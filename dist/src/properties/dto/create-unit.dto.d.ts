import { UnitStatus } from '@prisma/client';
import { PropertyImageDto } from './create-property.dto';
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
    images?: PropertyImageDto[];
    amenities?: Record<string, any>;
    metadata?: Record<string, any>;
}
