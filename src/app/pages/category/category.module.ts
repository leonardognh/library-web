import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category.component';
import { RouterModule, Routes } from '@angular/router';
import { CategoryService } from 'src/app/shared/services/category.service';
import { AddEdtCategoryModule } from './add-edt-category/add-edt-category.module';
import { NgbActiveModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
  },
];

@NgModule({
  declarations: [CategoryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AddEdtCategoryModule,
    NgbModalModule,
  ],
  providers: [CategoryService, NgbActiveModal],
})
export class CategoryModule {}
