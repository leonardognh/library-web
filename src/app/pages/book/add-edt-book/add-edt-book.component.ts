import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/shared/models/book.model';
import { Option } from 'src/app/shared/models/options.models';
import { AuthorService } from 'src/app/shared/services/author.service';
import { BookService } from 'src/app/shared/services/book.service';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-add-edt-book',
  templateUrl: './add-edt-book.component.html',
  styleUrls: ['./add-edt-book.component.scss'],
})
export class AddEdtBookComponent implements OnInit {
  @Input() book: Book;
  private modal = inject(NgbActiveModal);
  private toastr = inject(ToastrService);
  private bookService = inject(BookService);
  private categoryService = inject(CategoryService);
  private authorService = inject(AuthorService);
  action = 'Cadastrar';
  bookForm = new FormGroup({
    title: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    stock: new FormControl(0, Validators.required),
    categories: new FormControl(null, Validators.required),
    authors: new FormControl(null, Validators.required),
  });
  authors: Option[];
  categories: Option[];
  totalPagesAuthors: number = 0;
  totalPagesCategories: number = 0;
  triggerDropdownTouched = false;

  ngOnInit(): void {
    this.getAllAuthors();
    this.getAllCategories();

    if (this.book) {
      this.action = 'Editar';
      this.bookForm.patchValue(this.book as any);
    }
  }
  private getAllAuthors() {
    this.authorService.getAll().subscribe((response) => {
      this.authors = response.data.map((d) => ({
        id: d.id,
        label: d.name,
      }));
      this.totalPagesAuthors = response.pagination.totalPages;

      if (this.book) {
        const authors = this.authors.filter((author) =>
          this.book.authors.includes(author.id)
        );

        this.bookForm.controls['authors'].setValue(authors as any);
      }
    });
  }
  private getAllCategories() {
    this.categoryService.getAll().subscribe((response) => {
      this.categories = response.data.map((d) => ({
        id: d.id,
        label: d.description,
      }));
      this.totalPagesCategories = response.pagination.totalPages;

      if (this.book) {
        const categories = this.categories.filter((category) =>
          this.book.categories.includes(category.id)
        );

        this.bookForm.controls['categories'].setValue(categories as any);
      }
    });
  }

  onLoadMoreAuthors(page: number): void {
    this.authorService.getAll(page).subscribe((response) => {
      const newAuthors = response.data.map((d) => ({
        id: d.id,
        label: d.name,
      }));

      this.authors = [...this.authors, ...newAuthors];
      this.totalPagesAuthors = response.pagination.totalPages;
    });
  }
  onLoadMoreCategories(page: number): void {
    this.categoryService.getAll(page).subscribe((response) => {
      const newCategories = response.data.map((d) => ({
        id: d.id,
        label: d.description,
      }));

      this.categories = [...this.categories, ...newCategories];
      this.totalPagesCategories = response.pagination.totalPages;
    });
  }

  salvar() {
    if (this.bookForm.invalid) {
      this.toastr.warning(
        'Verifique o preenchimento do formulário e tente novamente...',
        'Campos Inválidos!'
      );
      this.bookForm.markAllAsTouched();
      this.triggerDropdownTouched = true;
      return;
    }

    if (this.book) this.update();
    else this.add();
  }
  private getAuthorAndCategoryIds() {
    let authors: any = this.bookForm.controls['authors'].value;
    authors = authors.map((author: Option) => author.id);

    let categories: any = this.bookForm.controls['categories'].value;
    categories = categories.map((category: Option) => category.id);

    return [authors, categories];
  }
  private add() {
    const book: Book = Object.assign(
      {},
      this.book,
      this.bookForm.getRawValue()
    );
    const [authors, categories] = this.getAuthorAndCategoryIds();
    book.authors = authors;
    book.categories = categories;
    book.price = Number(book.price);
    book.stock = Number(book.stock);

    this.bookService.add(book).subscribe({
      next: () => {
        this.toastr.success('Livro cadastrado com sucesso!');
        this.fecharModal();
      },
      error: () => {
        this.toastr.error('Não foi possível cadastrar esse livro!');
      },
    });
  }
  private update() {
    const book: Book = Object.assign(
      {},
      this.book,
      this.bookForm.getRawValue()
    );
    const [authors, categories] = this.getAuthorAndCategoryIds();
    book.authors = authors;
    book.categories = categories;
    book.price = Number(book.price);
    book.stock = Number(book.stock);

    this.bookService.update(book).subscribe({
      next: () => {
        this.toastr.success('Livro atualizado com sucesso!');
        this.fecharModal();
      },
      error: () => {
        this.toastr.error('Não foi possível atualizar esse livro!');
      },
    });
    this.fecharModal();
  }
  fecharModal() {
    this.modal.close();
  }
}
