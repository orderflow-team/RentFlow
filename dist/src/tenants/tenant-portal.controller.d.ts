import { TenantPortalService } from './tenant-portal.service';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class TenantPortalController {
    private service;
    private prisma;
    constructor(service: TenantPortalService, prisma: PrismaService);
    private resolveTenantId;
    getMyLease(user: JwtPayload): Promise<{
        unit: {
            building: {
                name: string;
                property: {
                    name: string;
                    address: string;
                };
            };
        } & {
            id: string;
            companyId: string;
            rentAmount: number | null;
            depositAmount: number | null;
            status: import("@prisma/client").$Enums.UnitStatus;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            name: string;
            description: string | null;
            amenities: import("@prisma/client/runtime/client").JsonValue | null;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            buildingId: string;
            floorNumber: number | null;
            bedrooms: number;
            bathrooms: number;
            squareFootage: number | null;
        };
        leaseLifecycle: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            leaseId: string;
            moveInAgreementSigned: boolean;
            moveInDepositReceived: boolean;
            moveInKycCompleted: boolean;
            moveInPhotosUploaded: boolean;
            moveInKeyHandover: boolean;
            moveOutInspection: boolean;
            moveOutKeyReturn: boolean;
            moveOutDepositSettlement: boolean;
            moveOutExitDoc: boolean;
            communicationLog: import("@prisma/client/runtime/client").JsonValue | null;
        } | null;
    } & {
        id: string;
        companyId: string;
        unitId: string;
        tenantId: string;
        startDate: Date;
        endDate: Date | null;
        rentAmount: number;
        depositAmount: number;
        securityDeposit: number;
        status: import("@prisma/client").$Enums.LeaseStatus;
        paymentDay: number;
        lateFeePercent: number;
        lateFeeFlat: number;
        leaseTerms: import("@prisma/client/runtime/client").JsonValue | null;
        documents: import("@prisma/client/runtime/client").JsonValue | null;
        notes: string | null;
        renewedFromId: string | null;
        renewedToId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    getMyInvoices(user: JwtPayload): Promise<({
        payments: {
            id: string;
            companyId: string;
            notes: string | null;
            createdAt: Date;
            deletedAt: Date | null;
            invoiceId: string;
            amount: number;
            paymentDate: Date;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            reference: string | null;
            receipt: string | null;
        }[];
    } & {
        id: string;
        companyId: string;
        unitId: string;
        tenantId: string;
        rentAmount: number;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        leaseId: string;
        invoiceNumber: string;
        periodStart: Date;
        periodEnd: Date;
        dueDate: Date;
        lateFee: number;
        otherCharges: number;
        totalAmount: number;
        paidAmount: number;
        balanceDue: number;
        category: import("@prisma/client").$Enums.InvoiceCategory;
        paidAt: Date | null;
    })[]>;
    getMyMaintenance(user: JwtPayload): Promise<({
        unit: {
            name: string;
        } | null;
        vendor: {
            name: string;
        } | null;
    } & {
        id: string;
        companyId: string;
        unitId: string | null;
        tenantId: string | null;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        images: import("@prisma/client/runtime/client").JsonValue | null;
        category: import("@prisma/client").$Enums.TicketCategory;
        title: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        vendorId: string | null;
        assignedTo: string | null;
        estimatedCost: number | null;
        actualCost: number | null;
        scheduledDate: Date | null;
        completedDate: Date | null;
    })[]>;
    submitMaintenance(user: JwtPayload, dto: {
        title: string;
        description?: string;
        category?: string;
        priority?: string;
        unitId?: string;
    }): Promise<{
        id: string;
        companyId: string;
        unitId: string | null;
        tenantId: string | null;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        description: string | null;
        images: import("@prisma/client/runtime/client").JsonValue | null;
        category: import("@prisma/client").$Enums.TicketCategory;
        title: string;
        priority: import("@prisma/client").$Enums.MaintenancePriority;
        vendorId: string | null;
        assignedTo: string | null;
        estimatedCost: number | null;
        actualCost: number | null;
        scheduledDate: Date | null;
        completedDate: Date | null;
    }>;
    getMyDocuments(user: JwtPayload): Promise<import("@prisma/client/runtime/client").JsonArray>;
    addMyDocument(user: JwtPayload, dto: {
        title: string;
        category?: string;
        url?: string;
    }): Promise<any[]>;
    uploadMyDocument(user: JwtPayload, file: Express.Multer.File, title?: string, category?: string): Promise<any[]>;
    removeMyDocument(user: JwtPayload, id: string): Promise<any[]>;
    getMyRentalHistory(user: JwtPayload): Promise<{
        leaseId: string;
        property: {
            name: string;
            address: string;
            city: string;
            state: string;
        };
        unit: string;
        startDate: Date;
        endDate: Date | null;
        duration: string;
        rating: number | null;
    }[]>;
}
