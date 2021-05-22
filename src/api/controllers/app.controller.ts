import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  Delete,
} from '@nestjs/common';
import { AuthService } from '../../core/services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { LoginDto } from '../dtos/users/login.dto';
import { CollectionsService } from '../../core/services/collections.service';
import { ItemsService } from '../../core/services/items.service';
import { UpdateUserDto } from '../dtos/users/update-user.dto';
import { UsersService } from '../../core/services/users.service';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private collectionService: CollectionsService,
    private itemsService: ItemsService,
    private userService: UsersService,
  ) {}

  // @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('auth/register')
  async register(@Request() req, @Body() createUserDto: CreateUserDto) {
    // return createUserDto;
    return this.authService.register(createUserDto);
  }
}
