import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
export declare class OwnersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: string, dto: CreateOwnerDto): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        status: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    findAll(companyId: string, filters?: {
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
    findOne(companyId: string, id: string): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        status: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    update(companyId: string, id: string, dto: UpdateOwnerDto): Promise<{
        id: any;
        firstName: any;
        lastName: any;
        email: any;
        phone: any;
        status: any;
        notes: any;
        createdAt: any;
        updatedAt: any;
    }>;
    remove(companyId: string, id: string): Promise<{
        message: string;
    }>;
    private format;
}
