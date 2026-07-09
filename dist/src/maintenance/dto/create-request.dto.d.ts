import { MaintenancePriority, TicketCategory } from '@prisma/client';
export declare class CreateRequestDto {
    unitId?: string;
    tenantId?: string;
    title: string;
    description?: string;
    category?: TicketCategory;
    priority?: MaintenancePriority;
    vendorId?: string;
    estimatedCost?: number;
    scheduledDate?: string;
}
