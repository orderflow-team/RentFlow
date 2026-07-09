"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreatePhoneUser = findOrCreatePhoneUser;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const crypto = __importStar(require("crypto"));
async function findOrCreatePhoneUser(prisma, { companyId, phone, firstName, lastName, roleType }) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) {
        if (existing.companyId !== companyId) {
            throw new common_1.ConflictException('This phone number is already registered under a different company');
        }
        const hasRole = await prisma.userRole.findFirst({
            where: { userId: existing.id, companyId, role: { type: roleType } },
        });
        if (!hasRole) {
            const role = await prisma.role.findUnique({ where: { type: roleType } });
            if (role) {
                await prisma.userRole.create({
                    data: { userId: existing.id, roleId: role.id, companyId },
                });
            }
        }
        return existing;
    }
    if (!firstName || !lastName) {
        throw new common_1.BadRequestException('firstName and lastName are required to create a new account for this phone number');
    }
    const role = await prisma.role.findUnique({ where: { type: roleType } });
    if (!role) {
        throw new common_1.BadRequestException(`Role ${roleType} not found. Run seed first.`);
    }
    const unusablePasswordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 12);
    const user = await prisma.user.create({
        data: {
            email: `phone-${crypto.randomBytes(8).toString('hex')}@no-email.rentflow.local`,
            passwordHash: unusablePasswordHash,
            firstName,
            lastName,
            phone,
            status: 'ACTIVE',
            companyId,
            roles: { create: [{ role: { connect: { type: roleType } }, companyId }] },
        },
    });
    return user;
}
//# sourceMappingURL=phone-account.util.js.map