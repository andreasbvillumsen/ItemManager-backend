import { Item } from './item.model';

export interface Collection {
  id: number;
  name: string;
  items: Item[];
}
