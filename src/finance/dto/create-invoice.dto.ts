import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { InvoiceStatus, InvoiceCategory } from '@prisma/client';

export class CreateInvoiceDto {
  @IsString() leaseId: string;
  @IsDateString() periodStart: string;
  @IsDateString() periodEnd: string;
  @IsDateString() dueDate: string;
  @IsNumber() @Min(0) rentAmount: number;
  @IsOptional() @IsNumber() @Min(0) lateFee?: number;
  @IsOptional() @IsNumber() @Min(0) otherCharges?: number;
  @IsOptional() @IsEnum(InvoiceStatus) status?: InvoiceStatus;
  @IsOptional() @IsEnum(InvoiceCategory) category?: InvoiceCategory;
  @IsOptional() @IsString() notes?: string;
}
