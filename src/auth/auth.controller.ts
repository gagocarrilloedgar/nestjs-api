import { Controller, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('/signup')
  signup(@Req() req: Request) {
    return this.authservice.signup();
  }

  @Post('/signin')
  signin() {
    return this.authservice.login();
  }
}
