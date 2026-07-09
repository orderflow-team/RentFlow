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
exports.LifecycleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const passport_service_1 = require("../properties/passport/passport.service");
let LifecycleService = class LifecycleService {
    prisma;
    passportService;
    constructor(prisma, passportService) {
        this.prisma = prisma;
        this.passportService = passportService;
    }
    async getLifecycle(companyId, leaseId) {
        const lease = await this.prisma.lease.findFirst({
            where: { id: leaseId, companyId, deletedAt: null },
            include: { leaseLifecycle: true },
        });
        if (!lease)
            throw new common_1.NotFoundException('Lease not found');
        if (!lease.leaseLifecycle) {
            const lifecycle = await this.prisma.leaseLifecycle.create({
                data: { leaseId },
            });
            return lifecycle;
        }
        return lease.leaseLifecycle;
    }
    async updateLifecycle(companyId, leaseId, dto) {
        const lease = await this.prisma.lease.findFirst({
            where: { id: leaseId, companyId, deletedAt: null },
            include: {
                leaseLifecycle: true,
                unit: {
                    select: {
                        building: {
                            select: { propertyId: true },
                        },
                    },
                },
            },
        });
        if (!lease)
            throw new common_1.NotFoundException('Lease not found');
        const currentLifecycle = lease.leaseLifecycle ||
            (await this.prisma.leaseLifecycle.create({ data: { leaseId } }));
        const updated = await this.prisma.leaseLifecycle.update({
            where: { id: currentLifecycle.id },
            data: dto,
        });
        const wasMoveInCompleted = !currentLifecycle.moveInKeyHandover &&
            dto.moveInKeyHandover &&
            (dto.moveInAgreementSigned ?? currentLifecycle.moveInAgreementSigned) &&
            (dto.moveInDepositReceived ?? currentLifecycle.moveInDepositReceived) &&
            (dto.moveInKycCompleted ?? currentLifecycle.moveInKycCompleted) &&
            (dto.moveInPhotosUploaded ?? currentLifecycle.moveInPhotosUploaded);
        if (wasMoveInCompleted && lease.unit?.building?.propertyId) {
            await this.passportService.logEvent(companyId, lease.unit.building.propertyId, 'MOVE_IN', `Tenant check-in completed. Agreement signed, deposit received, and key handover finalized.`, { leaseId, tenantId: lease.tenantId });
        }
        const wasMoveOutCompleted = !currentLifecycle.moveOutExitDoc &&
            dto.moveOutExitDoc &&
            (dto.moveOutInspection ?? currentLifecycle.moveOutInspection) &&
            (dto.moveOutKeyReturn ?? currentLifecycle.moveOutKeyReturn) &&
            (dto.moveOutDepositSettlement ?? currentLifecycle.moveOutDepositSettlement);
        if (wasMoveOutCompleted && lease.unit?.building?.propertyId) {
            await this.passportService.logEvent(companyId, lease.unit.building.propertyId, 'MOVE_OUT', `Tenant check-out completed. Final inspection and deposit settlement finalized.`, { leaseId, tenantId: lease.tenantId });
        }
        return updated;
    }
};
exports.LifecycleService = LifecycleService;
exports.LifecycleService = LifecycleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        passport_service_1.PassportService])
], LifecycleService);
//# sourceMappingURL=lifecycle.service.js.map