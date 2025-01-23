import { Injectable } from '@angular/core';
import { Author } from '../models/author.model';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthorService extends GenericService<Author> {
  constructor() {
    super();
    this.apiUrl = `${environment.apiUrl}/author`;
  }
}
