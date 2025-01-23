import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AddEdtCategoryComponent } from './add-edt-category/add-edt-category.component';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  private modalService = inject(NgbModal);
  private categoryService = inject(CategoryService);
  category: Category;
  categories: Category[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  pages: number[] = [];

  ngOnInit(): void {
    this.loadCategories(this.currentPage);
  }
  loadCategories(page: number): void {
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
      this.loadCategories(0);
    });
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadCategories(page);
    }
  }
}
