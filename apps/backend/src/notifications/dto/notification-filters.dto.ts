import {
  IsOptional,
  IsEnum,
  IsDateString,
  IsInt,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  NotificationFilters,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '@furry-friends/types';

export class NotificationFiltersDto implements NotificationFilters {
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @IsEnum(NotificationChannel)
  @IsOptional()
  channel?: NotificationChannel;

  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  unreadOnly?: boolean;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  offset?: number;

  @IsString()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  groomerId?: string;

  @IsString()
  @IsOptional()
  appointmentId?: string;
}
