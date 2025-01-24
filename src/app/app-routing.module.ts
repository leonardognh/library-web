import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlankComponent } from './layout/blank/blank.component';
import { FullComponent } from './layout/full/full.component';
import { authGuard } from './shared/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'book',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'author',
        loadChildren: () =>
          import('./pages/author/author.module').then((m) => m.AuthorModule),
      },
      {
        path: 'book',
        loadChildren: () =>
          import('./pages/book/book.module').then((m) => m.BookModule),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./pages/category/category.module').then(
            (m) => m.CategoryModule
          ),
      },
    ],
  },
  {
    path: '',
    component: BlankComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./pages/auth/login/login.module').then((m) => m.LoginModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
