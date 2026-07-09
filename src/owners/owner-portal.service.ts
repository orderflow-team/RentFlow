import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OwnerPortalService {
  constructor(private prisma: PrismaService) {}

  async getMyProperties(companyId: string, ownerId: string) {
    const properties = await this.prisma.property.findMany({
      where: { ownerId, companyId, deletedAt: null },
      include: {
        buildings: {
          include: { units: { where: { deletedAt: null }, select: { id: true, name: true, status: true, rentAmount: true } } },
        },
      },
    });
    if (!properties.length) throw new NotFoundException('No properties found for this owner');
    return properties;
  }

  async getMyFinancialSummary(companyId: string, ownerId: string) {
    const properties = await this.prisma.property.findMany({
      where: { ownerId, companyId, deletedAt: null },
      select: { id: true, name: true },
    });

    const propertyIds = properties.map(p => p.id);
    if (!propertyIds.length) throw new NotFoundException('No properties found');

    const buildingIds = (await this.prisma.building.findMany({
      where: { propertyId: { in: propertyIds }, deletedAt: null },
      select: { id: true },
    })).map(b => b.id);

    const unitIds = (await this.prisma.unit.findMany({
      where: { buildingId: { in: buildingIds }, deletedAt: null },
      select: { id: true },
    })).map(u => u.id);

    const [invoices, expenses, units] = await Promise.all([
      this.prisma.invoice.findMany({
        where: { unitId: { in: unitIds }, deletedAt: null },
        include: { payments: true },
      }),
      this.prisma.expense.findMany({
        where: { propertyId: { in: propertyIds }, deletedAt: null },
      }),
      this.prisma.unit.findMany({
        where: { buildingId: { in: buildingIds }, deletedAt: null },
        select: { id: true, status: true },
      }),
    ]);

    const totalRent = invoices.reduce((s, i) => s + i.rentAmount, 0);
    const totalCollected = invoices.reduce((s, i) => s + i.paidAmount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const occupied = units.filter(u => u.status === 'OCCUPIED').length;
    const totalUnits = units.length;

    return {
      properties: properties.map(p => p.name),
      totalProperties: properties.length,
      units: { total: totalUnits, occupied, vacant: totalUnits - occupied },
      finances: {
        totalRent,
        totalCollected,
        totalOutstanding: totalRent - totalCollected,
        totalExpenses,
        netIncome: totalCollected - totalExpenses,
      },
    };
  }
}
