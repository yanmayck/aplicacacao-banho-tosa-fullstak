import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class PublicClientRegisterDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter pelo menos 6 caracteres' })
  password: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsPhoneNumber('BR', { message: 'Telefone inválido' })
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
