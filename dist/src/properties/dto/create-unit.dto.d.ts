import { UnitStatus } from '@prisma/client';
export declare class CreateUnitDto {
    name: string;
    description?: string;
    status?: UnitStatus;
    floorNumber?: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    rentAmount?: number;
    depositAmount?: number;
    amenities?: Record<string, any>;
    metadata?: Record<string, any>;
}
