import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
  ParseEnumPipe,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FinancialService } from './financial.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionType,
} from './dto/create-transaction.dto';
import {
  CreateFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from './dto/create-financial-category.dto';
import {
  CreateCashRegisterDto,
  CloseCashRegisterDto,
} from './dto/create-cash-register.dto';
import { FinancialReportFiltersDto } from './dto/financial-report-filters.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  // ========== TRANSAÇÕES FINANCEIRAS ==========

  @Post('transactions')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.createTransaction(createTransactionDto, user);
  }

  @Get('transactions')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  findAllTransactions(
    @GetUser() user: JwtPayload,
    @Query('type') type?: TransactionType,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('categoryId') categoryId?: string,
    @Query('groomerId') groomerId?: string,
  ) {
    const filters: any = {};
    if (type) filters.type = type;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);
    if (categoryId) filters.categoryId = categoryId;
    if (groomerId) filters.groomerId = groomerId;

    return this.financialService.findAllTransactions(user, filters);
  }

  @Get('transactions/:id')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  findTransactionById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.findTransactionById(id, user);
  }

  @Patch('transactions/:id')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.updateTransaction(
      id,
      updateTransactionDto,
      user,
    );
  }

  @Delete('transactions/:id')
  @Roles(UserRole.SUPER_ADMIN)
  deleteTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.deleteTransaction(id, user);
  }

  // ========== CATEGORIAS FINANCEIRAS ==========

  @Post('categories')
  @Roles(UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createCategory(
    @Body() createCategoryDto: CreateFinancialCategoryDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.createCategory(createCategoryDto, user);
  }

  @Get('categories')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  findAllCategories(
    @GetUser() user: JwtPayload,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.financialService.findAllCategories(
      user,
      activeOnly !== 'false',
    );
  }

  @Get('categories/type/:type')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  findCategoriesByType(
    @GetUser() user: JwtPayload,
    @Param('type', new ParseEnumPipe(TransactionType)) type: TransactionType,
  ) {
    return this.financialService.findCategoriesByType(type);
  }

  @Patch('categories/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateFinancialCategoryDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.SUPER_ADMIN)
  deleteCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.deleteCategory(id);
  }

  // ========== CONTROLE DE CAIXA ==========

  @Post('cash-register')
  @Roles(UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createCashRegister(
    @Body() createCashRegisterDto: CreateCashRegisterDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.createCashRegister(
      createCashRegisterDto,
      user,
    );
  }

  @Get('cash-register/:date')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  getCashRegisterByDate(
    @Param('date') date: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.getCashRegisterByDate(new Date(date));
  }

  @Patch('cash-register/:date/close')
  @Roles(UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  closeCashRegister(
    @Param('date') date: string,
    @Body() closeCashRegisterDto: CloseCashRegisterDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.closeCashRegister(
      new Date(date),
      closeCashRegisterDto,
    );
  }

  // ========== RELATÓRIOS FINANCEIROS ==========

  @Get('reports')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  generateFinancialReport(
    @GetUser() user: JwtPayload,
    @Query() filters: FinancialReportFiltersDto,
  ) {
    return this.financialService.generateFinancialReport(filters);
  }

  @Get('reports/summary')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  getFinancialSummary(
    @GetUser() user: JwtPayload,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.financialService.getFinancialSummary(
      filters.startDate,
      filters.endDate,
    );
  }

  // ========== RECEITAS AUTOMÁTICAS ==========

  @Post('appointments/:appointmentId/automatic-income')
  @Roles(UserRole.SUPER_ADMIN)
  createAutomaticIncomeFromAppointment(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @GetUser() user: JwtPayload,
  ) {
    return this.financialService.createAutomaticIncomeFromAppointment(
      appointmentId,
      user,
    );
  }

  // ========== DASHBOARD FINANCEIRO ==========

  @Get('dashboard/summary')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  getDashboardSummary(
    @GetUser() user: JwtPayload,
    @Query('days') days?: string,
  ) {
    const daysBack = days ? parseInt(days) : 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysBack);

    return this.financialService.getFinancialSummary(startDate, endDate);
  }

  @Get('dashboard/recent-transactions')
  @Roles(UserRole.COMPANY_ADMIN, UserRole.EMPLOYEE)
  getRecentTransactions(
    @GetUser() user: JwtPayload,
    @Query('limit') limit?: string,
  ) {
    const limitCount = limit ? parseInt(limit) : 10;
    return this.financialService
      .findAllTransactions(user)
      .then((transactions) => transactions.slice(0, limitCount));
  }
}
