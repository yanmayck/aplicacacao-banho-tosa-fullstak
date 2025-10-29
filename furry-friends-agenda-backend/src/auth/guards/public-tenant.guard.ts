import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PublicTenantGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Verificar se o tenant foi resolvido pelo middleware
    if (!request.tenant) {
      // Se não há tenant, permitir acesso ao portal público genérico
      return true;
    }

    // Verificar se o portal público está habilitado
    if (!request.tenant.publicPortal?.isEnabled) {
      throw new ForbiddenException(
        'Portal público não está disponível para esta empresa',
      );
    }

    // Verificar se a funcionalidade específica está habilitada
    const requiredFeature = this.reflector.get<string>(
      'publicFeature',
      context.getHandler(),
    );

    if (requiredFeature) {
      const features = request.tenant.publicPortal.features || {};
      if (!features[requiredFeature]) {
        throw new ForbiddenException(
          `Funcionalidade '${requiredFeature}' não está disponível no portal público desta empresa`,
        );
      }
    }

    return true;
  }
}
