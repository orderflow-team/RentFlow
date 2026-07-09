"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReputationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReputationService = class ReputationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async submitReview(companyId, authorUserId, leaseId, dto) {
        const lease = await this.prisma.lease.findFirst({
            where: { id: leaseId, companyId, deletedAt: null },
            include: {
                unit: { select: { building: { select: { propertyId: true } } } },
                tenant: true,
            },
        });
        if (!lease) {
            throw new common_1.NotFoundException('Lease agreement not found');
        }
        if (lease.status !== client_1.LeaseStatus.EXPIRED && lease.status !== client_1.LeaseStatus.TERMINATED) {
            throw new common_1.BadRequestException('Ratings are only allowed once the stay is completed (lease is expired or terminated).');
        }
        const isTenantAuthor = lease.tenant?.userId === authorUserId;
        const property = await this.prisma.property.findFirst({
            where: { id: lease.unit?.building?.propertyId, companyId },
            include: { owner: true },
        });
        const isOwnerAuthor = property?.owner?.userId === authorUserId;
        if (!isTenantAuthor && !isOwnerAuthor) {
            throw new common_1.BadRequestException('You are not authorized to submit reviews for this lease stay.');
        }
        if (isTenantAuthor && dto.targetType === 'TENANT') {
            throw new common_1.BadRequestException('Tenants cannot rate other tenants on the same lease.');
        }
        if (isOwnerAuthor && (dto.targetType === 'OWNER' || dto.targetType === 'PROPERTY' || dto.targetType === 'COMMUNITY')) {
            throw new common_1.BadRequestException('Owners cannot rate owners, properties, or communities.');
        }
        const leaseEnd = lease.endDate || new Date();
        const visibleAfter = new Date(leaseEnd.getTime() + 14 * 24 * 60 * 60 * 1000);
        const existing = await this.prisma.review.findFirst({
            where: {
                leaseId,
                authorId: authorUserId,
                targetType: dto.targetType,
                targetId: dto.targetId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('You have already submitted a review for this target under this lease.');
        }
        const review = await this.prisma.review.create({
            data: {
                companyId,
                leaseId,
                authorId: authorUserId,
                targetType: dto.targetType,
                targetId: dto.targetId,
                scores: dto.scores,
                comment: dto.comment,
                visibleAfter,
                isUnblinded: false,
            },
        });
        const counterpartReview = await this.prisma.review.findFirst({
            where: {
                leaseId,
                authorId: isTenantAuthor ? property?.owner?.userId || 'owner' : lease.tenant?.userId || 'tenant',
            },
        });
        if (counterpartReview) {
            await this.prisma.review.updateMany({
                where: { leaseId },
                data: { isUnblinded: true },
            });
            if (lease.tenantId) {
                await this.recalculateTrustAndReputation(companyId, lease.tenantId, 'TENANT');
            }
            if (property?.ownerId) {
                await this.recalculateTrustAndReputation(companyId, property.ownerId, 'OWNER');
            }
        }
        return review;
    }
    async getReviewsForTarget(companyId, readerUserId, targetType, targetId) {
        const readerTenant = await this.prisma.tenant.findFirst({ where: { userId: readerUserId, companyId } });
        const readerOwner = await this.prisma.owner.findFirst({ where: { userId: readerUserId, companyId } });
        const isReaderPublic = (readerTenant ? readerTenant.isReputationPublic : true) &&
            (readerOwner ? readerOwner.isReputationPublic : true);
        if (!isReaderPublic) {
            throw new common_1.BadRequestException('Detailed reputation reviews are locked. You must set your own reputation to PUBLIC to view others.');
        }
        if (targetType === 'TENANT') {
            const targetTenant = await this.prisma.tenant.findFirst({ where: { id: targetId, companyId } });
            if (targetTenant && !targetTenant.isReputationPublic) {
                throw new common_1.BadRequestException('This user has set their reputation details to PRIVATE.');
            }
        }
        else if (targetType === 'OWNER') {
            const targetOwner = await this.prisma.owner.findFirst({ where: { id: targetId, companyId } });
            if (targetOwner && !targetOwner.isReputationPublic) {
                throw new common_1.BadRequestException('This user has set their reputation details to PRIVATE.');
            }
        }
        return this.prisma.review.findMany({
            where: {
                companyId,
                targetType,
                targetId,
                isUnblinded: true,
            },
            orderBy: { submittedAt: 'desc' },
        });
    }
    async recalculateTrustAndReputation(companyId, id, type) {
        const reviews = await this.prisma.review.findMany({
            where: {
                companyId,
                targetType: type,
                targetId: id,
                isUnblinded: true,
            },
        });
        let totalScoreSum = 0;
        let categoryCount = 0;
        reviews.forEach((r) => {
            const scores = r.scores;
            if (scores) {
                Object.values(scores).forEach((val) => {
                    totalScoreSum += val;
                    categoryCount++;
                });
            }
        });
        const averageRating = categoryCount > 0 ? parseFloat((totalScoreSum / categoryCount).toFixed(2)) : 0.0;
        const completedStays = await this.prisma.lease.count({
            where: {
                companyId,
                ...(type === 'TENANT' ? { tenantId: id } : { unit: { building: { property: { ownerId: id } } } }),
                status: { in: [client_1.LeaseStatus.EXPIRED, client_1.LeaseStatus.TERMINATED] },
            },
        });
        const trustScore = Math.min(100.0, parseFloat((50.0 + completedStays * 5.0 + averageRating * 10.0).toFixed(2)));
        if (type === 'TENANT') {
            await this.prisma.tenant.update({
                where: { id },
                data: {
                    averageRating,
                    verifiedStaysCount: completedStays,
                    trustScore,
                },
            });
        }
        else {
            await this.prisma.owner.update({
                where: { id },
                data: {
                    averageRating,
                    verifiedStaysCount: completedStays,
                    trustScore,
                },
            });
        }
        return { averageRating, completedStays, trustScore };
    }
    async togglePrivacy(companyId, userId, type, isPublic) {
        if (type === 'TENANT') {
            const tenant = await this.prisma.tenant.findFirst({ where: { userId, companyId } });
            if (!tenant)
                throw new common_1.NotFoundException('Tenant profile not found');
            return this.prisma.tenant.update({
                where: { id: tenant.id },
                data: { isReputationPublic: isPublic },
            });
        }
        else {
            const owner = await this.prisma.owner.findFirst({ where: { userId, companyId } });
            if (!owner)
                throw new common_1.NotFoundException('Owner profile not found');
            return this.prisma.owner.update({
                where: { id: owner.id },
                data: { isReputationPublic: isPublic },
            });
        }
    }
    async releaseExpiredBlindReviews() {
        const now = new Date();
        const result = await this.prisma.review.updateMany({
            where: {
                isUnblinded: false,
                visibleAfter: { lte: now },
            },
            data: { isUnblinded: true },
        });
        return result;
    }
};
exports.ReputationService = ReputationService;
exports.ReputationService = ReputationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReputationService);
//# sourceMappingURL=reputation.service.js.map