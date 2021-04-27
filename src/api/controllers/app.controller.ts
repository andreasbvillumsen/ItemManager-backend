import { Controller, Request, Post, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from '../../core/services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Req() request: Request) {
    return this.authService.login(request.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('auth/register')
  async register(@Req() request: Request) {
    return this.authService.register(request.body);
  }
}
