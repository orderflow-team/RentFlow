import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, IsInt, Min, Max, IsObject } from 'class-validator';
import { LeaseStatus } from '@prisma/client';

export class CreateLeaseDto {
  @IsString() unitId: string;
  @IsString() tenantId: string;
  @IsDateString() startDate: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsNumber() @Min(0) rentAmount: number;
  @IsOptional() @IsNumber() @Min(0) depositAmount?: number;
  @IsOptional() @IsNumber() @Min(0) securityDeposit?: number;
  @IsOptional() @IsEnum(LeaseStatus) status?: LeaseStatus;
  @IsOptional() @IsInt() @Min(1) @Max(31) paymentDay?: number;
  @IsOptional() @IsNumber() @Min(0) lateFeePercent?: number;
  @IsOptional() @IsNumber() @Min(0) lateFeeFlat?: number;
  @IsOptional() @IsObject() leaseTerms?: Record<string, any>;
  @IsOptional() @IsObject() documents?: Record<string, any>;
  @IsOptional() @IsString() notes?: string;
}
