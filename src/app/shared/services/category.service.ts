import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CategoryService extends GenericService<Category> {
  constructor() {
    super();
    this.apiUrl = `${environment.apiUrl}/categories`;
  }
}
