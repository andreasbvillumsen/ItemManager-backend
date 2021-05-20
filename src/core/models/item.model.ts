import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionModel } from './collection.model';

export interface ItemModel {
  id: number;
  desc: string;
  name: string;
  imgLink?: string;
  collection: CollectionModel;
}
