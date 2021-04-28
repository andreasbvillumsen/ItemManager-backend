import { CollectionModel } from '../../../core/models/collection.model';

export class CreateUserDto {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}
