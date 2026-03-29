import {
  IsInt,
  IsString,
  IsOptional,
  IsBoolean,
  Min,
  Max,
  IsUUID,
} from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsBoolean()
  @IsOptional()
  isAnonymous?: boolean;

  @IsUUID()
  @IsOptional()
  appointmentId?: string;

  @IsUUID()
  @IsOptional()
  groomerId?: string;
}
