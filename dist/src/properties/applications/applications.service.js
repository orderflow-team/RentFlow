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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ApplicationsService = class ApplicationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async apply(companyId, propertyId, tenantEmail, dto) {
        const property = await this.prisma.property.findFirst({
            where: { id: propertyId, companyId, deletedAt: null },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const tenant = await this.prisma.tenant.findFirst({
            where: { email: tenantEmail, companyId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant profile not found. Please register profile first.');
        }
        const existing = await this.prisma.propertyApplication.findFirst({
            where: {
                propertyId,
                tenantId: tenant.id,
                unitId: dto.unitId || null,
                isWaitingList: false,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('You have already applied for this property');
        }
        let score = 100.0;
        if (property.prefPetFriendly === false && dto.hasPets === true)
            score -= 20.0;
        if (property.prefSmokingAllowed === false && dto.isSmoker === true)
            score -= 20.0;
        if (property.prefVegetarian === true && dto.isVegetarian === false)
            score -= 20.0;
        if (property.prefFamily === true && dto.isFamily === false)
            score -= 15.0;
        if (property.prefMarried === true && dto.isMarried === false)
            score -= 15.0;
        if (property.prefLiveIn === true && dto.isLiveIn === false)
            score -= 15.0;
        if (property.prefStudents === true && dto.isStudent === false)
            score -= 15.0;
        if (property.prefProfessionals === true && dto.isProfessional === false)
            score -= 15.0;
        score = Math.max(0.0, score);
        return this.prisma.propertyApplication.create({
            data: {
                companyId,
                propertyId,
                unitId: dto.unitId || null,
                tenantId: tenant.id,
                status: client_1.ApplicationStatus.PENDING,
                compatibilityScore: score,
                isWaitingList: false,
            },
        });
    }
    async getQueue(companyId, propertyId) {
        const property = await this.prisma.property.findFirst({
            where: { id: propertyId, companyId, deletedAt: null },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const applications = await this.prisma.propertyApplication.findMany({
            where: { propertyId, companyId, isWaitingList: false },
            include: {
                tenant: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        trustScore: true,
                        averageRating: true,
                        verifiedStaysCount: true,
                        isReputationPublic: true,
                    },
                },
                unit: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: { compatibilityScore: 'desc' },
        });
        return applications.map((app) => ({
            id: app.id,
            status: app.status,
            compatibilityScore: app.compatibilityScore,
            createdAt: app.createdAt,
            unit: app.unit,
            tenant: {
                id: app.tenant.id,
                name: `${app.tenant.firstName} ${app.tenant.lastName}`,
                email: app.tenant.email,
                phone: app.tenant.phone,
                trustScore: app.tenant.trustScore,
                averageRating: app.tenant.averageRating,
                verifiedStaysCount: app.tenant.verifiedStaysCount,
                reputation: app.tenant.isReputationPublic
                    ? {
                        rating: app.tenant.averageRating,
                        stays: app.tenant.verifiedStaysCount,
                    }
                    : 'PRIVATE',
            },
        }));
    }
    async updateStatus(companyId, id, dto) {
        const application = await this.prisma.propertyApplication.findFirst({
            where: { id, companyId },
        });
        if (!application) {
            throw new common_1.NotFoundException('Application not found');
        }
        return this.prisma.propertyApplication.update({
            where: { id },
            data: { status: dto.status },
        });
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map