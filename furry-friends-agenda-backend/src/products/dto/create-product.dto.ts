import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  IsUUID,
  IsDateString,
} from 'class-validator';

enum ProductType {
  SHAMPOO = 'SHAMPOO',
  MEDICINE = 'MEDICINE',
  ACCESSORY = 'ACCESSORY',
  FOOD = 'FOOD',
  HYGIENE = 'HYGIENE',
  TOY = 'TOY',
  OTHER = 'OTHER'
}

enum UnitOfMeasure {
  UNIT = 'UNIT',
  KG = 'KG',
  G = 'G',
  L = 'L',
  ML = 'ML',
  PACK = 'PACK',
  BOX = 'BOX'
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  sku?: string;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  currentStock: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  minStock: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxStock?: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  purchasePrice: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @IsNotEmpty()
  salePrice: number;

  @IsEnum(ProductType)
  @IsNotEmpty()
  type: ProductType;

  @IsEnum(UnitOfMeasure)
  @IsNotEmpty()
  unitOfMeasure: UnitOfMeasure;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsBoolean()
  hasExpiration?: boolean;

  @IsOptional()
  @IsDateString()
  expirationDate?: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @IsOptional()
  @IsUUID()
  supplierId?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  isServiceItem?: boolean;
}