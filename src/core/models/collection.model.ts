import { ItemModel } from './item.model';
import { UserModel } from './user.model';

export interface CollectionModel {
  id: number;
  name: string;
  items: ItemModel[];
  users: UserModel[];
}
