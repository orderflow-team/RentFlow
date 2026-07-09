import { InvoiceStatus, InvoiceCategory } from '@prisma/client';
export declare class CreateInvoiceDto {
    leaseId: string;
    periodStart: string;
    periodEnd: string;
    dueDate: string;
    rentAmount: number;
    lateFee?: number;
    otherCharges?: number;
    status?: InvoiceStatus;
    category?: InvoiceCategory;
    notes?: string;
}
