import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: JwtPayloadClient;
}

interface JwtPayloadClient {
  userId: string;
  username: string;
  type: 'client';
}

@Injectable()
export class JwtClientGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    try {
      const token: string = authHeader.replace('Bearer ', '');
      const decoded = this.jwtService.verify(token);

      // Verificar se é um token de cliente
      if (decoded.type !== 'client') {
        return false;
      }

      request.user = decoded;
      return true;
    } catch (_error: unknown) {
      return false;
    }
  }
}
