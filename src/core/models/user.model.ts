import { Collection } from './collection.model';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  password: string;
  collections: Collection[];
}
