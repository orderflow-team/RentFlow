import { LeaseStatus } from '@prisma/client';
export declare class CreateLeaseDto {
    unitId: string;
    tenantId: string;
    startDate: string;
    endDate?: string;
    rentAmount: number;
    depositAmount?: number;
    securityDeposit?: number;
    status?: LeaseStatus;
    paymentDay?: number;
    lateFeePercent?: number;
    lateFeeFlat?: number;
    leaseTerms?: Record<string, any>;
    documents?: Record<string, any>;
    notes?: string;
}
