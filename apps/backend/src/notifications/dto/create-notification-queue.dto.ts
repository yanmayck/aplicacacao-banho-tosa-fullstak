import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsUUID,
  IsDateString,
} from 'class-validator';
import {
  CreateNotificationQueueRequest,
  NotificationType,
  NotificationChannel,
  NotificationStatus,
} from '@furry-friends/types';

export class CreateNotificationQueueDto implements CreateNotificationQueueRequest {
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
  data?: Record<string, unknown>;

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
  metadata?: Record<string, unknown>;
}
