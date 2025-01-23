import { Author } from './author.model';
import { Base } from './base.model';
import { Category } from './category.model';

export interface Book extends Base {
  title: string;
  price: number;
  stock: number;
  categories: number[];
  authors: number[];
  category?: Category[];
  author?: Author[];
}
