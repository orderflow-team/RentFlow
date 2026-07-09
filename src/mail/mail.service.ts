import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private prisma: PrismaService) {
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
    } else {
      this.logger.warn('SMTP not configured — password reset emails will be logged instead of sent');
    }
  }

  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether the email exists
      return { message: 'If that email exists, a reset link has been sent.' };
    }

    // Revoke any existing unused tokens for this user
    await this.prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null, expiresAt: { gte: new Date() } },
      data: { expiresAt: new Date(0) }, // expire them
    });

    // Generate a new token
    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

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

  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new BadRequestException('Token and password are required');
    }

    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
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
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash and update password
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
      // Revoke all refresh tokens for security
      this.prisma.refreshToken.updateMany({
        where: { userId: resetToken.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    return { message: 'Password reset successfully. Please log in with your new password.' };
  }

  async sendResponsibilityReminder(email: string, title: string, dueDate: Date) {
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

  private async sendPasswordResetEmail(email: string, token: string) {
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
}
