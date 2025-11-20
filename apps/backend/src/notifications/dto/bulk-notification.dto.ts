import {
  IsArray,
  IsString,
  IsEnum,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  BulkNotificationRequest,
  NotificationType,
  NotificationTarget,
} from '@furry-friends/types';

class NotificationTargetDto implements NotificationTarget {
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  recipientType?: 'email' | 'phone' | 'user_id';
}

export class BulkNotificationDto implements BulkNotificationRequest {
  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NotificationTargetDto)
  targets: NotificationTargetDto[];

  @IsObject()
  @IsOptional()
  data?: Record<string, unknown>;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  channels?: string[];

  @IsString()
  @IsOptional()
  scheduledFor?: string;
}
