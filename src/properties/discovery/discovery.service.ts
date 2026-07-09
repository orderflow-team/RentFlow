import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PropertyType, PropertyStatus, ApplicationStatus } from '@prisma/client';

@Injectable()
export class DiscoveryService {
  constructor(private prisma: PrismaService) {}

  async search(
    companyId: string,
    filters: {
      location?: string;
      minBudget?: number;
      maxBudget?: number;
      type?: PropertyType;
      furnishedStatus?: string;
      occupancyType?: string;
      isAvailableSoon?: boolean;
    },
  ) {
    const where: any = {
      companyId,
      deletedAt: null,
    };

    if (filters.location) {
      where.OR = [
        { city: { contains: filters.location, mode: 'insensitive' } },
        { state: { contains: filters.location, mode: 'insensitive' } },
        { address: { contains: filters.location, mode: 'insensitive' } },
      ];
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.furnishedStatus) {
      where.furnishedStatus = filters.furnishedStatus;
    }

    if (filters.occupancyType) {
      where.occupancyType = filters.occupancyType;
    }

    if (filters.isAvailableSoon) {
      where.status = PropertyStatus.AVAILABLE_SOON;
    } else {
      where.status = {
        in: [PropertyStatus.ACTIVE, PropertyStatus.AVAILABLE_SOON],
      };
    }

    // Since budget (rentAmount) is actually tracked on the Unit level in this schema:
    // We will query properties matching these criteria and include their units, or filter units.
    const properties = await this.prisma.property.findMany({
      where,
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true, phone: true },
        },
        buildings: {
          include: {
            units: {
              where: {
                deletedAt: null,
                ...(filters.minBudget || filters.maxBudget
                  ? {
                      rentAmount: {
                        ...(filters.minBudget ? { gte: filters.minBudget } : {}),
                        ...(filters.maxBudget ? { lte: filters.maxBudget } : {}),
                      },
                    }
                  : {}),
              },
            },
          },
        },
      },
    });

    // Format properties and only return those that have units if budget filter was specified
    return properties
      .map((p) => {
        const units = p.buildings.flatMap((b) => b.units);
        if ((filters.minBudget || filters.maxBudget) && units.length === 0) {
          return null;
        }

        const minRent = units.length > 0 ? Math.min(...units.map((u) => u.rentAmount || 0)) : null;
        const maxRent = units.length > 0 ? Math.max(...units.map((u) => u.rentAmount || 0)) : null;

        return {
          id: p.id,
          name: p.name,
          address: p.address,
          city: p.city,
          state: p.state,
          zipCode: p.zipCode,
          type: p.type,
          status: p.status,
          expectedAvailability: p.expectedAvailability,
          furnishedStatus: p.furnishedStatus,
          occupancyType: p.occupancyType,
          rentRange: minRent !== null ? { min: minRent, max: maxRent } : null,
          manager: p.manager
            ? {
                name: `${p.manager.firstName} ${p.manager.lastName}`,
                phone: p.manager.phone,
              }
            : null,
          preferences: {
            family: p.prefFamily,
            married: p.prefMarried,
            liveIn: p.prefLiveIn,
            students: p.prefStudents,
            professionals: p.prefProfessionals,
            petFriendly: p.prefPetFriendly,
            vegetarian: p.prefVegetarian,
            smokingAllowed: p.prefSmokingAllowed,
          },
          unitsCount: units.length,
        };
      })
      .filter((p) => p !== null);
  }

  async joinWaitlist(companyId: string, propertyId: string, tenantEmail: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, companyId, deletedAt: null },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    if (property.status !== PropertyStatus.AVAILABLE_SOON) {
      throw new BadRequestException('Property is not listed as Available Soon');
    }

    // Find tenant by email
    const tenant = await this.prisma.tenant.findFirst({
      where: { email: tenantEmail, companyId },
    });
    if (!tenant) {
      throw new NotFoundException('Tenant record not found. Please complete profile registration first.');
    }

    // Check if already on the waitlist
    const existing = await this.prisma.propertyApplication.findFirst({
      where: {
        propertyId,
        tenantId: tenant.id,
        isWaitingList: true,
      },
    });
    if (existing) {
      throw new BadRequestException('You are already on the waiting list for this property');
    }

    // Join waitlist (PropertyApplication with isWaitingList: true)
    return this.prisma.propertyApplication.create({
      data: {
        companyId,
        propertyId,
        tenantId: tenant.id,
        status: ApplicationStatus.PENDING,
        isWaitingList: true,
        compatibilityScore: 100.0, // base compatibility
      },
    });
  }
}
