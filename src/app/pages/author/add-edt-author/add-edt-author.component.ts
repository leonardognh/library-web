import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Author } from 'src/app/shared/models/author.model';
import { AuthorService } from 'src/app/shared/services/author.service';

@Component({
  selector: 'app-add-edt-author',
  templateUrl: './add-edt-author.component.html',
  styleUrls: ['./add-edt-author.component.scss'],
})
export class AddEdtAuthorComponent implements OnInit {
  @Input() author: Author;
  private modal = inject(NgbActiveModal);
  private toastr = inject(ToastrService);
  private authorService = inject(AuthorService);
  action = 'Cadastrar';
  nameControl = new FormControl('', Validators.required);
  ngOnInit(): void {
    if (this.author) {
      this.action = 'Editar';
      this.nameControl.setValue(this.author.name);
    }
  }

  salvar() {
    if (this.nameControl.invalid) {
      this.toastr.warning(
        'Verifique o preenchimento do formulário e tente novamente...',
        'Campo Inválido!'
      );
      this.nameControl.markAllAsTouched();
      return;
    }

    if (this.author) this.update();
    else this.add();
  }
  private add() {
    this.authorService
      .add({
        name: this.nameControl.value,
      } as Author)
      .subscribe({
        next: () => {
          this.toastr.success('Autor cadastrado com sucesso!');
          this.fecharModal();
        },
        error: () => {
          this.toastr.error('Não foi possível cadastrar esse autor!');
        },
      });
  }
  private update() {
    this.author.name = this.nameControl.value!;
    this.authorService.update(this.author).subscribe({
      next: () => {
        this.toastr.success('Autor atualizado com sucesso!');
        this.fecharModal();
      },
      error: () => {
        this.toastr.error('Não foi possível atualizar esse autor!');
      },
    });
    this.fecharModal();
  }
  fecharModal() {
    this.modal.close();
  }
}
