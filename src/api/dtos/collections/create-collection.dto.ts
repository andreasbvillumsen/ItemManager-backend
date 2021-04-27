import { Item } from '../../../core/models/item.model';
import { User } from '../../../core/models/user.model';

export class CreateCollectionDto {
  name: string;
  items: Item[];
  users: User[];
}
