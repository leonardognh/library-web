import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Category } from 'src/app/shared/models/category.model';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-add-edt-category',
  templateUrl: './add-edt-category.component.html',
  styleUrls: ['./add-edt-category.component.scss'],
})
export class AddEdtCategoryComponent implements OnInit {
  @Input() category: Category;
  private modal = inject(NgbActiveModal);
  private toastr = inject(ToastrService);
  private categoryService = inject(CategoryService);
  action = 'Cadastrar';
  descricaoControl = new FormControl('', Validators.required);
  ngOnInit(): void {
    if (this.category) {
      this.action = 'Editar';
      this.descricaoControl.setValue(this.category.description);
    }
  }

  salvar() {
    if (this.descricaoControl.invalid) {
      this.toastr.warning(
        'Verifique o preenchimento do formulário e tente novamente...',
        'Campo Inválido!'
      );
      this.descricaoControl.markAllAsTouched();
      return;
    }

    if (this.category) this.update();
    else this.add();
  }
  private add() {
    this.categoryService
      .add({
        description: this.descricaoControl.value,
      } as Category)
      .subscribe({
        next: () => {
          this.toastr.success('Categoria cadastrada com sucesso!');
          this.fecharModal();
        },
        error: () => {
          this.toastr.error('Não foi possível cadastrar essa categoria!');
        },
      });
  }
  private update() {
    this.category.description = this.descricaoControl.value!;
    this.categoryService.update(this.category).subscribe({
      next: () => {
        this.toastr.success('Categoria atualizada com sucesso!');
        this.fecharModal();
      },
      error: () => {
        this.toastr.error('Não foi possível atualizar essa categoria!');
      },
    });
    this.fecharModal();
  }
  fecharModal() {
    this.modal.close();
  }
}
