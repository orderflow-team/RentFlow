import { VendorSpecialty } from '@prisma/client';
export declare class CreateVendorDto {
    name: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    specialty?: VendorSpecialty;
    notes?: string;
    isApproved?: boolean;
}
