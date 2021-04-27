import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { AuthService } from '../../core/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../core/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/auth-constants';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { AppController } from '../controllers/app.controller';
import { User } from '../../infrastructure/data-source/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AppController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
