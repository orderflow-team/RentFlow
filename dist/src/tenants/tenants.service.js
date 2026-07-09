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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
const phone_util_1 = require("../common/utils/phone.util");
const phone_account_util_1 = require("../common/utils/phone-account.util");
let TenantsService = class TenantsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
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
                where.leases = {
                    some: {
                        unit: {
                            building: {
                                property: {
                                    ownerId: owner.id,
                                    deletedAt: null,
                                },
                            },
                        },
                        deletedAt: null,
                    },
                };
            }
            else {
                where.id = 'non-existent-id';
            }
            return where;
        }
        if (user.roles.includes(role_enum_1.RoleType.MANAGER)) {
            where.leases = {
                some: {
                    unit: {
                        building: {
                            property: {
                                managerId: user.sub,
                                deletedAt: null,
                            },
                        },
                    },
                    deletedAt: null,
                },
            };
            return where;
        }
        where.id = 'non-existent-id';
        return where;
    }
    async create(companyId, user, dto) {
        const existing = await this.prisma.tenant.findUnique({ where: { companyId_email: { companyId, email: dto.email } } });
        if (existing)
            throw new common_1.ConflictException('Tenant with this email already exists');
        const tenant = await this.prisma.tenant.create({ data: { ...dto, companyId, emergencyContact: dto.emergencyContact || undefined, documents: dto.documents || undefined } });
        return this.format(tenant);
    }
    async findOrCreateByPhone(companyId, dto) {
        const phone = (0, phone_util_1.normalizePhone)(dto.phone);
        const tenantUser = await (0, phone_account_util_1.findOrCreatePhoneUser)(this.prisma, {
            companyId,
            phone,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roleType: role_enum_1.RoleType.TENANT,
        });
        const existingTenant = await this.prisma.tenant.findFirst({
            where: { companyId, userId: tenantUser.id, deletedAt: null },
        });
        if (existingTenant) {
            return this.format(existingTenant);
        }
        const email = dto.email || tenantUser.email;
        const emailTaken = await this.prisma.tenant.findUnique({
            where: { companyId_email: { companyId, email } },
        });
        if (emailTaken) {
            throw new common_1.ConflictException('A tenant with this email already exists');
        }
        const tenant = await this.prisma.tenant.create({
            data: {
                companyId,
                userId: tenantUser.id,
                firstName: tenantUser.firstName,
                lastName: tenantUser.lastName,
                email,
                phone,
            },
        });
        return this.format(tenant);
    }
    async findAll(companyId, user, filters) {
        const where = await this.getScopedWhereClause(companyId, user);
        if (filters?.status)
            where.status = filters.status;
        if (filters?.search) {
            where.AND = [
                ...(where.AND || []),
                {
                    OR: [
                        { firstName: { contains: filters.search, mode: 'insensitive' } },
                        { lastName: { contains: filters.search, mode: 'insensitive' } },
                        { email: { contains: filters.search, mode: 'insensitive' } }
                    ]
                }
            ];
        }
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.tenant.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.prisma.tenant.count({ where }),
        ]);
        return { data: data.map(t => this.format(t)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(companyId, id, user) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const tenant = await this.prisma.tenant.findFirst({ where: scopedWhere });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        return this.format(tenant);
    }
    async update(companyId, id, user, dto) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const tenant = await this.prisma.tenant.findFirst({ where: scopedWhere });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        const updated = await this.prisma.tenant.update({ where: { id }, data: { ...dto, emergencyContact: dto.emergencyContact !== undefined ? dto.emergencyContact : undefined, documents: dto.documents !== undefined ? dto.documents : undefined } });
        return this.format(updated);
    }
    async remove(companyId, id, user) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = id;
        const tenant = await this.prisma.tenant.findFirst({ where: scopedWhere });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant not found');
        await this.prisma.tenant.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: 'Tenant deleted successfully' };
    }
    format(t) {
        return { id: t.id, firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone, status: t.status, emergencyContact: t.emergencyContact, notes: t.notes, documents: t.documents, createdAt: t.createdAt, updatedAt: t.updatedAt };
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map