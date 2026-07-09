import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateOwnerDto) {
    const existing = await this.prisma.owner.findUnique({ where: { companyId_email: { companyId, email: dto.email } } });
    if (existing) throw new ConflictException('Owner with this email already exists');
    const owner = await this.prisma.owner.create({ data: { ...dto, companyId } });
    return this.format(owner);
  }

  async findAll(companyId: string, filters?: { status?: string; search?: string; page?: number; limit?: number }) {
    const where: any = { companyId, deletedAt: null };
    if (filters?.status) where.status = filters.status;
    if (filters?.search) where.OR = [{ firstName: { contains: filters.search, mode: 'insensitive' } }, { lastName: { contains: filters.search, mode: 'insensitive' } }, { email: { contains: filters.search, mode: 'insensitive' } }];
    const page = filters?.page || 1; const limit = filters?.limit || 50; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([this.prisma.owner.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }), this.prisma.owner.count({ where })]);
    return { data: data.map(o => this.format(o)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(companyId: string, id: string) {
    const owner = await this.prisma.owner.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!owner) throw new NotFoundException('Owner not found');
    return this.format(owner);
  }

  async update(companyId: string, id: string, dto: UpdateOwnerDto) {
    const owner = await this.prisma.owner.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!owner) throw new NotFoundException('Owner not found');
    const updated = await this.prisma.owner.update({ where: { id }, data: dto });
    return this.format(updated);
  }

  async remove(companyId: string, id: string) {
    const owner = await this.prisma.owner.findFirst({ where: { id, companyId, deletedAt: null } });
    if (!owner) throw new NotFoundException('Owner not found');
    await this.prisma.owner.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Owner deleted successfully' };
  }

  private format(o: any) { return { id: o.id, firstName: o.firstName, lastName: o.lastName, email: o.email, phone: o.phone, status: o.status, notes: o.notes, createdAt: o.createdAt, updatedAt: o.updatedAt }; }
}
