import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorComponent } from './author.component';
import { Routes, RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AddEdtAuthorModule } from './add-edt-author/add-edt-author.module';
import { AuthorService } from 'src/app/shared/services/author.service';

const routes: Routes = [
  {
    path: '',
    component: AuthorComponent,
  },
];

@NgModule({
  declarations: [AuthorComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AddEdtAuthorModule,
    NgbModalModule,
  ],
  providers: [AuthorService],
})
export class AuthorModule {}
