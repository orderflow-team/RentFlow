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
exports.MaintenanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
let MaintenanceService = class MaintenanceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getScopedWhereClause(companyId, user) {
        const where = { companyId };
        if (user.roles.includes(role_enum_1.RoleType.ADMIN) || user.roles.includes(role_enum_1.RoleType.ACCOUNTANT)) {
            return where;
        }
        if (user.roles.includes(role_enum_1.RoleType.OWNER)) {
            const owner = await this.prisma.owner.findFirst({
                where: { companyId, userId: user.sub, deletedAt: null },
            });
            if (owner) {
                where.unit = {
                    building: {
                        property: {
                            ownerId: owner.id,
                            deletedAt: null,
                        },
                    },
                };
            }
            else {
                where.id = 'non-existent-id';
            }
            return where;
        }
        if (user.roles.includes(role_enum_1.RoleType.MANAGER)) {
            where.unit = {
                building: {
                    property: {
                        managerId: user.sub,
                        deletedAt: null,
                    },
                },
            };
            return where;
        }
        where.id = 'non-existent-id';
        return where;
    }
    async createRequest(companyId, user, dto) {
        if (dto.vendorId) {
            const v = await this.prisma.vendor.findFirst({ where: { id: dto.vendorId, companyId } });
            if (!v)
                throw new common_1.BadRequestException('Vendor not found');
        }
        return this.prisma.maintenanceRequest.create({
            data: {
                ...dto,
                companyId,
                category: dto.category || 'MAINTENANCE',
                scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
                estimatedCost: dto.estimatedCost || undefined,
            },
        });
    }
    async findAllRequests(companyId, user, filters) {
        const where = await this.getScopedWhereClause(companyId, user);
        if (filters?.status)
            where.status = filters.status;
        if (filters?.priority)
            where.priority = filters.priority;
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.maintenanceRequest.findMany({ where, skip, take: limit, include: { unit: { select: { name: true } }, tenant: { select: { firstName: true, lastName: true } }, vendor: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.maintenanceRequest.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOneRequest(companyId, id, user) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const r = await this.prisma.maintenanceRequest.findFirst({ where: scopedWhere, include: { unit: true, tenant: true, vendor: true } });
        if (!r)
            throw new common_1.NotFoundException('Maintenance request not found');
        return r;
    }
    async updateStatus(companyId, id, user, status, actualCost) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const r = await this.prisma.maintenanceRequest.findFirst({ where: scopedWhere });
        if (!r)
            throw new common_1.NotFoundException('Maintenance request not found');
        const data = { status };
        if (actualCost !== undefined)
            data.actualCost = actualCost;
        if (status === 'COMPLETED')
            data.completedDate = new Date();
        return this.prisma.maintenanceRequest.update({ where: { id }, data });
    }
    async removeRequest(companyId, id, user) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const r = await this.prisma.maintenanceRequest.findFirst({ where: scopedWhere });
        if (!r)
            throw new common_1.NotFoundException('Maintenance request not found');
        await this.prisma.maintenanceRequest.update({ where: { id }, data: { status: 'CANCELLED' } });
        return { message: 'Request cancelled' };
    }
    async createVendor(companyId, dto) {
        return this.prisma.vendor.create({ data: { ...dto, companyId } });
    }
    async findOneVendor(companyId, id) {
        const v = await this.prisma.vendor.findFirst({ where: { id, companyId, deletedAt: null } });
        if (!v)
            throw new common_1.NotFoundException('Vendor not found');
        return v;
    }
    async updateVendor(companyId, id, dto) {
        const v = await this.prisma.vendor.findFirst({ where: { id, companyId, deletedAt: null } });
        if (!v)
            throw new common_1.NotFoundException('Vendor not found');
        return this.prisma.vendor.update({ where: { id }, data: dto });
    }
    async findAllVendors(companyId) {
        return this.prisma.vendor.findMany({ where: { companyId, deletedAt: null }, orderBy: { name: 'asc' } });
    }
    async removeVendor(companyId, id) {
        const v = await this.prisma.vendor.findFirst({ where: { id, companyId, deletedAt: null } });
        if (!v)
            throw new common_1.NotFoundException('Vendor not found');
        await this.prisma.vendor.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: 'Vendor deleted' };
    }
};
exports.MaintenanceService = MaintenanceService;
exports.MaintenanceService = MaintenanceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MaintenanceService);
//# sourceMappingURL=maintenance.service.js.map