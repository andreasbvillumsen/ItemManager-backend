import { CollectionModel } from './collection.model';

export interface ItemModel {
  id: number;
  desc: string;
  name: string;
  imgName?: string;
  imgLink?: string;
  collection: CollectionModel;
}
