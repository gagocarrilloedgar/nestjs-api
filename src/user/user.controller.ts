import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  @Get('me')
  getProfile(@AuthUser() user: User) {
    return user;
  }
}
