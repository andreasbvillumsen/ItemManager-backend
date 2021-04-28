import { Module } from '@nestjs/common';
import { UsersService } from '../../core/services/users.service';
import { UsersGateway } from '../gateways/users.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/data-source/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersGateway, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
