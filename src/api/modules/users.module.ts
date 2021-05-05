import { Module } from '@nestjs/common';
import { UsersService } from '../../core/services/users.service';
import { UsersGateway } from '../gateways/users.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/data-source/entities/user.entity';
import { IUsersServiceProvider } from '../../core/primary-ports/user.service.interface';
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UsersGateway,
    {
      provide: IUsersServiceProvider,
      useClass: UsersService,
    },
  ],
  exports: [
    {
      provide: IUsersServiceProvider,
      useClass: UsersService,
    },
  ],
})
export class UsersModule {}
