import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  // Opcional: Se a criação de um cliente também pode criar um usuário associado
  @IsOptional()
  @IsString()
  userId?: string;
}
