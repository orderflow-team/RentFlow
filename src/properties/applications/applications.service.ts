import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ApplicationStatus } from '@prisma/client';

@Injectable()
export class ApplicationsService {
  constructor(private prisma: PrismaService) {}

  async apply(
    companyId: string,
    propertyId: string,
    tenantEmail: string,
    dto: {
      unitId?: string;
      isFamily?: boolean;
      isMarried?: boolean;
      isLiveIn?: boolean;
      isStudent?: boolean;
      isProfessional?: boolean;
      hasPets?: boolean;
      isVegetarian?: boolean;
      isSmoker?: boolean;
    },
  ) {
    // 1. Verify property
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, companyId, deletedAt: null },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // 2. Find tenant
    const tenant = await this.prisma.tenant.findFirst({
      where: { email: tenantEmail, companyId },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant profile not found. Please register profile first.');
    }

    // Check if already applied
    const existing = await this.prisma.propertyApplication.findFirst({
      where: {
        propertyId,
        tenantId: tenant.id,
        unitId: dto.unitId || null,
        isWaitingList: false,
      },
    });
    if (existing) {
      throw new BadRequestException('You have already applied for this property');
    }

    // 3. Compute compatibility score
    let score = 100.0;
    if (property.prefPetFriendly === false && dto.hasPets === true) score -= 20.0;
    if (property.prefSmokingAllowed === false && dto.isSmoker === true) score -= 20.0;
    if (property.prefVegetarian === true && dto.isVegetarian === false) score -= 20.0;
    if (property.prefFamily === true && dto.isFamily === false) score -= 15.0;
    if (property.prefMarried === true && dto.isMarried === false) score -= 15.0;
    if (property.prefLiveIn === true && dto.isLiveIn === false) score -= 15.0;
    if (property.prefStudents === true && dto.isStudent === false) score -= 15.0;
    if (property.prefProfessionals === true && dto.isProfessional === false) score -= 15.0;

    score = Math.max(0.0, score);

    // 4. Create application
    return this.prisma.propertyApplication.create({
      data: {
        companyId,
        propertyId,
        unitId: dto.unitId || null,
        tenantId: tenant.id,
        status: ApplicationStatus.PENDING,
        compatibilityScore: score,
        isWaitingList: false,
      },
    });
  }

  async getQueue(companyId: string, propertyId: string) {
    // Verify property exists
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, companyId, deletedAt: null },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const applications = await this.prisma.propertyApplication.findMany({
      where: { propertyId, companyId, isWaitingList: false },
      include: {
        tenant: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            trustScore: true,
            averageRating: true,
            verifiedStaysCount: true,
            isReputationPublic: true,
          },
        },
        unit: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { compatibilityScore: 'desc' },
    });

    return applications.map((app) => ({
      id: app.id,
      status: app.status,
      compatibilityScore: app.compatibilityScore,
      createdAt: app.createdAt,
      unit: app.unit,
      tenant: {
        id: app.tenant.id,
        name: `${app.tenant.firstName} ${app.tenant.lastName}`,
        email: app.tenant.email,
        phone: app.tenant.phone,
        trustScore: app.tenant.trustScore,
        averageRating: app.tenant.averageRating,
        verifiedStaysCount: app.tenant.verifiedStaysCount,
        reputation: app.tenant.isReputationPublic
          ? {
              rating: app.tenant.averageRating,
              stays: app.tenant.verifiedStaysCount,
            }
          : 'PRIVATE',
      },
    }));
  }

  async updateStatus(
    companyId: string,
    id: string,
    dto: { status: ApplicationStatus },
  ) {
    const application = await this.prisma.propertyApplication.findFirst({
      where: { id, companyId },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return this.prisma.propertyApplication.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
