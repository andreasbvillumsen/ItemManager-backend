import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { AuthService } from '../../core/services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../core/strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constants/auth-constants';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import { AppController } from '../controllers/app.controller';

@Module({
  imports: [
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
