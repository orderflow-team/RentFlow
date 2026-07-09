import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Injectable()
export class FinanceService {
  private logger = new Logger(FinanceService.name);
  constructor(private prisma: PrismaService) {}

  private async generateInvoiceNumber(companyId: string): Promise<string> {
    const count = await this.prisma.invoice.count({ where: { companyId, deletedAt: null } });
    return `INV-${String(count + 1).padStart(6, '0')}`;
  }

  private async getScopedInvoiceWhereClause(companyId: string, user: JwtPayload) {
    const where: any = { companyId, deletedAt: null };

    if (user.roles.includes(RoleType.ADMIN) || user.roles.includes(RoleType.ACCOUNTANT)) {
      return where;
    }

    if (user.roles.includes(RoleType.OWNER)) {
      const owner = await this.prisma.owner.findFirst({
        where: { companyId, userId: user.sub, deletedAt: null },
      });
      if (owner) {
        where.unit = {
          building: {
            property: {
              ownerId: owner.id,
              deletedAt: null,
            },
          },
        };
      } else {
        where.id = 'non-existent-id';
      }
      return where;
    }

    if (user.roles.includes(RoleType.MANAGER)) {
      where.unit = {
        building: {
          property: {
            managerId: user.sub,
            deletedAt: null,
          },
        },
      };
      return where;
    }

    where.id = 'non-existent-id';
    return where;
  }

  private async getScopedExpenseWhereClause(companyId: string, user: JwtPayload) {
    const where: any = { companyId, deletedAt: null };

    if (user.roles.includes(RoleType.ADMIN) || user.roles.includes(RoleType.ACCOUNTANT)) {
      return where;
    }

    if (user.roles.includes(RoleType.OWNER)) {
      const owner = await this.prisma.owner.findFirst({
        where: { companyId, userId: user.sub, deletedAt: null },
      });
      if (owner) {
        where.property = {
          ownerId: owner.id,
          deletedAt: null,
        };
      } else {
        where.id = 'non-existent-id';
      }
      return where;
    }

    if (user.roles.includes(RoleType.MANAGER)) {
      where.property = {
        managerId: user.sub,
        deletedAt: null,
      };
      return where;
    }

    where.id = 'non-existent-id';
    return where;
  }

  async createInvoice(companyId: string, user: JwtPayload, dto: CreateInvoiceDto) {
    const lease = await this.prisma.lease.findFirst({ where: { id: dto.leaseId, companyId, deletedAt: null } });
    if (!lease) throw new BadRequestException('Lease not found');

    const totalAmount = dto.rentAmount + (dto.lateFee || 0) + (dto.otherCharges || 0);
    const invoiceNumber = await this.generateInvoiceNumber(companyId);

    const invoice = await this.prisma.invoice.create({
      data: {
        companyId, leaseId: dto.leaseId, unitId: lease.unitId, tenantId: lease.tenantId,
        invoiceNumber, periodStart: new Date(dto.periodStart), periodEnd: new Date(dto.periodEnd),
        dueDate: new Date(dto.dueDate), rentAmount: dto.rentAmount, lateFee: dto.lateFee || 0,
        otherCharges: dto.otherCharges || 0, totalAmount, paidAmount: 0, balanceDue: totalAmount,
        status: dto.status || 'PENDING', notes: dto.notes, category: dto.category || 'RENT',
      },
      include: { lease: { include: { tenant: { select: { firstName: true, lastName: true } }, unit: { select: { name: true } } } } },
    });
    return this.formatInvoice(invoice);
  }

  async findAllInvoices(companyId: string, user: JwtPayload, filters?: { status?: string; page?: number; limit?: number }) {
    const where = await this.getScopedInvoiceWhereClause(companyId, user);
    if (filters?.status) where.status = filters.status;
    const page = filters?.page || 1; const limit = filters?.limit || 50; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.invoice.findMany({ where, skip, take: limit, include: { lease: { include: { tenant: { select: { firstName: true, lastName: true } }, unit: { select: { name: true } } } }, payments: true }, orderBy: { createdAt: 'desc' } }),
      this.prisma.invoice.count({ where }),
    ]);
    return { data: data.map(i => this.formatInvoice(i)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOneInvoice(companyId: string, id: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedInvoiceWhereClause(companyId, user);
    scopedWhere.id = id;
    const invoice = await this.prisma.invoice.findFirst({ where: scopedWhere, include: { lease: { include: { tenant: true, unit: { include: { building: { select: { name: true } } } } } }, payments: true } });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return { ...this.formatInvoice(invoice), payments: invoice.payments };
  }

  async recordPayment(companyId: string, invoiceId: string, user: JwtPayload, dto: RecordPaymentDto) {
    const scopedWhere = await this.getScopedInvoiceWhereClause(companyId, user);
    scopedWhere.id = invoiceId;
    const invoice = await this.prisma.invoice.findFirst({ where: scopedWhere });
    if (!invoice) throw new NotFoundException('Invoice not found');
    if (invoice.status === 'PAID') throw new BadRequestException('Invoice is already paid');

    const payment = await this.prisma.$transaction(async (tx) => {
      const p = await tx.payment.create({ data: { companyId, invoiceId, amount: dto.amount, paymentDate: dto.paymentDate ? new Date(dto.paymentDate) : new Date(), paymentMethod: dto.paymentMethod || 'ONLINE', reference: dto.reference, notes: dto.notes } });
      const newPaid = invoice.paidAmount + dto.amount;
      const newBalance = invoice.totalAmount - newPaid;
      const newStatus = newBalance <= 0 ? 'PAID' : newBalance < invoice.totalAmount ? 'PARTIAL' : invoice.status;
      await tx.invoice.update({ where: { id: invoiceId }, data: { paidAmount: newPaid, balanceDue: Math.max(0, newBalance), status: newStatus, paidAt: newStatus === 'PAID' ? new Date() : null } });
      return p;
    });
    return payment;
  }

  async getPaymentHistory(companyId: string, invoiceId: string, user: JwtPayload) {
    await this.findOneInvoice(companyId, invoiceId, user);
    return this.prisma.payment.findMany({ where: { invoiceId, companyId, deletedAt: null }, orderBy: { paymentDate: 'desc' } });
  }

  // ─── Expenses ───

  async createExpense(companyId: string, user: JwtPayload, dto: CreateExpenseDto) {
    if (dto.propertyId) {
      const prop = await this.prisma.property.findFirst({ where: { id: dto.propertyId, companyId, deletedAt: null } });
      if (!prop) throw new BadRequestException('Property not found');
    }
    return this.prisma.expense.create({ data: { ...dto, companyId, expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date() } });
  }

  async findAllExpenses(companyId: string, user: JwtPayload, filters?: { category?: string; propertyId?: string; page?: number; limit?: number }) {
    const where = await this.getScopedExpenseWhereClause(companyId, user);
    if (filters?.category) where.category = filters.category;
    if (filters?.propertyId) where.propertyId = filters.propertyId;
    const page = filters?.page || 1; const limit = filters?.limit || 50; const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.prisma.expense.findMany({ where, skip, take: limit, orderBy: { expenseDate: 'desc' } }),
      this.prisma.expense.count({ where }),
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async removeExpense(companyId: string, id: string, user: JwtPayload) {
    const scopedWhere = await this.getScopedExpenseWhereClause(companyId, user);
    scopedWhere.id = id;
    const expense = await this.prisma.expense.findFirst({ where: scopedWhere });
    if (!expense) throw new NotFoundException('Expense not found');
    await this.prisma.expense.update({ where: { id }, data: { deletedAt: new Date() } });
    return { message: 'Expense deleted' };
  }

  private formatInvoice(i: any) {
    return {
      id: i.id, invoiceNumber: i.invoiceNumber, leaseId: i.leaseId, unitId: i.unitId, tenantId: i.tenantId,
      periodStart: i.periodStart, periodEnd: i.periodEnd, dueDate: i.dueDate,
      rentAmount: i.rentAmount, lateFee: i.lateFee, otherCharges: i.otherCharges,
      totalAmount: i.totalAmount, paidAmount: i.paidAmount, balanceDue: i.balanceDue,
      status: i.status, paidAt: i.paidAt, notes: i.notes, category: i.category,
      tenant: i.lease?.tenant ? `${i.lease.tenant.firstName} ${i.lease.tenant.lastName}` : null,
      unit: i.lease?.unit?.name || null,
      createdAt: i.createdAt, updatedAt: i.updatedAt,
    };
  }
}
