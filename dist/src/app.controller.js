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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const app_service_1 = require("./app.service");
const public_decorator_1 = require("./common/decorators/public.decorator");
let AppController = class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    async getLanding(res) {
        const dashboard = await this.appService.getDashboard();
        const html = this.appService.getLandingPage(dashboard);
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    async health() {
        return this.appService.getHealth();
    }
    getLoginPage(res) {
        const html = this.appService.getLoginPage();
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    getSignupPage(res) {
        const html = this.appService.getSignupPage();
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    getAdminLoginPage(res) {
        const html = this.appService.getAdminLoginPage();
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
    getDashboardPage(res) {
        const html = this.appService.getDashboardPage();
        res.setHeader('Content-Type', 'text/html');
        res.send(html);
    }
};
exports.AppController = AppController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getLanding", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "health", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('login'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getLoginPage", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('signup'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getSignupPage", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('admin/login'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getAdminLoginPage", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getDashboardPage", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService])
], AppController);
//# sourceMappingURL=app.controller.js.map