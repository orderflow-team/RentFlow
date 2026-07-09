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
exports.ReputationController = void 0;
const common_1 = require("@nestjs/common");
const reputation_service_1 = require("./reputation.service");
const jwt_auth_guard_1 = require("../guards/jwt-auth.guard");
const roles_guard_1 = require("../guards/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const role_enum_1 = require("../enums/role.enum");
let ReputationController = class ReputationController {
    service;
    constructor(service) {
        this.service = service;
    }
    async submitReview(user, leaseId, dto) {
        return this.service.submitReview(user.companyId, user.sub, leaseId, dto);
    }
    async getReviews(user, targetType, targetId) {
        return this.service.getReviewsForTarget(user.companyId, user.sub, targetType, targetId);
    }
    async togglePrivacy(user, dto) {
        return this.service.togglePrivacy(user.companyId, user.sub, dto.type, dto.isPublic);
    }
};
exports.ReputationController = ReputationController;
__decorate([
    (0, common_1.Post)('leases/:leaseId/reviews'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('leaseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "submitReview", null);
__decorate([
    (0, common_1.Get)('reviews'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('targetType')),
    __param(2, (0, common_1.Query)('targetId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Patch)('privacy'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReputationController.prototype, "togglePrivacy", null);
exports.ReputationController = ReputationController = __decorate([
    (0, common_1.Controller)('reputation'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [reputation_service_1.ReputationService])
], ReputationController);
//# sourceMappingURL=reputation.controller.js.map