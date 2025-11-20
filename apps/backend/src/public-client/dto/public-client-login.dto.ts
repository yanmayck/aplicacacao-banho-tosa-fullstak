import { IsEmail, IsString } from 'class-validator';

export class PublicClientLoginDto {
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  password: string;
}
