import { PrismaService } from '../prisma/prisma.service';
import { RoleType, ResponsibilityStatus } from '@prisma/client';
export declare class ResponsibilitiesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(companyId: string, dto: {
        leaseId: string;
        assignedTo: RoleType;
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
    findAll(companyId: string, leaseId: string, assignedTo?: RoleType): Promise<{
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
    findOne(companyId: string, id: string): Promise<{
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
    update(companyId: string, id: string, dto: {
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
    remove(companyId: string, id: string): Promise<{
        message: string;
    }>;
}
