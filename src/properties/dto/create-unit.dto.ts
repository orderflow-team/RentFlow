import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsNumber,
  Min,
  MaxLength,
  MinLength,
  IsObject,
} from 'class-validator';
import { UnitStatus } from '@prisma/client';

export class CreateUnitDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsEnum(UnitStatus)
  status?: UnitStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  floorNumber?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bedrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  bathrooms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  squareFootage?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  rentAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  depositAmount?: number;

  @IsOptional()
  @IsObject()
  amenities?: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
