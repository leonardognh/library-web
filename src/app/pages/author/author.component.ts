import { Component, inject, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ModalConfirmationComponent } from 'src/app/shared/components/modal-confirmation/modal-confirmation.component';
import { Author } from 'src/app/shared/models/author.model';
import { AuthorService } from 'src/app/shared/services/author.service';
import { AddEdtAuthorComponent } from './add-edt-author/add-edt-author.component';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
})
export class AuthorComponent implements OnInit {
  private modalService = inject(NgbModal);
  private authorService = inject(AuthorService);
  private toastr = inject(ToastrService);
  searchControl = new FormControl('');
  author: Author;
  authors: Author[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  totalItems: number = 0;
  pages: number[] = [];

  ngOnInit(): void {
    this.loadAuthors(this.currentPage);
    this.observerSeachChange();
  }
  loadAuthors(page: number = 0, filter?: string): void {
    this.authorService.getAll(page, filter).subscribe((response) => {
      this.authors = response.data;
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
          this.loadAuthors(0, value);
        } else {
          this.loadAuthors();
        }
      });
  }

  openModal(author: Author | null = null) {
    const modalRef = this.modalService.open(AddEdtAuthorComponent);
    modalRef.componentInstance.author = author;
    modalRef.closed.subscribe(() => {
      this.loadAuthors();
    });
  }
  openModalDelete(author: Author) {
    const modalRef = this.modalService.open(ModalConfirmationComponent);
    modalRef.componentInstance.title = `Remover ${author.name}`;
    modalRef.componentInstance.message =
      'Tem certeza que deseja remover esta categoria?';
    modalRef.closed.subscribe((confirmation) => {
      if (confirmation) this.remove(author);
    });
  }
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.loadAuthors(page);
    }
  }
  private remove(author: Author) {
    this.authorService.remove(author.id).subscribe({
      next: () => {
        this.toastr.success('Categoria removida com sucesso!');
        this.loadAuthors();
      },
      error: () => {
        this.toastr.error('Não foi possível remover essa categoria!');
      },
    });
  }
}
