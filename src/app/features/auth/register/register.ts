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
  selector: 'app-register',
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
      <mat-card class="p-4" style="max-width:520px; width:100%;">
        <h3 class="mb-3">Criar conta</h3>

        <form
          [formGroup]="form"
          (ngSubmit)="submit()"
          class="d-flex flex-column gap-3"
        >
          <div class="row g-3">
            <div class="col-12">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Nome</mat-label>
                <input matInput formControlName="name" />
                @if(form.controls.name.hasError('required')){
                <mat-error>Obrigatório</mat-error>
                }
              </mat-form-field>
            </div>
            <div class="col-md-6">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>E-mail</mat-label>
                <input matInput type="email" formControlName="email" />
                @if(form.controls.email.hasError('required')){
                <mat-error>Obrigatório</mat-error>
                } @if(form.controls.email.hasError('email')){
                <mat-error>E-mail inválido</mat-error>
                }
              </mat-form-field>
            </div>
            <div class="col-md-6">
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
                } @if(form.controls.password.hasError('minlength')){
                <mat-error>Mínimo 6 caracteres</mat-error>
                }
              </mat-form-field>
            </div>
          </div>

          <button
            mat-flat-button
            color="primary"
            class="w-100"
            [disabled]="form.invalid || loading()"
          >
            Criar conta
          </button>
          @if(error()){
          <div class="text-danger small">{{ error() }}</div>
          }
        </form>

        <div class="mt-3">
          <a routerLink="/login">Já tenho conta</a>
        </div>
      </mat-card>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hide = signal(true);
  loading = signal(false);
  error = signal<string | null>(null);

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit() {
    if (this.form.invalid) return;
    this.error.set(null);
    this.loading.set(true);
    this.auth.register(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (e) => {
        this.error.set(e?.message || 'Falha no registro');
        this.loading.set(false);
      },
    });
  }
}
