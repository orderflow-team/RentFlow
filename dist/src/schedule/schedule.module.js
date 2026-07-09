"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ScheduleModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleModule = void 0;
const common_1 = require("@nestjs/common");
const cron = __importStar(require("node-cron"));
const client_1 = require("@prisma/client");
const prisma_module_1 = require("../prisma/prisma.module");
const prisma_service_1 = require("../prisma/prisma.service");
const mail_module_1 = require("../mail/mail.module");
const mail_service_1 = require("../mail/mail.service");
const reputation_service_1 = require("../common/reputation/reputation.service");
let ScheduleModule = ScheduleModule_1 = class ScheduleModule {
    prisma;
    mail;
    reputation;
    logger = new common_1.Logger(ScheduleModule_1.name);
    constructor(prisma, mail, reputation) {
        this.prisma = prisma;
        this.mail = mail;
        this.reputation = reputation;
    }
    onModuleInit() {
        cron.schedule('0 2 * * *', () => {
            this.generateMonthlyInvoices().catch(err => this.logger.error('Monthly invoice generation failed', err));
        });
        cron.schedule('0 3 * * *', () => {
            this.markOverdueInvoices().catch(err => this.logger.error('Overdue invoice processing failed', err));
        });
        cron.schedule('0 4 * * *', () => {
            this.processResponsibilities().catch(err => this.logger.error('Responsibility processing failed', err));
        });
        cron.schedule('0 4 * * *', () => {
            this.reputation.releaseExpiredBlindReviews().catch(err => this.logger.error('Blind review release failed', err));
        });
        this.logger.log('Scheduled tasks registered (daily 02:00 / 03:00 / 04:00)');
    }
    async generateMonthlyInvoices() {
        this.logger.log('Starting monthly invoice generation...');
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const activeLeases = await this.prisma.lease.findMany({
            where: {
                status: 'ACTIVE',
                deletedAt: null,
                startDate: { lte: endOfMonth },
                OR: [{ endDate: null }, { endDate: { gte: startOfMonth } }],
            },
            include: { unit: true, tenant: true, company: true },
        });
        let created = 0;
        for (const lease of activeLeases) {
            const existing = await this.prisma.invoice.findFirst({
                where: {
                    leaseId: lease.id,
                    periodStart: { gte: startOfMonth },
                    periodEnd: { lte: endOfMonth },
                    deletedAt: null,
                },
            });
            if (existing)
                continue;
            const invCount = await this.prisma.invoice.count({ where: { companyId: lease.companyId } });
            const invoiceNumber = `INV-${String(invCount + 1).padStart(6, '0')}`;
            await this.prisma.invoice.create({
                data: {
                    companyId: lease.companyId,
                    leaseId: lease.id,
                    unitId: lease.unitId,
                    tenantId: lease.tenantId,
                    invoiceNumber,
                    periodStart: startOfMonth,
                    periodEnd: endOfMonth,
                    dueDate: new Date(now.getFullYear(), now.getMonth(), lease.paymentDay),
                    rentAmount: lease.rentAmount,
                    lateFee: 0,
                    otherCharges: 0,
                    totalAmount: lease.rentAmount,
                    paidAmount: 0,
                    balanceDue: lease.rentAmount,
                    status: 'PENDING',
                },
            });
            created++;
        }
        this.logger.log(`Monthly invoice generation complete: ${created} invoices created across ${activeLeases.length} active leases`);
    }
    async markOverdueInvoices() {
        this.logger.log('Starting overdue invoice processing...');
        const now = new Date();
        const overdue = await this.prisma.invoice.findMany({
            where: {
                status: { in: ['PENDING', 'PARTIAL'] },
                dueDate: { lt: now },
                deletedAt: null,
            },
            include: { lease: true },
        });
        let marked = 0;
        for (const inv of overdue) {
            let lateFee = 0;
            if (inv.lease) {
                if (inv.lease.lateFeeFlat)
                    lateFee += inv.lease.lateFeeFlat;
                if (inv.lease.lateFeePercent)
                    lateFee += inv.rentAmount * (inv.lease.lateFeePercent / 100);
            }
            const totalWithFee = inv.totalAmount + lateFee;
            const newBalance = totalWithFee - inv.paidAmount;
            await this.prisma.invoice.update({
                where: { id: inv.id },
                data: {
                    status: 'OVERDUE',
                    lateFee: inv.lateFee + lateFee,
                    totalAmount: totalWithFee,
                    balanceDue: Math.max(0, newBalance),
                    ...(inv.status === 'PARTIAL' ? {} : {}),
                },
            });
            marked++;
        }
        this.logger.log(`Overdue processing complete: ${marked} invoices marked overdue`);
    }
    async processResponsibilities() {
        this.logger.log('Starting responsibility processing...');
        const now = new Date();
        const overdueResult = await this.prisma.responsibility.updateMany({
            where: { status: client_1.ResponsibilityStatus.PENDING, dueDate: { lt: now } },
            data: { status: client_1.ResponsibilityStatus.OVERDUE },
        });
        const reminderWindow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        const dueForReminder = await this.prisma.responsibility.findMany({
            where: {
                reminder: true,
                reminderSentAt: null,
                status: { in: [client_1.ResponsibilityStatus.PENDING, client_1.ResponsibilityStatus.OVERDUE] },
                dueDate: { lte: reminderWindow },
            },
            include: {
                lease: {
                    include: {
                        tenant: { select: { email: true } },
                        unit: {
                            include: {
                                building: {
                                    include: { property: { include: { owner: { select: { email: true } } } } },
                                },
                            },
                        },
                    },
                },
            },
        });
        let remindersSent = 0;
        for (const responsibility of dueForReminder) {
            const email = responsibility.assignedTo === client_1.RoleType.TENANT
                ? responsibility.lease.tenant?.email
                : responsibility.lease.unit?.building?.property?.owner?.email;
            if (email) {
                await this.mail.sendResponsibilityReminder(email, responsibility.title, responsibility.dueDate);
                remindersSent++;
            }
            await this.prisma.responsibility.update({
                where: { id: responsibility.id },
                data: { reminderSentAt: now },
            });
        }
        this.logger.log(`Responsibility processing complete: ${overdueResult.count} marked overdue, ${remindersSent} reminders sent`);
    }
};
exports.ScheduleModule = ScheduleModule;
exports.ScheduleModule = ScheduleModule = ScheduleModule_1 = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule, mail_module_1.MailModule],
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        mail_service_1.MailService,
        reputation_service_1.ReputationService])
], ScheduleModule);
//# sourceMappingURL=schedule.module.js.map