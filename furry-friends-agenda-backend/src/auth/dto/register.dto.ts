import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum, // Para validar o role contra o enum
} from 'class-validator';
import { UserRole } from '@prisma/client'; // Importar o enum do Prisma

export class RegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(UserRole, {
    message: 'Role inválido. Valores permitidos: USER, ADMIN',
  })
  role?: UserRole; // Alterado de roles para role, usando o enum do Prisma
}
