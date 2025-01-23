import { Component, inject, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss'],
})
export class ModalConfirmationComponent {
  @Input() title: string = 'Confirmação';
  @Input() message: string = 'Mensagem';
  private modal = inject(NgbActiveModal);
  fecharModal(confirmacao: boolean) {
    this.modal.close(confirmacao);
  }
}
