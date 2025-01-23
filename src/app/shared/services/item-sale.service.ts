import { Injectable } from '@angular/core';
import { ItemSale } from '../models/item-sale.model';
import { GenericService } from './generic.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class ItemSaleService extends GenericService<ItemSale> {
  constructor() {
    super();
    this.apiUrl = `${environment.apiUrl}/itemSale`;
  }
}
