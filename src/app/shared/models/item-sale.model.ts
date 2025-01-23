import { Base } from './base.model';
import { Book } from './book.model';
import { Sale } from './sale.model';

export interface ItemSale extends Base {
  saleId: number;
  bookId: number;
  quantity: number;
  price: number;
  book?: Book;
  sale?: Sale;
}
