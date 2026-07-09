import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Controller('companies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('current')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER, RoleType.TENANT)
  async getCurrent(@CurrentUser() user: JwtPayload) {
    return this.companiesService.findById(user.companyId);
  }

  @Patch('current')
  @Roles(RoleType.ADMIN)
  async update(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateCompanyDto,
  ) {
    return this.companiesService.update(user.companyId, dto);
  }
}
