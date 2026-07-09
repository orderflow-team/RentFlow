"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertiesModule = void 0;
const common_1 = require("@nestjs/common");
const properties_controller_1 = require("./properties.controller");
const properties_service_1 = require("./properties.service");
const passport_service_1 = require("./passport/passport.service");
const discovery_controller_1 = require("./discovery/discovery.controller");
const discovery_service_1 = require("./discovery/discovery.service");
const applications_controller_1 = require("./applications/applications.controller");
const applications_service_1 = require("./applications/applications.service");
let PropertiesModule = class PropertiesModule {
};
exports.PropertiesModule = PropertiesModule;
exports.PropertiesModule = PropertiesModule = __decorate([
    (0, common_1.Module)({
        controllers: [properties_controller_1.PropertiesController, discovery_controller_1.DiscoveryController, applications_controller_1.ApplicationsController],
        providers: [properties_service_1.PropertiesService, passport_service_1.PassportService, discovery_service_1.DiscoveryService, applications_service_1.ApplicationsService],
        exports: [properties_service_1.PropertiesService, passport_service_1.PassportService, discovery_service_1.DiscoveryService, applications_service_1.ApplicationsService],
    })
], PropertiesModule);
//# sourceMappingURL=properties.module.js.map