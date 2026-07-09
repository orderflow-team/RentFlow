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
import { PropertiesService } from './properties.service';
import { PassportService } from './passport/passport.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { AssignManagerDto } from './dto/assign-manager.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Controller('properties')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly passportService: PassportService,
  ) {}

  // ─── Properties CRUD ─────────────────────────────────────────────────────

  @Post()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async create(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreatePropertyDto,
  ) {
    return this.propertiesService.create(user.companyId, user, dto);
  }

  @Get()
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAll(
    @CurrentUser() user: JwtPayload,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.propertiesService.findAll(user.companyId, user, {
      status,
      type,
      search,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findOne(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.propertiesService.findOne(user.companyId, id, user);
  }

  @Get(':id/passport')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER, RoleType.TENANT)
  async getPassport(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.passportService.getPassport(user.companyId, id);
  }

  @Patch(':id')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async update(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(user.companyId, id, user, dto);
  }

  @Delete(':id')
  @Roles(RoleType.ADMIN)
  async remove(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    return this.propertiesService.remove(user.companyId, id, user);
  }

  @Patch(':id/manager')
  @Roles(RoleType.ADMIN, RoleType.OWNER)
  async assignManager(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
    @Body() dto: AssignManagerDto,
  ) {
    return this.propertiesService.assignManager(user.companyId, user, id, dto);
  }

  // ─── Buildings (nested under properties) ─────────────────────────────────

  @Post(':propertyId/buildings')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async createBuilding(
    @CurrentUser() user: JwtPayload,
    @Param('propertyId') propertyId: string,
    @Body() dto: CreateBuildingDto,
  ) {
    return this.propertiesService.createBuilding(
      user.companyId,
      propertyId,
      dto,
    );
  }

  @Get(':propertyId/buildings')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAllBuildings(
    @CurrentUser() user: JwtPayload,
    @Param('propertyId') propertyId: string,
  ) {
    return this.propertiesService.findAllBuildings(user.companyId, propertyId);
  }

  @Get('buildings/:buildingId')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findOneBuilding(
    @CurrentUser() user: JwtPayload,
    @Param('buildingId') buildingId: string,
  ) {
    return this.propertiesService.findOneBuilding(user.companyId, buildingId);
  }

  @Patch('buildings/:buildingId')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async updateBuilding(
    @CurrentUser() user: JwtPayload,
    @Param('buildingId') buildingId: string,
    @Body() dto: UpdateBuildingDto,
  ) {
    return this.propertiesService.updateBuilding(
      user.companyId,
      buildingId,
      dto,
    );
  }

  @Delete('buildings/:buildingId')
  @Roles(RoleType.ADMIN)
  async removeBuilding(
    @CurrentUser() user: JwtPayload,
    @Param('buildingId') buildingId: string,
  ) {
    return this.propertiesService.removeBuilding(user.companyId, buildingId);
  }

  // ─── Units (nested under buildings) ──────────────────────────────────────

  @Post('buildings/:buildingId/units')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async createUnit(
    @CurrentUser() user: JwtPayload,
    @Param('buildingId') buildingId: string,
    @Body() dto: CreateUnitDto,
  ) {
    return this.propertiesService.createUnit(user.companyId, buildingId, dto);
  }

  @Get('buildings/:buildingId/units')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAllUnits(
    @CurrentUser() user: JwtPayload,
    @Param('buildingId') buildingId: string,
    @Query('status') status?: string,
  ) {
    return this.propertiesService.findAllUnits(user.companyId, buildingId, {
      status,
    });
  }

  @Get('units/:unitId')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findOneUnit(
    @CurrentUser() user: JwtPayload,
    @Param('unitId') unitId: string,
  ) {
    return this.propertiesService.findOneUnit(user.companyId, unitId);
  }

  @Patch('units/:unitId')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER)
  async updateUnit(
    @CurrentUser() user: JwtPayload,
    @Param('unitId') unitId: string,
    @Body() dto: UpdateUnitDto,
  ) {
    return this.propertiesService.updateUnit(user.companyId, unitId, dto);
  }

  @Delete('units/:unitId')
  @Roles(RoleType.ADMIN)
  async removeUnit(
    @CurrentUser() user: JwtPayload,
    @Param('unitId') unitId: string,
  ) {
    return this.propertiesService.removeUnit(user.companyId, unitId);
  }
}
