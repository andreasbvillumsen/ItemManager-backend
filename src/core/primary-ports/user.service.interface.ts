import { CreateUserDto } from '../../api/dtos/users/create-user.dto';
import { UserModel } from '../models/user.model';
import { UpdateUserDto } from '../../api/dtos/users/update-user.dto';

export const IUsersServiceProvider = 'IUsersServiceProvider';
export interface IUsersService {
  createUser(createUserDto: CreateUserDto): Promise<UserModel>;

  findAllUsers(): Promise<UserModel[]>;

  findOneUserByID(id: number): Promise<UserModel>;

  findOneUserByEmail(email: string): Promise<UserModel>;

  updateUser(id: number, updateUserDto: UpdateUserDto): any;

  removeUser(id: number): any;
}
