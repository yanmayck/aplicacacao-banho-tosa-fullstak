import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDecimal,
  Min,
} from 'class-validator';
import { CreateServicePackageDto } from './create-service-package.dto';

export class UpdateServicePackageDto extends PartialType(
  CreateServicePackageDto,
) {
  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  basePrice?: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  onlinePrice?: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  @Min(0)
  pickupPrice?: number;

  @IsOptional()
  @IsBoolean()
  includesBaths?: boolean;

  @IsOptional()
  @IsBoolean()
  includesGrooming?: boolean;

  @IsOptional()
  @IsBoolean()
  includesHydration?: boolean;

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
