import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get('occupancy') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT)
  async getOccupancy(@CurrentUser() u: JwtPayload) {
    return this.service.getOccupancyReport(u.companyId);
  }

  @Get('financial') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT)
  async getFinancial(@CurrentUser() u: JwtPayload, @Query('year') year?: string) {
    return this.service.getFinancialReport(u.companyId, year ? +year : undefined);
  }

  @Get('maintenance') @Roles(RoleType.ADMIN, RoleType.MANAGER)
  async getMaintenance(@CurrentUser() u: JwtPayload) {
    return this.service.getMaintenanceReport(u.companyId);
  }

  @Get('dashboard') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT)
  async getDashboard(@CurrentUser() u: JwtPayload) {
    return this.service.getDashboardSummary(u.companyId);
  }
}
