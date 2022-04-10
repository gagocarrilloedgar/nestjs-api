import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET')
    });
  }

  // Nest automatically will trhow 401 if the user is not found
  async validate(payload: { sub: string; email: string }): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub
      }
    });
    delete user.hash;
    return user;
  }
}
