import {
  IsString,
  IsOptional,
  IsDateString,
  IsObject,
  ValidateNested,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreatePetDto } from './create-pet.dto'; // Import to use nested DTOs

// Re-using DTOs from create-pet.dto.ts for consistency
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
}
