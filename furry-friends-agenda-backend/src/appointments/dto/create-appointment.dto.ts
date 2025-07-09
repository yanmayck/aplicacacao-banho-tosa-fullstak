import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
  IsEnum, // Para validar o status contra o enum
} from 'class-validator';
import { AppointmentStatus as PrismaAppointmentStatus } from '@prisma/client'; // Importar o enum do Prisma (será utilizável após prisma generate)

// O enum local pode ser removido se pudermos depender do PrismaAppointmentStatus
// Por enquanto, manter para referência de estrutura, mas o serviço usará o do Prisma.
// export enum AppointmentStatus {
//   SCHEDULED = 'SCHEDULED',
//   COMPLETED = 'COMPLETED',
//   CANCELLED = 'CANCELLED',
//   NO_SHOW = 'NO_SHOW',
// }

export class CreateAppointmentDto {
  @IsUUID() // Assumindo que petId é um UUID
  @IsNotEmpty()
  petId: string;

  // Removido serviceTypeId
  // Adicionado serviceIds
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true }) // Validar cada ID no array como UUID
  serviceIds: string[];

  @IsUUID() // Assumindo que groomerId é um UUID
  @IsNotEmpty()
  groomerId: string;

  @IsDateString()
  @IsNotEmpty()
  dateTime: string; // Renomeado de appointmentDateTime

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(PrismaAppointmentStatus) // Validar contra o enum do Prisma
  status?: PrismaAppointmentStatus; // Status opcional na criação, default no serviço

  // clientId será pego do usuário logado no serviço
}
