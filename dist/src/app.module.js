"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const companies_module_1 = require("./companies/companies.module");
const properties_module_1 = require("./properties/properties.module");
const tenants_module_1 = require("./tenants/tenants.module");
const owners_module_1 = require("./owners/owners.module");
const leases_module_1 = require("./leases/leases.module");
const finance_module_1 = require("./finance/finance.module");
const maintenance_module_1 = require("./maintenance/maintenance.module");
const reports_module_1 = require("./reports/reports.module");
const schedule_module_1 = require("./schedule/schedule.module");
const tenant_portal_module_1 = require("./tenants/tenant-portal.module");
const owner_portal_module_1 = require("./owners/owner-portal.module");
const mail_module_1 = require("./mail/mail.module");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const reputation_module_1 = require("./common/reputation/reputation.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            throttler_1.ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            companies_module_1.CompaniesModule,
            properties_module_1.PropertiesModule,
            tenants_module_1.TenantsModule,
            owners_module_1.OwnersModule,
            leases_module_1.LeasesModule,
            finance_module_1.FinanceModule,
            maintenance_module_1.MaintenanceModule,
            reports_module_1.ReportsModule,
            tenant_portal_module_1.TenantPortalModule,
            owner_portal_module_1.OwnerPortalModule,
            mail_module_1.MailModule,
            schedule_module_1.ScheduleModule,
            reputation_module_1.ReputationModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map