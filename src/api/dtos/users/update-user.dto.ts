import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { CollectionModel } from '../../../core/models/collection.model';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  id: number;
  collections: CollectionModel[];
}
