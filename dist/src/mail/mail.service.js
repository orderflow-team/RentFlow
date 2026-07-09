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
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const crypto = __importStar(require("crypto"));
const nodemailer = __importStar(require("nodemailer"));
const bcrypt = __importStar(require("bcryptjs"));
const prisma_service_1 = require("../prisma/prisma.service");
let MailService = MailService_1 = class MailService {
    prisma;
    logger = new common_1.Logger(MailService_1.name);
    transporter = null;
    constructor(prisma) {
        this.prisma = prisma;
        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASS;
        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
            });
            this.logger.log(`Mail transport configured: ${host}:${port}`);
        }
        else {
            this.logger.warn('SMTP not configured — password reset emails will be logged instead of sent');
        }
    }
    async requestPasswordReset(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            return { message: 'If that email exists, a reset link has been sent.' };
        }
        await this.prisma.passwordResetToken.updateMany({
            where: { userId: user.id, usedAt: null, expiresAt: { gte: new Date() } },
            data: { expiresAt: new Date(0) },
        });
        const token = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                tokenHash,
                expiresAt,
            },
        });
        await this.sendPasswordResetEmail(email, token);
        return { message: 'If that email exists, a reset link has been sent.' };
    }
    async resetPassword(token, newPassword) {
        if (!token || !newPassword) {
            throw new common_1.BadRequestException('Token and password are required');
        }
        if (newPassword.length < 8) {
            throw new common_1.BadRequestException('Password must be at least 8 characters');
        }
        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const resetToken = await this.prisma.passwordResetToken.findFirst({
            where: {
                tokenHash,
                usedAt: null,
                expiresAt: { gte: new Date() },
            },
        });
        if (!resetToken) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const passwordHash = await bcrypt.hash(newPassword, 12);
        await this.prisma.$transaction([
            this.prisma.user.update({
                where: { id: resetToken.userId },
                data: { passwordHash, passwordChangedAt: new Date() },
            }),
            this.prisma.passwordResetToken.update({
                where: { id: resetToken.id },
                data: { usedAt: new Date() },
            }),
            this.prisma.refreshToken.updateMany({
                where: { userId: resetToken.userId, revokedAt: null },
                data: { revokedAt: new Date() },
            }),
        ]);
        return { message: 'Password reset successfully. Please log in with your new password.' };
    }
    async sendResponsibilityReminder(email, title, dueDate) {
        const dueDateLabel = dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const message = [
            `Reminder: "${title}" is due on ${dueDateLabel}.`,
            '',
            'Please complete this responsibility before the due date.',
        ].join('\n');
        if (!this.transporter) {
            this.logger.log(`[DEV] Responsibility reminder for ${email}: ${title} due ${dueDateLabel}`);
            return;
        }
        await this.transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'RentFlow'}" <${process.env.SMTP_FROM || 'noreply@rentflow.app'}>`,
            to: email,
            subject: `Reminder: ${title}`,
            text: message,
        });
    }
    async sendPasswordResetEmail(email, token) {
        const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
        const message = [
            'You requested a password reset for your RentFlow account.',
            '',
            `Click the link below to reset your password. This link expires in 1 hour.`,
            '',
            resetUrl,
            '',
            'If you did not request this, please ignore this email.',
        ].join('\n');
        if (!this.transporter) {
            this.logger.log(`[DEV] Password reset for ${email}: ${resetUrl}`);
            return;
        }
        await this.transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME || 'RentFlow'}" <${process.env.SMTP_FROM || 'noreply@rentflow.app'}>`,
            to: email,
            subject: 'Reset your RentFlow password',
            text: message,
        });
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MailService);
//# sourceMappingURL=mail.service.js.map