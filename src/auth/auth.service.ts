import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService
  ) {}

  login = async (dto: AuthDTO) => {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: dto.email
      }
    });

    if (!user) throw new ForbiddenException('Invalid email');

    const valid = argon.verify(user.hash, dto.password);

    if (!valid) throw new ForbiddenException('Invalid password');

    return this.signToken(user.id, user.email);
  };

  signup = async (dto: AuthDTO) => {
    const hash = await argon.hash(dto.password);
    try {
      const user = await this.prismaService.user.create({
        data: { email: dto.email, hash }
      });
      return { message: 'Signup success', user };
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError)
        if (e.code === 'P2002')
          throw new ForbiddenException('User already exists');
      throw new ForbiddenException('Signup failed');
    }
  };

  signToken = async (
    userId: string,
    email: string
  ): Promise<{ access_token: string }> => {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: secret
    });

    return { access_token: token };
  };
}
