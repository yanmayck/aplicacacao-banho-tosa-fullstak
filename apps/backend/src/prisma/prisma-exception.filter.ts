import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Ocorreu um erro interno no servidor';

    switch (exception.code) {
      case 'P2002': {
        // Violação de restrição única (ex: email já existe)
        status = HttpStatus.CONFLICT; // 409 Conflict
        const target = exception.meta?.target as string[];
        message = `Um registro com este ${target.join(', ')} já existe.`;
        break;
      }
      case 'P2025':
        // Registro para atualizar ou deletar não foi encontrado
        status = HttpStatus.NOT_FOUND; // 404 Not Found
        message = `O recurso solicitado não foi encontrado.`;
        break;
      // Adicione outros códigos de erro do Prisma que você queira tratar aqui
      default:
        // Para todos os outros erros do Prisma, log e retorna um 500 genérico
        console.error(
          `Código de erro do Prisma não tratado: ${exception.code}`,
          exception,
        );
        break;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
