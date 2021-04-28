import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../api/dtos/users/create-user.dto';
import { UpdateUserDto } from '../../api/dtos/users/update-user.dto';
import { IUsersService } from '../primary-ports/user.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from '../models/user.model';
import { Repository } from 'typeorm';
import { UserEntity } from '../../infrastructure/data-source/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService implements IUsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserModel> {
    if (await this.userRepository.findOne({ email: createUserDto.email }))
      throw new Error('This user already exists');

    // Hash password
    const hash = await bcrypt.hash(createUserDto.password, 10);

    // Register user in database
    let user = this.userRepository.create();
    user.email = createUserDto.email;
    user.password = hash;
    user.firstname = createUserDto.firstname;
    user.lastname = createUserDto.lastname;
    user = await this.userRepository.save(user);

    // Parse user returned from database
    const newUser = JSON.parse(JSON.stringify(user));

    // Make sure the password is not returned with the user
    newUser.password = undefined;

    // Return user info and authentication bearer token.
    return {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      password: user.password,
      collections: user.collections,
    };
  }

  async findAll(): Promise<UserModel[]> {
    const userEntities = await this.userRepository.find();
    if (userEntities) {
      const users: UserModel[] = JSON.parse(JSON.stringify(userEntities));
      return users;
    } else {
      throw new Error('Could´t find any stocks');
    }
  }

  async findOneByID(id: number): Promise<UserModel> {
    const userEntity = await this.userRepository.findOne({ id: id });
    if (userEntity) {
      return {
        id: userEntity.id,
        email: userEntity.email,
        firstname: userEntity.firstname,
        lastname: userEntity.lastname,
        password: userEntity.password,
        collections: userEntity.collections,
      };
    } else {
      throw new Error('Can´t find a user with this id');
    }
  }

  async findOneByEmail(email: string): Promise<UserModel> {
    const userEntity = await this.userRepository.findOne({ email: email });
    if (userEntity) {
      return {
        id: userEntity.id,
        email: userEntity.email,
        firstname: userEntity.firstname,
        lastname: userEntity.lastname,
        password: userEntity.password,
        collections: userEntity.collections,
      };
    } else {
      throw new Error('Can´t find a user with this email');
    }
  }

  update(id: number, updateUserDto: UpdateUserDto): any {
    return null;
  }

  remove(id: number): any {
    return `This action removes a #${id} user`;
  }
}
