import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType } from '../../common/enums/role.enum';
import type { JwtPayload } from '../../common/enums/role.enum';
import { ApplicationStatus } from '@prisma/client';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly service: ApplicationsService) {}

  @Post(':propertyId/apply')
  @Roles(RoleType.TENANT)
  async apply(
    @CurrentUser() user: JwtPayload,
    @Param('propertyId') propertyId: string,
    @Body()
    dto: {
      unitId?: string;
      isFamily?: boolean;
      isMarried?: boolean;
      isLiveIn?: boolean;
      isStudent?: boolean;
      isProfessional?: boolean;
      hasPets?: boolean;
      isVegetarian?: boolean;
      isSmoker?: boolean;
    },
  ) {
    return this.service.apply(user.companyId, propertyId, user.email, dto);
  }

  @Get(':propertyId/applications')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async getQueue(
    @CurrentUser() user: JwtPayload,
    @Param('propertyId') propertyId: string,
  ) {
    return this.service.getQueue(user.companyId, propertyId);
  }

  @Patch('applications/:id/status')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async updateStatus(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: { status: ApplicationStatus },
  ) {
    return this.service.updateStatus(user.companyId, id, dto);
  }
}
