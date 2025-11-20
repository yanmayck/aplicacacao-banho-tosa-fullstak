import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsUUID,
  IsEnum,
} from 'class-validator';
import {
  CreateAppointmentRequest,
  AppointmentStatus,
} from '@furry-friends/types';

export class CreateAppointmentDto implements CreateAppointmentRequest {
  @IsUUID()
  @IsNotEmpty()
  petId: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('all', { each: true })
  serviceIds: string[];

  @IsUUID()
  @IsNotEmpty()
  groomerId: string;

  @IsDateString()
  @IsNotEmpty()
  dateTime: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}
