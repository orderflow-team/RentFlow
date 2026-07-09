import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SmsService } from '../sms/sms.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private smsService;
    private readonly logger;
    constructor(prisma: PrismaService, jwtService: JwtService, smsService: SmsService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        company: {
            id: string;
            name: string;
            slug: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        company: {
            id: string;
            name: string;
            slug: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: import("@prisma/client").$Enums.RoleType[];
        };
    }>;
    requestOtp(rawPhone: string): Promise<{
        message: string;
    }>;
    verifyOtp(rawPhone: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
        company: {
            id: string;
            name: string;
            slug: string;
        };
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            roles: import("@prisma/client").$Enums.RoleType[];
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        isOwner: boolean;
        lastLoginAt: Date | null;
        company: {
            id: string;
            name: string;
            slug: string;
            status: import("@prisma/client").$Enums.CompanyStatus;
        };
        roles: {
            id: string;
            type: import("@prisma/client").$Enums.RoleType;
            name: string;
        }[];
        createdAt: Date;
    }>;
    private generateTokens;
}
