import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, dto: CreateUserDto) {
    // Check if user already exists in this company
    const existing = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
        companyId,
      },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists in your company');
    }

    // Generate a temporary password
    const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    // Validate roles exist
    for (const roleType of dto.roles) {
      const role = await this.prisma.role.findUnique({
        where: { type: roleType },
      });
      if (!role) {
        throw new BadRequestException(`Role ${roleType} not found. Run seed first.`);
      }
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        status: 'INVITED',
        companyId,
        roles: {
          create: dto.roles.map((roleType) => ({
            role: { connect: { type: roleType } },
            companyId,
          })),
        },
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      status: user.status,
      roles: user.roles.map((ur) => ur.role.type),
      tempPassword, // In production, email this instead of returning
      createdAt: user.createdAt,
    };
  }

  async findAll(companyId: string) {
    const users = await this.prisma.user.findMany({
      where: { companyId, deletedAt: null },
      include: {
        roles: { include: { role: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      isOwner: user.isOwner,
      lastLoginAt: user.lastLoginAt,
      roles: user.roles.map((ur) => ({
        id: ur.role.id,
        type: ur.role.type,
        name: ur.role.name,
      })),
      createdAt: user.createdAt,
    }));
  }

  async findOne(companyId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId, deletedAt: null },
      include: {
        roles: { include: { role: true } },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status,
      isOwner: user.isOwner,
      lastLoginAt: user.lastLoginAt,
      roles: user.roles.map((ur) => ({
        id: ur.role.id,
        type: ur.role.type,
        name: ur.role.name,
      })),
      createdAt: user.createdAt,
    };
  }

  async update(companyId: string, userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update roles if provided (transactional for safety)
    if (dto.roles && dto.roles.length > 0) {
      const roles = dto.roles;
      await this.prisma.$transaction(async (tx) => {
        // Remove existing roles
        await tx.userRole.deleteMany({
          where: { userId, companyId },
        });

        // Add new roles
        for (const roleType of roles) {
          const role = await tx.role.findUnique({
            where: { type: roleType },
          });
          if (role) {
            await tx.userRole.create({
              data: {
                userId,
                roleId: role.id,
                companyId,
              },
            });
          }
        }
      });
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.firstName !== undefined && { firstName: dto.firstName }),
        ...(dto.lastName !== undefined && { lastName: dto.lastName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
      },
      include: {
        roles: { include: { role: true } },
      },
    });

    return {
      id: updated.id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phone: updated.phone,
      status: updated.status,
      roles: updated.roles.map((ur) => ur.role.type),
    };
  }

  async remove(companyId: string, userId: string) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId, companyId, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isOwner) {
      throw new BadRequestException('Cannot remove the company owner');
    }

    // Soft delete
    await this.prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date(), status: 'INACTIVE' },
    });

    return { message: 'User removed successfully' };
  }
}
