import { PrismaService } from '../prisma/prisma.service';
export declare class MailService {
    private prisma;
    private readonly logger;
    private transporter;
    constructor(prisma: PrismaService);
    requestPasswordReset(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    sendResponsibilityReminder(email: string, title: string, dueDate: Date): Promise<void>;
    private sendPasswordResetEmail;
}
