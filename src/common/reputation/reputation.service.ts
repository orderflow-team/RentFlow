import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaseStatus } from '@prisma/client';

@Injectable()
export class ReputationService {
  constructor(private prisma: PrismaService) {}

  async submitReview(
    companyId: string,
    authorUserId: string,
    leaseId: string,
    dto: {
      targetType: 'TENANT' | 'OWNER' | 'PROPERTY' | 'COMMUNITY';
      targetId: string;
      scores: Record<string, number>;
      comment?: string;
    },
  ) {
    // 1. Fetch lease and verify status is EXPIRED or TERMINATED
    const lease = await this.prisma.lease.findFirst({
      where: { id: leaseId, companyId, deletedAt: null },
      include: {
        unit: { select: { building: { select: { propertyId: true } } } },
        tenant: true,
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease agreement not found');
    }

    if (lease.status !== LeaseStatus.EXPIRED && lease.status !== LeaseStatus.TERMINATED) {
      throw new BadRequestException('Ratings are only allowed once the stay is completed (lease is expired or terminated).');
    }

    // 2. Determine author role (Tenant vs Owner/Manager)
    const isTenantAuthor = lease.tenant?.userId === authorUserId;
    // For simplicity, we check if the user is linked to the company or property owner
    const property = await this.prisma.property.findFirst({
      where: { id: lease.unit?.building?.propertyId, companyId },
      include: { owner: true },
    });
    const isOwnerAuthor = property?.owner?.userId === authorUserId;

    if (!isTenantAuthor && !isOwnerAuthor) {
      throw new BadRequestException('You are not authorized to submit reviews for this lease stay.');
    }

    // Validate target compatibility
    if (isTenantAuthor && dto.targetType === 'TENANT') {
      throw new BadRequestException('Tenants cannot rate other tenants on the same lease.');
    }
    if (isOwnerAuthor && (dto.targetType === 'OWNER' || dto.targetType === 'PROPERTY' || dto.targetType === 'COMMUNITY')) {
      throw new BadRequestException('Owners cannot rate owners, properties, or communities.');
    }

    // 3. Set blind rating window: visibleAfter is 14 days after lease end date (or current date if lease end date doesn't exist)
    const leaseEnd = lease.endDate || new Date();
    const visibleAfter = new Date(leaseEnd.getTime() + 14 * 24 * 60 * 60 * 1000);

    // Check if review already exists
    const existing = await this.prisma.review.findFirst({
      where: {
        leaseId,
        authorId: authorUserId,
        targetType: dto.targetType,
        targetId: dto.targetId,
      },
    });
    if (existing) {
      throw new BadRequestException('You have already submitted a review for this target under this lease.');
    }

    // Create the review
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

    // 4. Blind Rating Release Logic:
    // Check if the counterpart has also submitted their review
    const counterpartReview = await this.prisma.review.findFirst({
      where: {
        leaseId,
        authorId: isTenantAuthor ? property?.owner?.userId || 'owner' : lease.tenant?.userId || 'tenant',
      },
    });

    if (counterpartReview) {
      // Both parties have submitted reviews! Unblind both immediately.
      await this.prisma.review.updateMany({
        where: { leaseId },
        data: { isUnblinded: true },
      });

      // Recalculate trust scores and average ratings
      if (lease.tenantId) {
        await this.recalculateTrustAndReputation(companyId, lease.tenantId, 'TENANT');
      }
      if (property?.ownerId) {
        await this.recalculateTrustAndReputation(companyId, property.ownerId, 'OWNER');
      }
    }

    return review;
  }

  async getReviewsForTarget(
    companyId: string,
    readerUserId: string,
    targetType: 'TENANT' | 'OWNER' | 'PROPERTY' | 'COMMUNITY',
    targetId: string,
  ) {
    // Determine reader eligibility based on privacy setting
    // Reader must have public reputation enabled to view others' detailed reviews
    const readerTenant = await this.prisma.tenant.findFirst({ where: { userId: readerUserId, companyId } });
    const readerOwner = await this.prisma.owner.findFirst({ where: { userId: readerUserId, companyId } });

    const isReaderPublic =
      (readerTenant ? readerTenant.isReputationPublic : true) &&
      (readerOwner ? readerOwner.isReputationPublic : true);

    if (!isReaderPublic) {
      throw new BadRequestException('Detailed reputation reviews are locked. You must set your own reputation to PUBLIC to view others.');
    }

    // Check if target is public
    if (targetType === 'TENANT') {
      const targetTenant = await this.prisma.tenant.findFirst({ where: { id: targetId, companyId } });
      if (targetTenant && !targetTenant.isReputationPublic) {
        throw new BadRequestException('This user has set their reputation details to PRIVATE.');
      }
    } else if (targetType === 'OWNER') {
      const targetOwner = await this.prisma.owner.findFirst({ where: { id: targetId, companyId } });
      if (targetOwner && !targetOwner.isReputationPublic) {
        throw new BadRequestException('This user has set their reputation details to PRIVATE.');
      }
    }

    // Fetch unblinded reviews
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

  async recalculateTrustAndReputation(
    companyId: string,
    id: string,
    type: 'TENANT' | 'OWNER',
  ) {
    // 1. Fetch all unblinded reviews targeting this entity
    const reviews = await this.prisma.review.findMany({
      where: {
        companyId,
        targetType: type,
        targetId: id,
        isUnblinded: true,
      },
    });

    // Calculate average score across all review categories
    let totalScoreSum = 0;
    let categoryCount = 0;

    reviews.forEach((r) => {
      const scores = r.scores as Record<string, number>;
      if (scores) {
        Object.values(scores).forEach((val) => {
          totalScoreSum += val;
          categoryCount++;
        });
      }
    });

    const averageRating = categoryCount > 0 ? parseFloat((totalScoreSum / categoryCount).toFixed(2)) : 0.0;

    // 2. Fetch completed stays (leases that are expired or terminated)
    const completedStays = await this.prisma.lease.count({
      where: {
        companyId,
        ...(type === 'TENANT' ? { tenantId: id } : { unit: { building: { property: { ownerId: id } } } }),
        status: { in: [LeaseStatus.EXPIRED, LeaseStatus.TERMINATED] },
      },
    });

    // 3. Compute trust score: starts at 50, +5 per stay, +10 per average rating point (max 100)
    const trustScore = Math.min(
      100.0,
      parseFloat((50.0 + completedStays * 5.0 + averageRating * 10.0).toFixed(2)),
    );

    // Update target
    if (type === 'TENANT') {
      await this.prisma.tenant.update({
        where: { id },
        data: {
          averageRating,
          verifiedStaysCount: completedStays,
          trustScore,
        },
      });
    } else {
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

  async togglePrivacy(
    companyId: string,
    userId: string,
    type: 'TENANT' | 'OWNER',
    isPublic: boolean,
  ) {
    if (type === 'TENANT') {
      const tenant = await this.prisma.tenant.findFirst({ where: { userId, companyId } });
      if (!tenant) throw new NotFoundException('Tenant profile not found');
      return this.prisma.tenant.update({
        where: { id: tenant.id },
        data: { isReputationPublic: isPublic },
      });
    } else {
      const owner = await this.prisma.owner.findFirst({ where: { userId, companyId } });
      if (!owner) throw new NotFoundException('Owner profile not found');
      return this.prisma.owner.update({
        where: { id: owner.id },
        data: { isReputationPublic: isPublic },
      });
    }
  }

  // Cron release task helper to release blinded reviews whose window has expired
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
}
