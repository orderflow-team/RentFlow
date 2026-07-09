import { IsString, IsEmail, IsOptional, IsEnum, MinLength, MaxLength, IsObject } from 'class-validator';
import { TenantStatus } from '@prisma/client';

export class CreateTenantDto {
  @IsString() @MinLength(2) @MaxLength(50) firstName: string;
  @IsString() @MinLength(2) @MaxLength(50) lastName: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() @IsEnum(TenantStatus) status?: TenantStatus;
  @IsOptional() @IsObject() emergencyContact?: Record<string, any>;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
  @IsOptional() @IsObject() documents?: Record<string, any>;
}
