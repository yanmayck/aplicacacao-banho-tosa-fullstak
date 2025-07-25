import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { jwtConstants } from '../constants/jwt.constants';
import { UserRole } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || jwtConstants.secret,
    });
  }

  validate(payload: { sub: string; username: string; role: UserRole }): {
    userId: string;
    username: string;
    role: UserRole;
  } {
    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
    };
  }
}
