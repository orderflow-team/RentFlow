import { Controller, Get, Post, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile, BadRequestException, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { TenantPortalService } from './tenant-portal.service';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from '../common/enums/role.enum';
import { RoleType } from '../common/enums/role.enum';

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15MB

@ApiTags('Tenant Portal')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RoleType.TENANT)
@Controller('tenants/me')
export class TenantPortalController {
  constructor(
    private service: TenantPortalService,
    private prisma: PrismaService,
  ) {}

  private async resolveTenantId(companyId: string, userId: string): Promise<string> {
    const tenant = await this.prisma.tenant.findFirst({
      where: { companyId, userId, deletedAt: null },
      select: { id: true },
    });
    if (!tenant) throw new NotFoundException('Tenant profile not found. Contact your property manager.');
    return tenant.id;
  }

  @Get('lease')
  @ApiOperation({ summary: 'Get my active lease' })
  async getMyLease(@CurrentUser() user: JwtPayload) {
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.getMyLease(user.companyId, tenantId);
  }

  @Get('invoices')
  @ApiOperation({ summary: 'Get my invoices' })
  async getMyInvoices(@CurrentUser() user: JwtPayload) {
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.getMyInvoices(user.companyId, tenantId);
  }

  @Get('maintenance')
  @ApiOperation({ summary: 'Get my maintenance requests' })
  async getMyMaintenance(@CurrentUser() user: JwtPayload) {
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.getMyMaintenanceRequests(user.companyId, tenantId);
  }

  @Post('maintenance')
  @ApiOperation({ summary: 'Submit a maintenance request' })
  async submitMaintenance(@CurrentUser() user: JwtPayload, @Body() dto: { title: string; description?: string; category?: string; priority?: string; unitId?: string }) {
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.submitMaintenanceRequest(user.companyId, tenantId, dto);
  }

  @Get('documents')
  @ApiOperation({ summary: 'Get my documents' })
  async getMyDocuments(@CurrentUser() user: JwtPayload) {
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.getMyDocuments(user.companyId, tenantId);
  }

  @Post('documents')
  @ApiOperation({ summary: 'Add a document to my profile' })
  async addMyDocument(@CurrentUser() user: JwtPayload, @Body() dto: { title: string; category?: string; url?: string }) {
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.addMyDocument(user.companyId, tenantId, dto);
  }

  @Post('documents/upload')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload a document file (image, PDF, docx, etc.) to my profile' })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads', 'tenant-documents'),
        filename: (_req, file, cb) => {
          cb(null, `${randomUUID()}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: MAX_UPLOAD_BYTES },
    }),
  )
  async uploadMyDocument(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
    @Body('title') title?: string,
    @Body('category') category?: string,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.addMyDocument(user.companyId, tenantId, {
      title: title || file.originalname,
      category,
      url: `/uploads/tenant-documents/${file.filename}`,
    });
  }

  @Delete('documents/:id')
  @ApiOperation({ summary: 'Remove a document from my profile' })
  async removeMyDocument(@CurrentUser() user: JwtPayload, @Param('id') id: string) {
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.removeMyDocument(user.companyId, tenantId, id);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get my rental résumé (completed stays with property, duration, and rating)' })
  async getMyRentalHistory(@CurrentUser() user: JwtPayload) {
    const tenantId = await this.resolveTenantId(user.companyId, user.sub);
    return this.service.getMyRentalHistory(user.companyId, tenantId);
  }
}
