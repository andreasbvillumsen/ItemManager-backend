import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.model';

export interface Item {
  id: number;
  name: string;
  collection: Collection;
}
