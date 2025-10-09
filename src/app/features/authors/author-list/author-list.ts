import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Author } from '../../../shared/models/author';
import { AuthorService } from '../../../shared/services/author.service';
import { AuthorDialogComponent } from '../author-dialog/author-dialog';

@Component({
  selector: 'app-author-list',
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
      <h2 mat-dialog-title class="mb-3 pt-3 ps-3">Autores</h2>
      <div
        class="d-flex flex-column flex-md-row align-items-md-center gap-3 p-3"
      >
        <mat-form-field class="w-100" appearance="outline">
          <mat-label>Buscar</mat-label>
          <input
            matInput
            [(ngModel)]="q"
            (ngModelChange)="onSearch()"
            placeholder="Nome, nacionalidade..."
          />
          @if(q){
          <button matSuffix mat-icon-button (click)="clearSearch()">
            <mat-icon>close</mat-icon>
          </button>
          }
        </mat-form-field>

        <span class="ms-auto"></span>

        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>add</mat-icon>
          Novo autor
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
            <td mat-cell *matCellDef="let row">{{ row.id }}</td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Nome</th>
            <td mat-cell *matCellDef="let row">{{ row.name }}</td>
          </ng-container>

          <ng-container matColumnDef="birthYear">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Nascimento
            </th>
            <td mat-cell *matCellDef="let row">{{ row.birthYear || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="nationality">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>
              Nacionalidade
            </th>
            <td mat-cell *matCellDef="let row">{{ row.nationality || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="w-40 text-right">
              Ações
            </th>
            <td mat-cell *matCellDef="let row" class="text-right">
              <button
                mat-icon-button
                aria-label="Ver livros"
                (click)="showBooks(row)"
              >
                <mat-icon>menu_book</mat-icon>
              </button>
              <button
                mat-icon-button
                aria-label="Editar"
                (click)="openEdit(row)"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                aria-label="Excluir"
                (click)="confirmDelete(row)"
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
export class AuthorListComponent implements OnInit {
  private svc = inject(AuthorService);
  private dialog = inject(MatDialog);

  displayed = ['id', 'name', 'birthYear', 'nationality', 'actions'] as const;

  private _items = signal<Author[]>([]);
  private _total = signal(0);
  private _page = signal(1);
  private _limit = signal(10);
  private _sort = signal<string | undefined>('name');
  private _order = signal<'asc' | 'desc' | undefined>('asc');
  q = '';

  readonly items = computed(() => this._items());
  readonly total = computed(() => this._total());
  readonly page = computed(() => this._page());
  readonly limit = computed(() => this._limit());

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
      .subscribe({
        next: ({ items, total }) => {
          this._items.set(items);
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
    this._sort.set(e.active || undefined);
    this._order.set((e.direction as 'asc' | 'desc') || undefined);
    this.load();
  }

  openCreate() {
    const ref = this.dialog.open(AuthorDialogComponent, {
      width: '520px',
      data: {},
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.svc.create(result).subscribe({
        next: () => this.load(),
        error: (e) => console.error(e),
      });
    });
  }

  openEdit(row: Author) {
    const ref = this.dialog.open(AuthorDialogComponent, {
      width: '520px',
      data: { Author: row },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.svc.update(row.id, result).subscribe({
        next: () => this.load(),
        error: (e) => console.error(e),
      });
    });
  }

  confirmDelete(row: Author) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: {
        title: 'Excluir categoria',
        message: `Confirmar exclusão de "${row.name}"?`,
        confirmText: 'Excluir',
        cancelText: 'Cancelar',
      },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.svc.delete(row.id).subscribe({
        next: () => this.load(),
        error: (e) => console.error(e),
      });
    });
  }

  showBooks(row: Author) {
    this.svc.books(row.id).subscribe({
      next: (books) => {
        const list =
          books.map((b) => `• ${b.title} (${b.publicationYear})`).join('\n') ||
          '— sem livros vinculados —';
        this.dialog.open(ConfirmDialogComponent, {
          width: '520px',
          data: {
            title: `Livros de ${row.name}`,
            message: list,
            confirmText: 'OK',
            cancelText: 'Fechar',
          },
        });
      },
      error: (e) => console.error(e),
    });
  }
}
