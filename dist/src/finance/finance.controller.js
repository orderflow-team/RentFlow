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
exports.FinanceController = void 0;
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const create_invoice_dto_1 = require("./dto/create-invoice.dto");
const record_payment_dto_1 = require("./dto/record-payment.dto");
const create_expense_dto_1 = require("./dto/create-expense.dto");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const role_enum_1 = require("../common/enums/role.enum");
let FinanceController = class FinanceController {
    service;
    constructor(service) {
        this.service = service;
    }
    async createInvoice(u, dto) { return this.service.createInvoice(u.companyId, u, dto); }
    async findAllInvoices(u, status, page, limit) {
        return this.service.findAllInvoices(u.companyId, u, { status, page: page ? +page : undefined, limit: limit ? +limit : undefined });
    }
    async findOneInvoice(u, id) { return this.service.findOneInvoice(u.companyId, id, u); }
    async recordPayment(u, id, dto) { return this.service.recordPayment(u.companyId, id, u, dto); }
    async getPayments(u, id) { return this.service.getPaymentHistory(u.companyId, id, u); }
    async createExpense(u, dto) { return this.service.createExpense(u.companyId, u, dto); }
    async findAllExpenses(u, category, propertyId, page, limit) {
        return this.service.findAllExpenses(u.companyId, u, { category, propertyId, page: page ? +page : undefined, limit: limit ? +limit : undefined });
    }
    async removeExpense(u, id) { return this.service.removeExpense(u.companyId, id, u); }
};
exports.FinanceController = FinanceController;
__decorate([
    (0, common_1.Post)('invoices'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_invoice_dto_1.CreateInvoiceDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('invoices'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Number, Number]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "findAllInvoices", null);
__decorate([
    (0, common_1.Get)('invoices/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "findOneInvoice", null);
__decorate([
    (0, common_1.Post)('invoices/:id/payments'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, record_payment_dto_1.RecordPaymentDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "recordPayment", null);
__decorate([
    (0, common_1.Get)('invoices/:id/payments'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "getPayments", null);
__decorate([
    (0, common_1.Post)('expenses'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_expense_dto_1.CreateExpenseDto]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "createExpense", null);
__decorate([
    (0, common_1.Get)('expenses'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN, role_enum_1.RoleType.MANAGER, role_enum_1.RoleType.ACCOUNTANT, role_enum_1.RoleType.OWNER),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('propertyId')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "findAllExpenses", null);
__decorate([
    (0, common_1.Delete)('expenses/:id'),
    (0, roles_decorator_1.Roles)(role_enum_1.RoleType.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], FinanceController.prototype, "removeExpense", null);
exports.FinanceController = FinanceController = __decorate([
    (0, common_1.Controller)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map