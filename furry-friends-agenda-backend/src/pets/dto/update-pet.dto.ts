import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  species?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional() // Campo novo
  @IsString()   // Campo novo
  observations?: string; // Campo novo
}
