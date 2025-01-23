import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AddEdtCategoryComponent } from './add-edt-category/add-edt-category.component';
import { ModalConfirmationComponent } from 'src/app/shared/components/modal-confirmation/modal-confirmation.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  private modalService = inject(NgbModal);
  private categoryService = inject(CategoryService);
  private toastr = inject(ToastrService);
  category: Category;
  categories: Category[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  pages: number[] = [];

  ngOnInit(): void {
    this.loadCategories(this.currentPage);
  }
  loadCategories(page: number = 0): void {
    this.categoryService.getAll(page).subscribe((response) => {
      this.categories = response.data;
      this.currentPage = response.pagination.currentPage;
      this.totalPages = response.pagination.totalPages;
      this.totalItems = response.pagination.totalItems;

      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }

  openModal(category: Category | null = null) {
    const modalRef = this.modalService.open(AddEdtCategoryComponent);
    modalRef.componentInstance.category = category;
    modalRef.closed.subscribe(() => {
      this.loadCategories();
    });
  }
  openModalDelete(category: Category) {
    const modalRef = this.modalService.open(ModalConfirmationComponent);
    modalRef.componentInstance.title = `Remover ${category.description}`;
    modalRef.componentInstance.message =
      'Tem certeza que deseja remover esta categoria?';
    modalRef.closed.subscribe((confirmation) => {
      if (confirmation) this.remove(category);
    });
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadCategories(page);
    }
  }
  private remove(category: Category) {
    this.categoryService.remove(category.id).subscribe({
      next: () => {
        this.toastr.success('Categoria removida com sucesso!');
        this.loadCategories();
      },
      error: () => {
        this.toastr.error('Não foi possível remover essa categoria!');
      },
    });
  }
}
