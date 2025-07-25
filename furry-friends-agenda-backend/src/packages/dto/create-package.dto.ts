import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  includesBaths: number;

  @IsBoolean()
  includesGrooming: boolean;

  @IsBoolean()
  includesHydration: boolean;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  basePrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  pickupPrice: number;
}
