"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_HIERARCHY = exports.RoleType = void 0;
var RoleType;
(function (RoleType) {
    RoleType["ADMIN"] = "ADMIN";
    RoleType["MANAGER"] = "MANAGER";
    RoleType["ACCOUNTANT"] = "ACCOUNTANT";
    RoleType["TENANT"] = "TENANT";
    RoleType["OWNER"] = "OWNER";
})(RoleType || (exports.RoleType = RoleType = {}));
exports.ROLE_HIERARCHY = {
    [RoleType.ADMIN]: 100,
    [RoleType.MANAGER]: 80,
    [RoleType.ACCOUNTANT]: 60,
    [RoleType.OWNER]: 40,
    [RoleType.TENANT]: 20,
};
//# sourceMappingURL=role.enum.js.map