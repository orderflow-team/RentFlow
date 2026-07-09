import { Module, OnModuleInit, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { RoleType, ResponsibilityStatus } from '@prisma/client';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaService } from '../prisma/prisma.service';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';
import { ReputationService } from '../common/reputation/reputation.service';

@Module({
  imports: [PrismaModule, MailModule],
})
export class ScheduleModule implements OnModuleInit {
  private readonly logger = new Logger(ScheduleModule.name);
  constructor(
    private prisma: PrismaService,
    private mail: MailService,
    private reputation: ReputationService,
  ) {}

  onModuleInit() {
    // Run every day at 2:00 AM
    cron.schedule('0 2 * * *', () => {
      this.generateMonthlyInvoices().catch(err => this.logger.error('Monthly invoice generation failed', err));
    });
    cron.schedule('0 3 * * *', () => {
      this.markOverdueInvoices().catch(err => this.logger.error('Overdue invoice processing failed', err));
    });
    // Run every day at 4:00 AM
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
      if (existing) continue;

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
        if (inv.lease.lateFeeFlat) lateFee += inv.lease.lateFeeFlat;
        if (inv.lease.lateFeePercent) lateFee += inv.rentAmount * (inv.lease.lateFeePercent / 100);
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
      where: { status: ResponsibilityStatus.PENDING, dueDate: { lt: now } },
      data: { status: ResponsibilityStatus.OVERDUE },
    });

    const reminderWindow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const dueForReminder = await this.prisma.responsibility.findMany({
      where: {
        reminder: true,
        reminderSentAt: null,
        status: { in: [ResponsibilityStatus.PENDING, ResponsibilityStatus.OVERDUE] },
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
      const email =
        responsibility.assignedTo === RoleType.TENANT
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
}
