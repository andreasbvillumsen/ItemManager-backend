import { Module } from '@nestjs/common';
import { AuthService } from '../../core/services/auth.service';
import { UsersModule } from '../modules/users.module';
import { AuthController } from '../controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '../../core/strategies/local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
