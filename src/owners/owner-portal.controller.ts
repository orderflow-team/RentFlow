import { Controller, Get, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OwnerPortalService } from './owner-portal.service';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../common/enums/role.enum';
import { RoleType } from '../common/enums/role.enum';

@ApiTags('Owner Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.OWNER)
@Controller('owners/me')
export class OwnerPortalController {
  constructor(
    private service: OwnerPortalService,
    private prisma: PrismaService,
  ) {}

  private async resolveOwnerId(companyId: string, userId: string): Promise<string> {
    const owner = await this.prisma.owner.findFirst({
      where: { companyId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!owner) throw new NotFoundException('Owner profile not found. Contact your property manager.');
    return owner.id;
  }

  @Get('properties')
  @ApiOperation({ summary: 'Get my properties with units' })
  async getMyProperties(@CurrentUser() user: JwtPayload) {
    const ownerId = await this.resolveOwnerId(user.companyId, user.sub);
    return this.service.getMyProperties(user.companyId, ownerId);
  }

  @Get('financials')
  @ApiOperation({ summary: 'Get financial summary for my properties' })
  async getMyFinancials(@CurrentUser() user: JwtPayload) {
    const ownerId = await this.resolveOwnerId(user.companyId, user.sub);
    return this.service.getMyFinancialSummary(user.companyId, ownerId);
  }
}
