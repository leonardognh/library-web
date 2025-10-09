import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchMap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  private _user = signal<User | null>(this.restore());
  readonly user = computed(() => this._user());
  readonly isLoggedIn = computed(() => !!this._user());

  private restore(): User | null {
    try {
      return JSON.parse(localStorage.getItem('auth_user') || 'null');
    } catch {
      return null;
    }
  }
  private persist(u: User | null) {
    if (u) localStorage.setItem('auth_user', JSON.stringify(u));
    else localStorage.removeItem('auth_user');
  }

  logout() {
    this._user.set(null);
    this.persist(null);
  }

  async hashPassword(plain: string): Promise<string> {
    const enc = new TextEncoder().encode(plain);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  register(input: { name: string; email: string; password: string }) {
    return this.http
      .get<User[]>(`${this.base}/users`, {
        params: { email: input.email } as any,
      })
      .pipe(
        switchMap(async (list) => {
          if (list.length) throw new Error('E-mail já cadastrado.');
          const password_hash = await this.hashPassword(input.password);
          return { name: input.name, email: input.email, password_hash };
        }),
        switchMap((payload) =>
          this.http.post<User>(`${this.base}/users`, payload)
        )
      );
  }

  login(input: { email: string; password: string }) {
    return this.http
      .get<User[]>(`${this.base}/users`, {
        params: { email: input.email } as any,
      })
      .pipe(
        switchMap(async (users) => {
          if (!users.length) throw new Error('Usuário não encontrado.');
          const u = users[0];
          const hash = await this.hashPassword(input.password);
          if (u.password_hash !== hash) throw new Error('Senha inválida.');
          return u;
        }),
        map((u: User) => {
          this._user.set(u);
          this.persist(u);
          return u;
        })
      );
  }
}
