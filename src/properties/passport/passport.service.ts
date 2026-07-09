import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PassportService {
  constructor(private prisma: PrismaService) {}

  async logEvent(
    companyId: string,
    propertyId: string,
    eventType: string,
    description: string,
    metadata?: any,
  ) {
    // Verify property exists
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, companyId, deletedAt: null },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.propertyHistory.create({
      data: {
        propertyId,
        eventType,
        description,
        metadata: metadata || undefined,
      },
    });
  }

  async getPassport(companyId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, companyId, deletedAt: null },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const history = await this.prisma.propertyHistory.findMany({
      where: { propertyId },
      orderBy: { eventDate: 'desc' },
    });

    return {
      property: {
        id: property.id,
        name: property.name,
        address: property.address,
        totalUnits: property.totalUnits,
      },
      history,
    };
  }
}
