import { PrismaService } from '../../prisma/prisma.service';
export declare class ReputationService {
    private prisma;
    constructor(prisma: PrismaService);
    submitReview(companyId: string, authorUserId: string, leaseId: string, dto: {
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
    getReviewsForTarget(companyId: string, readerUserId: string, targetType: 'TENANT' | 'OWNER' | 'PROPERTY' | 'COMMUNITY', targetId: string): Promise<{
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
    recalculateTrustAndReputation(companyId: string, id: string, type: 'TENANT' | 'OWNER'): Promise<{
        averageRating: number;
        completedStays: number;
        trustScore: number;
    }>;
    togglePrivacy(companyId: string, userId: string, type: 'TENANT' | 'OWNER', isPublic: boolean): Promise<{
        id: string;
        email: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.TenantStatus;
        createdAt: Date;
        updatedAt: Date;
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
        email: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.OwnerStatus;
        createdAt: Date;
        updatedAt: Date;
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
    releaseExpiredBlindReviews(): Promise<import("@prisma/client").Prisma.BatchPayload>;
}
