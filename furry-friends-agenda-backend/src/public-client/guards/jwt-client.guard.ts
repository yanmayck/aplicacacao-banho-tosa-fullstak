import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtClientGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return false;
    }

    try {
      const token = authHeader.replace('Bearer ', '');
      const decoded = this.jwtService.verify(token);

      // Verificar se é um token de cliente
      if (decoded.type !== 'client') {
        return false;
      }

      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}