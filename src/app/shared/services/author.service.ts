import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Author } from '../models/author';
import { Book } from '../models/book';
import { Page } from '../models/page';

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}`;

  listPaged(params: {
    q?: string;
    _page?: number;
    _limit?: number;
    _sort?: string;
    _order?: 'asc' | 'desc';
  }): Observable<Page<Author>> {
    let p = new HttpParams()
      .set('_page', String(params._page ?? 1))
      .set('_limit', String(params._limit ?? 10));

    if (params.q) p = p.set('q', params.q);
    if (params._sort) p = p.set('_sort', params._sort);
    if (params._order) p = p.set('_order', params._order);

    return this.http
      .get<Author[]>(`${this.base}/authors`, { params: p, observe: 'response' })
      .pipe(
        map((resp: HttpResponse<Author[]>) => ({
          items: resp.body ?? [],
          total: Number(resp.headers.get('X-Total-Count') ?? '0') || 0,
        }))
      );
  }

  get(id: number): Observable<Author> {
    return this.http.get<Author>(`${this.base}/authors/${id}`);
  }

  create(payload: Omit<Author, 'id'>): Observable<Author> {
    return this.http.post<Author>(`${this.base}/authors`, payload);
  }

  update(id: number, patch: Partial<Author>): Observable<Author> {
    return this.http.patch<Author>(`${this.base}/authors/${id}`, patch);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/authors/${id}`);
  }

  books(authorId: number): Observable<Book[]> {
    return this.http
      .get<any[]>(`${this.base}/authors/${authorId}/books`)
      .pipe(map((links) => links.map((l) => l.book as Book)));
  }
}
