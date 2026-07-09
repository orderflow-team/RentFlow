import { TenantStatus } from '@prisma/client';
export declare class CreateTenantDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status?: TenantStatus;
    emergencyContact?: Record<string, any>;
    notes?: string;
    documents?: Record<string, any>;
}
