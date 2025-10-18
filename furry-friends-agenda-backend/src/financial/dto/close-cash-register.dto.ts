import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
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