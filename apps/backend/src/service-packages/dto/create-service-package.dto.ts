import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDecimal,
  Min,
} from 'class-validator';

export class CreateServicePackageDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  basePrice: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  onlinePrice?: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  pickupPrice?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  durationInMonths?: number;

  @IsNumber()
  @Min(1)
  totalServices: number;

  @IsBoolean()
  @IsBoolean()
  includesBaths: boolean;

  @IsBoolean()
  includesGrooming: boolean;

  @IsBoolean()
  includesHydration: boolean;

  @IsBoolean()
  isOnlineEnabled: boolean;

  @IsOptional()
  @IsString()
  stripePriceId?: string;

  @IsOptional()
  @IsString()
  stripeProductId?: string;
}
