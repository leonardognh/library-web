import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { BookPublication } from '../../../shared/models/book-publication';
import { Author } from '../../../shared/models/author';
import { Book } from '../../../shared/models/book';
import { Category } from '../../../shared/models/category';
import { BookService } from '../../../shared/services/book.service';

export type BookDialogData = {
  book?: Book;
  authorIds?: number[];
  categoryIds?: number[];
  publication?: Omit<BookPublication, 'id' | 'bookId'> | null;
};

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <h2 mat-dialog-title>{{ isEdit() ? 'Editar livro' : 'Novo livro' }}</h2>

    <form
      class="p-3 d-flex flex-column gap-3"
      [formGroup]="form"
      (ngSubmit)="save()"
    >
      <div class="row g-3">
        <div class="col-12">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Título</mat-label>
            <input matInput formControlName="title" maxlength="120" />
            @if(form.controls.title.hasError('required')){
            <mat-error>Obrigatório</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="col-md-6">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Ano de publicação</mat-label>
            <input matInput type="number" formControlName="publicationYear" />
            @if(form.controls.publicationYear.hasError('required')){
            <mat-error>Obrigatório</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="col-md-6">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Autores</mat-label>
            <mat-select formControlName="authorIds" multiple>
              <mat-option *ngFor="let a of authors()" [value]="a.id">{{
                a.name
              }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="col-md-12">
          <mat-form-field appearance="outline" class="w-100">
            <mat-label>Categorias</mat-label>
            <mat-select formControlName="categoryIds" multiple>
              @for(c of categories();track c.id){
              <mat-option [value]="c.id">{{ c.name }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>
      </div>

      <fieldset class="border rounded p-3">
        <legend class="float-none w-auto px-2 fs-6">Publicação</legend>
        <div class="d-flex gap-2 mb-2">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            (click)="togglePublication(true)"
          >
            Usar publicação
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            (click)="togglePublication(false)"
          >
            Sem publicação
          </button>
        </div>
        @if(usePublication()){
        <div class="row g-3">
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Editora</mat-label>
              <input matInput formControlName="publisherName" />
            </mat-form-field>
          </div>
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Cidade</mat-label>
              <input matInput formControlName="city" />
            </mat-form-field>
          </div>
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Edição</mat-label>
              <input matInput formControlName="edition" />
            </mat-form-field>
          </div>
          <div class="col-md-6">
            <mat-form-field appearance="outline" class="w-100">
              <mat-label>Páginas</mat-label>
              <input matInput type="number" formControlName="pages" />
            </mat-form-field>
          </div>
        </div>
        }
      </fieldset>

      <div class="d-flex justify-content-end gap-2">
        <button mat-button type="button" (click)="close()">Cancelar</button>
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
export class BookDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(MatDialogRef<BookDialogComponent>);
  private data = inject<BookDialogData>(MAT_DIALOG_DATA);
  private svc = inject(BookService);

  isEdit = signal(!!this.data?.book);
  authors = signal<Author[]>([]);
  categories = signal<Category[]>([]);
  usePublication = signal<boolean>(this.data?.publication !== null);

  form = this.fb.group({
    title: [this.data?.book?.title ?? '', [Validators.required]],
    publicationYear: [
      this.data?.book?.publicationYear ?? new Date().getFullYear(),
      [Validators.required],
    ],
    authorIds: [this.data?.authorIds ?? []],
    categoryIds: [this.data?.categoryIds ?? []],
    publisherName: [
      this.data?.publication ? this.data.publication.publisherName : '',
    ],
    city: [this.data?.publication ? this.data.publication.city ?? '' : ''],
    edition: [
      this.data?.publication ? this.data.publication.edition ?? '' : '',
    ],
    pages: [
      this.data?.publication ? this.data.publication.pages ?? null : null,
    ],
  });

  ngOnInit() {
    this.svc.authors().subscribe((a) => this.authors.set(a));
    this.svc.categories().subscribe((c) => this.categories.set(c));
  }

  togglePublication(on: boolean) {
    this.usePublication.set(on);
  }

  save() {
    if (this.form.invalid) return;

    const v = this.form.value;
    const payload = {
      book: {
        title: v.title!,
        publicationYear: Number(v.publicationYear!),
      } as Omit<Book, 'id'>,
      authorIds: (v.authorIds ?? []) as number[],
      categoryIds: (v.categoryIds ?? []) as number[],
      publication: this.usePublication()
        ? ({
            publisherName: v.publisherName ?? '',
            city: v.city ?? '',
            edition: v.edition ?? '',
            pages: v.pages ? Number(v.pages) : undefined,
          } as Omit<BookPublication, 'id' | 'bookId'>)
        : null,
    };

    this.ref.close(payload);
  }

  close() {
    this.ref.close();
  }
}
