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
exports.OwnerPortalService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OwnerPortalService = class OwnerPortalService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyProperties(companyId, ownerId) {
        const properties = await this.prisma.property.findMany({
            where: { ownerId, companyId, deletedAt: null },
            include: {
                buildings: {
                    include: { units: { where: { deletedAt: null }, select: { id: true, name: true, status: true, rentAmount: true } } },
                },
            },
        });
        if (!properties.length)
            throw new common_1.NotFoundException('No properties found for this owner');
        return properties;
    }
    async getMyFinancialSummary(companyId, ownerId) {
        const properties = await this.prisma.property.findMany({
            where: { ownerId, companyId, deletedAt: null },
            select: { id: true, name: true },
        });
        const propertyIds = properties.map(p => p.id);
        if (!propertyIds.length)
            throw new common_1.NotFoundException('No properties found');
        const buildingIds = (await this.prisma.building.findMany({
            where: { propertyId: { in: propertyIds }, deletedAt: null },
            select: { id: true },
        })).map(b => b.id);
        const unitIds = (await this.prisma.unit.findMany({
            where: { buildingId: { in: buildingIds }, deletedAt: null },
            select: { id: true },
        })).map(u => u.id);
        const [invoices, expenses, units] = await Promise.all([
            this.prisma.invoice.findMany({
                where: { unitId: { in: unitIds }, deletedAt: null },
                include: { payments: true },
            }),
            this.prisma.expense.findMany({
                where: { propertyId: { in: propertyIds }, deletedAt: null },
            }),
            this.prisma.unit.findMany({
                where: { buildingId: { in: buildingIds }, deletedAt: null },
                select: { id: true, status: true },
            }),
        ]);
        const totalRent = invoices.reduce((s, i) => s + i.rentAmount, 0);
        const totalCollected = invoices.reduce((s, i) => s + i.paidAmount, 0);
        const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
        const occupied = units.filter(u => u.status === 'OCCUPIED').length;
        const totalUnits = units.length;
        return {
            properties: properties.map(p => p.name),
            totalProperties: properties.length,
            units: { total: totalUnits, occupied, vacant: totalUnits - occupied },
            finances: {
                totalRent,
                totalCollected,
                totalOutstanding: totalRent - totalCollected,
                totalExpenses,
                netIncome: totalCollected - totalExpenses,
            },
        };
    }
};
exports.OwnerPortalService = OwnerPortalService;
exports.OwnerPortalService = OwnerPortalService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OwnerPortalService);
//# sourceMappingURL=owner-portal.service.js.map