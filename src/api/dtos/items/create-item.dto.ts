import { CollectionModel } from '../../../core/models/collection.model';

export class CreateItemDto {
  name: string;
  collection: CollectionModel;
}
