import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class CloseCashRegisterDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  closingBalance?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsBoolean()
  forceClose?: boolean; // Para forçar fechamento mesmo com divergência
}

export class CreateCashRegisterDto {
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  openingBalance?: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}