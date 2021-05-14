import { ItemModel } from '../../../core/models/item.model';
import { UserModel } from '../../../core/models/user.model';

export class CreateCollectionDto {
  name: string;
  users: UserModel[];
}
