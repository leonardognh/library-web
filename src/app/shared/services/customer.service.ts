import { Injectable } from '@angular/core';
import { Customer } from '../models/customer.model';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class CustomerService extends GenericService<Customer> {
  constructor() {
    super();
    this.apiUrl = `${environment.apiUrl}/customer`;
  }
}
