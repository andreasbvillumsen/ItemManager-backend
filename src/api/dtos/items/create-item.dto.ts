import { CollectionModel } from '../../../core/models/collection.model';

export class CreateItemDto {
  name: string;
  desc: string;
  imgLink?: string;
  collection: CollectionModel;
}
