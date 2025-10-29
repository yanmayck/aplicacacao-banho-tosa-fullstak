import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  // Hierarquia de permissões: SUPER_ADMIN > COMPANY_ADMIN > MANAGER > EMPLOYEE > GROOMER
  private readonly roleHierarchy: Record<UserRole, number> = {
    [UserRole.SUPER_ADMIN]: 5,
    [UserRole.COMPANY_ADMIN]: 4,
    [UserRole.MANAGER]: 3,
    [UserRole.EMPLOYEE]: 2,
    [UserRole.GROOMER]: 1,
  };

  private hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
    return this.roleHierarchy[userRole] >= this.roleHierarchy[requiredRole];
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log(
      'BACKEND: RolesGuard - User role:',
      user?.role,
      'Required roles:',
      requiredRoles,
    ); // Log para depuração

    if (!user?.role) {
      return false;
    }

    // Verifica se o usuário tem pelo menos uma das roles requeridas
    // considerando a hierarquia (roles superiores podem acessar roles inferiores)
    return requiredRoles.some((requiredRole) =>
      this.hasPermission(user.role, requiredRole),
    );
  }
}
