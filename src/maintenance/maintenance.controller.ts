import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';
import { MaintenanceStatus } from '@prisma/client';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaintenanceController {
  constructor(private readonly service: MaintenanceService) {}

  @Post('maintenance') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async createRequest(@CurrentUser() u: JwtPayload, @Body() dto: CreateRequestDto) { return this.service.createRequest(u.companyId, u, dto); }

  @Get('maintenance') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAllRequests(@CurrentUser() u: JwtPayload, @Query('status') status?: string, @Query('priority') priority?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.findAllRequests(u.companyId, u, { status, priority, page: page ? +page : undefined, limit: limit ? +limit : undefined }); }

  @Get('maintenance/:id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findOneRequest(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.findOneRequest(u.companyId, id, u); }

  @Patch('maintenance/:id/status') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async updateStatus(@CurrentUser() u: JwtPayload, @Param('id') id: string, @Body('status') status: MaintenanceStatus, @Body('actualCost') actualCost?: number) {
    return this.service.updateStatus(u.companyId, id, u, status, actualCost); }

  @Delete('maintenance/:id') @Roles(RoleType.ADMIN)
  async removeRequest(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.removeRequest(u.companyId, id, u); }

  @Post('vendors') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async createVendor(@CurrentUser() u: JwtPayload, @Body() dto: CreateVendorDto) { return this.service.createVendor(u.companyId, dto); }

  @Get('vendors') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAllVendors(@CurrentUser() u: JwtPayload) { return this.service.findAllVendors(u.companyId); }

  @Get('vendors/:id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findOneVendor(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.findOneVendor(u.companyId, id); }

  @Patch('vendors/:id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async updateVendor(@CurrentUser() u: JwtPayload, @Param('id') id: string, @Body() dto: UpdateVendorDto) { return this.service.updateVendor(u.companyId, id, dto); }

  @Delete('vendors/:id') @Roles(RoleType.ADMIN)
  async removeVendor(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.removeVendor(u.companyId, id); }
}
