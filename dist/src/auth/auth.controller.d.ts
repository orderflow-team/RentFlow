import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    refresh(dto: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }>;
    requestOtp(dto: RequestOtpDto): Promise<{
        message: string;
    }>;
    verifyOtp(dto: VerifyOtpDto): Promise<{
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
    logout(user: JwtPayload): Promise<{
        message: string;
    }>;
    getProfile(user: JwtPayload): Promise<{
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
}
