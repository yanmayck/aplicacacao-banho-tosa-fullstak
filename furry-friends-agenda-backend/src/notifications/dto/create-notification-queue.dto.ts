import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsUUID,
  IsDateString,
} from 'class-validator';
import {
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '@prisma/client';

export class CreateNotificationQueueDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationChannel)
  channel: NotificationChannel;

  @IsString()
  recipient: string;

  @IsString()
  recipientType: 'email' | 'phone' | 'user_id';

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  content: string;

  @IsUUID()
  @IsOptional()
  templateId?: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsUUID()
  @IsOptional()
  groomerId?: string;

  @IsUUID()
  @IsOptional()
  appointmentId?: string;

  @IsEnum(NotificationStatus)
  @IsOptional()
  status?: NotificationStatus;

  @IsDateString()
  @IsOptional()
  scheduledFor?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
