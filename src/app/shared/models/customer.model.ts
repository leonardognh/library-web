import { Base } from './base.model';

export interface Customer extends Base {
  name: string;
  email: string;
  phone?: string;
}
