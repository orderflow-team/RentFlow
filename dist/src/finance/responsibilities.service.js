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
exports.ResponsibilitiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ResponsibilitiesService = class ResponsibilitiesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        const lease = await this.prisma.lease.findFirst({
            where: { id: dto.leaseId, companyId, deletedAt: null },
        });
        if (!lease) {
            throw new common_1.NotFoundException('Lease not found');
        }
        if (dto.assignedTo !== client_1.RoleType.OWNER && dto.assignedTo !== client_1.RoleType.TENANT) {
            throw new common_1.BadRequestException('Responsibilities can only be assigned to OWNER or TENANT');
        }
        return this.prisma.responsibility.create({
            data: {
                companyId,
                leaseId: dto.leaseId,
                assignedTo: dto.assignedTo,
                title: dto.title,
                description: dto.description,
                dueDate: new Date(dto.dueDate),
                reminder: dto.reminder ?? false,
                status: client_1.ResponsibilityStatus.PENDING,
            },
        });
    }
    async findAll(companyId, leaseId, assignedTo) {
        const where = { companyId, leaseId };
        if (assignedTo) {
            where.assignedTo = assignedTo;
        }
        return this.prisma.responsibility.findMany({
            where,
            orderBy: { dueDate: 'asc' },
        });
    }
    async findOne(companyId, id) {
        const responsibility = await this.prisma.responsibility.findFirst({
            where: { id, companyId },
        });
        if (!responsibility) {
            throw new common_1.NotFoundException('Responsibility not found');
        }
        return responsibility;
    }
    async update(companyId, id, dto) {
        const responsibility = await this.prisma.responsibility.findFirst({
            where: { id, companyId },
        });
        if (!responsibility) {
            throw new common_1.NotFoundException('Responsibility not found');
        }
        const data = {};
        if (dto.status) {
            data.status = dto.status;
            if (dto.status === client_1.ResponsibilityStatus.COMPLETED) {
                data.completedAt = new Date();
            }
        }
        if (dto.completed !== undefined) {
            data.status = dto.completed
                ? client_1.ResponsibilityStatus.COMPLETED
                : client_1.ResponsibilityStatus.PENDING;
            data.completedAt = dto.completed ? new Date() : null;
        }
        return this.prisma.responsibility.update({
            where: { id },
            data,
        });
    }
    async remove(companyId, id) {
        const responsibility = await this.prisma.responsibility.findFirst({
            where: { id, companyId },
        });
        if (!responsibility) {
            throw new common_1.NotFoundException('Responsibility not found');
        }
        await this.prisma.responsibility.delete({
            where: { id },
        });
        return { message: 'Responsibility deleted successfully' };
    }
};
exports.ResponsibilitiesService = ResponsibilitiesService;
exports.ResponsibilitiesService = ResponsibilitiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ResponsibilitiesService);
//# sourceMappingURL=responsibilities.service.js.map