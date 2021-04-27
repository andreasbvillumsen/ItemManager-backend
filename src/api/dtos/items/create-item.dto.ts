import { Collection } from '../../../core/models/collection.model';

export class CreateItemDto {
  name: string;
  collection: Collection;
}
