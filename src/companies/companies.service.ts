import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async findById(companyId: string) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return {
      id: company.id,
      name: company.name,
      slug: company.slug,
      email: company.email,
      phone: company.phone,
      address: company.address,
      logo: company.logo,
      status: company.status,
      timezone: company.timezone,
      locale: company.locale,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  async update(companyId: string, dto: CreateCompanyDto) {
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const updated = await this.prisma.company.update({
      where: { id: companyId },
      data: {
        name: dto.name ?? company.name,
        email: dto.email ?? company.email,
        phone: dto.phone ?? company.phone,
        address: dto.address ?? company.address,
      },
    });

    return {
      id: updated.id,
      name: updated.name,
      slug: updated.slug,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      status: updated.status,
      updatedAt: updated.updatedAt,
    };
  }
}
