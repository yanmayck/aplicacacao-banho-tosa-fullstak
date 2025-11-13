import {
  IsString,
  IsOptional,
  IsNumber,
  Min,
  IsInt, // Para durationMin
  IsBoolean, // Importar IsBoolean
} from 'class-validator';

export class UpdateServiceDto {
  // Classe renomeada
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }) // Especificar precisão para preço
  @Min(0)
  price?: number;

  @IsOptional()
  @IsInt() // Alterado para IsInt
  @Min(1)
  durationMin?: number; // Renomeado de durationMinutes

  @IsOptional()
  @IsBoolean()
  isOnlineEnabled?: boolean;

  @IsOptional()
  @IsString()
  stripePriceId?: string;

  @IsOptional()
  @IsString()
  stripeProductId?: string;
}
