import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Category } from '../../../shared/models/category';
import { CategoryService } from '../../../shared/services/category.service';
import { CategoryDialogComponent } from '../category-dialog/category-dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-list',
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
      <h2 mat-dialog-title class="mb-3 pt-3 ps-3">Categorias</h2>
      <div
        class="d-flex flex-column flex-md-row align-items-md-center gap-3 p-3"
      >
        <mat-form-field class="w-100" appearance="outline">
          <mat-label>Buscar</mat-label>
          <input
            matInput
            [(ngModel)]="q"
            (ngModelChange)="onSearch()"
            placeholder="Nome ou descrição"
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
          Nova categoria
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

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Descrição</th>
            <td mat-cell *matCellDef="let row">{{ row.description || '—' }}</td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="w-32 text-right">
              Ações
            </th>
            <td mat-cell *matCellDef="let row" class="text-right">
              <button
                mat-icon-button
                (click)="openEdit(row)"
                aria-label="Editar"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                color="warn"
                (click)="confirmDelete(row)"
                aria-label="Excluir"
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
export class CategoryListComponent implements OnInit {
  private svc = inject(CategoryService);
  private dialog = inject(MatDialog);

  displayed = ['id', 'name', 'description', 'actions'] as const;

  private _items = signal<Category[]>([]);
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
    const ref = this.dialog.open(CategoryDialogComponent, {
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

  openEdit(row: Category) {
    const ref = this.dialog.open(CategoryDialogComponent, {
      width: '520px',
      data: { category: row },
    });
    ref.afterClosed().subscribe((result) => {
      if (!result) return;
      this.svc.update(row.id, result).subscribe({
        next: () => this.load(),
        error: (e) => console.error(e),
      });
    });
  }

  confirmDelete(row: Category) {
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
}
