import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../infrastructure/data-source/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../../api/dtos/users/create-user.dto';
import { LoginUserDto } from '../../api/dtos/users/login-user.dto';
import { UserModel } from '../models/user.model';
import {
  IUsersService,
  IUsersServiceProvider,
} from '../primary-ports/user.service.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(IUsersServiceProvider) private usersService: IUsersService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<any> {
    // return loginUserDto;
    const userFromDB: UserModel = await this.usersService.findOneByEmail(
      loginUserDto.email,
    );

    if (userFromDB) {
      if (await bcrypt.compare(loginUserDto.password, userFromDB.password)) {
        const payload = { email: userFromDB.email, sub: userFromDB.id };
        userFromDB.password = undefined;
        return {
          user: userFromDB,
          bearer_token: this.jwtService.sign(payload),
        };
      } else {
        return {
          error: 'Password is not correct',
        };
      }
    } else {
      return {
        error: 'User not found',
      };
    }
  }

  async register(createUserDto: CreateUserDto): Promise<any> {
    // return createUserDto;
    if (await this.userRepository.findOne({ email: createUserDto.email }))
      return {
        error: 'Email in use. Please use another email.',
      };

    // Create user
    // return createUserDto;
    const userModel = await this.usersService.create(createUserDto);

    // Return user info and authentication bearer token.
    return {
      user: userModel,
      bearer_token: this.jwtService.sign({
        email: userModel.email,
        sub: userModel.id,
      }),
    };
  }

  // Provide validation on correct password, identifying user.
  async validateUser(email: string, password: string): Promise<boolean> {
    // Get user from db.
    const user = await this.userRepository.findOne({ email: email });

    // Compare plain text password to hashed password.
    return bcrypt.compare(password, user.password);
  }
}
