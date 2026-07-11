import { UnitStatus, ListingType } from '@prisma/client';
import { PropertyImageDto } from './create-property.dto';
export declare class CreateUnitDto {
    name: string;
    description?: string;
    status?: UnitStatus;
    floorNumber?: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    listingType?: ListingType;
    rentAmount?: number;
    depositAmount?: number;
    salePrice?: number;
    images?: PropertyImageDto[];
    amenities?: Record<string, any>;
    metadata?: Record<string, any>;
}
