import { Item } from './item.model';
import { User } from './user.model';

export interface Collection {
  id: number;
  name: string;
  items: Item[];
  users: User[];
}
