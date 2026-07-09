import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    getCurrent(user: JwtPayload): Promise<{
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
    update(user: JwtPayload, dto: CreateCompanyDto): Promise<{
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
