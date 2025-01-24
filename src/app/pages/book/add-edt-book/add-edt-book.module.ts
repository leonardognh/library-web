import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEdtBookComponent } from './add-edt-book.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'src/app/shared/components/multi-select/multi-select.module';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AuthorService } from 'src/app/shared/services/author.service';

@NgModule({
  declarations: [AddEdtBookComponent],
  imports: [CommonModule, ReactiveFormsModule, MultiSelectModule],
  providers: [CategoryService, AuthorService],
})
export class AddEdtBookModule {}
