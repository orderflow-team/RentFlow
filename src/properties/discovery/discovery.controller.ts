import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleType } from '../../common/enums/role.enum';
import type { JwtPayload } from '../../common/enums/role.enum';
import { PropertyType, ListingType } from '@prisma/client';

@Controller('discovery')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DiscoveryController {
  constructor(private readonly service: DiscoveryService) {}

  @Get('search')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER, RoleType.TENANT)
  async search(
    @CurrentUser() user: JwtPayload,
    @Query('location') location?: string,
    @Query('minBudget') minBudget?: number,
    @Query('maxBudget') maxBudget?: number,
    @Query('type') type?: PropertyType,
    @Query('furnishedStatus') furnishedStatus?: string,
    @Query('occupancyType') occupancyType?: string,
    @Query('isAvailableSoon') isAvailableSoon?: string,
    @Query('listingType') listingType?: ListingType,
  ) {
    return this.service.search(user.companyId, {
      location,
      minBudget: minBudget ? Number(minBudget) : undefined,
      maxBudget: maxBudget ? Number(maxBudget) : undefined,
      type,
      furnishedStatus,
      occupancyType,
      isAvailableSoon: isAvailableSoon === 'true',
      listingType,
    });
  }

  @Get('properties/:id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER, RoleType.TENANT)
  async getPropertyDetail(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.service.getPropertyDetail(user.companyId, id);
  }

  @Post('properties/:id/waitlist')
  @Roles(RoleType.TENANT)
  async joinWaitlist(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    return this.service.joinWaitlist(user.companyId, id, user.email);
  }
}
