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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
const crypto = __importStar(require("crypto"));
const phone_util_1 = require("../common/utils/phone.util");
const sms_service_1 = require("../sms/sms.service");
function generateToken() {
    return crypto.randomBytes(64).toString('hex');
}
const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwtService;
    smsService;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwtService, smsService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.smsService = smsService;
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const passwordHash = await bcrypt.hash(dto.password, 12);
        const result = await this.prisma.$transaction(async (tx) => {
            const company = await tx.company.create({
                data: {
                    name: dto.companyName,
                    slug: dto.companyName
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/^-|-$/g, '') +
                        '-' +
                        Math.random().toString(36).substring(2, 8),
                    status: 'ACTIVE',
                },
            });
            const adminRole = await tx.role.findUnique({
                where: { type: role_enum_1.RoleType.ADMIN },
            });
            if (!adminRole) {
                throw new common_1.BadRequestException('System roles not initialized. Run seed first.');
            }
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    phone: dto.phone,
                    status: 'ACTIVE',
                    isOwner: true,
                    companyId: company.id,
                },
            });
            await tx.userRole.create({
                data: {
                    userId: user.id,
                    roleId: adminRole.id,
                    companyId: company.id,
                },
            });
            return { company, user };
        });
        const tokens = await this.generateTokens(result.user.id, result.user.email, result.company.id);
        return {
            company: {
                id: result.company.id,
                name: result.company.name,
                slug: result.company.slug,
            },
            user: {
                id: result.user.id,
                email: result.user.email,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
            },
            ...tokens,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                company: true,
                roles: {
                    include: { role: true },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        if (user.company.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Company account is not active');
        }
        const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });
        const tokens = await this.generateTokens(user.id, user.email, user.companyId);
        return {
            company: {
                id: user.company.id,
                name: user.company.name,
                slug: user.company.slug,
            },
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles.map((ur) => ur.role.type),
            },
            ...tokens,
        };
    }
    async requestOtp(rawPhone) {
        const phone = (0, phone_util_1.normalizePhone)(rawPhone);
        const user = await this.prisma.user.findUnique({ where: { phone } });
        if (!user) {
            throw new common_1.NotFoundException('No account found for this phone number');
        }
        await this.prisma.otpCode.updateMany({
            where: { phone, consumedAt: null, expiresAt: { gte: new Date() } },
            data: { expiresAt: new Date(0) },
        });
        const code = crypto.randomInt(100000, 1000000).toString();
        const codeHash = crypto.createHash('sha256').update(code).digest('hex');
        await this.prisma.otpCode.create({
            data: {
                phone,
                codeHash,
                expiresAt: new Date(Date.now() + OTP_TTL_MS),
            },
        });
        await this.smsService.sendOtp(phone, code);
        return { message: 'If that phone number is registered, an OTP has been sent.' };
    }
    async verifyOtp(rawPhone, code) {
        const phone = (0, phone_util_1.normalizePhone)(rawPhone);
        const codeHash = crypto.createHash('sha256').update(code).digest('hex');
        const otp = await this.prisma.otpCode.findFirst({
            where: { phone, consumedAt: null, expiresAt: { gte: new Date() } },
            orderBy: { createdAt: 'desc' },
        });
        if (!otp) {
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        if (otp.attempts >= MAX_OTP_ATTEMPTS) {
            throw new common_1.UnauthorizedException('Too many attempts. Please request a new OTP');
        }
        if (otp.codeHash !== codeHash) {
            await this.prisma.otpCode.update({
                where: { id: otp.id },
                data: { attempts: { increment: 1 } },
            });
            throw new common_1.UnauthorizedException('Invalid or expired OTP');
        }
        const user = await this.prisma.user.findUnique({
            where: { phone },
            include: { company: true, roles: { include: { role: true } } },
        });
        if (!user) {
            throw new common_1.NotFoundException('No account found for this phone number');
        }
        if (user.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Account is not active');
        }
        if (user.company.status !== 'ACTIVE') {
            throw new common_1.UnauthorizedException('Company account is not active');
        }
        await this.prisma.$transaction([
            this.prisma.otpCode.update({ where: { id: otp.id }, data: { consumedAt: new Date() } }),
            this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }),
        ]);
        const tokens = await this.generateTokens(user.id, user.email, user.companyId);
        return {
            company: {
                id: user.company.id,
                name: user.company.name,
                slug: user.company.slug,
            },
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles.map((ur) => ur.role.type),
            },
            ...tokens,
        };
    }
    async refresh(refreshToken) {
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: {
                user: {
                    include: {
                        roles: { include: { role: true } },
                    },
                },
            },
        });
        if (!storedToken) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        if (storedToken.revokedAt) {
            throw new common_1.UnauthorizedException('Refresh token has been revoked');
        }
        if (storedToken.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Refresh token has expired');
        }
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revokedAt: new Date() },
        });
        return this.generateTokens(storedToken.user.id, storedToken.user.email, storedToken.user.companyId);
    }
    async logout(userId) {
        await this.prisma.refreshToken.updateMany({
            where: {
                userId,
                revokedAt: null,
            },
            data: { revokedAt: new Date() },
        });
        return { message: 'Logged out successfully' };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                company: true,
                roles: {
                    include: { role: true },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatar: user.avatar,
            status: user.status,
            isOwner: user.isOwner,
            lastLoginAt: user.lastLoginAt,
            company: {
                id: user.company.id,
                name: user.company.name,
                slug: user.company.slug,
                status: user.company.status,
            },
            roles: user.roles.map((ur) => ({
                id: ur.role.id,
                type: ur.role.type,
                name: ur.role.name,
            })),
            createdAt: user.createdAt,
        };
    }
    async generateTokens(userId, email, companyId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                roles: { include: { role: true } },
            },
        });
        const roles = (user?.roles || []).map((ur) => ur.role.type);
        const payload = {
            sub: userId,
            email,
            companyId,
            roles: roles,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = generateToken();
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId,
                companyId,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });
        return {
            accessToken,
            refreshToken,
            expiresIn: 900,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        sms_service_1.SmsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map