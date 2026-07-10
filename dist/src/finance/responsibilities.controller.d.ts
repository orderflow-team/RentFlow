import { ResponsibilitiesService } from './responsibilities.service';
import type { JwtPayload } from '../common/enums/role.enum';
import { RoleType as PrismaRoleType, ResponsibilityStatus } from '@prisma/client';
export declare class ResponsibilitiesController {
    private readonly service;
    constructor(service: ResponsibilitiesService);
    create(user: JwtPayload, leaseId: string, dto: {
        assignedTo: PrismaRoleType;
        title: string;
        description?: string;
        dueDate: string;
        reminder?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ResponsibilityStatus;
        companyId: string;
        description: string | null;
        leaseId: string;
        dueDate: Date;
        title: string;
        assignedTo: import("@prisma/client").$Enums.RoleType;
        reminder: boolean;
        reminderSentAt: Date | null;
        completedAt: Date | null;
    }>;
    findAll(user: JwtPayload, leaseId: string, assignedTo?: PrismaRoleType): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ResponsibilityStatus;
        companyId: string;
        description: string | null;
        leaseId: string;
        dueDate: Date;
        title: string;
        assignedTo: import("@prisma/client").$Enums.RoleType;
        reminder: boolean;
        reminderSentAt: Date | null;
        completedAt: Date | null;
    }[]>;
    findOne(user: JwtPayload, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ResponsibilityStatus;
        companyId: string;
        description: string | null;
        leaseId: string;
        dueDate: Date;
        title: string;
        assignedTo: import("@prisma/client").$Enums.RoleType;
        reminder: boolean;
        reminderSentAt: Date | null;
        completedAt: Date | null;
    }>;
    update(user: JwtPayload, id: string, dto: {
        status?: ResponsibilityStatus;
        completed?: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.ResponsibilityStatus;
        companyId: string;
        description: string | null;
        leaseId: string;
        dueDate: Date;
        title: string;
        assignedTo: import("@prisma/client").$Enums.RoleType;
        reminder: boolean;
        reminderSentAt: Date | null;
        completedAt: Date | null;
    }>;
    remove(user: JwtPayload, id: string): Promise<{
        message: string;
    }>;
}
