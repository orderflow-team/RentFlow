"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPortalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const crypto = __importStar(require("crypto"));
let TenantPortalService = class TenantPortalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyLease(companyId, tenantId) {
        const lease = await this.prisma.lease.findFirst({
            where: { tenantId, companyId, deletedAt: null, status: 'ACTIVE' },
            include: {
                unit: { include: { building: { select: { name: true, property: { select: { name: true, address: true } } } } } },
                leaseLifecycle: true,
            },
        });
        if (!lease)
            throw new common_1.NotFoundException('No active lease found');
        return lease;
    }
    async getMyInvoices(companyId, tenantId) {
        return this.prisma.invoice.findMany({
            where: { tenantId, companyId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: { payments: true },
        });
    }
    async getMyMaintenanceRequests(companyId, tenantId) {
        return this.prisma.maintenanceRequest.findMany({
            where: { tenantId, companyId, deletedAt: null },
            orderBy: { createdAt: 'desc' },
            include: { unit: { select: { name: true } }, vendor: { select: { name: true } } },
        });
    }
    async submitMaintenanceRequest(companyId, tenantId, dto) {
        const lease = await this.prisma.lease.findFirst({ where: { tenantId, companyId, deletedAt: null, status: 'ACTIVE' } });
        if (!lease)
            throw new common_1.NotFoundException('No active lease found');
        return this.prisma.maintenanceRequest.create({
            data: {
                companyId,
                tenantId,
                unitId: dto.unitId || lease.unitId,
                title: dto.title,
                description: dto.description,
                category: dto.category || 'MAINTENANCE',
                priority: dto.priority || 'MEDIUM',
                status: 'SUBMITTED',
            },
        });
    }
    async getMyDocuments(companyId, tenantId) {
        const tenant = await this.prisma.tenant.findFirst({
            where: { id: tenantId, companyId, deletedAt: null },
            select: { documents: true },
        });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant profile not found');
        return Array.isArray(tenant.documents) ? tenant.documents : [];
    }
    async addMyDocument(companyId, tenantId, dto) {
        const tenant = await this.prisma.tenant.findFirst({ where: { id: tenantId, companyId, deletedAt: null } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant profile not found');
        const docs = Array.isArray(tenant.documents) ? tenant.documents : [];
        docs.push({
            id: crypto.randomUUID(),
            title: dto.title,
            category: dto.category || 'OTHER',
            url: dto.url || null,
            uploadedAt: new Date().toISOString(),
        });
        await this.prisma.tenant.update({ where: { id: tenantId }, data: { documents: docs } });
        return docs;
    }
    async removeMyDocument(companyId, tenantId, docId) {
        const tenant = await this.prisma.tenant.findFirst({ where: { id: tenantId, companyId, deletedAt: null } });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant profile not found');
        const docs = (Array.isArray(tenant.documents) ? tenant.documents : []).filter((d) => d.id !== docId);
        await this.prisma.tenant.update({ where: { id: tenantId }, data: { documents: docs } });
        return docs;
    }
    async getMyRentalHistory(companyId, tenantId) {
        const leases = await this.prisma.lease.findMany({
            where: {
                tenantId,
                companyId,
                deletedAt: null,
                status: { in: [client_1.LeaseStatus.EXPIRED, client_1.LeaseStatus.TERMINATED] },
            },
            include: {
                unit: {
                    select: {
                        name: true,
                        building: {
                            select: {
                                property: { select: { name: true, address: true, city: true, state: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { startDate: 'desc' },
        });
        const history = await Promise.all(leases.map(async (lease) => {
            const reviews = await this.prisma.review.findMany({
                where: { leaseId: lease.id, targetType: 'TENANT', isUnblinded: true },
            });
            let rating = null;
            let scoreSum = 0;
            let scoreCount = 0;
            for (const review of reviews) {
                const scores = review.scores;
                if (scores) {
                    for (const value of Object.values(scores)) {
                        scoreSum += value;
                        scoreCount++;
                    }
                }
            }
            if (scoreCount > 0) {
                rating = parseFloat((scoreSum / scoreCount).toFixed(2));
            }
            const end = lease.endDate ?? new Date();
            const durationDays = Math.max(0, Math.round((end.getTime() - lease.startDate.getTime()) / (1000 * 60 * 60 * 24)));
            return {
                leaseId: lease.id,
                property: {
                    name: lease.unit.building.property.name,
                    address: lease.unit.building.property.address,
                    city: lease.unit.building.property.city,
                    state: lease.unit.building.property.state,
                },
                unit: lease.unit.name,
                startDate: lease.startDate,
                endDate: lease.endDate,
                duration: this.formatDuration(durationDays),
                rating,
            };
        }));
        return history;
    }
    formatDuration(days) {
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        if (years > 0) {
            return months > 0 ? `${years} year${years > 1 ? 's' : ''} ${months} month${months > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''}`;
        }
        if (months > 0) {
            return `${months} month${months > 1 ? 's' : ''}`;
        }
        return `${days} day${days !== 1 ? 's' : ''}`;
    }
};
exports.TenantPortalService = TenantPortalService;
exports.TenantPortalService = TenantPortalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantPortalService);
//# sourceMappingURL=tenant-portal.service.js.map