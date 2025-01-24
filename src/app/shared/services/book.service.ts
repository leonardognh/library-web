import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class BookService extends GenericService<Book> {
  constructor() {
    super();
    this.apiUrl = `${environment.apiUrl}/books`;
  }
  getAllByAuthors(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/authors`);
  }
  getAllByCategories(): Observable<Book[]> {
    return this.httpClient.get<Book[]>(`${this.apiUrl}/categories`);
  }
}
