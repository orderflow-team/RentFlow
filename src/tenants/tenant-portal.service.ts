import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeaseStatus } from '@prisma/client';
import * as crypto from 'crypto';

@Injectable()
export class TenantPortalService {
  constructor(private prisma: PrismaService) {}

  async getMyLease(companyId: string, tenantId: string) {
    const lease = await this.prisma.lease.findFirst({
      where: { tenantId, companyId, deletedAt: null, status: 'ACTIVE' },
      include: {
        unit: { include: { building: { select: { name: true, property: { select: { name: true, address: true } } } } } },
        leaseLifecycle: true,
      },
    });
    if (!lease) throw new NotFoundException('No active lease found');
    return lease;
  }

  async getMyInvoices(companyId: string, tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId, companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { payments: true },
    });
  }

  async getMyMaintenanceRequests(companyId: string, tenantId: string) {
    return this.prisma.maintenanceRequest.findMany({
      where: { tenantId, companyId, deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: { unit: { select: { name: true } }, vendor: { select: { name: true } } },
    });
  }

  async submitMaintenanceRequest(companyId: string, tenantId: string, dto: { title: string; description?: string; category?: string; priority?: string; unitId?: string }) {
    const lease = await this.prisma.lease.findFirst({ where: { tenantId, companyId, deletedAt: null, status: 'ACTIVE' } });
    if (!lease) throw new NotFoundException('No active lease found');
    return this.prisma.maintenanceRequest.create({
      data: {
        companyId,
        tenantId,
        unitId: dto.unitId || lease.unitId,
        title: dto.title,
        description: dto.description,
        category: (dto.category as any) || 'MAINTENANCE',
        priority: (dto.priority as any) || 'MEDIUM',
        status: 'SUBMITTED',
      },
    });
  }

  async getMyDocuments(companyId: string, tenantId: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id: tenantId, companyId, deletedAt: null },
      select: { documents: true },
    });
    if (!tenant) throw new NotFoundException('Tenant profile not found');
    return Array.isArray(tenant.documents) ? tenant.documents : [];
  }

  async addMyDocument(companyId: string, tenantId: string, dto: { title: string; category?: string; url?: string }) {
    const tenant = await this.prisma.tenant.findFirst({ where: { id: tenantId, companyId, deletedAt: null } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');

    const docs = Array.isArray(tenant.documents) ? (tenant.documents as any[]) : [];
    docs.push({
      id: crypto.randomUUID(),
      title: dto.title,
      category: dto.category || 'OTHER',
      url: dto.url || null,
      uploadedAt: new Date().toISOString(),
    });

    await this.prisma.tenant.update({ where: { id: tenantId }, data: { documents: docs } });
    return docs;
  }

  async removeMyDocument(companyId: string, tenantId: string, docId: string) {
    const tenant = await this.prisma.tenant.findFirst({ where: { id: tenantId, companyId, deletedAt: null } });
    if (!tenant) throw new NotFoundException('Tenant profile not found');

    const docs = (Array.isArray(tenant.documents) ? (tenant.documents as any[]) : []).filter((d) => d.id !== docId);
    await this.prisma.tenant.update({ where: { id: tenantId }, data: { documents: docs } });
    return docs;
  }

  async getMyRentalHistory(companyId: string, tenantId: string) {
    const leases = await this.prisma.lease.findMany({
      where: {
        tenantId,
        companyId,
        deletedAt: null,
        status: { in: [LeaseStatus.EXPIRED, LeaseStatus.TERMINATED] },
      },
      include: {
        unit: {
          select: {
            name: true,
            building: {
              select: {
                property: { select: { name: true, address: true, city: true, state: true } },
              },
            },
          },
        },
      },
      orderBy: { startDate: 'desc' },
    });

    const history = await Promise.all(
      leases.map(async (lease) => {
        const reviews = await this.prisma.review.findMany({
          where: { leaseId: lease.id, targetType: 'TENANT', isUnblinded: true },
        });

        let rating: number | null = null;
        let scoreSum = 0;
        let scoreCount = 0;
        for (const review of reviews) {
          const scores = review.scores as Record<string, number> | null;
          if (scores) {
            for (const value of Object.values(scores)) {
              scoreSum += value;
              scoreCount++;
            }
          }
        }
        if (scoreCount > 0) {
          rating = parseFloat((scoreSum / scoreCount).toFixed(2));
        }

        const end = lease.endDate ?? new Date();
        const durationDays = Math.max(0, Math.round((end.getTime() - lease.startDate.getTime()) / (1000 * 60 * 60 * 24)));

        return {
          leaseId: lease.id,
          property: {
            name: lease.unit.building.property.name,
            address: lease.unit.building.property.address,
            city: lease.unit.building.property.city,
            state: lease.unit.building.property.state,
          },
          unit: lease.unit.name,
          startDate: lease.startDate,
          endDate: lease.endDate,
          duration: this.formatDuration(durationDays),
          rating,
        };
      }),
    );

    return history;
  }

  private formatDuration(days: number): string {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    if (years > 0) {
      return months > 0 ? `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''}`;
    }
    if (months > 0) {
      return `${months} month${months > 1 ? 's' : ''}`;
    }
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
}
