import { Routes } from '@angular/router';
import { FullComponent } from './core/layouts/full/full';
import { BlankComponent } from './core/layouts/blank/blank';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  {
    path: '',
    component: FullComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'authors',
        loadComponent: () =>
          import('./features/authors/author-list/author-list').then(
            (m) => m.AuthorListComponent
          ),
      },
      {
        path: 'books',
        loadComponent: () =>
          import('./features/books/book-list/book-list').then(
            (m) => m.BookListComponent
          ),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories/category-list/category-list').then(
            (m) => m.CategoryListComponent
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
        loadComponent: () =>
          import('./features/auth/login/login').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/auth/register/register').then(
            (m) => m.RegisterComponent
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
