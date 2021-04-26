import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';

export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Collection, (collection) => collection.items)
  collection: Collection;
}
