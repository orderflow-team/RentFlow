import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';
import * as crypto from 'crypto';
import { normalizePhone } from '../common/utils/phone.util';
import { SmsService } from '../sms/sms.service';

function generateToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private smsService: SmsService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      // Check if email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existingUser) {
        throw new ConflictException('Email already registered');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(dto.password, 12);

      // Create company and user sequentially
      // (We avoid interactive transactions here due to Vercel/adapter-pg serverless issues)
      
      const adminRole = await this.prisma.role.findUnique({
        where: { type: RoleType.ADMIN },
      });

      if (!adminRole) {
        throw new BadRequestException('System roles not initialized. Run seed first.');
      }

      const company = await this.prisma.company.create({
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

      const user = await this.prisma.user.create({
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

      await this.prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: adminRole.id,
          companyId: company.id,
        },
      });

      const result = { company, user };

      // Generate tokens
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
    } catch (e) {
      if (e instanceof ConflictException || e instanceof BadRequestException) {
        throw e;
      }
      throw new InternalServerErrorException(e.stack || e.message);
    }
  }

  async login(dto: LoginDto) {
    // Find user with roles
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
      throw new UnauthorizedException('Invalid email or password');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    if (user.company.status !== 'ACTIVE') {
      throw new UnauthorizedException('Company account is not active');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate tokens
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

  async requestOtp(rawPhone: string) {
    const phone = normalizePhone(rawPhone);

    const user = await this.prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new NotFoundException('No account found for this phone number');
    }

    // Invalidate any previously issued, unconsumed codes for this phone
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

  async verifyOtp(rawPhone: string, code: string) {
    const phone = normalizePhone(rawPhone);
    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    const otp = await this.prisma.otpCode.findFirst({
      where: { phone, consumedAt: null, expiresAt: { gte: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    if (otp.attempts >= MAX_OTP_ATTEMPTS) {
      throw new UnauthorizedException('Too many attempts. Please request a new OTP');
    }

    if (otp.codeHash !== codeHash) {
      await this.prisma.otpCode.update({
        where: { id: otp.id },
        data: { attempts: { increment: 1 } },
      });
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.prisma.user.findUnique({
      where: { phone },
      include: { company: true, roles: { include: { role: true } } },
    });

    if (!user) {
      throw new NotFoundException('No account found for this phone number');
    }

    if (user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Account is not active');
    }

    if (user.company.status !== 'ACTIVE') {
      throw new UnauthorizedException('Company account is not active');
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

  async refresh(refreshToken: string) {
    // Find valid refresh token
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
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Revoke the old token
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revokedAt: new Date() },
    });

    // Generate new tokens
    return this.generateTokens(
      storedToken.user.id,
      storedToken.user.email,
      storedToken.user.companyId,
    );
  }

  async logout(userId: string) {
    // Revoke all refresh tokens for the user
    await this.prisma.refreshToken.updateMany({
      where: {
        userId,
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return { message: 'Logged out successfully' };
  }

  async getProfile(userId: string) {
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
      throw new UnauthorizedException('User not found');
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

  private async generateTokens(userId: string, email: string, companyId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: { include: { role: true } },
      },
    });

    const roles = (user?.roles || []).map((ur) => ur.role.type);

    const payload: JwtPayload = {
      sub: userId,
      email,
      companyId,
      roles: roles as RoleType[],
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = generateToken();

    // Store refresh token
    await this.prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId,
        companyId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }
}
