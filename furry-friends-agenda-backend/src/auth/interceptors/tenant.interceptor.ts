import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (user && user.companyId) {
      // Injeta companyId automaticamente nas queries
      if (!request.query) request.query = {};
      if (!request.body) request.body = {};

      // Para queries GET
      if (!request.query.companyId) {
        request.query.companyId = user.companyId;
      }

      // Para bodies POST/PUT/PATCH (se não especificado)
      if (request.method !== 'GET' && !request.body.companyId) {
        request.body.companyId = user.companyId;
      }

      // Para parâmetros de rota
      if (!request.params.companyId) {
        request.params.companyId = user.companyId;
      }
    }

    return next.handle();
  }
}
