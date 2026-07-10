import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { AssignTenantByPhoneDto } from './dto/assign-tenant-by-phone.dto';
import type { JwtPayload } from '../common/enums/role.enum';
import { TenantsService } from '../tenants/tenants.service';
export declare class LeasesService {
    private prisma;
    private tenantsService;
    constructor(prisma: PrismaService, tenantsService: TenantsService);
    private getScopedWhereClause;
    create(companyId: string, user: JwtPayload, dto: CreateLeaseDto): Promise<{
        id: any;
        unitId: any;
        unit: any;
        tenantId: any;
        tenant: any;
        startDate: any;
        endDate: any;
        rentAmount: any;
        depositAmount: any;
        securityDeposit: any;
        status: any;
        paymentDay: any;
        lateFeePercent: any;
        lateFeeFlat: any;
        leaseTerms: any;
        documents: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    assignTenantByPhone(companyId: string, user: JwtPayload, dto: AssignTenantByPhoneDto): Promise<{
        id: any;
        unitId: any;
        unit: any;
        tenantId: any;
        tenant: any;
        startDate: any;
        endDate: any;
        rentAmount: any;
        depositAmount: any;
        securityDeposit: any;
        status: any;
        paymentDay: any;
        lateFeePercent: any;
        lateFeeFlat: any;
        leaseTerms: any;
        documents: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    findAll(companyId: string, user: JwtPayload, filters?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: any;
            unitId: any;
            unit: any;
            tenantId: any;
            tenant: any;
            startDate: any;
            endDate: any;
            rentAmount: any;
            depositAmount: any;
            securityDeposit: any;
            status: any;
            paymentDay: any;
            lateFeePercent: any;
            lateFeeFlat: any;
            leaseTerms: any;
            documents: any;
            notes: any;
            createdAt: any;
            updatedAt: any;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(companyId: string, id: string, user: JwtPayload): Promise<{
        unit: {
            building: {
                name: string;
                property: {
                    name: string;
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
            buildingId: string;
            floorNumber: number | null;
            bedrooms: number;
            bathrooms: number;
            squareFootage: number | null;
            rentAmount: number | null;
            depositAmount: number | null;
        };
        tenant: {
            id: string;
            name: string;
            email: string;
        };
        id: any;
        unitId: any;
        tenantId: any;
        startDate: any;
        endDate: any;
        rentAmount: any;
        depositAmount: any;
        securityDeposit: any;
        status: any;
        paymentDay: any;
        lateFeePercent: any;
        lateFeeFlat: any;
        leaseTerms: any;
        documents: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    update(companyId: string, id: string, user: JwtPayload, dto: UpdateLeaseDto): Promise<{
        id: any;
        unitId: any;
        unit: any;
        tenantId: any;
        tenant: any;
        startDate: any;
        endDate: any;
        rentAmount: any;
        depositAmount: any;
        securityDeposit: any;
        status: any;
        paymentDay: any;
        lateFeePercent: any;
        lateFeeFlat: any;
        leaseTerms: any;
        documents: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    remove(companyId: string, id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
    private format;
}
