import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString() // Tornou-se obrigatório
  @IsNotEmpty() // Tornou-se obrigatório
  species: string; // Removido '?'

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string; // Usar string para facilitar a entrada, o Prisma converte para DateTime

  @IsOptional() // Campo novo
  @IsString()   // Campo novo
  observations?: string; // Campo novo

  // o clientId (anteriormente ownerId) será pego do usuário logado no serviço
}
