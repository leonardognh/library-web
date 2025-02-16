import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { Category } from 'src/app/shared/models/category.model';
import { ItemSale } from 'src/app/shared/models/item-sale.model';
import { PaginatedResponse } from 'src/app/shared/models/paginated-response.model';
import { BookService } from 'src/app/shared/services/book.service';
import { CartService } from 'src/app/shared/services/cart.service';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit, OnDestroy {
  private cartService = inject(CartService);
  private categoryService = inject(CategoryService);
  private bookService = inject(BookService);
  private destroy$ = new Subject<void>();

  searchControl = new FormControl<string>('');
  categories: Category[] = [];
  books: Book[] = [];

  selectedCategories: number[] = [];
  currentPage = 0;
  pageSize = 6;
  totalItems = 0;
  totalPages = 0;

  ngOnInit(): void {
    this.observeSearchChange();
    this.loadCategories();
    this.loadBooks();
  }

  private observeSearchChange(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.currentPage = 0;
        this.loadBooks(value || '');
      });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe((res) => {
      this.categories = res.data;
    });
  }

  private loadBooks(filter: string = ''): void {
    if (this.selectedCategories.length > 0) {
      this.bookService
        .getAllByCategories(this.selectedCategories, filter)
        .subscribe((response) => this.fillList(response));
    } else {
      this.bookService
        .getAll(this.currentPage, filter, this.pageSize)
        .subscribe((response) => this.fillList(response));
    }
  }

  private fillList(response: PaginatedResponse<Book>): void {
    this.books = response.data;
    this.currentPage = response.pagination.currentPage;
    this.totalItems = response.pagination.totalItems;
    this.totalPages = response.pagination.totalPages;
  }

  filterBooks(category: Category, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedCategories.push(category.id);
    } else {
      this.selectedCategories = this.selectedCategories.filter(
        (id) => id !== category.id
      );
    }

    this.currentPage = 0;
    this.loadBooks(this.searchControl.value || '');
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadBooks(this.searchControl.value || '');
    }
  }
  getAuthors(book: Book) {
    return book.author?.map((a) => a.name).join(', ');
  }

  addToCart(book: Book): void {
    const product: ItemSale = {
      id: 1,
      saleId: 1,
      bookId: book.id,
      quantity: 1,
      price: book.price,
      book,
    };

    this.cartService.add(product);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
