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
      throw new Error('Could´t find any users');
    }
  }

  async findOneByID(id: number): Promise<UserModel> {
    const userEntity = await this.userRepository.findOne({ id: id });

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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserModel> {
    if (id !== updateUserDto.id) {
      throw new Error('Id does not match');
    }

    const userToUpdate = await this.userRepository.findOne({ id: id });
    if (userToUpdate) {
      await this.userRepository.update(id, updateUserDto);
      const updatedUser = await this.userRepository.findOne({ id: id });

      if (updatedUser) {
        return JSON.parse(JSON.stringify(updatedUser));
      } else {
        throw new Error('User was not updated');
      }
    } else {
      throw new Error('This user does not exist');
    }
  }

  async remove(id: number): Promise<any> {
    if (await this.userRepository.findOne({ id: id })) {
      // await this.userRepository.softDelete(id);
      await this.userRepository.delete({ id: id });
      return {
        message: 'User was successfully removed!',
      };
    } else {
      throw new Error('User does not exist!');
    }
  }
}
