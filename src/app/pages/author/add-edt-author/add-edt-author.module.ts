import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEdtAuthorComponent } from './add-edt-author.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AddEdtAuthorComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddEdtAuthorModule {}
