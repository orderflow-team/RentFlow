import { OwnerStatus } from '@prisma/client';
export declare class CreateOwnerDto {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    status?: OwnerStatus;
    notes?: string;
}
