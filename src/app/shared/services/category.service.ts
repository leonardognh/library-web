import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category';
import { Page } from '../models/page';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}`;

  listPaged(params: {
    q?: string;
    _page?: number;
    _limit?: number;
    _sort?: string;
    _order?: 'asc' | 'desc';
  }): Observable<Page<Category>> {
    let p = new HttpParams();
    if (params.q) p = p.set('q', params.q);
    p = p.set('_page', params._page ?? 1).set('_limit', params._limit ?? 10);
    if (params._sort) p = p.set('_sort', params._sort);
    if (params._order) p = p.set('_order', params._order);

    return this.http
      .get<Category[]>(`${this.base}/categories`, {
        params: p,
        observe: 'response',
      })
      .pipe(
        map((resp: HttpResponse<Category[]>) => ({
          items: resp.body ?? [],
          total: Number(resp.headers.get('X-Total-Count') ?? '0') || 0,
        }))
      );
  }

  get(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.base}/categories/${id}`);
  }

  create(payload: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(`${this.base}/categories`, payload);
  }

  update(id: number, patch: Partial<Category>): Observable<Category> {
    return this.http.patch<Category>(`${this.base}/categories/${id}`, patch);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/categories/${id}`);
  }
}
