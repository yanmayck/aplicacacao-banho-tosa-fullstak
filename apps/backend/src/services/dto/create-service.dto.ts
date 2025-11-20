import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  IsInt, // Para durationMin, pois minutos geralmente são inteiros
  IsBoolean, // Importar IsBoolean
} from 'class-validator';

export class CreateServiceDto {
  // Classe renomeada
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber({ maxDecimalPlaces: 2 }) // Especificar precisão para preço
  @Min(0)
  @IsNotEmpty() // Tornando obrigatório conforme schema.prisma
  price: number; // Era opcional

  @IsInt() // Alterado para IsInt
  @Min(1)
  @IsNotEmpty() // Tornando obrigatório conforme schema.prisma
  durationMin: number; // Renomeado de durationMinutes e era opcional

  @IsBoolean()
  isOnlineEnabled: boolean;

  @IsOptional()
  @IsString()
  stripePriceId?: string;

  @IsOptional()
  @IsString()
  stripeProductId?: string;
}
