import { IsString, IsNumber, IsOptional, IsEnum, IsDateString, Min } from 'class-validator';
import { ExpenseCategory } from '@prisma/client';

export class CreateExpenseDto {
  @IsOptional() @IsString() propertyId?: string;
  @IsEnum(ExpenseCategory) category: ExpenseCategory;
  @IsNumber() @Min(0) amount: number;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsDateString() expenseDate?: string;
  @IsOptional() @IsString() vendor?: string;
  @IsOptional() @IsString() notes?: string;
}
