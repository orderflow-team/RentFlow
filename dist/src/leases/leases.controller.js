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
exports.LeasesController = void 0;
const common_1 = require("@nestjs/common");
const leases_service_1 = require("./leases.service");
const lifecycle_service_1 = require("./lifecycle.service");
const create_lease_dto_1 = require("./dto/create-lease.dto");
const update_lease_dto_1 = require("./dto/update-lease.dto");
const assign_tenant_by_phone_dto_1 = require("./dto/assign-tenant-by-phone.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let LeasesController = class LeasesController {
    service;
    lifecycleService;
    constructor(service, lifecycleService) {
        this.service = service;
        this.lifecycleService = lifecycleService;
    }
    async create(u, dto) { return this.service.create(u.companyId, u, dto); }
    async assignByPhone(u, dto) {
        return this.service.assignTenantByPhone(u.companyId, u, dto);
    }
    async findAll(u, status, page, limit) {
        return this.service.findAll(u.companyId, u, { status, page: page ? +page : undefined, limit: limit ? +limit : undefined });
    }
    async findOne(u, id) { return this.service.findOne(u.companyId, id, u); }
    async update(u, id, dto) { return this.service.update(u.companyId, id, u, dto); }
    async remove(u, id) { return this.service.remove(u.companyId, id, u); }
    async getLifecycle(u, id) {
        return this.lifecycleService.getLifecycle(u.companyId, id);
    }
    async updateLifecycle(u, id, dto) {
        return this.lifecycleService.updateLifecycle(u.companyId, id, dto);
    }
};
exports.LeasesController = LeasesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_lease_dto_1.CreateLeaseDto]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('assign-by-phone'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, assign_tenant_by_phone_dto_1.AssignTenantByPhoneDto]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "assignByPhone", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_lease_dto_1.UpdateLeaseDto]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)(':id/lifecycle'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "getLifecycle", null);
__decorate([
    (0, common_1.Patch)(':id/lifecycle'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER, role_enum_1.RoleType.TENANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], LeasesController.prototype, "updateLifecycle", null);
exports.LeasesController = LeasesController = __decorate([
    (0, common_1.Controller)('leases'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [leases_service_1.LeasesService,
        lifecycle_service_1.LifecycleService])
], LeasesController);
//# sourceMappingURL=leases.controller.js.map