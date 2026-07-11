"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantPortalController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const crypto_1 = require("crypto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const tenant_portal_service_1 = require("./tenant-portal.service");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
const MAX_MOVE_IN_PHOTOS = 12;
const IMAGE_EXTENSIONS = /\.(jpe?g|png|webp|gif|avif)$/i;
let TenantPortalController = class TenantPortalController {
    service;
    prisma;
    constructor(service, prisma) {
        this.service = service;
        this.prisma = prisma;
    }
    async resolveTenantId(companyId, userId) {
        const tenant = await this.prisma.tenant.findFirst({
            where: { companyId, userId, deletedAt: null },
            select: { id: true },
        });
        if (!tenant)
            throw new common_1.NotFoundException('Tenant profile not found. Contact your property manager.');
        return tenant.id;
    }
    async getMyLease(user) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.getMyLease(user.companyId, tenantId);
    }
    async getMyInvoices(user) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.getMyInvoices(user.companyId, tenantId);
    }
    async getMoveInPhotos(user) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.getMoveInPhotos(user.companyId, tenantId);
    }
    async uploadMoveInPhotos(user, files) {
        if (!files?.length)
            throw new common_1.BadRequestException('No files uploaded');
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        const urls = files.map((f) => `/uploads/move-in-photos/${f.filename}`);
        return this.service.addMoveInPhotos(user.companyId, tenantId, urls);
    }
    async getMyMaintenance(user) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.getMyMaintenanceRequests(user.companyId, tenantId);
    }
    async submitMaintenance(user, dto) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.submitMaintenanceRequest(user.companyId, tenantId, dto);
    }
    async getMyDocuments(user) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.getMyDocuments(user.companyId, tenantId);
    }
    async addMyDocument(user, dto) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.addMyDocument(user.companyId, tenantId, dto);
    }
    async uploadMyDocument(user, file, title, category) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.addMyDocument(user.companyId, tenantId, {
            title: title || file.originalname,
            category,
            url: `/uploads/tenant-documents/${file.filename}`,
        });
    }
    async removeMyDocument(user, id) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.removeMyDocument(user.companyId, tenantId, id);
    }
    async getMyRentalHistory(user) {
        const tenantId = await this.resolveTenantId(user.companyId, user.sub);
        return this.service.getMyRentalHistory(user.companyId, tenantId);
    }
};
exports.TenantPortalController = TenantPortalController;
__decorate([
    (0, common_1.Get)('lease'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my active lease' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "getMyLease", null);
__decorate([
    (0, common_1.Get)('invoices'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my invoices' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "getMyInvoices", null);
__decorate([
    (0, common_1.Get)('lease/move-in-photos'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my move-in photos' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "getMoveInPhotos", null);
__decorate([
    (0, common_1.Post)('lease/move-in-photos'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload move-in photos for my active lease' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', MAX_MOVE_IN_PHOTOS, {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'move-in-photos'),
            filename: (_req, file, cb) => {
                cb(null, `${(0, crypto_1.randomUUID)()}${(0, path_1.extname)(file.originalname).toLowerCase()}`);
            },
        }),
        limits: { fileSize: MAX_UPLOAD_BYTES },
        fileFilter: (_req, file, cb) => {
            if (!IMAGE_EXTENSIONS.test((0, path_1.extname)(file.originalname))) {
                return cb(new common_1.BadRequestException('Only image files are allowed (jpg, png, webp, gif, avif)'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "uploadMoveInPhotos", null);
__decorate([
    (0, common_1.Get)('maintenance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my maintenance requests' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "getMyMaintenance", null);
__decorate([
    (0, common_1.Post)('maintenance'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a maintenance request' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "submitMaintenance", null);
__decorate([
    (0, common_1.Get)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my documents' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "getMyDocuments", null);
__decorate([
    (0, common_1.Post)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a document to my profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "addMyDocument", null);
__decorate([
    (0, common_1.Post)('documents/upload'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a document file (image, PDF, docx, etc.) to my profile' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: (0, path_1.join)(process.cwd(), 'uploads', 'tenant-documents'),
            filename: (_req, file, cb) => {
                cb(null, `${(0, crypto_1.randomUUID)()}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
        limits: { fileSize: MAX_UPLOAD_BYTES },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('title')),
    __param(3, (0, common_1.Body)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "uploadMyDocument", null);
__decorate([
    (0, common_1.Delete)('documents/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove a document from my profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "removeMyDocument", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my rental résumé (completed stays with property, duration, and rating)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantPortalController.prototype, "getMyRentalHistory", null);
exports.TenantPortalController = TenantPortalController = __decorate([
    (0, swagger_1.ApiTags)('Tenant Portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.TENANT),
    (0, common_1.Controller)('tenants/me'),
    __metadata("design:paramtypes", [tenant_portal_service_1.TenantPortalService,
        prisma_service_1.PrismaService])
], TenantPortalController);
//# sourceMappingURL=tenant-portal.controller.js.map