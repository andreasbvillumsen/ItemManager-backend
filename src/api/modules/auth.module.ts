import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { AuthService } from '../../core/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../core/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/auth-constants';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { AppController } from '../controllers/app.controller';
import { UserEntity } from '../../infrastructure/data-source/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsModule } from './collections.module';
import { CollectionsService } from '../../core/services/collections.service';
import { CollectionEntity } from '../../infrastructure/data-source/entities/collection.entity';
import { ItemsService } from '../../core/services/items.service';
import { ItemEntity } from '../../infrastructure/data-source/entities/item.entity';
import { UsersService } from '../../core/services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, CollectionEntity, ItemEntity]),
    CollectionsModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    CollectionsService,
    ItemsService,
    UsersService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
