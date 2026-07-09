import { PropertyType } from '@prisma/client';
export declare class CreatePropertyDto {
    name: string;
    type?: PropertyType;
    description?: string;
    notes?: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
    totalUnits?: number;
    yearBuilt?: number;
    latitude?: number;
    longitude?: number;
    amenities?: Record<string, any>;
    images?: Record<string, any>[];
    metadata?: Record<string, any>;
    ownerId?: string;
    managerId?: string;
}
