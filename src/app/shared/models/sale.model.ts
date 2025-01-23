import { Base } from './base.model';
import { Customer } from './customer.model';
import { ItemSale } from './item-sale.model';

export interface Sale extends Base {
  customerId: number;
  date: string;
  total: number;
  itemsSale?: ItemSale[];
  customer?: Customer;
}
