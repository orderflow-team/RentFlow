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
exports.LeasesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
const tenants_service_1 = require("../tenants/tenants.service");
let LeasesService = class LeasesService {
    prisma;
    tenantsService;
    constructor(prisma, tenantsService) {
        this.prisma = prisma;
        this.tenantsService = tenantsService;
    }
    async getScopedWhereClause(companyId, user) {
        const where = { companyId, deletedAt: null };
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
    async create(companyId, user, dto) {
        const unit = await this.prisma.unit.findFirst({ where: { id: dto.unitId, companyId } });
        if (!unit)
            throw new common_1.BadRequestException('Unit not found');
        const tenant = await this.prisma.tenant.findFirst({ where: { id: dto.tenantId, companyId } });
        if (!tenant)
            throw new common_1.BadRequestException('Tenant not found');
        const lease = await this.prisma.lease.create({
            data: {
                ...dto,
                companyId,
                startDate: new Date(dto.startDate),
                endDate: dto.endDate ? new Date(dto.endDate) : null,
                leaseTerms: dto.leaseTerms || undefined,
                documents: dto.documents || undefined,
            },
            include: { unit: { select: { id: true, name: true } }, tenant: { select: { id: true, firstName: true, lastName: true } } },
        });
        if (dto.status === 'ACTIVE') {
            await this.prisma.unit.update({ where: { id: dto.unitId }, data: { status: 'OCCUPIED' } });
        }
        return this.format(lease);
    }
    async assignTenantByPhone(companyId, user, dto) {
        const unit = await this.prisma.unit.findFirst({
            where: { id: dto.unitId, companyId, deletedAt: null },
            include: { building: { include: { property: true } } },
        });
        if (!unit)
            throw new common_1.BadRequestException('Unit not found');
        const property = unit.building.property;
        if (user.roles.includes(role_enum_1.RoleType.ADMIN)) {
        }
        else if (user.roles.includes(role_enum_1.RoleType.OWNER)) {
            const owner = await this.prisma.owner.findFirst({
                where: { companyId, userId: user.sub, deletedAt: null },
            });
            if (!owner || property.ownerId !== owner.id) {
                throw new common_1.ForbiddenException('You do not manage this property');
            }
        }
        else if (user.roles.includes(role_enum_1.RoleType.MANAGER)) {
            if (property.managerId !== user.sub) {
                throw new common_1.ForbiddenException('You do not manage this property');
            }
        }
        else {
            throw new common_1.ForbiddenException('You do not manage this property');
        }
        const { unitId, phone, firstName, lastName, email, ...leaseFields } = dto;
        const tenant = await this.tenantsService.findOrCreateByPhone(companyId, {
            phone,
            firstName,
            lastName,
            email,
        });
        return this.create(companyId, user, {
            ...leaseFields,
            unitId,
            tenantId: tenant.id,
            status: dto.status || 'ACTIVE',
        });
    }
    async findAll(companyId, user, filters) {
        const where = await this.getScopedWhereClause(companyId, user);
        if (filters?.status)
            where.status = filters.status;
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.lease.findMany({ where, skip, take: limit, include: { unit: { select: { id: true, name: true, building: { select: { name: true } } } }, tenant: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }),
            this.prisma.lease.count({ where }),
        ]);
        return { data: data.map(l => this.format(l)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(companyId, id, user) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const lease = await this.prisma.lease.findFirst({ where: scopedWhere, include: { unit: { include: { building: { select: { name: true, property: { select: { name: true } } } } } }, tenant: true } });
        if (!lease)
            throw new common_1.NotFoundException('Lease not found');
        return { ...this.format(lease), unit: lease.unit, tenant: { id: lease.tenant.id, name: `${lease.tenant.firstName} ${lease.tenant.lastName}`, email: lease.tenant.email } };
    }
    async update(companyId, id, user, dto) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const lease = await this.prisma.lease.findFirst({ where: scopedWhere });
        if (!lease)
            throw new common_1.NotFoundException('Lease not found');
        const data = { ...dto };
        if (dto.startDate)
            data.startDate = new Date(dto.startDate);
        if (dto.endDate)
            data.endDate = new Date(dto.endDate);
        if (dto.leaseTerms !== undefined)
            data.leaseTerms = dto.leaseTerms;
        if (dto.documents !== undefined)
            data.documents = dto.documents;
        const updated = await this.prisma.lease.update({ where: { id }, data, include: { unit: { select: { id: true, name: true } }, tenant: { select: { id: true, firstName: true, lastName: true } } } });
        return this.format(updated);
    }
    async remove(companyId, id, user) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const lease = await this.prisma.lease.findFirst({ where: scopedWhere });
        if (!lease)
            throw new common_1.NotFoundException('Lease not found');
        await this.prisma.lease.update({ where: { id }, data: { deletedAt: new Date(), status: 'TERMINATED' } });
        await this.prisma.unit.update({ where: { id: lease.unitId }, data: { status: 'VACANT' } });
        return { message: 'Lease terminated successfully' };
    }
    format(l) {
        return { id: l.id, unitId: l.unitId, unit: l.unit, tenantId: l.tenantId, tenant: l.tenant, startDate: l.startDate, endDate: l.endDate, rentAmount: l.rentAmount, depositAmount: l.depositAmount, securityDeposit: l.securityDeposit, status: l.status, paymentDay: l.paymentDay, lateFeePercent: l.lateFeePercent, lateFeeFlat: l.lateFeeFlat, leaseTerms: l.leaseTerms, documents: l.documents, notes: l.notes, createdAt: l.createdAt, updatedAt: l.updatedAt };
    }
};
exports.LeasesService = LeasesService;
exports.LeasesService = LeasesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        tenants_service_1.TenantsService])
], LeasesService);
//# sourceMappingURL=leases.service.js.map