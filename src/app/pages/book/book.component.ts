import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmationComponent } from 'src/app/shared/components/modal-confirmation/modal-confirmation.component';
import { Book } from 'src/app/shared/models/book.model';
import { BookService } from 'src/app/shared/services/book.service';
import { AddEdtBookComponent } from './add-edt-book/add-edt-book.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit {
  private modalService = inject(NgbModal);
  private bookService = inject(BookService);
  private toastr = inject(ToastrService);
  searchControl = new FormControl('');
  book: Book;
  books: Book[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  pages: number[] = [];

  ngOnInit(): void {
    this.loadBooks(this.currentPage);
    this.observerSeachChange();
  }
  loadBooks(page: number = 0, filter?: string): void {
    this.bookService.getAll(page, filter).subscribe((response) => {
      this.books = response.data;
      this.currentPage = response.pagination.currentPage;
      this.totalPages = response.pagination.totalPages;
      this.totalItems = response.pagination.totalItems;

      this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    });
  }
  private observerSeachChange() {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.loadBooks(0, value);
        } else {
          this.loadBooks();
        }
      });
  }

  openModal(book: Book | null = null) {
    const modalRef = this.modalService.open(AddEdtBookComponent);
    modalRef.componentInstance.book = book;
    modalRef.closed.subscribe(() => {
      this.loadBooks();
    });
  }
  openModalDelete(book: Book) {
    const modalRef = this.modalService.open(ModalConfirmationComponent);
    modalRef.componentInstance.title = `Remover ${book.title}`;
    modalRef.componentInstance.message =
      'Tem certeza que deseja remover esta categoria?';
    modalRef.closed.subscribe((confirmation) => {
      if (confirmation) this.remove(book);
    });
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      const filter = this.searchControl.value ?? '';
      this.loadBooks(page, filter);
    }
  }
  private remove(book: Book) {
    this.bookService.remove(book.id).subscribe({
      next: () => {
        this.toastr.success('Livro removido com sucesso!');
        this.loadBooks();
      },
      error: () => {
        this.toastr.error('Não foi possível remover essa categoria!');
      },
    });
  }
}
