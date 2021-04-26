import { Column, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Collection } from './collection.entity';

export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  password: string;

  @ManyToMany(() => Collection, (collection) => collection.users)
  collections: Collection[];
}
