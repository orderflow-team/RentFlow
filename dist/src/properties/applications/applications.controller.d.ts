import { ApplicationsService } from './applications.service';
import type { JwtPayload } from '../../common/enums/role.enum';
import { ApplicationStatus } from '@prisma/client';
export declare class ApplicationsController {
    private readonly service;
    constructor(service: ApplicationsService);
    apply(user: JwtPayload, propertyId: string, dto: {
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
    getQueue(user: JwtPayload, propertyId: string): Promise<{
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
    updateStatus(user: JwtPayload, id: string, dto: {
        status: ApplicationStatus;
    }): Promise<{
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
