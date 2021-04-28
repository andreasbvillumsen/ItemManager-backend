import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../api/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../api/dtos/users/update-user.dto';
import { IUsersService } from '../primary-ports/user.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../models/user.model';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
  ];

  async create(createUserDto: CreateUserDto): Promise<User> {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByID(id: number): Promise<User | undefined> {
    return this.users.find((user) => user.userId === id);
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
