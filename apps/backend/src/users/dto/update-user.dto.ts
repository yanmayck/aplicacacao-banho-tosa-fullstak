import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  // A atualização de senha pode ser um DTO separado e um endpoint específico
  // por questões de segurança e UX (ex: pedir senha atual).
  // Por enquanto, vamos focar no nome.
}
