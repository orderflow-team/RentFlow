import { ReputationService } from './reputation.service';
import type { JwtPayload } from '../enums/role.enum';
export declare class ReputationController {
    private readonly service;
    constructor(service: ReputationService);
    submitReview(user: JwtPayload, leaseId: string, dto: {
        targetType: 'TENANT' | 'OWNER' | 'PROPERTY' | 'COMMUNITY';
        targetId: string;
        scores: Record<string, number>;
        comment?: string;
    }): Promise<{
        id: string;
        companyId: string;
        leaseId: string;
        authorId: string;
        targetType: string;
        targetId: string;
        scores: import("@prisma/client/runtime/client").JsonValue;
        comment: string | null;
        submittedAt: Date;
        visibleAfter: Date;
        isUnblinded: boolean;
    }>;
    getReviews(user: JwtPayload, targetType: 'TENANT' | 'OWNER' | 'PROPERTY' | 'COMMUNITY', targetId: string): Promise<{
        id: string;
        companyId: string;
        leaseId: string;
        authorId: string;
        targetType: string;
        targetId: string;
        scores: import("@prisma/client/runtime/client").JsonValue;
        comment: string | null;
        submittedAt: Date;
        visibleAfter: Date;
        isUnblinded: boolean;
    }[]>;
    togglePrivacy(user: JwtPayload, dto: {
        type: 'TENANT' | 'OWNER';
        isPublic: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.TenantStatus;
        deletedAt: Date | null;
        firstName: string;
        lastName: string;
        companyId: string;
        userId: string | null;
        notes: string | null;
        emergencyContact: import("@prisma/client/runtime/client").JsonValue | null;
        documents: import("@prisma/client/runtime/client").JsonValue | null;
        trustScore: number;
        verifiedStaysCount: number;
        averageRating: number;
        isReputationPublic: boolean;
    } | {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.OwnerStatus;
        deletedAt: Date | null;
        firstName: string;
        lastName: string;
        companyId: string;
        userId: string | null;
        notes: string | null;
        trustScore: number;
        verifiedStaysCount: number;
        averageRating: number;
        isReputationPublic: boolean;
    }>;
}
