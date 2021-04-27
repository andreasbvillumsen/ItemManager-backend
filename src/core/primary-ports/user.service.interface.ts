import { CreateUserDto } from '../../api/dtos/users/create-user.dto';
import { User } from '../models/user.model';
import { UpdateUserDto } from '../../api/dtos/users/update-user.dto';

export const IUsersServiceProvider = 'IUsersServiceProvider';
export interface IUsersService {
  create(createUserDto: CreateUserDto): Promise<User>;

  findAll(): Promise<User[]>;

  findOneByID(id: number): Promise<User | undefined>;

  findOne(username: string): Promise<User | undefined>;

  update(id: number, updateUserDto: UpdateUserDto): Promise<User>;

  remove(id: number): Promise<User>;
}
