import { inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Base } from '../models/base.model';
import { Observable } from 'rxjs';
import { PaginatedResponse } from '../models/paginated-response.model';

export abstract class GenericService<T extends Base> {
  protected httpClient = inject(HttpClient);
  protected apiUrl: string;
  getAll(
    page: number = 0,
    filter?: string,
    limit: number = 10
  ): Observable<PaginatedResponse<T>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    if (filter) {
      params = params.set('filter', filter);
    }
    return this.httpClient.get<PaginatedResponse<T>>(`${this.apiUrl}`, {
      params,
    });
  }
  getById(id: number): Observable<T> {
    return this.httpClient.get<T>(`${this.apiUrl}/${id}`);
  }
  add(objeto: T): Observable<T> {
    return this.httpClient.post<T>(`${this.apiUrl}`, objeto);
  }
  update(objeto: T) {
    return this.httpClient.put(`${this.apiUrl}/${objeto.id}`, objeto);
  }
  remove(id: number) {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }
}
