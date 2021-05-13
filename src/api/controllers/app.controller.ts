import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body, Delete,
} from '@nestjs/common';
import { AuthService } from '../../core/services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateUserDto } from '../dtos/users/create-user.dto';
import { LoginDto } from '../dtos/users/login.dto';
import { CreateCollectionDto } from '../dtos/collections/create-collection.dto';
import { CollectionsService } from '../../core/services/collections.service';
import { ItemsService } from '../../core/services/items.service';
import { CreateItemDto } from '../dtos/items/create-item.dto';
import { UpdateCollectionDto } from '../dtos/collections/update-collection.dto';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private collectionService: CollectionsService,
    private itemsService: ItemsService
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

  @Post('auth/controller')
  async createCollection(@Request() req, @Body() createCollectionDto: CreateCollectionDto) {
    // return createUserDto;
    return this.collectionService.create(createCollectionDto);
  }
  @Delete('auth/controller')
  async deleteCollection(@Request() req, @Body() updateCollectionDto: UpdateCollectionDto) {
    // return createUserDto;
    return this.collectionService.remove(updateCollectionDto.id);
  }

  @Post('auth/test/items')
  async createItem(@Request() req, @Body() createItemDto: CreateItemDto) {
    // return createUserDto;
    return this.itemsService.create(createItemDto);
  }



  @Get('auth/controller')
  async GetCollection(@Request() req) {
    // return createUserDto;
    return this.collectionService.findAllByUserID(1);
  }
}
