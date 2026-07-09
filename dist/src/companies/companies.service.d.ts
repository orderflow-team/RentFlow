import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
export declare class CompaniesService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(companyId: string): Promise<{
        id: string;
        name: string;
        slug: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        logo: string | null;
        status: import("@prisma/client").$Enums.CompanyStatus;
        timezone: string;
        locale: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(companyId: string, dto: CreateCompanyDto): Promise<{
        id: string;
        name: string;
        slug: string;
        email: string | null;
        phone: string | null;
        address: string | null;
        status: import("@prisma/client").$Enums.CompanyStatus;
        updatedAt: Date;
    }>;
}
