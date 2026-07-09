import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  private logger = new Logger(ReportsService.name);
  constructor(private prisma: PrismaService) {}

  async getOccupancyReport(companyId: string) {
    const [totalUnits, occupiedUnits, vacantUnits, maintenanceUnits] = await Promise.all([
      this.prisma.unit.count({ where: { companyId, deletedAt: null } }),
      this.prisma.unit.count({ where: { companyId, deletedAt: null, status: 'OCCUPIED' } }),
      this.prisma.unit.count({ where: { companyId, deletedAt: null, status: 'VACANT' } }),
      this.prisma.unit.count({ where: { companyId, deletedAt: null, status: 'MAINTENANCE' } }),
    ]);

    const properties = await this.prisma.property.findMany({
      where: { companyId, deletedAt: null },
      select: {
        id: true, name: true,
        _count: { select: { buildings: true } },
      },
    });

    const propertyStats = await Promise.all(
      properties.map(async (p) => {
        const buildingIds = await this.prisma.building.findMany({
          where: { propertyId: p.id, deletedAt: null },
          select: { id: true },
        });
        const ids = buildingIds.map(b => b.id);
        const [total, occ] = await Promise.all([
          this.prisma.unit.count({ where: { buildingId: { in: ids }, deletedAt: null } }),
          this.prisma.unit.count({ where: { buildingId: { in: ids }, deletedAt: null, status: 'OCCUPIED' } }),
        ]);
        return { id: p.id, name: p.name, buildings: p._count.buildings, units: total, occupied: occ, vacant: total - occ, occupancyRate: total > 0 ? Math.round((occ / total) * 100) : 0 };
      })
    );

    return {
      summary: {
        totalUnits, occupiedUnits, vacantUnits, maintenanceUnits,
        occupancyRate: totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0,
      },
      properties: propertyStats,
    };
  }

  async getFinancialReport(companyId: string, year?: number) {
    const targetYear = year || new Date().getFullYear();

    const [invoices, expenses, payments] = await Promise.all([
      this.prisma.invoice.findMany({
        where: {
          companyId,
          deletedAt: null,
          periodStart: { gte: new Date(`${targetYear}-01-01`) },
          periodEnd: { lte: new Date(`${targetYear}-12-31`) },
        },
      }),
      this.prisma.expense.findMany({
        where: {
          companyId,
          deletedAt: null,
          expenseDate: { gte: new Date(`${targetYear}-01-01`), lte: new Date(`${targetYear}-12-31`) },
        },
      }),
      this.prisma.payment.findMany({
        where: {
          companyId,
          paymentDate: { gte: new Date(`${targetYear}-01-01`), lte: new Date(`${targetYear}-12-31`) },
        },
      }),
    ]);

    const totalRent = invoices.reduce((s, i) => s + i.rentAmount, 0);
    const totalLateFees = invoices.reduce((s, i) => s + i.lateFee, 0);
    const totalOtherCharges = invoices.reduce((s, i) => s + i.otherCharges, 0);
    const totalInvoiced = invoices.reduce((s, i) => s + i.totalAmount, 0);
    const totalCollected = payments.reduce((s, p) => s + p.amount, 0);
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const outstandingBalance = invoices
      .filter(i => i.status !== 'PAID' && i.status !== 'CANCELLED')
      .reduce((s, i) => s + i.balanceDue, 0);

    const paidInvoices = invoices.filter(i => i.status === 'PAID').length;
    const collectionRate = invoices.length > 0 ? Math.round((paidInvoices / invoices.length) * 100) : 0;

    const expensesByCategory = expenses.reduce((acc: Record<string, number>, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const m = i + 1;
      const monthStr = `${targetYear}-${String(m).padStart(2, '0')}`;
      const monthInvoices = invoices.filter(inv => new Date(inv.periodStart).getMonth() === i);
      const monthPayments = payments.filter(p => new Date(p.paymentDate).getMonth() === i);
      const monthExpenses = expenses.filter(e => new Date(e.expenseDate).getMonth() === i);
      return {
        month: monthStr,
        invoiced: monthInvoices.reduce((s, inv) => s + inv.totalAmount, 0),
        collected: monthPayments.reduce((s, p) => s + p.amount, 0),
        expenses: monthExpenses.reduce((s, e) => s + e.amount, 0),
      };
    });

    return {
      year: targetYear,
      summary: {
        totalUnits: invoices.length,
        totalRent,
        totalLateFees,
        totalOtherCharges,
        totalInvoiced,
        totalCollected,
        totalExpenses,
        netIncome: totalCollected - totalExpenses,
        outstandingBalance,
        collectionRate,
      },
      expensesByCategory,
      monthlyData,
    };
  }

  async getMaintenanceReport(companyId: string) {
    const [requests, vendors] = await Promise.all([
      this.prisma.maintenanceRequest.findMany({ where: { companyId, deletedAt: null } }),
      this.prisma.vendor.count({ where: { companyId, deletedAt: null } }),
    ]);

    const byStatus = requests.reduce((acc: Record<string, number>, r) => {
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    }, {});

    const byPriority = requests.reduce((acc: Record<string, number>, r) => {
      acc[r.priority] = (acc[r.priority] || 0) + 1;
      return acc;
    }, {});

    const completed = requests.filter(r => r.status === 'COMPLETED');
    const avgCompletionTime = completed.length > 0
      ? completed.reduce((s, r) => {
          if (r.completedDate && r.createdAt) {
            return s + (r.completedDate.getTime() - r.createdAt.getTime());
          }
          return s;
        }, 0) / completed.length / (1000 * 60 * 60)
      : 0;

    const totalEstimatedCost = requests.reduce((s, r) => s + (r.estimatedCost || 0), 0);
    const totalActualCost = completed.reduce((s, r) => s + (r.actualCost || 0), 0);
    const openCount = requests.filter(r =>
      !['COMPLETED', 'CANCELLED'].includes(r.status)
    ).length;

    return {
      summary: {
        totalRequests: requests.length,
        openRequests: openCount,
        completedRequests: completed.length,
        totalVendors: vendors,
        avgCompletionHours: Math.round(avgCompletionTime * 10) / 10,
        totalEstimatedCost,
        totalActualCost,
      },
      byStatus,
      byPriority,
    };
  }

  async getDashboardSummary(companyId: string) {
    const [occupancy, financial, maintenance] = await Promise.all([
      this.getOccupancyReport(companyId),
      this.getFinancialReport(companyId),
      this.getMaintenanceReport(companyId),
    ]);

    return {
      occupancy: occupancy.summary,
      financial: financial.summary,
      maintenance: maintenance.summary,
    };
  }
}
