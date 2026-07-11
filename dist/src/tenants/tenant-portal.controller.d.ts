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
            name: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.UnitStatus;
            metadata: import("@prisma/client/runtime/client").JsonValue | null;
            deletedAt: Date | null;
            companyId: string;
            description: string | null;
            amenities: import("@prisma/client/runtime/client").JsonValue | null;
            images: import("@prisma/client/runtime/client").JsonValue | null;
            buildingId: string;
            floorNumber: number | null;
            bedrooms: number;
            bathrooms: number;
            squareFootage: number | null;
            listingType: import("@prisma/client").$Enums.ListingType;
            rentAmount: number | null;
            depositAmount: number | null;
            salePrice: number | null;
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
            moveInKeyHandoverAt: Date | null;
            moveInPhotos: import("@prisma/client/runtime/client").JsonValue | null;
            moveOutInspection: boolean;
            moveOutKeyReturn: boolean;
            moveOutDepositSettlement: boolean;
            moveOutExitDoc: boolean;
            communicationLog: import("@prisma/client/runtime/client").JsonValue | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LeaseStatus;
        deletedAt: Date | null;
        companyId: string;
        notes: string | null;
        documents: import("@prisma/client/runtime/client").JsonValue | null;
        rentAmount: number;
        depositAmount: number;
        unitId: string;
        tenantId: string;
        startDate: Date;
        endDate: Date | null;
        securityDeposit: number;
        paymentDay: number;
        lateFeePercent: number;
        lateFeeFlat: number;
        leaseTerms: import("@prisma/client/runtime/client").JsonValue | null;
        renewedFromId: string | null;
        renewedToId: string | null;
    }>;
    getMyInvoices(user: JwtPayload): Promise<({
        payments: {
            id: string;
            createdAt: Date;
            deletedAt: Date | null;
            companyId: string;
            notes: string | null;
            amount: number;
            paymentDate: Date;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            reference: string | null;
            receipt: string | null;
            invoiceId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.InvoiceStatus;
        deletedAt: Date | null;
        companyId: string;
        notes: string | null;
        rentAmount: number;
        unitId: string;
        tenantId: string;
        invoiceNumber: string;
        leaseId: string;
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
    getMoveInPhotos(user: JwtPayload): Promise<{
        photos: import("@prisma/client/runtime/client").JsonArray;
        keyHandover: boolean;
        keyHandoverAt: Date | null;
    }>;
    uploadMoveInPhotos(user: JwtPayload, files: Express.Multer.File[]): Promise<{
        photos: import("@prisma/client/runtime/client").JsonValue;
        keyHandover: boolean;
        keyHandoverAt: Date | null;
    }>;
    getMyMaintenance(user: JwtPayload): Promise<({
        unit: {
            name: string;
        } | null;
        vendor: {
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        deletedAt: Date | null;
        companyId: string;
        description: string | null;
        notes: string | null;
        images: import("@prisma/client/runtime/client").JsonValue | null;
        unitId: string | null;
        tenantId: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.MaintenanceStatus;
        deletedAt: Date | null;
        companyId: string;
        description: string | null;
        notes: string | null;
        images: import("@prisma/client/runtime/client").JsonValue | null;
        unitId: string | null;
        tenantId: string | null;
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
