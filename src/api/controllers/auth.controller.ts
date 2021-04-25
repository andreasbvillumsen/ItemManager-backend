import {
  Body,
  Req,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../core/services/auth.service';
import RegisterDto from '../dtos/users/RegisterUser.dto';
import RequestWithUser from '../../core/interfaces/users/requestWithUser.interface';
import { LocalAuthenticationGuard } from '../guards/localAuthentication.guard';

@Controller('authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(@Req() request: RequestWithUser) {
    const user = request.user;
    user.password = undefined;
    return user;
  }
}
