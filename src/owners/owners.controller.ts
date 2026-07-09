import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Controller('owners')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OwnersController {
  constructor(private readonly service: OwnersService) {}

  @Post() @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async create(@CurrentUser() u: JwtPayload, @Body() dto: CreateOwnerDto) { return this.service.create(u.companyId, dto); }

  @Get() @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT)
  async findAll(@CurrentUser() u: JwtPayload, @Query('status') status?: string, @Query('search') search?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.findAll(u.companyId, { status, search, page: page ? +page : undefined, limit: limit ? +limit : undefined }); }

  @Get(':id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT)
  async findOne(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.findOne(u.companyId, id); }

  @Patch(':id') @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async update(@CurrentUser() u: JwtPayload, @Param('id') id: string, @Body() dto: UpdateOwnerDto) { return this.service.update(u.companyId, id, dto); }

  @Delete(':id') @Roles(RoleType.ADMIN)
  async remove(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.remove(u.companyId, id); }
}
