import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { AssignTenantByPhoneDto } from './dto/assign-tenant-by-phone.dto';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';
import { TenantsService } from '../tenants/tenants.service';

@Injectable()
export class LeasesService {
  constructor(
    private prisma: PrismaService,
    private tenantsService: TenantsService,
  ) {}

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

  async create(companyId: string, user: JwtPayload, dto: CreateLeaseDto) {
    const unit = await this.prisma.unit.findFirst({ where: { id: dto.unitId, companyId } });
    if (!unit) throw new BadRequestException('Unit not found');
    const tenant = await this.prisma.tenant.findFirst({ where: { id: dto.tenantId, companyId } });
    if (!tenant) throw new BadRequestException('Tenant not found');

    const lease = await this.prisma.lease.create({
      data: {
        ...dto,
        companyId,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        leaseTerms: dto.leaseTerms || undefined,
        documents: dto.documents || undefined,
      },
      include: { unit: { select: { id: true, name: true } }, tenant: { select: { id: true, firstName: true, lastName: true } } },
    });

    if (dto.status === 'ACTIVE') {
      await this.prisma.unit.update({ where: { id: dto.unitId }, data: { status: 'OCCUPIED' } });
    }
    return this.format(lease);
  }

  async assignTenantByPhone(companyId: string, user: JwtPayload, dto: AssignTenantByPhoneDto) {
    const unit = await this.prisma.unit.findFirst({
      where: { id: dto.unitId, companyId, deletedAt: null },
      include: { building: { include: { property: true } } },
    });
    if (!unit) throw new BadRequestException('Unit not found');

    const property = unit.building.property;

    if (user.roles.includes(RoleType.ADMIN)) {
      // unrestricted
    } else if (user.roles.includes(RoleType.OWNER)) {
      const owner = await this.prisma.owner.findFirst({
        where: { companyId, userId: user.sub, deletedAt: null },
      });
      if (!owner || property.ownerId !== owner.id) {
        throw new ForbiddenException('You do not manage this property');
      }
    } else if (user.roles.includes(RoleType.MANAGER)) {
      if (property.managerId !== user.sub) {
        throw new ForbiddenException('You do not manage this property');
      }
    } else {
      throw new ForbiddenException('You do not manage this property');
    }

    const { unitId, phone, firstName, lastName, email, ...leaseFields } = dto;

    const tenant = await this.tenantsService.findOrCreateByPhone(companyId, {
      phone,
      firstName,
      lastName,
      email,
    });

    return this.create(companyId, user, {
      ...leaseFields,
      unitId,
      tenantId: tenant.id,
      status: dto.status || 'ACTIVE',
    });
  }

  async findAll(companyId: string, user: JwtPayload, filters?: { status?: string; page?: number; limit?: number }) {
    const where = await this.getScopedWhereClause(companyId, user);
    if (filters?.status) where.status = filters.status;
    const page = filters?.page || 1; const limit = filters?.limit || 50; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.lease.findMany({ where, skip, take: limit, include: { unit: { select: { id: true, name: true, building: { select: { name: true } } } }, tenant: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } }),
      this.prisma.lease.count({ where }),
    ]);
    return { data: data.map(l => this.format(l)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(companyId: string, id: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const lease = await this.prisma.lease.findFirst({ where: scopedWhere, include: { unit: { include: { building: { select: { name: true, property: { select: { name: true } } } } } }, tenant: true } });
    if (!lease) throw new NotFoundException('Lease not found');
    return { ...this.format(lease), unit: lease.unit, tenant: { id: lease.tenant.id, name: `${lease.tenant.firstName} ${lease.tenant.lastName}`, email: lease.tenant.email } };
  }

  async update(companyId: string, id: string, user: JwtPayload, dto: UpdateLeaseDto) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const lease = await this.prisma.lease.findFirst({ where: scopedWhere });
    if (!lease) throw new NotFoundException('Lease not found');
    const data: any = { ...dto };
    if (dto.startDate) data.startDate = new Date(dto.startDate);
    if (dto.endDate) data.endDate = new Date(dto.endDate);
    if (dto.leaseTerms !== undefined) data.leaseTerms = dto.leaseTerms;
    if (dto.documents !== undefined) data.documents = dto.documents;
    const updated = await this.prisma.lease.update({ where: { id }, data, include: { unit: { select: { id: true, name: true } }, tenant: { select: { id: true, firstName: true, lastName: true } } } });
    return this.format(updated);
  }

  async remove(companyId: string, id: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const lease = await this.prisma.lease.findFirst({ where: scopedWhere });
    if (!lease) throw new NotFoundException('Lease not found');
    await this.prisma.lease.update({ where: { id }, data: { deletedAt: new Date(), status: 'TERMINATED' } });
    await this.prisma.unit.update({ where: { id: lease.unitId }, data: { status: 'VACANT' } });
    return { message: 'Lease terminated successfully' };
  }

  private format(l: any) {
    return { id: l.id, unitId: l.unitId, unit: l.unit, tenantId: l.tenantId, tenant: l.tenant, startDate: l.startDate, endDate: l.endDate, rentAmount: l.rentAmount, depositAmount: l.depositAmount, securityDeposit: l.securityDeposit, status: l.status, paymentDay: l.paymentDay, lateFeePercent: l.lateFeePercent, lateFeeFlat: l.lateFeeFlat, leaseTerms: l.leaseTerms, documents: l.documents, notes: l.notes, createdAt: l.createdAt, updatedAt: l.updatedAt };
  }
}
