import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class TenantsService {
    private prisma;
    constructor(prisma: PrismaService);
    private getScopedWhereClause;
    create(companyId: string, user: JwtPayload, dto: CreateTenantDto): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        status: any;
        emergencyContact: any;
        notes: any;
        documents: any;
        createdAt: any;
        updatedAt: any;
    }>;
    findOrCreateByPhone(companyId: string, dto: {
        phone: string;
        firstName?: string;
        lastName?: string;
        email?: string;
    }): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        status: any;
        emergencyContact: any;
        notes: any;
        documents: any;
        createdAt: any;
        updatedAt: any;
    }>;
    findAll(companyId: string, user: JwtPayload, filters?: {
        status?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        data: {
            id: any;
            firstName: any;
            lastName: any;
            email: any;
            phone: any;
            status: any;
            emergencyContact: any;
            notes: any;
            documents: any;
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
        id: any;
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        status: any;
        emergencyContact: any;
        notes: any;
        documents: any;
        createdAt: any;
        updatedAt: any;
    }>;
    update(companyId: string, id: string, user: JwtPayload, dto: UpdateTenantDto): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        status: any;
        emergencyContact: any;
        notes: any;
        documents: any;
        createdAt: any;
        updatedAt: any;
    }>;
    remove(companyId: string, id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
    private format;
}
