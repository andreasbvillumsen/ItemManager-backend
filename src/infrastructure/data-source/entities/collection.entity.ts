import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ItemEntity } from './item.entity';
import { UserEntity } from './user.entity';

@Entity()
export class CollectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ItemEntity, (item) => item.collection)
  items: ItemEntity[];

  @ManyToMany(() => UserEntity, (user) => user.collections)
  @JoinTable()
  users: UserEntity[];
}
