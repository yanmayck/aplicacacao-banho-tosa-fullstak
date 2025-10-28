import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsUUID,
} from 'class-validator';
import { UserRole } from '@prisma/client';

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
    message: 'Role inválido. Valores permitidos: SUPER_ADMIN, COMPANY_ADMIN, MANAGER, EMPLOYEE, GROOMER',
  })
  role?: UserRole;

  @IsOptional()
  @IsUUID()
  companyId?: string;
}
