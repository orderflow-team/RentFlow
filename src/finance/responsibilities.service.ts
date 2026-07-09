import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RoleType, ResponsibilityStatus } from '@prisma/client';

@Injectable()
export class ResponsibilitiesService {
  constructor(private prisma: PrismaService) {}

  async create(
    companyId: string,
    dto: {
      leaseId: string;
      assignedTo: RoleType;
      title: string;
      description?: string;
      dueDate: string;
      reminder?: boolean;
    },
  ) {
    // Verify lease exists
    const lease = await this.prisma.lease.findFirst({
      where: { id: dto.leaseId, companyId, deletedAt: null },
    });
    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    if (dto.assignedTo !== RoleType.OWNER && dto.assignedTo !== RoleType.TENANT) {
      throw new BadRequestException('Responsibilities can only be assigned to OWNER or TENANT');
    }

    return this.prisma.responsibility.create({
      data: {
        companyId,
        leaseId: dto.leaseId,
        assignedTo: dto.assignedTo,
        title: dto.title,
        description: dto.description,
        dueDate: new Date(dto.dueDate),
        reminder: dto.reminder ?? false,
        status: ResponsibilityStatus.PENDING,
      },
    });
  }

  async findAll(companyId: string, leaseId: string, assignedTo?: RoleType) {
    const where: any = { companyId, leaseId };
    if (assignedTo) {
      where.assignedTo = assignedTo;
    }
    return this.prisma.responsibility.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });
  }

  async findOne(companyId: string, id: string) {
    const responsibility = await this.prisma.responsibility.findFirst({
      where: { id, companyId },
    });
    if (!responsibility) {
      throw new NotFoundException('Responsibility not found');
    }
    return responsibility;
  }

  async update(
    companyId: string,
    id: string,
    dto: {
      status?: ResponsibilityStatus;
      completed?: boolean;
    },
  ) {
    const responsibility = await this.prisma.responsibility.findFirst({
      where: { id, companyId },
    });
    if (!responsibility) {
      throw new NotFoundException('Responsibility not found');
    }

    const data: any = {};
    if (dto.status) {
      data.status = dto.status;
      if (dto.status === ResponsibilityStatus.COMPLETED) {
        data.completedAt = new Date();
      }
    }
    if (dto.completed !== undefined) {
      data.status = dto.completed
        ? ResponsibilityStatus.COMPLETED
        : ResponsibilityStatus.PENDING;
      data.completedAt = dto.completed ? new Date() : null;
    }

    return this.prisma.responsibility.update({
      where: { id },
      data,
    });
  }

  async remove(companyId: string, id: string) {
    const responsibility = await this.prisma.responsibility.findFirst({
      where: { id, companyId },
    });
    if (!responsibility) {
      throw new NotFoundException('Responsibility not found');
    }

    await this.prisma.responsibility.delete({
      where: { id },
    });

    return { message: 'Responsibility deleted successfully' };
  }
}
