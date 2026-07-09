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
exports.OwnersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OwnersService = class OwnersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        const existing = await this.prisma.owner.findUnique({ where: { companyId_email: { companyId, email: dto.email } } });
        if (existing)
            throw new common_1.ConflictException('Owner with this email already exists');
        const owner = await this.prisma.owner.create({ data: { ...dto, companyId } });
        return this.format(owner);
    }
    async findAll(companyId, filters) {
        const where = { companyId, deletedAt: null };
        if (filters?.status)
            where.status = filters.status;
        if (filters?.search)
            where.OR = [{ firstName: { contains: filters.search, mode: 'insensitive' } }, { lastName: { contains: filters.search, mode: 'insensitive' } }, { email: { contains: filters.search, mode: 'insensitive' } }];
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([this.prisma.owner.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }), this.prisma.owner.count({ where })]);
        return { data: data.map(o => this.format(o)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOne(companyId, id) {
        const owner = await this.prisma.owner.findFirst({ where: { id, companyId, deletedAt: null } });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        return this.format(owner);
    }
    async update(companyId, id, dto) {
        const owner = await this.prisma.owner.findFirst({ where: { id, companyId, deletedAt: null } });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        const updated = await this.prisma.owner.update({ where: { id }, data: dto });
        return this.format(updated);
    }
    async remove(companyId, id) {
        const owner = await this.prisma.owner.findFirst({ where: { id, companyId, deletedAt: null } });
        if (!owner)
            throw new common_1.NotFoundException('Owner not found');
        await this.prisma.owner.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: 'Owner deleted successfully' };
    }
    format(o) { return { id: o.id, firstName: o.firstName, lastName: o.lastName, email: o.email, phone: o.phone, status: o.status, notes: o.notes, createdAt: o.createdAt, updatedAt: o.updatedAt }; }
};
exports.OwnersService = OwnersService;
exports.OwnersService = OwnersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OwnersService);
//# sourceMappingURL=owners.service.js.map