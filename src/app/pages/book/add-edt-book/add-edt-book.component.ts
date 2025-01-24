import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Book } from 'src/app/shared/models/book.model';
import { Option } from 'src/app/shared/models/options.models';
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
  action = 'Cadastrar';
  bookForm = new FormGroup({
    id: new FormControl(0, Validators.required),
    title: new FormControl('', Validators.required),
    price: new FormControl(0, Validators.required),
    stock: new FormControl(0, Validators.required),
    categories: new FormControl([0], Validators.required),
    authors: new FormControl([0], Validators.required),
  });
  categories: Option[];
  totalPagesCategories: number = 0;

  ngOnInit(): void {
    if (this.book) {
      this.action = 'Editar';
      this.bookForm.patchValue(this.book);
    }

    this.getAllCategories();
  }
  private getAllCategories() {
    this.categoryService.getAll().subscribe((response) => {
      this.categories = response.data.map((d) => ({
        id: d.id,
        label: d.description,
      }));
      this.totalPagesCategories = response.pagination.totalPages;
    });
  }
  onSelectionChange(selectedOptions: any): void {
    console.log('Selecionados:', selectedOptions);
  }

  onLoadMore(page: any): void {
    this.categoryService.getAll(page).subscribe((response) => {
      const newCategories = response.data.map((d) => ({
        id: d.id,
        label: d.description,
      }));

      this.totalPagesCategories = response.pagination.totalPages;

      this.categories = [...this.categories, ...newCategories];
      console.log(
        '🚀 ~ AddEdtBookComponent ~ this.categoryService.getAll ~ this.categories:',
        this.categories
      );
    });
  }

  salvar() {
    if (this.bookForm.invalid) {
      this.toastr.warning(
        'Verifique o preenchimento do formulário e tente novamente...',
        'Campos Inválidos!'
      );
      this.bookForm.markAllAsTouched();
      return;
    }

    if (this.book) this.update();
    else this.add();
  }
  private add() {
    const book = Object.assign({}, this.book, this.bookForm.getRawValue());
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
    const book = Object.assign({}, this.book, this.bookForm.getRawValue());
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
