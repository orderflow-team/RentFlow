import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private prisma;
    private logger;
    constructor(prisma: PrismaService);
    getOccupancyReport(companyId: string): Promise<{
        summary: {
            totalUnits: number;
            occupiedUnits: number;
            vacantUnits: number;
            maintenanceUnits: number;
            occupancyRate: number;
        };
        properties: {
            id: string;
            name: string;
            buildings: number;
            units: number;
            occupied: number;
            vacant: number;
            occupancyRate: number;
        }[];
    }>;
    getFinancialReport(companyId: string, year?: number): Promise<{
        year: number;
        summary: {
            totalUnits: number;
            totalRent: number;
            totalLateFees: number;
            totalOtherCharges: number;
            totalInvoiced: number;
            totalCollected: number;
            totalExpenses: number;
            netIncome: number;
            outstandingBalance: number;
            collectionRate: number;
        };
        expensesByCategory: Record<string, number>;
        monthlyData: {
            month: string;
            invoiced: number;
            collected: number;
            expenses: number;
        }[];
    }>;
    getMaintenanceReport(companyId: string): Promise<{
        summary: {
            totalRequests: number;
            openRequests: number;
            completedRequests: number;
            totalVendors: number;
            avgCompletionHours: number;
            totalEstimatedCost: number;
            totalActualCost: number;
        };
        byStatus: Record<string, number>;
        byPriority: Record<string, number>;
    }>;
    getDashboardSummary(companyId: string): Promise<{
        occupancy: {
            totalUnits: number;
            occupiedUnits: number;
            vacantUnits: number;
            maintenanceUnits: number;
            occupancyRate: number;
        };
        financial: {
            totalUnits: number;
            totalRent: number;
            totalLateFees: number;
            totalOtherCharges: number;
            totalInvoiced: number;
            totalCollected: number;
            totalExpenses: number;
            netIncome: number;
            outstandingBalance: number;
            collectionRate: number;
        };
        maintenance: {
            totalRequests: number;
            openRequests: number;
            completedRequests: number;
            totalVendors: number;
            avgCompletionHours: number;
            totalEstimatedCost: number;
            totalActualCost: number;
        };
    }>;
}
