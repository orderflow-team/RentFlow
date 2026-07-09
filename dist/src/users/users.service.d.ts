import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: string, dto: CreateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        roles: import("@prisma/client").$Enums.RoleType[];
        tempPassword: string;
        createdAt: Date;
    }>;
    findAll(companyId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        isOwner: boolean;
        lastLoginAt: Date | null;
        roles: {
            id: string;
            type: import("@prisma/client").$Enums.RoleType;
            name: string;
        }[];
        createdAt: Date;
    }[]>;
    findOne(companyId: string, userId: string): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        avatar: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        isOwner: boolean;
        lastLoginAt: Date | null;
        roles: {
            id: string;
            type: import("@prisma/client").$Enums.RoleType;
            name: string;
        }[];
        createdAt: Date;
    }>;
    update(companyId: string, userId: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        roles: import("@prisma/client").$Enums.RoleType[];
    }>;
    remove(companyId: string, userId: string): Promise<{
        message: string;
    }>;
}
