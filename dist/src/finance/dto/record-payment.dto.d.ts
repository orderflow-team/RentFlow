import { PaymentMethod } from '@prisma/client';
export declare class RecordPaymentDto {
    amount: number;
    paymentDate?: string;
    paymentMethod?: PaymentMethod;
    reference?: string;
    notes?: string;
}
