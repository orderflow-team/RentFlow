import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { MaintenanceStatus, TicketCategory } from '@prisma/client';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Injectable()
export class MaintenanceService {
  constructor(private prisma: PrismaService) {}

  private async getScopedWhereClause(companyId: string, user: JwtPayload) {
    const where: any = { companyId };

    if (user.roles.includes(RoleType.ADMIN) || user.roles.includes(RoleType.ACCOUNTANT)) {
      return where;
    }

    if (user.roles.includes(RoleType.OWNER)) {
      const owner = await this.prisma.owner.findFirst({
        where: { companyId, userId: user.sub, deletedAt: null },
      });
      if (owner) {
        where.unit = {
          building: {
            property: {
              ownerId: owner.id,
              deletedAt: null,
            },
          },
        };
      } else {
        where.id = 'non-existent-id';
      }
      return where;
    }

    if (user.roles.includes(RoleType.MANAGER)) {
      where.unit = {
        building: {
          property: {
            managerId: user.sub,
            deletedAt: null,
          },
        },
      };
      return where;
    }

    where.id = 'non-existent-id';
    return where;
  }

  async createRequest(companyId: string, user: JwtPayload, dto: CreateRequestDto) {
    if (dto.vendorId) {
      const v = await this.prisma.vendor.findFirst({ where: { id: dto.vendorId, companyId } });
      if (!v) throw new BadRequestException('Vendor not found');
    }
    return this.prisma.maintenanceRequest.create({
      data: {
        ...dto,
        companyId,
        category: dto.category || 'MAINTENANCE',
        scheduledDate: dto.scheduledDate ? new Date(dto.scheduledDate) : null,
        estimatedCost: dto.estimatedCost || undefined,
      },
    });
  }

  async findAllRequests(companyId: string, user: JwtPayload, filters?: { status?: string; priority?: string; page?: number; limit?: number }) {
    const where = await this.getScopedWhereClause(companyId, user);
    if (filters?.status) where.status = filters.status;
    if (filters?.priority) where.priority = filters.priority;
    const page = filters?.page || 1; const limit = filters?.limit || 50; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.maintenanceRequest.findMany({ where, skip, take: limit, include: { unit: { select: { name: true } }, tenant: { select: { firstName: true, lastName: true } }, vendor: { select: { name: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.maintenanceRequest.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneRequest(companyId: string, id: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const r = await this.prisma.maintenanceRequest.findFirst({ where: scopedWhere, include: { unit: true, tenant: true, vendor: true } });
    if (!r) throw new NotFoundException('Maintenance request not found');
    return r;
  }

  async updateStatus(companyId: string, id: string, user: JwtPayload, status: MaintenanceStatus, actualCost?: number) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const r = await this.prisma.maintenanceRequest.findFirst({ where: scopedWhere });
    if (!r) throw new NotFoundException('Maintenance request not found');
    const data: any = { status };
    if (actualCost !== undefined) data.actualCost = actualCost;
    if (status === 'COMPLETED') data.completedDate = new Date();
    return this.prisma.maintenanceRequest.update({ where: { id }, data });
  }

  async removeRequest(companyId: string, id: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const r = await this.prisma.maintenanceRequest.findFirst({ where: scopedWhere });
    if (!r) throw new NotFoundException('Maintenance request not found');
    await this.prisma.maintenanceRequest.update({ where: { id }, data: { status: 'CANCELLED' } });
    return { message: 'Request cancelled' };
  }

  async createVendor(companyId: string, dto: CreateVendorDto) {
    return this.prisma.vendor.create({ data: { ...dto, companyId } });
  }

  async findOneVendor(companyId: string, id: string) {
    const v = await this.prisma.vendor.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!v) throw new NotFoundException('Vendor not found');
    return v;
  }

  async updateVendor(companyId: string, id: string, dto: UpdateVendorDto) {
    const v = await this.prisma.vendor.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!v) throw new NotFoundException('Vendor not found');
    return this.prisma.vendor.update({ where: { id }, data: dto });
  }

  async findAllVendors(companyId: string) {
    return this.prisma.vendor.findMany({ where: { companyId, deletedAt: null }, orderBy: { name: 'asc' } });
  }

  async removeVendor(companyId: string, id: string) {
    const v = await this.prisma.vendor.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!v) throw new NotFoundException('Vendor not found');
    await this.prisma.vendor.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Vendor deleted' };
  }
}
