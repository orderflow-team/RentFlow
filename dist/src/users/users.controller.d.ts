import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { JwtPayload } from '../common/enums/role.enum';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(user: JwtPayload, dto: CreateUserDto): Promise<{
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
    findAll(user: JwtPayload): Promise<{
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
    findOne(user: JwtPayload, id: string): Promise<{
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
    update(user: JwtPayload, id: string, dto: UpdateUserDto): Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        phone: string | null;
        status: import("@prisma/client").$Enums.UserStatus;
        roles: import("@prisma/client").$Enums.RoleType[];
    }>;
    remove(user: JwtPayload, id: string): Promise<{
        message: string;
    }>;
}
