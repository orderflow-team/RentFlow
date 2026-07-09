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
    joinWaitlist(user: JwtPayload, id: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        createdAt: Date;
        updatedAt: Date;
        companyId: string;
        propertyId: string;
        unitId: string | null;
        tenantId: string;
        compatibilityScore: number;
        isWaitingList: boolean;
    }>;
}
