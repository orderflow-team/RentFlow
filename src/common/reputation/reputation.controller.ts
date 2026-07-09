import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { RoleType } from '../enums/role.enum';
import type { JwtPayload } from '../enums/role.enum';

@Controller('reputation')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReputationController {
  constructor(private readonly service: ReputationService) {}

  @Post('leases/:leaseId/reviews')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER, RoleType.TENANT)
  async submitReview(
    @CurrentUser() user: JwtPayload,
    @Param('leaseId') leaseId: string,
    @Body()
    dto: {
      targetType: 'TENANT' | 'OWNER' | 'PROPERTY' | 'COMMUNITY';
      targetId: string;
      scores: Record<string, number>;
      comment?: string;
    },
  ) {
    return this.service.submitReview(user.companyId, user.sub, leaseId, dto);
  }

  @Get('reviews')
  @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.OWNER, RoleType.TENANT)
  async getReviews(
    @CurrentUser() user: JwtPayload,
    @Query('targetType') targetType: 'TENANT' | 'OWNER' | 'PROPERTY' | 'COMMUNITY',
    @Query('targetId') targetId: string,
  ) {
    return this.service.getReviewsForTarget(
      user.companyId,
      user.sub,
      targetType,
      targetId,
    );
  }

  @Patch('privacy')
  @Roles(RoleType.OWNER, RoleType.TENANT)
  async togglePrivacy(
    @CurrentUser() user: JwtPayload,
    @Body() dto: { type: 'TENANT' | 'OWNER'; isPublic: boolean },
  ) {
    return this.service.togglePrivacy(user.companyId, user.sub, dto.type, dto.isPublic);
  }
}
