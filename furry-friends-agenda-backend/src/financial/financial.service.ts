import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateTransactionDto,
  UpdateTransactionDto,
} from './dto/create-transaction.dto';
import {
  CreateFinancialCategoryDto,
  UpdateFinancialCategoryDto,
} from './dto/create-financial-category.dto';
import {
  CreateCashRegisterDto,
  CloseCashRegisterDto,
} from './dto/create-cash-register.dto';
import {
  FinancialReportFiltersDto,
  ReportType,
} from './dto/financial-report-filters.dto';
import {
  Prisma,
  Transaction,
  FinancialCategory,
  CashRegister,
} from '@prisma/client';
import { TransactionType } from './dto/create-transaction.dto';
import {
  TransactionUpdateData,
  FinancialReportData,
  FinancialSummary,
} from '../types/financial.types';

@Injectable()
export class FinancialService {
  constructor(private prisma: PrismaService) {}

  // ========== GESTÃO DE TRANSAÇÕES ==========

  async createTransaction(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const {
      type,
      amount,
      description,
      date,
      categoryId,
      appointmentId,
      groomerId,
      cashRegisterId,
      paymentMethod,
      notes,
      receiptUrl,
    } = createTransactionDto;

    const category = await this.prisma.financialCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(
        `Categoria financeira com ID "${categoryId}" não encontrada`,
      );
    }

    if (category.type !== type) {
      throw new BadRequestException(`Categoria deve ser do tipo ${type}`);
    }

    if (appointmentId) {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
      });
      if (!appointment) {
        throw new NotFoundException(
          `Agendamento com ID "${appointmentId}" não encontrado`,
        );
      }
    }

    if (groomerId) {
      const groomer = await this.prisma.groomer.findUnique({
        where: { id: groomerId },
      });
      if (!groomer) {
        throw new NotFoundException(
          `Tosador com ID "${groomerId}" não encontrado`,
        );
      }
    }

    if (cashRegisterId) {
      const cashRegister = await this.prisma.cashRegister.findUnique({
        where: { id: cashRegisterId },
      });
      if (!cashRegister) {
        throw new NotFoundException(
          `Caixa com ID "${cashRegisterId}" não encontrado`,
        );
      }
    }

    const transactionData: Prisma.TransactionCreateInput = {
      type,
      amount,
      description,
      date: new Date(date),
      category: { connect: { id: categoryId } },
      appointment: appointmentId
        ? { connect: { id: appointmentId } }
        : undefined,
      groomer: groomerId ? { connect: { id: groomerId } } : undefined,
      paymentMethod,
      notes,
      receiptUrl,
      isCashRegisterClosed: false,
      CashRegister: cashRegisterId
        ? { connect: { id: cashRegisterId } }
        : undefined,
    };

    return this.prisma.transaction.create({
      data: transactionData,
      include: {
        category: true,
        appointment: {
          include: {
            client: true,
            pet: true,
            groomer: true,
          },
        },
        groomer: true,
        CashRegister: true,
      },
    });
  }

  async findAllTransactions(filters?: {
    type?: TransactionType;
    startDate?: Date;
    endDate?: Date;
    categoryId?: string;
    groomerId?: string;
  }): Promise<Transaction[]> {
    const where: Prisma.TransactionWhereInput = {};

    if (filters?.type) where.type = filters.type;
    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.groomerId) where.groomerId = filters.groomerId;

    if (filters?.startDate || filters?.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = filters.startDate;
      if (filters.endDate) where.date.lte = filters.endDate;
    }

    return this.prisma.transaction.findMany({
      where,
      include: {
        category: true,
        appointment: {
          include: {
            client: true,
            pet: true,
            groomer: true,
          },
        },
        groomer: true,
        CashRegister: true,
      },
      orderBy: { date: 'desc' },
    });
  }

  async findTransactionById(id: string): Promise<Transaction> {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
        appointment: {
          include: {
            client: true,
            pet: true,
            groomer: true,
          },
        },
        groomer: true,
        CashRegister: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transação com ID "${id}" não encontrada`);
    }

    return transaction;
  }

  async updateTransaction(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    await this.findTransactionById(id);

    const dataToUpdate: TransactionUpdateData = {};

    if (updateTransactionDto.type)
      dataToUpdate.type = updateTransactionDto.type;
    if (updateTransactionDto.amount)
      dataToUpdate.amount = updateTransactionDto.amount;
    if (updateTransactionDto.description)
      dataToUpdate.description = updateTransactionDto.description;
    if (updateTransactionDto.date)
      dataToUpdate.date = new Date(updateTransactionDto.date);
    if (updateTransactionDto.paymentMethod)
      dataToUpdate.paymentMethod = updateTransactionDto.paymentMethod;
    if (updateTransactionDto.notes !== undefined)
      dataToUpdate.notes = updateTransactionDto.notes;
    if (updateTransactionDto.receiptUrl)
      dataToUpdate.receiptUrl = updateTransactionDto.receiptUrl;

    if (updateTransactionDto.categoryId) {
      const category = await this.prisma.financialCategory.findUnique({
        where: { id: updateTransactionDto.categoryId },
      });
      if (!category) {
        throw new NotFoundException(
          `Categoria com ID "${updateTransactionDto.categoryId}" não encontrada`,
        );
      }
      dataToUpdate.category = {
        connect: { id: updateTransactionDto.categoryId },
      };
    }

    if (updateTransactionDto.appointmentId) {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: updateTransactionDto.appointmentId },
      });
      if (!appointment) {
        throw new NotFoundException(
          `Agendamento com ID "${updateTransactionDto.appointmentId}" não encontrado`,
        );
      }
      dataToUpdate.appointment = {
        connect: { id: updateTransactionDto.appointmentId },
      };
    }

    if (updateTransactionDto.groomerId) {
      const groomer = await this.prisma.groomer.findUnique({
        where: { id: updateTransactionDto.groomerId },
      });
      if (!groomer) {
        throw new NotFoundException(
          `Tosador com ID "${updateTransactionDto.groomerId}" não encontrado`,
        );
      }
      dataToUpdate.groomer = {
        connect: { id: updateTransactionDto.groomerId },
      };
    }

    return this.prisma.transaction.update({
      where: { id },
      data: dataToUpdate,
      include: {
        category: true,
        appointment: {
          include: {
            client: true,
            pet: true,
            groomer: true,
          },
        },
        groomer: true,
      },
    });
  }

  async deleteTransaction(id: string): Promise<Transaction> {
    await this.findTransactionById(id);
    return this.prisma.transaction.delete({
      where: { id },
    });
  }

  // ========== GESTÃO DE CATEGORIAS ==========

  async createCategory(
    createCategoryDto: CreateFinancialCategoryDto,
  ): Promise<FinancialCategory> {
    const { name, description, type, isActive = true } = createCategoryDto;

    const existingCategory = await this.prisma.financialCategory.findFirst({
      where: { name, type },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Categoria "${name}" já existe para o tipo ${type}`,
      );
    }

    return this.prisma.financialCategory.create({
      data: {
        name,
        description,
        type,
        isActive,
      },
    });
  }

  async findAllCategories(activeOnly = true): Promise<FinancialCategory[]> {
    return this.prisma.financialCategory.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { name: 'asc' },
    });
  }

  async findCategoriesByType(
    type: TransactionType,
  ): Promise<FinancialCategory[]> {
    return this.prisma.financialCategory.findMany({
      where: { type, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async updateCategory(
    id: string,
    updateCategoryDto: UpdateFinancialCategoryDto,
  ): Promise<FinancialCategory> {
    const existingCategory = await this.prisma.financialCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada`);
    }

    if (
      updateCategoryDto.name &&
      updateCategoryDto.name !== existingCategory.name
    ) {
      const conflictingCategory = await this.prisma.financialCategory.findFirst(
        {
          where: {
            name: updateCategoryDto.name,
            type: updateCategoryDto.type || existingCategory.type,
          },
        },
      );

      if (conflictingCategory) {
        throw new ConflictException(
          `Categoria "${updateCategoryDto.name}" já existe`,
        );
      }
    }

    return this.prisma.financialCategory.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async deleteCategory(id: string): Promise<FinancialCategory> {
    const existingCategory = await this.prisma.financialCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada`);
    }

    const transactionCount = await this.prisma.transaction.count({
      where: { categoryId: id },
    });

    if (transactionCount > 0) {
      throw new BadRequestException(
        'Não é possível excluir categoria que possui transações',
      );
    }

    return this.prisma.financialCategory.delete({
      where: { id },
    });
  }

  // ========== CONTROLE DE CAIXA ==========

  async createCashRegister(
    createCashRegisterDto: CreateCashRegisterDto,
  ): Promise<CashRegister> {
    const { date, openingBalance = 0, notes } = createCashRegisterDto;

    const registerDate = new Date(date);
    registerDate.setHours(0, 0, 0, 0);

    const existingRegister = await this.prisma.cashRegister.findUnique({
      where: { date: registerDate },
    });

    if (existingRegister) {
      throw new ConflictException(`Caixa para a data ${date} já existe`);
    }

    return this.prisma.cashRegister.create({
      data: {
        date: registerDate,
        openingBalance,
        notes,
      },
    });
  }

  async getCashRegisterByDate(date: Date): Promise<CashRegister> {
    const registerDate = new Date(date);
    registerDate.setHours(0, 0, 0, 0);

    const cashRegister = await this.prisma.cashRegister.findUnique({
      where: { date: registerDate },
      include: {
        transactions: {
          include: {
            category: true,
            appointment: true,
            groomer: true,
          },
        },
      },
    });

    if (!cashRegister) {
      throw new NotFoundException(
        `Caixa para a data ${date.toISOString().split('T')[0]} não encontrado`,
      );
    }

    return cashRegister;
  }

  async closeCashRegister(
    date: Date,
    closeCashRegisterDto: CloseCashRegisterDto,
  ): Promise<CashRegister> {
    const cashRegister = await this.getCashRegisterByDate(date);

    if (cashRegister.isClosed) {
      throw new BadRequestException('Caixa já está fechado');
    }

    const transactions = await this.prisma.transaction.findMany({
      where: { cashRegisterId: cashRegister.id },
    });
    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const calculatedClosingBalance =
      cashRegister.openingBalance + totalIncome - totalExpenses;

    if (closeCashRegisterDto.closingBalance !== undefined) {
      const difference = Math.abs(
        calculatedClosingBalance - closeCashRegisterDto.closingBalance,
      );
      if (difference > 0.01 && !closeCashRegisterDto.forceClose) {
        throw new BadRequestException(
          `Divergência de R$ ${difference.toFixed(2)} entre saldo calculado e informado. Use forceClose para forçar o fechamento.`,
        );
      }
    }

    return this.prisma.cashRegister.update({
      where: { id: cashRegister.id },
      data: {
        closingBalance:
          closeCashRegisterDto.closingBalance ?? calculatedClosingBalance,
        totalIncome,
        totalExpenses,
        isClosed: true,
        closedAt: new Date(),
        notes: closeCashRegisterDto.notes,
      },
    });
  }

  // ========== RELATÓRIOS FINANCEIROS ==========

  async generateFinancialReport(
    filters: FinancialReportFiltersDto,
  ): Promise<FinancialReportData> {
    const {
      type = ReportType.MONTHLY,
      startDate,
      endDate,
      transactionType,
      categoryId,
      groomerId,
    } = filters;

    const now = new Date();
    let reportStartDate: Date;
    let reportEndDate: Date = new Date(now);

    if (startDate && endDate) {
      reportStartDate = new Date(startDate);
      reportEndDate = new Date(endDate);
    } else {
      switch (type) {
        case ReportType.DAILY:
          reportStartDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
          );
          break;
        case ReportType.WEEKLY: {
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          reportStartDate = weekStart;
          break;
        }
        case ReportType.MONTHLY:
          reportStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case ReportType.YEARLY:
          reportStartDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          reportStartDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
    }

    const where: Prisma.TransactionWhereInput = {
      date: {
        gte: reportStartDate,
        lte: reportEndDate,
      },
    };

    if (transactionType) where.type = transactionType;
    if (categoryId) where.categoryId = categoryId;
    if (groomerId) where.groomerId = groomerId;

    const transactions = await this.prisma.transaction.findMany({
      where,
      include: {
        category: true,
        groomer: true,
        appointment: true,
      },
      orderBy: { date: 'asc' },
    });

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpenses;

    const categoryMetrics = transactions.reduce(
      (acc, transaction) => {
        const categoryName = transaction.category.name;
        if (!acc[categoryName]) {
          acc[categoryName] = { total: 0, count: 0 };
        }
        acc[categoryName].total += transaction.amount;
        acc[categoryName].count += 1;
        return acc;
      },
      {} as Record<string, { total: number; count: number }>,
    );

    const groomerMetrics = transactions
      .filter((t) => t.type === TransactionType.INCOME && t.groomer)
      .reduce(
        (acc, transaction) => {
          const groomerName = transaction.groomer!.name;
          if (!acc[groomerName]) {
            acc[groomerName] = { total: 0, count: 0, commission: 0 };
          }
          acc[groomerName].total += transaction.amount;
          acc[groomerName].count += 1;
          acc[groomerName].commission +=
            transaction.amount *
            (transaction.groomer!.commissionPercentage / 100);
          return acc;
        },
        {} as Record<
          string,
          { total: number; count: number; commission: number }
        >,
      );

    return {
      period: {
        startDate: reportStartDate,
        endDate: reportEndDate,
        type,
      },
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
        transactionCount: transactions.length,
        averageTicket:
          transactions.length > 0
            ? totalIncome /
              transactions.filter((t) => t.type === TransactionType.INCOME)
                .length
            : 0,
      },
      byCategory: categoryMetrics,
      byGroomer: groomerMetrics,
      transactions: transactions.map((t) => ({
        id: t.id,
        type: t.type as TransactionType,
        amount: t.amount,
        description: t.description,
        date: t.date,
        category: t.category.name,
        groomer: t.groomer?.name,
        paymentMethod: t.paymentMethod || '',
      })),
    };
  }

  // ========== RECEITAS AUTOMÁTICAS ==========

  async createAutomaticIncomeFromAppointment(
    appointmentId: string,
  ): Promise<Transaction> {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        client: true,
        pet: true,
        groomer: true,
        appointmentServices: {
          include: {
            service: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Agendamento com ID "${appointmentId}" não encontrado`,
      );
    }

    if (appointment.status !== 'COMPLETED') {
      throw new BadRequestException(
        'Apenas agendamentos concluídos podem gerar receitas automáticas',
      );
    }

    const existingTransaction = await this.prisma.transaction.findFirst({
      where: {
        appointmentId,
        type: TransactionType.INCOME,
      },
    });

    if (existingTransaction) {
      throw new ConflictException(
        'Receita automática já foi criada para este agendamento',
      );
    }

    const serviceCategory = await this.prisma.financialCategory.findFirst({
      where: {
        type: TransactionType.INCOME,
        name: 'Serviços de Banho e Tosa',
      },
    });

    if (!serviceCategory) {
      throw new NotFoundException(
        'Categoria padrão para serviços não encontrada. Cadastre uma categoria de receita primeiro.',
      );
    }

    return this.prisma.transaction.create({
      data: {
        type: TransactionType.INCOME,
        amount: appointment.totalPrice,
        description: `Serviço - ${appointment.pet.name} (${appointment.appointmentServices.map((s) => s.service.name).join(', ')})`,
        date: appointment.dateTime,
        category: { connect: { id: serviceCategory.id } },
        appointment: { connect: { id: appointmentId } },
        groomer: appointment.groomer
          ? { connect: { id: appointment.groomer.id } }
          : undefined,
        paymentMethod: 'Dinheiro', // Pode ser ajustado conforme necessidade
        isCashRegisterClosed: false,
      },
      include: {
        category: true,
        appointment: true,
        groomer: true,
      },
    });
  }

  // ========== MÉTODOS AUXILIARES ==========

  async getFinancialSummary(
    startDate?: Date,
    endDate?: Date,
  ): Promise<FinancialSummary> {
    const where: Prisma.TransactionWhereInput = {};

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      select: {
        type: true,
        amount: true,
      },
    });

    const totalIncome = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      transactionCount: transactions.length,
    };
  }
}
