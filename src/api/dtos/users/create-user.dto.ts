import { Collection } from '../../../core/models/collection.model';

export class CreateUserDto {
  firstname: string;
  lastname: string;
  password: string;
  collections: Collection[];
}
