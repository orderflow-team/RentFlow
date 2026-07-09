import { ExpenseCategory } from '@prisma/client';
export declare class CreateExpenseDto {
    propertyId?: string;
    category: ExpenseCategory;
    amount: number;
    description?: string;
    expenseDate?: string;
    vendor?: string;
    notes?: string;
}
