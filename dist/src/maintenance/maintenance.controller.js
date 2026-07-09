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
exports.MaintenanceController = void 0;
const common_1 = require("@nestjs/common");
const maintenance_service_1 = require("./maintenance.service");
const create_request_dto_1 = require("./dto/create-request.dto");
const create_vendor_dto_1 = require("./dto/create-vendor.dto");
const update_vendor_dto_1 = require("./dto/update-vendor.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const client_1 = require("@prisma/client");
let MaintenanceController = class MaintenanceController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createRequest(u, dto) { return this.service.createRequest(u.companyId, u, dto); }
    async findAllRequests(u, status, priority, page, limit) {
        return this.service.findAllRequests(u.companyId, u, { status, priority, page: page ? +page : undefined, limit: limit ? +limit : undefined });
    }
    async findOneRequest(u, id) { return this.service.findOneRequest(u.companyId, id, u); }
    async updateStatus(u, id, status, actualCost) {
        return this.service.updateStatus(u.companyId, id, u, status, actualCost);
    }
    async removeRequest(u, id) { return this.service.removeRequest(u.companyId, id, u); }
    async createVendor(u, dto) { return this.service.createVendor(u.companyId, dto); }
    async findAllVendors(u) { return this.service.findAllVendors(u.companyId); }
    async findOneVendor(u, id) { return this.service.findOneVendor(u.companyId, id); }
    async updateVendor(u, id, dto) { return this.service.updateVendor(u.companyId, id, dto); }
    async removeVendor(u, id) { return this.service.removeVendor(u.companyId, id); }
};
exports.MaintenanceController = MaintenanceController;
__decorate([
    (0, common_1.Post)('maintenance'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_request_dto_1.CreateRequestDto]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "createRequest", null);
__decorate([
    (0, common_1.Get)('maintenance'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('priority')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "findAllRequests", null);
__decorate([
    (0, common_1.Get)('maintenance/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "findOneRequest", null);
__decorate([
    (0, common_1.Patch)('maintenance/:id/status'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)('status')),
    __param(3, (0, common_1.Body)('actualCost')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Delete)('maintenance/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "removeRequest", null);
__decorate([
    (0, common_1.Post)('vendors'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_vendor_dto_1.CreateVendorDto]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "createVendor", null);
__decorate([
    (0, common_1.Get)('vendors'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "findAllVendors", null);
__decorate([
    (0, common_1.Get)('vendors/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "findOneVendor", null);
__decorate([
    (0, common_1.Patch)('vendors/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_vendor_dto_1.UpdateVendorDto]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "updateVendor", null);
__decorate([
    (0, common_1.Delete)('vendors/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MaintenanceController.prototype, "removeVendor", null);
exports.MaintenanceController = MaintenanceController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [maintenance_service_1.MaintenanceService])
], MaintenanceController);
//# sourceMappingURL=maintenance.controller.js.map