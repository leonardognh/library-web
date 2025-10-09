import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { forkJoin, map, switchMap } from 'rxjs';

import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Book } from '../../../shared/models/book';
import { BookService } from '../../../shared/services/book.service';
import { BookDialogComponent } from '../book-dialog/book-dialog';

type BookRow = {
  book: Book;
  authors: string[];
  categories: string[];
  pages?: number | null;
};

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatCardModule,
  ],
  template: `
    <mat-card class="mb-3">
      <h2 mat-dialog-title class="mb-3 pt-3 ps-3">Livros</h2>
      <div
        class="d-flex flex-column flex-md-row align-items-md-center gap-3 p-3"
      >
        <mat-form-field class="w-100" appearance="outline">
          <mat-label>Buscar</mat-label>
          <input
            matInput
            [(ngModel)]="q"
            (ngModelChange)="onSearch()"
            placeholder="Título..."
          />
          @if(q){
          <button
            matSuffix
            mat-icon-button
            aria-label="Limpar"
            (click)="clearSearch()"
          >
            <mat-icon>close</mat-icon>
          </button>
          }
        </mat-form-field>

        <span class="ms-auto"></span>

        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>add</mat-icon>
          Novo livro
        </button>
      </div>

      <div class="table-responsive">
        <table
          mat-table
          [dataSource]="items()"
          matSort
          (matSortChange)="onSort($event)"
        >
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
            <td mat-cell *matCellDef="let row">{{ row.book.id }}</td>
          </ng-container>

          <ng-container matColumnDef="title">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Título</th>
            <td mat-cell *matCellDef="let row">{{ row.book.title }}</td>
          </ng-container>

          <ng-container matColumnDef="year">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Ano</th>
            <td mat-cell *matCellDef="let row">
              {{ row.book.publicationYear }}
            </td>
          </ng-container>

          <ng-container matColumnDef="authors">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Autores</th>
            <td mat-cell *matCellDef="let row">
              {{ row.authors.length ? row.authors.join(', ') : '—' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="categories">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Categorias
            </th>
            <td mat-cell *matCellDef="let row">
              {{ row.categories.length ? row.categories.join(', ') : '—' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="pages">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Páginas</th>
            <td mat-cell *matCellDef="let row">{{ row.pages ?? '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="text-end">Ações</th>
            <td mat-cell *matCellDef="let row" class="text-end">
              <button
                mat-icon-button
                aria-label="Editar"
                (click)="openEdit(row.book)"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                aria-label="Excluir"
                (click)="confirmDelete(row.book)"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayed"></tr>
          <tr mat-row *matRowDef="let row; columns: displayed"></tr>
        </table>
      </div>

      <mat-paginator
        [length]="total()"
        [pageSize]="limit()"
        [pageIndex]="page() - 1"
        [pageSizeOptions]="[5, 10, 20, 50]"
        (page)="onPage($event)"
      >
      </mat-paginator>
    </mat-card>
  `,
})
export class BookListComponent implements OnInit {
  private svc = inject(BookService);
  private dialog = inject(MatDialog);

  displayed = [
    'id',
    'title',
    'year',
    'authors',
    'categories',
    'pages',
    'actions',
  ] as const;

  private _items = signal<BookRow[]>([]);
  private _total = signal(0);
  private _page = signal(1);
  private _limit = signal(10);
  private _sort = signal<string | undefined>('title');
  private _order = signal<'asc' | 'desc' | undefined>('asc');
  q = '';

  items = computed(() => this._items());
  total = computed(() => this._total());
  page = computed(() => this._page());
  limit = computed(() => this._limit());

  ngOnInit() {
    this.load();
  }

  load() {
    this.svc
      .listPaged({
        q: this.q,
        _page: this._page(),
        _limit: this._limit(),
        _sort: this._sort(),
        _order: this._order(),
      })
      .pipe(
        switchMap(({ items, total }) => {
          const rows$ = items.map((b) =>
            forkJoin({
              authors: this.svc
                .authorsOf(b.id)
                .pipe(
                  map((links) =>
                    links.map((l) => l.author?.name ?? '').filter(Boolean)
                  )
                ),
              categories: this.svc
                .categoriesOf(b.id)
                .pipe(
                  map((links) =>
                    links.map((l) => l.category?.name ?? '').filter(Boolean)
                  )
                ),
              publication: this.svc.publicationOf(b.id),
            }).pipe(
              map(
                ({ authors, categories, publication }) =>
                  ({
                    book: b,
                    authors,
                    categories,
                    pages: publication?.pages ?? null,
                  } as BookRow)
              )
            )
          );
          return forkJoin(rows$).pipe(map((rows) => ({ rows, total })));
        })
      )
      .subscribe({
        next: ({ rows, total }) => {
          this._items.set(rows);
          this._total.set(total);
        },
        error: (e) => console.error(e),
      });
  }

  onSearch() {
    this._page.set(1);
    this.load();
  }
  clearSearch() {
    this.q = '';
    this.onSearch();
  }
  onPage(e: PageEvent) {
    this._limit.set(e.pageSize);
    this._page.set(e.pageIndex + 1);
    this.load();
  }
  onSort(e: Sort) {
    const SORT_MAP: Record<string, string> = {
      id: 'id',
      title: 'title',
      year: 'publicationYear',
      authors: 'authors',
      categories: 'categories',
      pages: 'pages',
    };
    const col = e.active;
    const dir = (e.direction as 'asc' | 'desc') || undefined;

    if (col === 'authors' || col === 'categories' || col === 'pages') {
      const factor = dir === 'desc' ? -1 : 1;
      if (!dir) {
        this.load();
        return;
      }
      const collator = new Intl.Collator('pt-BR', { sensitivity: 'base' });
      const sorted = [...this._items()].sort((a, b) => {
        let av: string | number = '';
        let bv: string | number = '';

        if (col === 'authors') {
          av = a.authors.join(', ') || '';
          bv = b.authors.join(', ') || '';
          return collator.compare(String(av), String(bv)) * factor;
        }
        if (col === 'categories') {
          av = a.categories.join(', ') || '';
          bv = b.categories.join(', ') || '';
          return collator.compare(String(av), String(bv)) * factor;
        }

        av = a.pages ?? -1;
        bv = b.pages ?? -1;
        return (Number(av) - Number(bv)) * factor;
      });
      this._items.set(sorted);

      return;
    }

    const backendField = SORT_MAP[col];
    if (!backendField || !dir) {
      this._sort.set(undefined);
      this._order.set(undefined);
      this.load();
      return;
    }

    this._sort.set(backendField);
    this._order.set(dir);
    this.load();
  }

  openCreate() {
    const ref = this.dialog.open(BookDialogComponent, {
      width: '720px',
      data: {},
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.svc
        .createFull({
          book: result.book,
          authorIds: result.authorIds,
          categoryIds: result.categoryIds,
          publication: result.publication,
        })
        .subscribe({ next: () => this.load(), error: (e) => console.error(e) });
    });
  }

  openEdit(row: Book) {
    this.svc.getDetail(row.id).subscribe((detail) => {
      const data = {
        book: detail.book,
        authorIds: detail.authors.map((a) => a.id),
        categoryIds: detail.categories.map((c) => c.id),
        publication: detail.publication,
      };
      const ref = this.dialog.open(BookDialogComponent, {
        width: '720px',
        data,
      });
      ref.afterClosed().subscribe((result) => {
        if (!result) return;
        this.svc
          .updateFull(row.id, {
            patch: result.book,
            authorIds: result.authorIds,
            categoryIds: result.categoryIds,
            publication: result.publication,
          })
          .subscribe({
            next: () => this.load(),
            error: (e) => console.error(e),
          });
      });
    });
  }

  confirmDelete(row: Book) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Excluir livro',
        message: `Confirmar exclusão de "${row.title}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.svc
        .delete(row.id)
        .subscribe({ next: () => this.load(), error: (e) => console.error(e) });
    });
  }
}
