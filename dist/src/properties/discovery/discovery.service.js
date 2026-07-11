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
exports.DiscoveryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DiscoveryService = class DiscoveryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async search(companyId, filters) {
        const where = {
            companyId,
            deletedAt: null,
        };
        if (filters.location) {
            where.OR = [
                { city: { contains: filters.location, mode: 'insensitive' } },
                { state: { contains: filters.location, mode: 'insensitive' } },
                { address: { contains: filters.location, mode: 'insensitive' } },
            ];
        }
        if (filters.type) {
            where.type = filters.type;
        }
        if (filters.furnishedStatus) {
            where.furnishedStatus = filters.furnishedStatus;
        }
        if (filters.occupancyType) {
            where.occupancyType = filters.occupancyType;
        }
        if (filters.isAvailableSoon) {
            where.status = client_1.PropertyStatus.AVAILABLE_SOON;
        }
        else {
            where.status = {
                in: [client_1.PropertyStatus.ACTIVE, client_1.PropertyStatus.AVAILABLE_SOON],
            };
        }
        const unitWhere = {
            deletedAt: null,
            ...(filters.minBudget || filters.maxBudget
                ? {
                    rentAmount: {
                        ...(filters.minBudget ? { gte: filters.minBudget } : {}),
                        ...(filters.maxBudget ? { lte: filters.maxBudget } : {}),
                    },
                }
                : {}),
            ...(filters.listingType
                ? { OR: [{ listingType: filters.listingType }, { listingType: 'BOTH' }] }
                : {}),
        };
        const properties = await this.prisma.property.findMany({
            where,
            include: {
                manager: {
                    select: { id: true, firstName: true, lastName: true, phone: true },
                },
                buildings: {
                    include: {
                        units: { where: unitWhere },
                    },
                },
            },
        });
        return properties
            .map((p) => {
            const units = p.buildings.flatMap((b) => b.units);
            if ((filters.minBudget || filters.maxBudget || filters.listingType) && units.length === 0) {
                return null;
            }
            const rents = units.map((u) => u.rentAmount || 0).filter((r) => r > 0);
            const sales = units.map((u) => u.salePrice || 0).filter((s) => s > 0);
            return {
                id: p.id,
                name: p.name,
                address: p.address,
                city: p.city,
                state: p.state,
                zipCode: p.zipCode,
                type: p.type,
                status: p.status,
                images: p.images || [],
                expectedAvailability: p.expectedAvailability,
                furnishedStatus: p.furnishedStatus,
                occupancyType: p.occupancyType,
                rentRange: rents.length ? { min: Math.min(...rents), max: Math.max(...rents) } : null,
                saleRange: sales.length ? { min: Math.min(...sales), max: Math.max(...sales) } : null,
                manager: p.manager
                    ? {
                        name: `${p.manager.firstName} ${p.manager.lastName}`,
                        phone: p.manager.phone,
                    }
                    : null,
                preferences: {
                    family: p.prefFamily,
                    married: p.prefMarried,
                    liveIn: p.prefLiveIn,
                    students: p.prefStudents,
                    professionals: p.prefProfessionals,
                    petFriendly: p.prefPetFriendly,
                    vegetarian: p.prefVegetarian,
                    smokingAllowed: p.prefSmokingAllowed,
                },
                unitsCount: units.length,
            };
        })
            .filter((p) => p !== null);
    }
    async getPropertyDetail(companyId, propertyId) {
        const property = await this.prisma.property.findFirst({
            where: {
                id: propertyId,
                companyId,
                deletedAt: null,
                status: { in: [client_1.PropertyStatus.ACTIVE, client_1.PropertyStatus.AVAILABLE_SOON] },
            },
            include: {
                manager: {
                    select: { id: true, firstName: true, lastName: true, phone: true, email: true },
                },
                buildings: {
                    where: { deletedAt: null },
                    include: {
                        units: { where: { deletedAt: null } },
                    },
                },
            },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found or not open for discovery');
        }
        const units = property.buildings.flatMap((b) => b.units.map((u) => ({ ...u, buildingName: b.name })));
        const availableUnits = units.filter((u) => u.status === 'VACANT' || u.status === 'AVAILABLE_SOON');
        const rents = units.map((u) => u.rentAmount || 0).filter((r) => r > 0);
        const sales = units.map((u) => u.salePrice || 0).filter((s) => s > 0);
        return {
            id: property.id,
            name: property.name,
            description: property.description,
            address: property.address,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            type: property.type,
            status: property.status,
            yearBuilt: property.yearBuilt,
            expectedAvailability: property.expectedAvailability,
            furnishedStatus: property.furnishedStatus,
            occupancyType: property.occupancyType,
            images: property.images || [],
            amenities: property.amenities,
            rentRange: rents.length ? { min: Math.min(...rents), max: Math.max(...rents) } : null,
            saleRange: sales.length ? { min: Math.min(...sales), max: Math.max(...sales) } : null,
            manager: property.manager
                ? {
                    name: `${property.manager.firstName} ${property.manager.lastName}`,
                    phone: property.manager.phone,
                    email: property.manager.email,
                }
                : null,
            preferences: {
                family: property.prefFamily,
                married: property.prefMarried,
                liveIn: property.prefLiveIn,
                students: property.prefStudents,
                professionals: property.prefProfessionals,
                petFriendly: property.prefPetFriendly,
                vegetarian: property.prefVegetarian,
                smokingAllowed: property.prefSmokingAllowed,
            },
            totalUnits: units.length,
            availableUnitsCount: availableUnits.length,
            availableUnits: availableUnits.map((u) => ({
                id: u.id,
                name: u.name,
                building: u.buildingName,
                bedrooms: u.bedrooms,
                bathrooms: u.bathrooms,
                squareFootage: u.squareFootage,
                listingType: u.listingType,
                rentAmount: u.rentAmount,
                salePrice: u.salePrice,
                status: u.status,
                description: u.description,
                images: u.images || [],
            })),
        };
    }
    async joinWaitlist(companyId, propertyId, tenantEmail) {
        const property = await this.prisma.property.findFirst({
            where: { id: propertyId, companyId, deletedAt: null },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        if (property.status !== client_1.PropertyStatus.AVAILABLE_SOON) {
            throw new common_1.BadRequestException('Property is not listed as Available Soon');
        }
        const tenant = await this.prisma.tenant.findFirst({
            where: { email: tenantEmail, companyId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant record not found. Please complete profile registration first.');
        }
        const existing = await this.prisma.propertyApplication.findFirst({
            where: {
                propertyId,
                tenantId: tenant.id,
                isWaitingList: true,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('You are already on the waiting list for this property');
        }
        return this.prisma.propertyApplication.create({
            data: {
                companyId,
                propertyId,
                tenantId: tenant.id,
                status: client_1.ApplicationStatus.PENDING,
                isWaitingList: true,
                compatibilityScore: 100.0,
            },
        });
    }
};
exports.DiscoveryService = DiscoveryService;
exports.DiscoveryService = DiscoveryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DiscoveryService);
//# sourceMappingURL=discovery.service.js.map