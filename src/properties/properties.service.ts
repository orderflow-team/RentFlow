import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { AssignManagerDto } from './dto/assign-manager.dto';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';
import { normalizePhone } from '../common/utils/phone.util';
import { findOrCreatePhoneUser } from '../common/utils/phone-account.util';

@Injectable()
export class PropertiesService {
  private readonly logger = new Logger(PropertiesService.name);

  constructor(private prisma: PrismaService) {}

  // ─── Properties ──────────────────────────────────────────────────────────

  // ─── Properties ──────────────────────────────────────────────────────────

  private async getScopedWhereClause(companyId: string, user: JwtPayload) {
    const where: any = { companyId, deletedAt: null };

    if (user.roles.includes(RoleType.ADMIN) || user.roles.includes(RoleType.ACCOUNTANT)) {
      return where;
    }

    if (user.roles.includes(RoleType.OWNER)) {
      const owner = await this.prisma.owner.findFirst({
        where: { companyId, userId: user.sub, deletedAt: null },
      });
      if (owner) {
        where.ownerId = owner.id;
      } else {
        where.id = 'non-existent-id';
      }
      return where;
    }

    if (user.roles.includes(RoleType.MANAGER)) {
      where.managerId = user.sub;
      return where;
    }

    where.id = 'non-existent-id';
    return where;
  }

  async create(companyId: string, user: JwtPayload, dto: CreatePropertyDto) {
    let finalOwnerId = dto.ownerId;
    const isOwner = user.roles.includes(RoleType.OWNER);
    if (isOwner) {
      const owner = await this.prisma.owner.findFirst({
        where: { companyId, userId: user.sub, deletedAt: null },
      });
      if (!owner) {
        throw new NotFoundException('Owner profile not found');
      }
      finalOwnerId = owner.id;
    }

    const property = await this.prisma.property.create({
      data: {
        ...dto,
        companyId,
        ownerId: finalOwnerId || undefined,
        managerId: dto.managerId || undefined,
        createdById: user.sub,
        updatedById: user.sub,
        amenities: dto.amenities || undefined,
        images: dto.images || undefined,
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

  async findAll(
    companyId: string,
    user: JwtPayload,
    filters?: {
      status?: string;
      type?: string;
      search?: string;
      page?: number;
      limit?: number;
    },
  ) {
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

  async findOne(companyId: string, propertyId: string, user: JwtPayload) {
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
      throw new NotFoundException('Property not found');
    }

    return {
      ...this.formatProperty(property),
      buildingCount: property._count.buildings,
      manager: property.manager,
    };
  }

  async update(
    companyId: string,
    propertyId: string,
    user: JwtPayload,
    dto: UpdatePropertyDto,
  ) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = propertyId;

    const property = await this.prisma.property.findFirst({
      where: scopedWhere,
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    let finalOwnerId = dto.ownerId;
    if (user.roles.includes(RoleType.OWNER)) {
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
        images: dto.images !== undefined ? dto.images : undefined,
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

  async remove(companyId: string, propertyId: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = propertyId;

    const property = await this.prisma.property.findFirst({
      where: scopedWhere,
    });

    if (!property) {
      throw new NotFoundException('Property not found');
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

  async assignManager(
    companyId: string,
    user: JwtPayload,
    propertyId: string,
    dto: AssignManagerDto,
  ) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = propertyId;

    const property = await this.prisma.property.findFirst({ where: scopedWhere });
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const phone = normalizePhone(dto.phone);

    const manager = await findOrCreatePhoneUser(this.prisma, {
      companyId,
      phone,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleType: RoleType.MANAGER,
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

  // ─── Buildings ───────────────────────────────────────────────────────────

  async createBuilding(
    companyId: string,
    propertyId: string,
    dto: CreateBuildingDto,
  ) {
    // Verify property exists and belongs to company
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

  async findAllBuildings(companyId: string, propertyId: string) {
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

  async findOneBuilding(companyId: string, buildingId: string) {
    const building = await this.prisma.building.findFirst({
      where: { id: buildingId, companyId, deletedAt: null },
      include: {
        _count: { select: { units: true } },
      },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    return {
      ...this.formatBuilding(building),
      unitCount: building._count.units,
    };
  }

  async updateBuilding(
    companyId: string,
    buildingId: string,
    dto: UpdateBuildingDto,
  ) {
    const building = await this.prisma.building.findFirst({
      where: { id: buildingId, companyId, deletedAt: null },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
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

  async removeBuilding(companyId: string, buildingId: string) {
    const building = await this.prisma.building.findFirst({
      where: { id: buildingId, companyId, deletedAt: null },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    // Cascade soft-delete: building → units
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

    // Decrement property unit count
    await this.prisma.property.update({
      where: { id: building.propertyId },
      data: { totalUnits: { decrement: building.totalUnits } },
    });

    return { message: 'Building deleted successfully' };
  }

  // ─── Units ───────────────────────────────────────────────────────────────

  async createUnit(
    companyId: string,
    buildingId: string,
    dto: CreateUnitDto,
  ) {
    // Verify building exists and belongs to company
    const building = await this.prisma.building.findFirst({
      where: { id: buildingId, companyId, deletedAt: null },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    // Check for duplicate unit name within the same building
    const existing = await this.prisma.unit.findFirst({
      where: {
        companyId,
        buildingId,
        name: dto.name,
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException(
        `Unit "${dto.name}" already exists in this building`,
      );
    }

    const unit = await this.prisma.unit.create({
      data: {
        ...dto,
        companyId,
        buildingId,
        amenities: dto.amenities || undefined,
        metadata: dto.metadata || undefined,
      },
    });

    // Update building total unit count
    await this.prisma.building.update({
      where: { id: buildingId },
      data: { totalUnits: { increment: 1 } },
    });

    // Update property total unit count
    await this.prisma.property.update({
      where: { id: building.propertyId },
      data: { totalUnits: { increment: 1 } },
    });

    return this.formatUnit(unit);
  }

  async findAllUnits(
    companyId: string,
    buildingId: string,
    filters?: { status?: string },
  ) {
    const building = await this.prisma.building.findFirst({
      where: { id: buildingId, companyId, deletedAt: null },
    });

    if (!building) {
      throw new NotFoundException('Building not found');
    }

    const where: any = { buildingId, companyId, deletedAt: null };
    if (filters?.status) {
      where.status = filters.status;
    }

    const units = await this.prisma.unit.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return units.map((u) => this.formatUnit(u));
  }

  async findOneUnit(companyId: string, unitId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id: unitId, companyId, deletedAt: null },
      include: {
        building: {
          select: { id: true, name: true, propertyId: true },
        },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    return {
      ...this.formatUnit(unit),
      building: unit.building,
    };
  }

  async updateUnit(companyId: string, unitId: string, dto: UpdateUnitDto) {
    const unit = await this.prisma.unit.findFirst({
      where: { id: unitId, companyId, deletedAt: null },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    const updated = await this.prisma.unit.update({
      where: { id: unitId },
      data: {
        ...dto,
        amenities: dto.amenities !== undefined ? dto.amenities : undefined,
        metadata: dto.metadata !== undefined ? dto.metadata : undefined,
      },
    });

    return this.formatUnit(updated);
  }

  async removeUnit(companyId: string, unitId: string) {
    const unit = await this.prisma.unit.findFirst({
      where: { id: unitId, companyId, deletedAt: null },
      include: {
        building: { select: { propertyId: true } },
      },
    });

    if (!unit) {
      throw new NotFoundException('Unit not found');
    }

    await this.prisma.unit.update({
      where: { id: unitId },
      data: { deletedAt: new Date() },
    });

    // Decrement building and property unit counts
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

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private async verifyPropertyExists(companyId: string, propertyId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: propertyId, companyId, deletedAt: null },
      select: { id: true },
    });
    if (!property) {
      throw new NotFoundException('Property not found');
    }
  }

  private formatProperty(property: any) {
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

  private formatBuilding(building: any) {
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

  private formatUnit(unit: any) {
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
      metadata: unit.metadata,
      createdAt: unit.createdAt,
      updatedAt: unit.updatedAt,
    };
  }
}
