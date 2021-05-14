import { PartialType } from '@nestjs/mapped-types';
import { CreateCollectionDto } from './create-collection.dto';
import { ItemModel } from '../../../core/models/item.model';

export class UpdateCollectionDto extends PartialType(CreateCollectionDto) {
  id: number;
  items: ItemModel[];
  userid: number;
}
