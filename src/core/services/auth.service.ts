import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../infrastructure/data-source/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async login(user: any) {
    const userFromDB = await this.userRepository.findOne({ email: user.email });

    if (userFromDB) {
      if (await bcrypt.compare(user.password, userFromDB.password)) {
        const payload = { email: user.email, sub: user.userId };
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

  async register(body: any): Promise<any> {
    if (await this.userRepository.findOne({ email: body.email }))
      return {
        error: 'Email in use. Please use another email.',
      };

    // Hash password
    const hash = await bcrypt.hash(body.password, 10);

    // Register user in database
    let user = this.userRepository.create();
    user.email = body.email;
    user.password = hash;
    user.firstname = body.firstname;
    user.lastname = body.lastname;
    user = await this.userRepository.save(user);

    // Parse user returned from database
    const newUser = JSON.parse(JSON.stringify(user));

    // Make sure the password is not returned with the user
    newUser.password = undefined;

    // Return user info and authentication bearer token.
    return {
      user: newUser,
      bearer_token: this.jwtService.sign({
        email: newUser.email,
        sub: newUser.userId,
      }),
    };
  }

  async validateUser(email: string, password: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ email: email });
    return bcrypt.compare(password, user.password);
  }
}
