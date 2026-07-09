import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Controller('tenants')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TenantsController {
  constructor(private readonly service: TenantsService) {}

  @Post() @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async create(@CurrentUser() u: JwtPayload, @Body() dto: CreateTenantDto) { return this.service.create(u.companyId, u, dto); }

  @Get() @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAll(@CurrentUser() u: JwtPayload, @Query('status') status?: string, @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.findAll(u.companyId, u, { status, search, page: page ? +page : undefined, limit: limit ? +limit : undefined });
  }

  @Get(':id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findOne(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.findOne(u.companyId, id, u); }

  @Patch(':id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async update(@CurrentUser() u: JwtPayload, @Param('id') id: string, @Body() dto: UpdateTenantDto) { return this.service.update(u.companyId, id, u, dto); }

  @Delete(':id') @Roles(RoleType.ADMIN)
  async remove(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.remove(u.companyId, id, u); }
}
