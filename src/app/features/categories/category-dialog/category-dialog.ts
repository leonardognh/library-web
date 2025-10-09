import { Component, inject, signal, computed } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Category } from '../../../shared/models/category';

export type CategoryDialogData = { category?: Category };

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{ isEdit() ? 'Editar categoria' : 'Nova categoria' }}
    </h2>
    <form class="p-4" [formGroup]="form" (ngSubmit)="save()">
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="name" maxlength="60" />
        @if(form.controls.name.hasError('required')){
        <mat-error>Obrigatório</mat-error>
        }
        <mat-hint align="end"
          >{{ form.controls.name.value?.length || 0 }} / 60</mat-hint
        >
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100 mt-3">
        <mat-label>Descrição</mat-label>
        <textarea
          matInput
          formControlName="description"
          rows="3"
          maxlength="200"
        ></textarea>
        <mat-hint align="end"
          >{{ form.controls.description.value?.length || 0 }} / 200</mat-hint
        >
      </mat-form-field>

      <div class="d-flex justify-content-end mt-3">
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
export class CategoryDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryDialogComponent>);
  private data = inject<CategoryDialogData>(MAT_DIALOG_DATA);

  isEdit = signal(!!this.data?.category);

  form = this.fb.group({
    name: [
      this.data?.category?.name ?? '',
      [Validators.required, Validators.maxLength(60)],
    ],
    description: [
      this.data?.category?.description ?? '',
      [Validators.maxLength(200)],
    ],
  });

  save() {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
  close() {
    this.dialogRef.close();
  }
}
