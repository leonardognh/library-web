import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultiSelectComponent } from './multi-select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [MultiSelectComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [MultiSelectComponent],
})
export class MultiSelectModule {}
