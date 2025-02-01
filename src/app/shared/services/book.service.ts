import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { GenericService } from './generic.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { PaginatedResponse } from '../models/paginated-response.model';

@Injectable()
export class BookService extends GenericService<Book> {
  constructor() {
    super();
    this.apiUrl = `${environment.apiUrl}/books`;
  }
  getAllByAuthors(
    ids: number[],
    filter?: string
  ): Observable<PaginatedResponse<Book>> {
    let params = new HttpParams().set('authorIds', ids.join(', '));

    if (filter) {
      params = params.set('filter', filter);
    }
    return this.httpClient.get<PaginatedResponse<Book>>(
      `${this.apiUrl}/authors`,
      { params }
    );
  }
  getAllByCategories(
    ids: number[],
    filter?: string
  ): Observable<PaginatedResponse<Book>> {
    let params = new HttpParams().set('categoryIds', ids.join(', '));

    if (filter) {
      params = params.set('filter', filter);
    }
    return this.httpClient.get<PaginatedResponse<Book>>(
      `${this.apiUrl}/categories`,
      { params }
    );
  }
}
