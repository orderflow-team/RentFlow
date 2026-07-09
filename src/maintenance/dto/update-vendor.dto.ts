import { IsString, IsOptional, IsEnum, IsBoolean, MinLength, MaxLength } from 'class-validator';
import { VendorSpecialty } from '@prisma/client';
export class UpdateVendorDto {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(200) name?: string;
  @IsOptional() @IsString() @MaxLength(100) contactPerson?: string;
  @IsOptional() @IsString() @MaxLength(100) email?: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() @IsString() @MaxLength(500) address?: string;
  @IsOptional() @IsEnum(VendorSpecialty) specialty?: VendorSpecialty;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
  @IsOptional() @IsBoolean() isApproved?: boolean;
}
