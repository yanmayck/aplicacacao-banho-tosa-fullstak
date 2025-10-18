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
  Request,
  ValidationPipe,
  UsePipes,
  ParseUUIDPipe,
  ParseEnumPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FinancialService } from './financial.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionType } from './dto/create-transaction.dto';
import { CreateFinancialCategoryDto, UpdateFinancialCategoryDto } from './dto/create-financial-category.dto';
import { CreateCashRegisterDto, CloseCashRegisterDto } from './dto/create-cash-register.dto';
import { FinancialReportFiltersDto, ReportType } from './dto/financial-report-filters.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  // ========== TRANSAÇÕES FINANCEIRAS ==========

  @Post('transactions')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.createTransaction(createTransactionDto);
  }

  @Get('transactions')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAllTransactions(
    @Request() req: { user: JwtPayload },
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

    return this.financialService.findAllTransactions(filters);
  }

  @Get('transactions/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findTransactionById(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.findTransactionById(id);
  }

  @Patch('transactions/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.updateTransaction(id, updateTransactionDto);
  }

  @Delete('transactions/:id')
  @Roles(UserRole.ADMIN)
  deleteTransaction(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.deleteTransaction(id);
  }

  // ========== CATEGORIAS FINANCEIRAS ==========

  @Post('categories')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createCategory(
    @Body() createCategoryDto: CreateFinancialCategoryDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAllCategories(
    @Request() req: { user: JwtPayload },
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.financialService.findAllCategories(activeOnly !== 'false');
  }

  @Get('categories/type/:type')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findCategoriesByType(
    @Request() req: { user: JwtPayload },
    @Param('type', new ParseEnumPipe(TransactionType)) type: TransactionType,
  ) {
    return this.financialService.findCategoriesByType(type);
  }

  @Patch('categories/:id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateFinancialCategoryDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @Roles(UserRole.ADMIN)
  deleteCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.deleteCategory(id);
  }

  // ========== CONTROLE DE CAIXA ==========

  @Post('cash-register')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createCashRegister(
    @Body() createCashRegisterDto: CreateCashRegisterDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.createCashRegister(createCashRegisterDto);
  }

  @Get('cash-register/:date')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getCashRegisterByDate(
    @Param('date') date: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.getCashRegisterByDate(new Date(date));
  }

  @Patch('cash-register/:date/close')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  closeCashRegister(
    @Param('date') date: string,
    @Body() closeCashRegisterDto: CloseCashRegisterDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.closeCashRegister(new Date(date), closeCashRegisterDto);
  }

  // ========== RELATÓRIOS FINANCEIROS ==========

  @Get('reports')
  @Roles(UserRole.ADMIN, UserRole.USER)
  generateFinancialReport(
    @Request() req: { user: JwtPayload },
    @Query() filters: FinancialReportFiltersDto,
  ) {
    return this.financialService.generateFinancialReport(filters);
  }

  @Get('reports/summary')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getFinancialSummary(
    @Request() req: { user: JwtPayload },
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const filters: any = {};
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.financialService.getFinancialSummary(filters.startDate, filters.endDate);
  }

  // ========== RECEITAS AUTOMÁTICAS ==========

  @Post('appointments/:appointmentId/automatic-income')
  @Roles(UserRole.ADMIN)
  createAutomaticIncomeFromAppointment(
    @Param('appointmentId', ParseUUIDPipe) appointmentId: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.financialService.createAutomaticIncomeFromAppointment(appointmentId);
  }

  // ========== DASHBOARD FINANCEIRO ==========

  @Get('dashboard/summary')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getDashboardSummary(
    @Request() req: { user: JwtPayload },
    @Query('days') days?: string,
  ) {
    const daysBack = days ? parseInt(days) : 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysBack);

    return this.financialService.getFinancialSummary(startDate, endDate);
  }

  @Get('dashboard/recent-transactions')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getRecentTransactions(
    @Request() req: { user: JwtPayload },
    @Query('limit') limit?: string,
  ) {
    const limitCount = limit ? parseInt(limit) : 10;
    return this.financialService.findAllTransactions()
      .then(transactions => transactions.slice(0, limitCount));
  }
}