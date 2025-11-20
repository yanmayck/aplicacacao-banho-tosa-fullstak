import {
  IsOptional,
  IsDateString,
  IsString,
  IsEnum,
  IsArray,
  IsUUID,
} from 'class-validator';
import { AppointmentStatus as PrismaAppointmentStatus } from '@prisma/client'; // Importar o enum do Prisma

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  dateTime?: string; // Renomeado

  @IsOptional()
  @IsEnum(PrismaAppointmentStatus) // Usar o enum do Prisma
  status?: PrismaAppointmentStatus;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  // @ArrayNotEmpty() // Decidir se um array vazio é permitido para remover todos os serviços
  @IsUUID('all', { each: true })
  serviceIds?: string[];

  @IsOptional()
  @IsUUID()
  groomerId?: string;
}
