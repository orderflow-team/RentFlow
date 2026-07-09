import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { ReputationService } from '../common/reputation/reputation.service';
export declare class ScheduleModule implements OnModuleInit {
    private prisma;
    private mail;
    private reputation;
    private readonly logger;
    constructor(prisma: PrismaService, mail: MailService, reputation: ReputationService);
    onModuleInit(): void;
    generateMonthlyInvoices(): Promise<void>;
    markOverdueInvoices(): Promise<void>;
    processResponsibilities(): Promise<void>;
}
