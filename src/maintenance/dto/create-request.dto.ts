import { IsString, IsOptional, IsEnum, IsNumber, IsDateString, Min, MaxLength } from 'class-validator';
import { MaintenancePriority, TicketCategory } from '@prisma/client';
export class CreateRequestDto {
  @IsOptional() @IsString() unitId?: string;
  @IsOptional() @IsString() tenantId?: string;
  @IsString() @MaxLength(200) title: string;
  @IsOptional() @IsString() @MaxLength(2000) description?: string;
  @IsOptional() @IsEnum(TicketCategory) category?: TicketCategory;
  @IsOptional() @IsEnum(MaintenancePriority) priority?: MaintenancePriority;
  @IsOptional() @IsString() vendorId?: string;
  @IsOptional() @IsNumber() @Min(0) estimatedCost?: number;
  @IsOptional() @IsDateString() scheduledDate?: string;
}
