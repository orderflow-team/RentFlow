import { PrismaService } from '../../prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';
export declare class ApplicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    apply(companyId: string, propertyId: string, tenantEmail: string, dto: {
        unitId?: string;
        isFamily?: boolean;
        isMarried?: boolean;
        isLiveIn?: boolean;
        isStudent?: boolean;
        isProfessional?: boolean;
        hasPets?: boolean;
        isVegetarian?: boolean;
        isSmoker?: boolean;
    }): Promise<{
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
    getQueue(companyId: string, propertyId: string): Promise<{
        id: string;
        status: import("@prisma/client").$Enums.ApplicationStatus;
        compatibilityScore: number;
        createdAt: Date;
        unit: {
            id: string;
            name: string;
        } | null;
        tenant: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            trustScore: number;
            averageRating: number;
            verifiedStaysCount: number;
            reputation: string | {
                rating: number;
                stays: number;
            };
        };
    }[]>;
    updateStatus(companyId: string, id: string, dto: {
        status: ApplicationStatus;
    }): Promise<{
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
