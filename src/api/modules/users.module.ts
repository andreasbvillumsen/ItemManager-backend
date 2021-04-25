import { Module } from '@nestjs/common';
import { UsersService } from '../../core/services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../../infrastructure/data-source/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
