import { CreateUserDto } from '../../api/dtos/users/create-user.dto';
import { UserModel } from '../models/user.model';
import { UpdateUserDto } from '../../api/dtos/users/update-user.dto';

export const IUsersServiceProvider = 'IUsersServiceProvider';
export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<UserModel>;

  findAll(): Promise<UserModel[]>;

  findOneByID(id: number): Promise<UserModel>;

  findOneByEmail(email: string): Promise<UserModel>;

  update(id: number, updateUserDto: UpdateUserDto): Promise<any>;

  remove(id: number): Promise<any>;
}
