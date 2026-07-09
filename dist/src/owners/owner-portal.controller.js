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
exports.OwnerPortalController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const owner_portal_service_1 = require("./owner-portal.service");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
let OwnerPortalController = class OwnerPortalController {
    service;
    prisma;
    constructor(service, prisma) {
        this.service = service;
        this.prisma = prisma;
    }
    async resolveOwnerId(companyId, userId) {
        const owner = await this.prisma.owner.findFirst({
            where: { companyId, userId, deletedAt: null },
            select: { id: true },
        });
        if (!owner)
            throw new common_1.NotFoundException('Owner profile not found. Contact your property manager.');
        return owner.id;
    }
    async getMyProperties(user) {
        const ownerId = await this.resolveOwnerId(user.companyId, user.sub);
        return this.service.getMyProperties(user.companyId, ownerId);
    }
    async getMyFinancials(user) {
        const ownerId = await this.resolveOwnerId(user.companyId, user.sub);
        return this.service.getMyFinancialSummary(user.companyId, ownerId);
    }
};
exports.OwnerPortalController = OwnerPortalController;
__decorate([
    (0, common_1.Get)('properties'),
    (0, swagger_1.ApiOperation)({ summary: 'Get my properties with units' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerPortalController.prototype, "getMyProperties", null);
__decorate([
    (0, common_1.Get)('financials'),
    (0, swagger_1.ApiOperation)({ summary: 'Get financial summary for my properties' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OwnerPortalController.prototype, "getMyFinancials", null);
exports.OwnerPortalController = OwnerPortalController = __decorate([
    (0, swagger_1.ApiTags)('Owner Portal'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.OWNER),
    (0, common_1.Controller)('owners/me'),
    __metadata("design:paramtypes", [owner_portal_service_1.OwnerPortalService,
        prisma_service_1.PrismaService])
], OwnerPortalController);
//# sourceMappingURL=owner-portal.controller.js.map