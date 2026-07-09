import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class TenantsController {
    private readonly service;
    constructor(service: TenantsService);
    create(u: JwtPayload, dto: CreateTenantDto): Promise<{
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
    findAll(u: JwtPayload, status?: string, search?: string, page?: number, limit?: number): Promise<{
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
    findOne(u: JwtPayload, id: string): Promise<{
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
    update(u: JwtPayload, id: string, dto: UpdateTenantDto): Promise<{
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
    remove(u: JwtPayload, id: string): Promise<{
        message: string;
    }>;
}
