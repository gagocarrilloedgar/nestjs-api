import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  login = () => {
    return { message: 'Login success' };
  };

  signup = () => {
    return { message: 'I am signed up' };
  };
}
