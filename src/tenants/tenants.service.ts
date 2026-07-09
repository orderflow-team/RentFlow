import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';
import { normalizePhone } from '../common/utils/phone.util';
import { findOrCreatePhoneUser } from '../common/utils/phone-account.util';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

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
        where.leases = {
          some: {
            unit: {
              building: {
                property: {
                  ownerId: owner.id,
                  deletedAt: null,
                },
              },
            },
            deletedAt: null,
          },
        };
      } else {
        where.id = 'non-existent-id';
      }
      return where;
    }

    if (user.roles.includes(RoleType.MANAGER)) {
      where.leases = {
        some: {
          unit: {
            building: {
              property: {
                managerId: user.sub,
                deletedAt: null,
              },
            },
          },
          deletedAt: null,
        },
      };
      return where;
    }

    where.id = 'non-existent-id';
    return where;
  }

  async create(companyId: string, user: JwtPayload, dto: CreateTenantDto) {
    const existing = await this.prisma.tenant.findUnique({ where: { companyId_email: { companyId, email: dto.email } } });
    if (existing) throw new ConflictException('Tenant with this email already exists');
    const tenant = await this.prisma.tenant.create({ data: { ...dto, companyId, emergencyContact: dto.emergencyContact || undefined, documents: dto.documents || undefined } });
    return this.format(tenant);
  }

  async findOrCreateByPhone(
    companyId: string,
    dto: { phone: string; firstName?: string; lastName?: string; email?: string },
  ) {
    const phone = normalizePhone(dto.phone);

    const tenantUser = await findOrCreatePhoneUser(this.prisma, {
      companyId,
      phone,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleType: RoleType.TENANT,
    });

    const existingTenant = await this.prisma.tenant.findFirst({
      where: { companyId, userId: tenantUser.id, deletedAt: null },
    });
    if (existingTenant) {
      return this.format(existingTenant);
    }

    const email = dto.email || tenantUser.email;
    const emailTaken = await this.prisma.tenant.findUnique({
      where: { companyId_email: { companyId, email } },
    });
    if (emailTaken) {
      throw new ConflictException('A tenant with this email already exists');
    }

    const tenant = await this.prisma.tenant.create({
      data: {
        companyId,
        userId: tenantUser.id,
        firstName: tenantUser.firstName,
        lastName: tenantUser.lastName,
        email,
        phone,
      },
    });

    return this.format(tenant);
  }

  async findAll(companyId: string, user: JwtPayload, filters?: { status?: string; search?: string; page?: number; limit?: number }) {
    const where = await this.getScopedWhereClause(companyId, user);
    if (filters?.status) where.status = filters.status;
    if (filters?.search) {
      where.AND = [
        ...(where.AND || []),
        {
          OR: [
            { firstName: { contains: filters.search, mode: 'insensitive' } },
            { lastName: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } }
          ]
        }
      ];
    }
    const page = filters?.page || 1;
    const limit = filters?.limit || 50;
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.tenant.count({ where }),
    ]);
    return { data: data.map(t => this.format(t)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(companyId: string, id: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const tenant = await this.prisma.tenant.findFirst({ where: scopedWhere });
    if (!tenant) throw new NotFoundException('Tenant not found');
    return this.format(tenant);
  }

  async update(companyId: string, id: string, user: JwtPayload, dto: UpdateTenantDto) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const tenant = await this.prisma.tenant.findFirst({ where: scopedWhere });
    if (!tenant) throw new NotFoundException('Tenant not found');
    const updated = await this.prisma.tenant.update({ where: { id }, data: { ...dto, emergencyContact: dto.emergencyContact !== undefined ? dto.emergencyContact : undefined, documents: dto.documents !== undefined ? dto.documents : undefined } });
    return this.format(updated);
  }

  async remove(companyId: string, id: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedWhereClause(companyId, user);
    scopedWhere.id = id;
    const tenant = await this.prisma.tenant.findFirst({ where: scopedWhere });
    if (!tenant) throw new NotFoundException('Tenant not found');
    await this.prisma.tenant.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Tenant deleted successfully' };
  }

  private format(t: any) {
    return { id: t.id, firstName: t.firstName, lastName: t.lastName, email: t.email, phone: t.phone, status: t.status, emergencyContact: t.emergencyContact, notes: t.notes, documents: t.documents, createdAt: t.createdAt, updatedAt: t.updatedAt };
  }
}
