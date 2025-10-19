import { IsObject, IsBoolean, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateNotificationPreferencesDto {
  @IsObject()
  @IsOptional()
  @Type(() => Object)
  preferences?: Record<string, Record<string, boolean>>;
}
