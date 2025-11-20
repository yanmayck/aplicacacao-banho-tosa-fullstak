import { IsString, IsDateString, IsOptional } from 'class-validator';

export class VaccineRecordDto {
    @IsString()
    name: string;

    @IsDateString()
    dateGiven: string;

    @IsDateString()
    @IsOptional()
    nextDueDate?: string;

    @IsString()
    @IsOptional()
    veterinarian?: string;
}

export class RabiesVaccineDto {
    @IsDateString()
    dateGiven: string;

    @IsDateString()
    expiresAt: string;

    @IsString()
    @IsOptional()
    tagNumber?: string;
}

export class TickMedicineDto {
    @IsString()
    name: string;

    @IsDateString()
    dateGiven: string;

    @IsDateString()
    @IsOptional()
    nextDueDate?: string;
}
