import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CollectionEntity } from './collection.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  password: string;

  @ManyToMany(() => CollectionEntity, (collection) => collection.users)
  collections: CollectionEntity[];
}
