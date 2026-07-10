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
var PropertiesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
const phone_util_1 = require("../common/utils/phone.util");
const phone_account_util_1 = require("../common/utils/phone-account.util");
let PropertiesService = PropertiesService_1 = class PropertiesService {
    prisma;
    logger = new common_1.Logger(PropertiesService_1.name);
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
                where.ownerId = owner.id;
            }
            else {
                where.id = 'non-existent-id';
            }
            return where;
        }
        if (user.roles.includes(role_enum_1.RoleType.MANAGER)) {
            where.managerId = user.sub;
            return where;
        }
        where.id = 'non-existent-id';
        return where;
    }
    async create(companyId, user, dto) {
        let finalOwnerId = dto.ownerId;
        const isOwner = user.roles.includes(role_enum_1.RoleType.OWNER);
        if (isOwner) {
            const owner = await this.prisma.owner.findFirst({
                where: { companyId, userId: user.sub, deletedAt: null },
            });
            if (!owner) {
                throw new common_1.NotFoundException('Owner profile not found');
            }
            finalOwnerId = owner.id;
        }
        let finalManagerId = dto.managerId;
        if (!finalManagerId && user.roles.includes(role_enum_1.RoleType.MANAGER)) {
            finalManagerId = user.sub;
        }
        const property = await this.prisma.property.create({
            data: {
                ...dto,
                companyId,
                ownerId: finalOwnerId || undefined,
                managerId: finalManagerId || undefined,
                createdById: user.sub,
                updatedById: user.sub,
                amenities: dto.amenities || undefined,
                images: dto.images?.map((img) => ({ url: img.url, caption: img.caption })) || undefined,
                metadata: dto.metadata || undefined,
            },
            include: {
                createdBy: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        return this.formatProperty(property);
    }
    async findAll(companyId, user, filters) {
        const where = await this.getScopedWhereClause(companyId, user);
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.type) {
            where.type = filters.type;
        }
        if (filters?.search) {
            where.OR = [
                { name: { contains: filters.search, mode: 'insensitive' } },
                { address: { contains: filters.search, mode: 'insensitive' } },
                { city: { contains: filters.search, mode: 'insensitive' } },
            ];
        }
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;
        const [properties, total] = await Promise.all([
            this.prisma.property.findMany({
                where,
                skip,
                take: limit,
                include: {
                    _count: { select: { buildings: true } },
                    createdBy: {
                        select: { id: true, firstName: true, lastName: true },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.property.count({ where }),
        ]);
        return {
            data: properties.map((p) => ({
                ...this.formatProperty(p),
                buildingCount: p._count.buildings,
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(companyId, propertyId, user) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = propertyId;
        const property = await this.prisma.property.findFirst({
            where: scopedWhere,
            include: {
                _count: { select: { buildings: true } },
                createdBy: {
                    select: { id: true, firstName: true, lastName: true },
                },
                updatedBy: {
                    select: { id: true, firstName: true, lastName: true },
                },
                manager: {
                    select: { id: true, firstName: true, lastName: true, phone: true },
                },
            },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        return {
            ...this.formatProperty(property),
            buildingCount: property._count.buildings,
            manager: property.manager,
        };
    }
    async update(companyId, propertyId, user, dto) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = propertyId;
        const property = await this.prisma.property.findFirst({
            where: scopedWhere,
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        let finalOwnerId = dto.ownerId;
        if (user.roles.includes(role_enum_1.RoleType.OWNER)) {
            finalOwnerId = undefined;
        }
        const updated = await this.prisma.property.update({
            where: { id: propertyId },
            data: {
                ...dto,
                ownerId: finalOwnerId !== undefined ? finalOwnerId : undefined,
                managerId: dto.managerId !== undefined ? dto.managerId : undefined,
                updatedById: user.sub,
                amenities: dto.amenities !== undefined ? dto.amenities : undefined,
                images: dto.images !== undefined ? dto.images.map((img) => ({ url: img.url, caption: img.caption })) : undefined,
                metadata: dto.metadata !== undefined ? dto.metadata : undefined,
            },
            include: {
                createdBy: {
                    select: { id: true, firstName: true, lastName: true },
                },
                updatedBy: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });
        return this.formatProperty(updated);
    }
    async remove(companyId, propertyId, user) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = propertyId;
        const property = await this.prisma.property.findFirst({
            where: scopedWhere,
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const buildings = await this.prisma.building.findMany({
            where: { propertyId, companyId, deletedAt: null },
            select: { id: true },
        });
        const buildingIds = buildings.map((b) => b.id);
        await this.prisma.$transaction([
            this.prisma.unit.updateMany({
                where: { buildingId: { in: buildingIds }, companyId },
                data: { deletedAt: new Date() },
            }),
            this.prisma.building.updateMany({
                where: { propertyId, companyId },
                data: { deletedAt: new Date() },
            }),
            this.prisma.property.update({
                where: { id: propertyId },
                data: { deletedAt: new Date() },
            }),
        ]);
        return { message: 'Property deleted successfully' };
    }
    async assignManager(companyId, user, propertyId, dto) {
        const scopedWhere = await this.getScopedWhereClause(companyId, user);
        scopedWhere.id = propertyId;
        const property = await this.prisma.property.findFirst({ where: scopedWhere });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
        const phone = (0, phone_util_1.normalizePhone)(dto.phone);
        const manager = await (0, phone_account_util_1.findOrCreatePhoneUser)(this.prisma, {
            companyId,
            phone,
            firstName: dto.firstName,
            lastName: dto.lastName,
            roleType: role_enum_1.RoleType.MANAGER,
        });
        const updated = await this.prisma.property.update({
            where: { id: propertyId },
            data: { managerId: manager.id },
            include: {
                createdBy: { select: { id: true, firstName: true, lastName: true } },
            },
        });
        return {
            ...this.formatProperty(updated),
            manager: {
                id: manager.id,
                firstName: manager.firstName,
                lastName: manager.lastName,
                phone: manager.phone,
            },
        };
    }
    async createBuilding(companyId, propertyId, dto) {
        await this.verifyPropertyExists(companyId, propertyId);
        const building = await this.prisma.building.create({
            data: {
                ...dto,
                companyId,
                propertyId,
                amenities: dto.amenities || undefined,
                metadata: dto.metadata || undefined,
            },
        });
        return this.formatBuilding(building);
    }
    async findAllBuildings(companyId, propertyId) {
        await this.verifyPropertyExists(companyId, propertyId);
        const buildings = await this.prisma.building.findMany({
            where: { propertyId, companyId, deletedAt: null },
            include: {
                _count: { select: { units: true } },
            },
            orderBy: { createdAt: 'asc' },
        });
        return buildings.map((b) => ({
            ...this.formatBuilding(b),
            unitCount: b._count.units,
        }));
    }
    async findOneBuilding(companyId, buildingId) {
        const building = await this.prisma.building.findFirst({
            where: { id: buildingId, companyId, deletedAt: null },
            include: {
                _count: { select: { units: true } },
            },
        });
        if (!building) {
            throw new common_1.NotFoundException('Building not found');
        }
        return {
            ...this.formatBuilding(building),
            unitCount: building._count.units,
        };
    }
    async updateBuilding(companyId, buildingId, dto) {
        const building = await this.prisma.building.findFirst({
            where: { id: buildingId, companyId, deletedAt: null },
        });
        if (!building) {
            throw new common_1.NotFoundException('Building not found');
        }
        const updated = await this.prisma.building.update({
            where: { id: buildingId },
            data: {
                ...dto,
                amenities: dto.amenities !== undefined ? dto.amenities : undefined,
                metadata: dto.metadata !== undefined ? dto.metadata : undefined,
            },
        });
        return this.formatBuilding(updated);
    }
    async removeBuilding(companyId, buildingId) {
        const building = await this.prisma.building.findFirst({
            where: { id: buildingId, companyId, deletedAt: null },
        });
        if (!building) {
            throw new common_1.NotFoundException('Building not found');
        }
        await this.prisma.$transaction([
            this.prisma.unit.updateMany({
                where: { buildingId, companyId },
                data: { deletedAt: new Date() },
            }),
            this.prisma.building.update({
                where: { id: buildingId },
                data: { deletedAt: new Date() },
            }),
        ]);
        await this.prisma.property.update({
            where: { id: building.propertyId },
            data: { totalUnits: { decrement: building.totalUnits } },
        });
        return { message: 'Building deleted successfully' };
    }
    async createUnit(companyId, buildingId, dto) {
        const building = await this.prisma.building.findFirst({
            where: { id: buildingId, companyId, deletedAt: null },
        });
        if (!building) {
            throw new common_1.NotFoundException('Building not found');
        }
        const existing = await this.prisma.unit.findFirst({
            where: {
                companyId,
                buildingId,
                name: dto.name,
                deletedAt: null,
            },
        });
        if (existing) {
            throw new common_1.ConflictException(`Unit "${dto.name}" already exists in this building`);
        }
        const unit = await this.prisma.unit.create({
            data: {
                ...dto,
                companyId,
                buildingId,
                amenities: dto.amenities || undefined,
                images: dto.images?.map((img) => ({ url: img.url, caption: img.caption })) || undefined,
                metadata: dto.metadata || undefined,
            },
        });
        await this.prisma.building.update({
            where: { id: buildingId },
            data: { totalUnits: { increment: 1 } },
        });
        await this.prisma.property.update({
            where: { id: building.propertyId },
            data: { totalUnits: { increment: 1 } },
        });
        return this.formatUnit(unit);
    }
    async findAllUnits(companyId, buildingId, filters) {
        const building = await this.prisma.building.findFirst({
            where: { id: buildingId, companyId, deletedAt: null },
        });
        if (!building) {
            throw new common_1.NotFoundException('Building not found');
        }
        const where = { buildingId, companyId, deletedAt: null };
        if (filters?.status) {
            where.status = filters.status;
        }
        const units = await this.prisma.unit.findMany({
            where,
            orderBy: { name: 'asc' },
        });
        return units.map((u) => this.formatUnit(u));
    }
    async findOneUnit(companyId, unitId) {
        const unit = await this.prisma.unit.findFirst({
            where: { id: unitId, companyId, deletedAt: null },
            include: {
                building: {
                    select: { id: true, name: true, propertyId: true },
                },
            },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        return {
            ...this.formatUnit(unit),
            building: unit.building,
        };
    }
    async updateUnit(companyId, unitId, dto) {
        const unit = await this.prisma.unit.findFirst({
            where: { id: unitId, companyId, deletedAt: null },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        const updated = await this.prisma.unit.update({
            where: { id: unitId },
            data: {
                ...dto,
                amenities: dto.amenities !== undefined ? dto.amenities : undefined,
                images: dto.images !== undefined ? dto.images.map((img) => ({ url: img.url, caption: img.caption })) : undefined,
                metadata: dto.metadata !== undefined ? dto.metadata : undefined,
            },
        });
        return this.formatUnit(updated);
    }
    async removeUnit(companyId, unitId) {
        const unit = await this.prisma.unit.findFirst({
            where: { id: unitId, companyId, deletedAt: null },
            include: {
                building: { select: { propertyId: true } },
            },
        });
        if (!unit) {
            throw new common_1.NotFoundException('Unit not found');
        }
        await this.prisma.unit.update({
            where: { id: unitId },
            data: { deletedAt: new Date() },
        });
        await this.prisma.building.update({
            where: { id: unit.buildingId },
            data: { totalUnits: { decrement: 1 } },
        });
        await this.prisma.property.update({
            where: { id: unit.building.propertyId },
            data: { totalUnits: { decrement: 1 } },
        });
        return { message: 'Unit deleted successfully' };
    }
    async verifyPropertyExists(companyId, propertyId) {
        const property = await this.prisma.property.findFirst({
            where: { id: propertyId, companyId, deletedAt: null },
            select: { id: true },
        });
        if (!property) {
            throw new common_1.NotFoundException('Property not found');
        }
    }
    formatProperty(property) {
        return {
            id: property.id,
            name: property.name,
            type: property.type,
            status: property.status,
            description: property.description,
            notes: property.notes,
            address: property.address,
            city: property.city,
            state: property.state,
            zipCode: property.zipCode,
            country: property.country,
            totalUnits: property.totalUnits,
            yearBuilt: property.yearBuilt,
            latitude: property.latitude,
            longitude: property.longitude,
            amenities: property.amenities,
            images: property.images,
            metadata: property.metadata,
            ownerId: property.ownerId,
            managerId: property.managerId,
            createdBy: property.createdBy
                ? {
                    id: property.createdBy.id,
                    name: `${property.createdBy.firstName} ${property.createdBy.lastName}`,
                }
                : null,
            updatedBy: property.updatedBy
                ? {
                    id: property.updatedBy.id,
                    name: `${property.updatedBy.firstName} ${property.updatedBy.lastName}`,
                }
                : null,
            createdAt: property.createdAt,
            updatedAt: property.updatedAt,
        };
    }
    formatBuilding(building) {
        return {
            id: building.id,
            propertyId: building.propertyId,
            name: building.name,
            code: building.code,
            description: building.description,
            totalFloors: building.totalFloors,
            totalUnits: building.totalUnits,
            yearBuilt: building.yearBuilt,
            amenities: building.amenities,
            metadata: building.metadata,
            createdAt: building.createdAt,
            updatedAt: building.updatedAt,
        };
    }
    formatUnit(unit) {
        return {
            id: unit.id,
            buildingId: unit.buildingId,
            name: unit.name,
            description: unit.description,
            status: unit.status,
            floorNumber: unit.floorNumber,
            bedrooms: unit.bedrooms,
            bathrooms: unit.bathrooms,
            squareFootage: unit.squareFootage,
            rentAmount: unit.rentAmount,
            depositAmount: unit.depositAmount,
            amenities: unit.amenities,
            images: unit.images || [],
            metadata: unit.metadata,
            createdAt: unit.createdAt,
            updatedAt: unit.updatedAt,
        };
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = PropertiesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map