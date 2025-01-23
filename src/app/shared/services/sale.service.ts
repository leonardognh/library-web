import { Injectable } from '@angular/core';
import { Sale } from '../models/sale.model';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class SaleService extends GenericService<Sale> {
  constructor() {
    super();
    this.apiUrl = `${environment.apiUrl}/sale`;
  }
}
