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
    // Check if user exists.
    if (await this.userRepository.findOne({ email: createUserDto.email }))
      throw new Error('This user already exists');

    // Generate hash, and set to dto.
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    // Register user in database
    const userEntity = await this.userRepository.create(createUserDto);
    const userEntityDb = await this.userRepository.save(userEntity);

    // Parse user returned from database
    const userModel = JSON.parse(JSON.stringify(userEntityDb));

    // Make sure the password is not returned with the user
    userModel.password = undefined;

    // Return user info and authentication bearer token.
    return userModel;
  }

  async findAll(): Promise<UserModel[]> {
    const userEntities = await this.userRepository.find();
    if (userEntities) {
      return JSON.parse(JSON.stringify(userEntities));
    } else {
      throw new Error('Could´t find any stocks');
    }
  }

  async findOneByID(id: number): Promise<UserModel> {
    const userEntity = await this.userRepository.findOne(id);

    if (userEntity) {
      return JSON.parse(JSON.stringify(userEntity));
    } else {
      throw new Error("Can't find a user with this id");
    }
  }

  async findOneByEmail(email: string): Promise<UserModel> {
    const userEntity = await this.userRepository.findOne({ email: email });
    if (userEntity) {
      return JSON.parse(JSON.stringify(userEntity));
    } else {
      throw new Error("Can't find a user with this email");
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    if (id !== updateUserDto.id) return { message: 'Id does not match' };

    const updatedUser = await this.userRepository.update(id, updateUserDto);

    if (updatedUser) return { message: 'User was successfully updated!' };

    return { message: 'User was not updated' };
  }

  async remove(id: number): Promise<any> {
    if (await this.userRepository.findOne(id)) {
      // await this.userRepository.softDelete(id);
      await this.userRepository.delete(id);
      return {
        message: 'User was successfully removed!',
      };
    } else {
      return {
        message: 'User does not exist!',
      };
    }
  }
}
