import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ResponsibilitiesService } from './responsibilities.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';
import { RoleType as PrismaRoleType, ResponsibilityStatus } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResponsibilitiesController {
  constructor(private readonly service: ResponsibilitiesService) {}

  @Post('leases/:leaseId/responsibilities')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async create(
    @CurrentUser() user: JwtPayload,
    @Param('leaseId') leaseId: string,
    @Body()
    dto: {
      assignedTo: PrismaRoleType;
      title: string;
      description?: string;
      dueDate: string;
      reminder?: boolean;
    },
  ) {
    return this.service.create(user.companyId, {
      ...dto,
      leaseId,
    });
  }

  @Get('leases/:leaseId/responsibilities')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER, RoleType.TENANT)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Param('leaseId') leaseId: string,
    @Query('assignedTo') assignedTo?: PrismaRoleType,
  ) {
    return this.service.findAll(user.companyId, leaseId, assignedTo);
  }

  @Get('responsibilities/:id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER, RoleType.TENANT)
  async findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.findOne(user.companyId, id);
  }

  @Patch('responsibilities/:id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER, RoleType.TENANT)
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body()
    dto: {
      status?: ResponsibilityStatus;
      completed?: boolean;
    },
  ) {
    return this.service.update(user.companyId, id, dto);
  }

  @Delete('responsibilities/:id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.service.remove(user.companyId, id);
  }
}
