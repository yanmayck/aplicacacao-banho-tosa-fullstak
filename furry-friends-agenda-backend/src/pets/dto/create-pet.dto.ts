import { IsString, IsNotEmpty, IsOptional, IsDateString, IsObject, ValidateNested, IsBoolean, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

class TickMedicineDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;
}

class RabiesVaccineDto {
  @IsBoolean()
  isUpToDate: boolean;

  @IsDateString()
  lastDate: string;
}

class VaccineHistoryDto {
  @IsString()
  name: string;

  @IsDateString()
  date: string;
}

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  species: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  observations?: string;

  @IsOptional()
  @IsString()
  foodType?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => TickMedicineDto)
  lastTickMedicine?: TickMedicineDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RabiesVaccineDto)
  rabiesVaccine?: RabiesVaccineDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VaccineHistoryDto)
  vaccineHistory?: VaccineHistoryDto[];

  @IsString()
  @IsNotEmpty()
  clientId: string;
}
