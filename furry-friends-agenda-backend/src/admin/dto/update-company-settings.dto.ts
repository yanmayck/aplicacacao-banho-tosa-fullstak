import { IsObject, IsOptional } from 'class-validator';

export class UpdateCompanySettingsDto {
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}