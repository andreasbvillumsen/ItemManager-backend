import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionEntity } from './collection.entity';

@Entity()
export class ItemEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  desc: string;

  @Column({ nullable: true })
  imgLink: string;

  @ManyToOne(() => CollectionEntity, (collection) => collection.items)
  collection: CollectionEntity;
}
