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
exports.OwnersController = void 0;
const common_1 = require("@nestjs/common");
const owners_service_1 = require("./owners.service");
const create_owner_dto_1 = require("./dto/create-owner.dto");
const update_owner_dto_1 = require("./dto/update-owner.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let OwnersController = class OwnersController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(u, dto) { return this.service.create(u.companyId, dto); }
    async findAll(u, status, search, page, limit) {
        return this.service.findAll(u.companyId, { status, search, page: page ? +page : undefined, limit: limit ? +limit : undefined });
    }
    async findOne(u, id) { return this.service.findOne(u.companyId, id); }
    async update(u, id, dto) { return this.service.update(u.companyId, id, dto); }
    async remove(u, id) { return this.service.remove(u.companyId, id); }
};
exports.OwnersController = OwnersController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_owner_dto_1.CreateOwnerDto]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_owner_dto_1.UpdateOwnerDto]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OwnersController.prototype, "remove", null);
exports.OwnersController = OwnersController = __decorate([
    (0, common_1.Controller)('owners'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [owners_service_1.OwnersService])
], OwnersController);
//# sourceMappingURL=owners.controller.js.map