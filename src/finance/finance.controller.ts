import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { RecordPaymentDto } from './dto/record-payment.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RoleType } from '../common/enums/role.enum';
import type { JwtPayload } from '../common/enums/role.enum';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FinanceController {
  constructor(private readonly service: FinanceService) {}

  @Post('invoices') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async createInvoice(@CurrentUser() u: JwtPayload, @Body() dto: CreateInvoiceDto) { return this.service.createInvoice(u.companyId, u, dto); }

  @Get('invoices') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAllInvoices(@CurrentUser() u: JwtPayload, @Query('status') status?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.findAllInvoices(u.companyId, u, { status, page: page ? +page : undefined, limit: limit ? +limit : undefined }); }

  @Get('invoices/:id') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findOneInvoice(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.findOneInvoice(u.companyId, id, u); }

  @Post('invoices/:id/payments') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async recordPayment(@CurrentUser() u: JwtPayload, @Param('id') id: string, @Body() dto: RecordPaymentDto) { return this.service.recordPayment(u.companyId, id, u, dto); }

  @Get('invoices/:id/payments') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async getPayments(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.getPaymentHistory(u.companyId, id, u); }

  @Post('expenses') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async createExpense(@CurrentUser() u: JwtPayload, @Body() dto: CreateExpenseDto) { return this.service.createExpense(u.companyId, u, dto); }

  @Get('expenses') @Roles(RoleType.ADMIN, RoleType.MANAGER, RoleType.ACCOUNTANT, RoleType.OWNER)
  async findAllExpenses(@CurrentUser() u: JwtPayload, @Query('category') category?: string, @Query('propertyId') propertyId?: string, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.service.findAllExpenses(u.companyId, u, { category, propertyId, page: page ? +page : undefined, limit: limit ? +limit : undefined }); }

  @Delete('expenses/:id') @Roles(RoleType.ADMIN)
  async removeExpense(@CurrentUser() u: JwtPayload, @Param('id') id: string) { return this.service.removeExpense(u.companyId, id, u); }
}
