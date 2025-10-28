import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const companyIdFromUser = user.companyId;
    const companyIdFromParams = request.params.companyId;
    const companyIdFromBody = request.body?.companyId;
    const companyIdFromQuery = request.query?.companyId;

    // Verifica se o usuário pertence à empresa dos dados acessados
    const targetCompanyId = companyIdFromParams || companyIdFromBody || companyIdFromQuery;

    if (targetCompanyId && targetCompanyId !== companyIdFromUser) {
      throw new ForbiddenException(
        'Acesso negado: Você não tem permissão para acessar dados de outra empresa'
      );
    }

    return true;
  }
}