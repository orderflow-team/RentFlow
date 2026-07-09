"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var FinanceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const role_enum_1 = require("../common/enums/role.enum");
let FinanceService = FinanceService_1 = class FinanceService {
    prisma;
    logger = new common_1.Logger(FinanceService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateInvoiceNumber(companyId) {
        const count = await this.prisma.invoice.count({ where: { companyId, deletedAt: null } });
        return `INV-${String(count + 1).padStart(6, '0')}`;
    }
    async getScopedInvoiceWhereClause(companyId, user) {
        const where = { companyId, deletedAt: null };
        if (user.roles.includes(role_enum_1.RoleType.ADMIN) || user.roles.includes(role_enum_1.RoleType.ACCOUNTANT)) {
            return where;
        }
        if (user.roles.includes(role_enum_1.RoleType.OWNER)) {
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
            }
            else {
                where.id = 'non-existent-id';
            }
            return where;
        }
        if (user.roles.includes(role_enum_1.RoleType.MANAGER)) {
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
    async getScopedExpenseWhereClause(companyId, user) {
        const where = { companyId, deletedAt: null };
        if (user.roles.includes(role_enum_1.RoleType.ADMIN) || user.roles.includes(role_enum_1.RoleType.ACCOUNTANT)) {
            return where;
        }
        if (user.roles.includes(role_enum_1.RoleType.OWNER)) {
            const owner = await this.prisma.owner.findFirst({
                where: { companyId, userId: user.sub, deletedAt: null },
            });
            if (owner) {
                where.property = {
                    ownerId: owner.id,
                    deletedAt: null,
                };
            }
            else {
                where.id = 'non-existent-id';
            }
            return where;
        }
        if (user.roles.includes(role_enum_1.RoleType.MANAGER)) {
            where.property = {
                managerId: user.sub,
                deletedAt: null,
            };
            return where;
        }
        where.id = 'non-existent-id';
        return where;
    }
    async createInvoice(companyId, user, dto) {
        const lease = await this.prisma.lease.findFirst({ where: { id: dto.leaseId, companyId, deletedAt: null } });
        if (!lease)
            throw new common_1.BadRequestException('Lease not found');
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
    async findAllInvoices(companyId, user, filters) {
        const where = await this.getScopedInvoiceWhereClause(companyId, user);
        if (filters?.status)
            where.status = filters.status;
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.invoice.findMany({ where, skip, take: limit, include: { lease: { include: { tenant: { select: { firstName: true, lastName: true } }, unit: { select: { name: true } } } }, payments: true }, orderBy: { createdAt: 'desc' } }),
            this.prisma.invoice.count({ where }),
        ]);
        return { data: data.map(i => this.formatInvoice(i)), meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async findOneInvoice(companyId, id, user) {
        const scopedWhere = await this.getScopedInvoiceWhereClause(companyId, user);
        scopedWhere.id = id;
        const invoice = await this.prisma.invoice.findFirst({ where: scopedWhere, include: { lease: { include: { tenant: true, unit: { include: { building: { select: { name: true } } } } } }, payments: true } });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        return { ...this.formatInvoice(invoice), payments: invoice.payments };
    }
    async recordPayment(companyId, invoiceId, user, dto) {
        const scopedWhere = await this.getScopedInvoiceWhereClause(companyId, user);
        scopedWhere.id = invoiceId;
        const invoice = await this.prisma.invoice.findFirst({ where: scopedWhere });
        if (!invoice)
            throw new common_1.NotFoundException('Invoice not found');
        if (invoice.status === 'PAID')
            throw new common_1.BadRequestException('Invoice is already paid');
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
    async getPaymentHistory(companyId, invoiceId, user) {
        await this.findOneInvoice(companyId, invoiceId, user);
        return this.prisma.payment.findMany({ where: { invoiceId, companyId, deletedAt: null }, orderBy: { paymentDate: 'desc' } });
    }
    async createExpense(companyId, user, dto) {
        if (dto.propertyId) {
            const prop = await this.prisma.property.findFirst({ where: { id: dto.propertyId, companyId, deletedAt: null } });
            if (!prop)
                throw new common_1.BadRequestException('Property not found');
        }
        return this.prisma.expense.create({ data: { ...dto, companyId, expenseDate: dto.expenseDate ? new Date(dto.expenseDate) : new Date() } });
    }
    async findAllExpenses(companyId, user, filters) {
        const where = await this.getScopedExpenseWhereClause(companyId, user);
        if (filters?.category)
            where.category = filters.category;
        if (filters?.propertyId)
            where.propertyId = filters.propertyId;
        const page = filters?.page || 1;
        const limit = filters?.limit || 50;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.expense.findMany({ where, skip, take: limit, orderBy: { expenseDate: 'desc' } }),
            this.prisma.expense.count({ where }),
        ]);
        return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
    async removeExpense(companyId, id, user) {
        const scopedWhere = await this.getScopedExpenseWhereClause(companyId, user);
        scopedWhere.id = id;
        const expense = await this.prisma.expense.findFirst({ where: scopedWhere });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        await this.prisma.expense.update({ where: { id }, data: { deletedAt: new Date() } });
        return { message: 'Expense deleted' };
    }
    formatInvoice(i) {
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
};
exports.FinanceService = FinanceService;
exports.FinanceService = FinanceService = FinanceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceService);
//# sourceMappingURL=finance.service.js.map