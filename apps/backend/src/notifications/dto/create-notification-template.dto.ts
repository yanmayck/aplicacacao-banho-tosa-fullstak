import {
  IsString,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsArray,
  IsObject,
} from 'class-validator';
import { NotificationType, NotificationChannel } from '@prisma/client';

export class CreateNotificationTemplateDto {
  @IsString()
  name: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsEnum(NotificationType)
  type: NotificationType;

  @IsEnum(NotificationChannel)
  @IsOptional()
  channel?: NotificationChannel;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  variables?: string[];

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
