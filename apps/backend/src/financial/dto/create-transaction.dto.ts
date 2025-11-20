import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsDateString,
  IsOptional,
  IsUUID,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';

// Enums locais (serão substituídos pelos do Prisma após generate)
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export enum IncomeCategory {
  SERVICE_PAYMENT = 'SERVICE_PAYMENT',
  PACKAGE_PAYMENT = 'PACKAGE_PAYMENT',
  OTHER_INCOME = 'OTHER_INCOME',
}

export enum ExpenseCategory {
  OPERATIONAL_COSTS = 'OPERATIONAL_COSTS',
  STAFF_SALARY = 'STAFF_SALARY',
  PRODUCTS = 'PRODUCTS',
  MAINTENANCE = 'MAINTENANCE',
  MARKETING = 'MARKETING',
  UTILITIES = 'UTILITIES',
  RENT = 'RENT',
  OTHER_EXPENSE = 'OTHER_EXPENSE',
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  // Relacionamentos opcionais
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsOptional()
  @IsUUID()
  groomerId?: string;

  @IsOptional()
  @IsUUID()
  cashRegisterId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  receiptUrl?: string;

  // Campos específicos para receitas
  @IsOptional()
  @IsEnum(IncomeCategory)
  incomeCategory?: IncomeCategory;

  // Campos específicos para despesas
  @IsOptional()
  @IsEnum(ExpenseCategory)
  expenseCategory?: ExpenseCategory;
}

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsNumber()
  @Min(0.01)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  description: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  // Relacionamentos opcionais
  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsOptional()
  @IsUUID()
  groomerId?: string;

  @IsOptional()
  @IsUUID()
  cashRegisterId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  receiptUrl?: string;

  // Campos específicos para receitas
  @IsOptional()
  @IsEnum(IncomeCategory)
  incomeCategory?: IncomeCategory;

  // Campos específicos para despesas
  @IsOptional()
  @IsEnum(ExpenseCategory)
  expenseCategory?: ExpenseCategory;
}
