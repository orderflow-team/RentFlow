import { IsString, IsEmail, IsOptional, IsEnum, MinLength, MaxLength } from 'class-validator';
import { OwnerStatus } from '@prisma/client';
export class CreateOwnerDto {
  @IsString() @MinLength(2) @MaxLength(50) firstName: string;
  @IsString() @MinLength(2) @MaxLength(50) lastName: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() @IsEnum(OwnerStatus) status?: OwnerStatus;
  @IsOptional() @IsString() @MaxLength(2000) notes?: string;
}
