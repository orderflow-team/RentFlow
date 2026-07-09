import { PrismaService } from '../../prisma/prisma.service';
import { PropertyType } from '@prisma/client';
export declare class DiscoveryService {
    private prisma;
    constructor(prisma: PrismaService);
    search(companyId: string, filters: {
        location?: string;
        minBudget?: number;
        maxBudget?: number;
        type?: PropertyType;
        furnishedStatus?: string;
        occupancyType?: string;
        isAvailableSoon?: boolean;
    }): Promise<{
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
    joinWaitlist(companyId: string, propertyId: string, tenantEmail: string): Promise<{
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
