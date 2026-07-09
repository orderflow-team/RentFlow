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
exports.ResponsibilitiesController = void 0;
const common_1 = require("@nestjs/common");
const responsibilities_service_1 = require("./responsibilities.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const client_1 = require("@prisma/client");
let ResponsibilitiesController = class ResponsibilitiesController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(user, leaseId, dto) {
        return this.service.create(user.companyId, {
            ...dto,
            leaseId,
        });
    }
    async findAll(user, leaseId, assignedTo) {
        return this.service.findAll(user.companyId, leaseId, assignedTo);
    }
    async findOne(user, id) {
        return this.service.findOne(user.companyId, id);
    }
    async update(user, id, dto) {
        return this.service.update(user.companyId, id, dto);
    }
    async remove(user, id) {
        return this.service.remove(user.companyId, id);
    }
};
exports.ResponsibilitiesController = ResponsibilitiesController;
__decorate([
    (0, common_1.Post)('leases/:leaseId/responsibilities'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('leaseId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ResponsibilitiesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('leases/:leaseId/responsibilities'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('leaseId')),
    __param(2, (0, common_1.Query)('assignedTo')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], ResponsibilitiesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('responsibilities/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ResponsibilitiesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('responsibilities/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ResponsibilitiesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('responsibilities/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ResponsibilitiesController.prototype, "remove", null);
exports.ResponsibilitiesController = ResponsibilitiesController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [responsibilities_service_1.ResponsibilitiesService])
], ResponsibilitiesController);
//# sourceMappingURL=responsibilities.controller.js.map