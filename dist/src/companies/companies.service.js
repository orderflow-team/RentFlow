"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompaniesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CompaniesService = class CompaniesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(companyId) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        return {
            id: company.id,
            name: company.name,
            slug: company.slug,
            email: company.email,
            phone: company.phone,
            address: company.address,
            logo: company.logo,
            status: company.status,
            timezone: company.timezone,
            locale: company.locale,
            createdAt: company.createdAt,
            updatedAt: company.updatedAt,
        };
    }
    async update(companyId, dto) {
        const company = await this.prisma.company.findUnique({
            where: { id: companyId },
        });
        if (!company) {
            throw new common_1.NotFoundException('Company not found');
        }
        const updated = await this.prisma.company.update({
            where: { id: companyId },
            data: {
                name: dto.name ?? company.name,
                email: dto.email ?? company.email,
                phone: dto.phone ?? company.phone,
                address: dto.address ?? company.address,
            },
        });
        return {
            id: updated.id,
            name: updated.name,
            slug: updated.slug,
            email: updated.email,
            phone: updated.phone,
            address: updated.address,
            status: updated.status,
            updatedAt: updated.updatedAt,
        };
    }
};
exports.CompaniesService = CompaniesService;
exports.CompaniesService = CompaniesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CompaniesService);
//# sourceMappingURL=companies.service.js.map