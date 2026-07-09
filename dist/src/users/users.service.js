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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(companyId, dto) {
        const existing = await this.prisma.user.findFirst({
            where: {
                email: dto.email,
                companyId,
            },
        });
        if (existing) {
            throw new common_1.ConflictException('User with this email already exists in your company');
        }
        const tempPassword = Math.random().toString(36).slice(-12) + 'A1!';
        const passwordHash = await bcrypt.hash(tempPassword, 12);
        for (const roleType of dto.roles) {
            const role = await this.prisma.role.findUnique({
                where: { type: roleType },
            });
            if (!role) {
                throw new common_1.BadRequestException(`Role ${roleType} not found. Run seed first.`);
            }
        }
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                phone: dto.phone,
                status: 'INVITED',
                companyId,
                roles: {
                    create: dto.roles.map((roleType) => ({
                        role: { connect: { type: roleType } },
                        companyId,
                    })),
                },
            },
            include: {
                roles: { include: { role: true } },
            },
        });
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            status: user.status,
            roles: user.roles.map((ur) => ur.role.type),
            tempPassword,
            createdAt: user.createdAt,
        };
    }
    async findAll(companyId) {
        const users = await this.prisma.user.findMany({
            where: { companyId, deletedAt: null },
            include: {
                roles: { include: { role: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        return users.map((user) => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            avatar: user.avatar,
            status: user.status,
            isOwner: user.isOwner,
            lastLoginAt: user.lastLoginAt,
            roles: user.roles.map((ur) => ({
                id: ur.role.id,
                type: ur.role.type,
                name: ur.role.name,
            })),
            createdAt: user.createdAt,
        }));
    }
    async findOne(companyId, userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, companyId, deletedAt: null },
            include: {
                roles: { include: { role: true } },
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
            roles: user.roles.map((ur) => ({
                id: ur.role.id,
                type: ur.role.type,
                name: ur.role.name,
            })),
            createdAt: user.createdAt,
        };
    }
    async update(companyId, userId, dto) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, companyId, deletedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (dto.roles && dto.roles.length > 0) {
            const roles = dto.roles;
            await this.prisma.$transaction(async (tx) => {
                await tx.userRole.deleteMany({
                    where: { userId, companyId },
                });
                for (const roleType of roles) {
                    const role = await tx.role.findUnique({
                        where: { type: roleType },
                    });
                    if (role) {
                        await tx.userRole.create({
                            data: {
                                userId,
                                roleId: role.id,
                                companyId,
                            },
                        });
                    }
                }
            });
        }
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.firstName !== undefined && { firstName: dto.firstName }),
                ...(dto.lastName !== undefined && { lastName: dto.lastName }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
            },
            include: {
                roles: { include: { role: true } },
            },
        });
        return {
            id: updated.id,
            email: updated.email,
            firstName: updated.firstName,
            lastName: updated.lastName,
            phone: updated.phone,
            status: updated.status,
            roles: updated.roles.map((ur) => ur.role.type),
        };
    }
    async remove(companyId, userId) {
        const user = await this.prisma.user.findFirst({
            where: { id: userId, companyId, deletedAt: null },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isOwner) {
            throw new common_1.BadRequestException('Cannot remove the company owner');
        }
        await this.prisma.user.update({
            where: { id: userId },
            data: { deletedAt: new Date(), status: 'INACTIVE' },
        });
        return { message: 'User removed successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map