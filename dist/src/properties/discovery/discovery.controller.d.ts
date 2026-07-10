import { DiscoveryService } from './discovery.service';
import type { JwtPayload } from '../../common/enums/role.enum';
import { PropertyType } from '@prisma/client';
export declare class DiscoveryController {
    private readonly service;
    constructor(service: DiscoveryService);
    search(user: JwtPayload, location?: string, minBudget?: number, maxBudget?: number, type?: PropertyType, furnishedStatus?: string, occupancyType?: string, isAvailableSoon?: string): Promise<{
        id: string;
        name: string;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        type: import("@prisma/client").$Enums.PropertyType;
        status: import("@prisma/client").$Enums.PropertyStatus;
        images: {
            url: string;
            caption?: string;
        }[];
        expectedAvailability: Date | null;
        furnishedStatus: string | null;
        occupancyType: string | null;
        rentRange: {
            min: number;
            max: number | null;
        } | null;
        manager: {
            name: string;
            phone: string | null;
        } | null;
        preferences: {
            family: boolean;
            married: boolean;
            liveIn: boolean;
            students: boolean;
            professionals: boolean;
            petFriendly: boolean;
            vegetarian: boolean;
            smokingAllowed: boolean;
        };
        unitsCount: number;
    }[]>;
    getPropertyDetail(user: JwtPayload, id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        address: string;
        city: string;
        state: string;
        zipCode: string;
        type: import("@prisma/client").$Enums.PropertyType;
        status: import("@prisma/client").$Enums.PropertyStatus;
        yearBuilt: number | null;
        expectedAvailability: Date | null;
        furnishedStatus: string | null;
        occupancyType: string | null;
        images: {
            url: string;
            caption?: string;
        }[];
        amenities: import("@prisma/client/runtime/client").JsonValue;
        rentRange: {
            min: number;
            max: number;
        } | null;
        manager: {
            name: string;
            phone: string | null;
            email: string;
        } | null;
        preferences: {
            family: boolean;
            married: boolean;
            liveIn: boolean;
            students: boolean;
            professionals: boolean;
            petFriendly: boolean;
            vegetarian: boolean;
            smokingAllowed: boolean;
        };
        totalUnits: number;
        availableUnitsCount: number;
        availableUnits: {
            id: string;
            name: string;
            building: string;
            bedrooms: number;
            bathrooms: number;
            squareFootage: number | null;
            rentAmount: number | null;
            status: import("@prisma/client").$Enums.UnitStatus;
            description: string | null;
            images: {
                url: string;
                caption?: string;
            }[];
        }[];
    }>;
    joinWaitlist(user: JwtPayload, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        companyId: string;
        propertyId: string;
        unitId: string | null;
        tenantId: string;
        compatibilityScore: number;
        isWaitingList: boolean;
    }>;
}
