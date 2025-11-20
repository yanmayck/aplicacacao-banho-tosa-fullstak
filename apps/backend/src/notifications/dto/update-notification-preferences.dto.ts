import { IsObject, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateNotificationPreferencesRequest } from '@furry-friends/types';

export class UpdateNotificationPreferencesDto implements UpdateNotificationPreferencesRequest {
  @IsObject()
  @IsOptional()
  @Type(() => Object)
  preferences?: Record<string, Record<string, boolean>>;
}
