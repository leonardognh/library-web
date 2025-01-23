import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Base } from '../models/base.model';
import { Observable } from 'rxjs';

export abstract class GenericService<T extends Base> {
  protected httpClient = inject(HttpClient);
  protected apiUrl: string;
  getAll(): Observable<T[]> {
    return this.httpClient.get<T[]>(`${this.apiUrl}`);
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
