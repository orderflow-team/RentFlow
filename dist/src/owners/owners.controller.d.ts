import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class OwnersController {
    private readonly service;
    constructor(service: OwnersService);
    create(u: JwtPayload, dto: CreateOwnerDto): Promise<{
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
    findAll(u: JwtPayload, status?: string, search?: string, page?: number, limit?: number): Promise<{
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
    findOne(u: JwtPayload, id: string): Promise<{
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
    update(u: JwtPayload, id: string, dto: UpdateOwnerDto): Promise<{
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
    remove(u: JwtPayload, id: string): Promise<{
        message: string;
    }>;
}
