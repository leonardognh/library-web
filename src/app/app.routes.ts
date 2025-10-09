import { Routes } from '@angular/router';
import { CategoryListComponent } from './features/categories/category-list/category-list';
import { AuthorListComponent } from './features/authors/author-list/author-list';
import { BookListComponent } from './features/books/book-list/book-list';

export const routes: Routes = [
  { path: '', redirectTo: 'books', pathMatch: 'full' },
  { path: 'books', component: BookListComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'authors', component: AuthorListComponent },
];
