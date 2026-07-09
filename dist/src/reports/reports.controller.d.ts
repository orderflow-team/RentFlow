import { ReportsService } from './reports.service';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class ReportsController {
    private readonly service;
    constructor(service: ReportsService);
    getOccupancy(u: JwtPayload): Promise<{
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
    getFinancial(u: JwtPayload, year?: string): Promise<{
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
    getMaintenance(u: JwtPayload): Promise<{
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
    getDashboard(u: JwtPayload): Promise<{
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
