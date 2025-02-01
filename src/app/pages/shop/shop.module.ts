import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from 'src/app/shared/services/category.service';
import { BookService } from 'src/app/shared/services/book.service';

const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
  },
];

@NgModule({
  declarations: [ShopComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    NgbPaginationModule,
  ],
  providers: [CategoryService, BookService],
})
export class ShopModule {}
