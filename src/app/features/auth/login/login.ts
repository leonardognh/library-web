import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="container py-5 d-flex justify-content-center">
      <mat-card class="p-4" style="max-width:420px; width:100%;">
        <h3 class="mb-3">Entrar</h3>

        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          class="d-flex flex-column gap-3"
        >
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>E-mail</mat-label>
            <input matInput type="email" formControlName="email" />
            @if(form.controls.email.hasError('required')){
            <mat-error>Obrigatório</mat-error>
            } @if(form.controls.email.hasError('email')){
            <mat-error>E-mail inválido</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Senha</mat-label>
            <input
              matInput
              [type]="hide() ? 'password' : 'text'"
              formControlName="password"
            />
            <button
              mat-icon-button
              matSuffix
              type="button"
              (click)="hide.set(!hide())"
            >
              <mat-icon>{{
                hide() ? 'visibility' : 'visibility_off'
              }}</mat-icon>
            </button>
            @if(form.controls.password.hasError('required')){
            <mat-error>Obrigatória</mat-error>
            }
          </mat-form-field>

          <button
            mat-flat-button
            color="primary"
            class="w-100"
            [disabled]="form.invalid || loading()"
          >
            Entrar
          </button>
          @if(error()){
          <div class="text-danger small">{{ error() }}</div>
          }
        </form>

        <div class="mt-3">
          <a routerLink="/register">Criar conta</a>
        </div>
      </mat-card>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hide = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    if (this.form.invalid) return;
    this.error.set(null);
    this.loading.set(true);
    this.auth.login(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/']),
      error: (e) => {
        this.error.set(e?.message || 'Falha no login');
        this.loading.set(false);
      },
    });
  }
}
