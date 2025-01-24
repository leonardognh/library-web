import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './book.component';
import { Routes, RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEdtBookModule } from './add-edt-book/add-edt-book.module';
import { BookService } from 'src/app/shared/services/book.service';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: BookComponent,
  },
];

@NgModule({
  declarations: [BookComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AddEdtBookModule,
    NgbModalModule,
    ReactiveFormsModule,
  ],
  providers: [BookService],
})
export class BookModule {}
