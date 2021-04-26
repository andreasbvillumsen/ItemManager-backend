import { Module } from '@nestjs/common';
import { UsersService } from '../../core/services/users.service';
import { UsersGateway } from '../gateways/users.gateway';

@Module({
  providers: [UsersGateway, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
