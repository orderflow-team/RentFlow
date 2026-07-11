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
      listingType?: 'RENT' | 'SALE' | 'BOTH';
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

    const unitWhere: any = {
      deletedAt: null,
      ...(filters.minBudget || filters.maxBudget
        ? {
            rentAmount: {
              ...(filters.minBudget ? { gte: filters.minBudget } : {}),
              ...(filters.maxBudget ? { lte: filters.maxBudget } : {}),
            },
          }
        : {}),
      ...(filters.listingType
        ? { OR: [{ listingType: filters.listingType }, { listingType: 'BOTH' }] }
        : {}),
    };

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
            units: { where: unitWhere },
          },
        },
      },
    });

    // Format properties and only return those that have units if a unit-level filter was specified
    return properties
      .map((p) => {
        const units = p.buildings.flatMap((b) => b.units);
        if ((filters.minBudget || filters.maxBudget || filters.listingType) && units.length === 0) {
          return null;
        }

        const rents = units.map((u) => u.rentAmount || 0).filter((r) => r > 0);
        const sales = units.map((u) => u.salePrice || 0).filter((s) => s > 0);

        return {
          id: p.id,
          name: p.name,
          address: p.address,
          city: p.city,
          state: p.state,
          zipCode: p.zipCode,
          type: p.type,
          status: p.status,
          images: (p.images as { url: string; caption?: string }[] | null) || [],
          expectedAvailability: p.expectedAvailability,
          furnishedStatus: p.furnishedStatus,
          occupancyType: p.occupancyType,
          rentRange: rents.length ? { min: Math.min(...rents), max: Math.max(...rents) } : null,
          saleRange: sales.length ? { min: Math.min(...sales), max: Math.max(...sales) } : null,
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

  async getPropertyDetail(companyId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({
      where: {
        id: propertyId,
        companyId,
        deletedAt: null,
        status: { in: [PropertyStatus.ACTIVE, PropertyStatus.AVAILABLE_SOON] },
      },
      include: {
        manager: {
          select: { id: true, firstName: true, lastName: true, phone: true, email: true },
        },
        buildings: {
          where: { deletedAt: null },
          include: {
            units: { where: { deletedAt: null } },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found or not open for discovery');
    }

    const units = property.buildings.flatMap((b) =>
      b.units.map((u) => ({ ...u, buildingName: b.name })),
    );
    const availableUnits = units.filter(
      (u) => u.status === 'VACANT' || u.status === 'AVAILABLE_SOON',
    );
    const rents = units.map((u) => u.rentAmount || 0).filter((r) => r > 0);
    const sales = units.map((u) => u.salePrice || 0).filter((s) => s > 0);

    return {
      id: property.id,
      name: property.name,
      description: property.description,
      address: property.address,
      city: property.city,
      state: property.state,
      zipCode: property.zipCode,
      type: property.type,
      status: property.status,
      yearBuilt: property.yearBuilt,
      expectedAvailability: property.expectedAvailability,
      furnishedStatus: property.furnishedStatus,
      occupancyType: property.occupancyType,
      images: (property.images as { url: string; caption?: string }[] | null) || [],
      amenities: property.amenities,
      rentRange: rents.length ? { min: Math.min(...rents), max: Math.max(...rents) } : null,
      saleRange: sales.length ? { min: Math.min(...sales), max: Math.max(...sales) } : null,
      manager: property.manager
        ? {
            name: `${property.manager.firstName} ${property.manager.lastName}`,
            phone: property.manager.phone,
            email: property.manager.email,
          }
        : null,
      preferences: {
        family: property.prefFamily,
        married: property.prefMarried,
        liveIn: property.prefLiveIn,
        students: property.prefStudents,
        professionals: property.prefProfessionals,
        petFriendly: property.prefPetFriendly,
        vegetarian: property.prefVegetarian,
        smokingAllowed: property.prefSmokingAllowed,
      },
      totalUnits: units.length,
      availableUnitsCount: availableUnits.length,
      availableUnits: availableUnits.map((u) => ({
        id: u.id,
        name: u.name,
        building: u.buildingName,
        bedrooms: u.bedrooms,
        bathrooms: u.bathrooms,
        squareFootage: u.squareFootage,
        listingType: u.listingType,
        rentAmount: u.rentAmount,
        salePrice: u.salePrice,
        status: u.status,
        description: u.description,
        images: (u.images as { url: string; caption?: string }[] | null) || [],
      })),
    };
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
