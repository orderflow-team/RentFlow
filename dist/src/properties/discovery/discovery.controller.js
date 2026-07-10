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
exports.DiscoveryController = void 0;
const common_1 = require("@nestjs/common");
const discovery_service_1 = require("./discovery.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const role_enum_1 = require("../../common/enums/role.enum");
const client_1 = require("@prisma/client");
let DiscoveryController = class DiscoveryController {
    service;
    constructor(service) {
        this.service = service;
    }
    async search(user, location, minBudget, maxBudget, type, furnishedStatus, occupancyType, isAvailableSoon) {
        return this.service.search(user.companyId, {
            location,
            minBudget: minBudget ? Number(minBudget) : undefined,
            maxBudget: maxBudget ? Number(maxBudget) : undefined,
            type,
            furnishedStatus,
            occupancyType,
            isAvailableSoon: isAvailableSoon === 'true',
        });
    }
    async getPropertyDetail(user, id) {
        return this.service.getPropertyDetail(user.companyId, id);
    }
    async joinWaitlist(user, id) {
        return this.service.joinWaitlist(user.companyId, id, user.email);
    }
};
exports.DiscoveryController = DiscoveryController;
__decorate([
    (0, common_1.Get)('search'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('location')),
    __param(2, (0, common_1.Query)('minBudget')),
    __param(3, (0, common_1.Query)('maxBudget')),
    __param(4, (0, common_1.Query)('type')),
    __param(5, (0, common_1.Query)('furnishedStatus')),
    __param(6, (0, common_1.Query)('occupancyType')),
    __param(7, (0, common_1.Query)('isAvailableSoon')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number, String, String, String, String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('properties/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "getPropertyDetail", null);
__decorate([
    (0, common_1.Post)('properties/:id/waitlist'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], DiscoveryController.prototype, "joinWaitlist", null);
exports.DiscoveryController = DiscoveryController = __decorate([
    (0, common_1.Controller)('discovery'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [discovery_service_1.DiscoveryService])
], DiscoveryController);
//# sourceMappingURL=discovery.controller.js.map