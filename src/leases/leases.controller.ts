import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LeasesService } from './leases.service';
import { LifecycleService } from './lifecycle.service';
import { CreateLeaseDto } from './dto/create-lease.dto';
import { UpdateLeaseDto } from './dto/update-lease.dto';
import { AssignTenantByPhoneDto } from './dto/assign-tenant-by-phone.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Controller('leases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeasesController {
  constructor(
    private readonly service: LeasesService,
    private readonly lifecycleService: LifecycleService,
  ) {}

  @Post() @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async create(@CurrentUser() u: JwtPayload, @Body() dto: CreateLeaseDto) { return this.service.create(u.companyId, u, dto); }

  @Post('assign-by-phone') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async assignByPhone(@CurrentUser() u: JwtPayload, @Body() dto: AssignTenantByPhoneDto) {
    return this.service.assignTenantByPhone(u.companyId, u, dto);
  }

  @Get() @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAll(@CurrentUser() u: JwtPayload, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.findAll(u.companyId, u, { status, page: page ? +page : undefined, limit: limit ? +limit : undefined }); }

  @Get(':id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER, RoleType.TENANT)
  async findOne(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.findOne(u.companyId, id, u); }

  @Patch(':id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async update(@CurrentUser() u: JwtPayload, @Param('id') id: string, @Body() dto: UpdateLeaseDto) { return this.service.update(u.companyId, id, u, dto); }

  @Delete(':id') @Roles(RoleType.ADMIN)
  async remove(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.remove(u.companyId, id, u); }

  @Get(':id/lifecycle') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER, RoleType.TENANT)
  async getLifecycle(@CurrentUser() u: JwtPayload, @Param('id') id: string) {
    return this.lifecycleService.getLifecycle(u.companyId, id);
  }

  @Patch(':id/lifecycle') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER, RoleType.TENANT)
  async updateLifecycle(
    @CurrentUser() u: JwtPayload,
    @Param('id') id: string,
    @Body() dto: {
      moveInAgreementSigned?: boolean;
      moveInDepositReceived?: boolean;
      moveInKycCompleted?: boolean;
      moveInPhotosUploaded?: boolean;
      moveInKeyHandover?: boolean;
      moveOutInspection?: boolean;
      moveOutKeyReturn?: boolean;
      moveOutDepositSettlement?: boolean;
      moveOutExitDoc?: boolean;
      communicationLog?: any;
    },
  ) {
    return this.lifecycleService.updateLifecycle(u.companyId, id, dto);
  }
}
