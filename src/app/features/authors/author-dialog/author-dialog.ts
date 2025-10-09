import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Author } from '../../../shared/models/author';

export type AuthorDialogData = { author?: Author };

@Component({
  selector: 'app-author-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit() ? 'Editar autor' : 'Novo autor' }}</h2>

    <form class="p-4" [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="name" maxlength="80" />
        @if(form.controls.name.hasError('required')){
        <mat-error>Obrigatório</mat-error>
        }
        <mat-hint align="end"
          >{{ form.controls.name.value?.length || 0 }} / 80</mat-hint
        >
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100 mt-3">
        <mat-label>Ano de nascimento</mat-label>
        <input
          class="px-2"
          matInput
          formControlName="birthYear"
          type="number"
          placeholder="Ex: 1975"
        />
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100 mt-3">
        <mat-label>Nacionalidade</mat-label>
        <input matInput formControlName="nationality" maxlength="40" />
        <mat-hint align="end"
          >{{ form.controls.nationality.value?.length || 0 }} / 40</mat-hint
        >
      </mat-form-field>

      <div class="w-100 d-flex justify-content-end mt-3">
        <button mat-button type="button" class="me-3" (click)="close()">
          Cancelar
        </button>
        <button
          mat-flat-button
          color="primary"
          type="submit"
          [disabled]="form.invalid"
        >
          Salvar
        </button>
      </div>
    </form>
  `,
})
export class AuthorDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AuthorDialogComponent>);
  private data = inject<AuthorDialogData>(MAT_DIALOG_DATA);

  isEdit = signal(!!this.data?.author);

  form = this.fb.group({
    name: [
      this.data?.author?.name ?? '',
      [Validators.required, Validators.maxLength(80)],
    ],
    birthYear: [this.data?.author?.birthYear ?? null],
    nationality: [
      this.data?.author?.nationality ?? '',
      [Validators.maxLength(40)],
    ],
  });

  save() {
    if (this.form.valid) this.dialogRef.close(this.form.value);
  }
  close() {
    this.dialogRef.close();
  }
}
