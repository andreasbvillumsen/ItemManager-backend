export interface UserModel {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  collections: Collection[];
}
