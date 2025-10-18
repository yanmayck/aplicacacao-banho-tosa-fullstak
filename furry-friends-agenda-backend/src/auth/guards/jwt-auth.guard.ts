import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
// import { JwtPayload } from '../interfaces/jwt-payload.interface'; // Remover import se não usado em outro lugar

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Adicione sua lógica de ativação personalizada aqui, se necessário
    // Por exemplo, verificar se o usuário tem permissões específicas
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any /*, _info */) {
    // Você pode lançar uma exceção aqui com base em `info` ou `err`
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido ou expirado');
    }
    return user; // Retorna o usuário para ser injetado em req.user
  }
}
