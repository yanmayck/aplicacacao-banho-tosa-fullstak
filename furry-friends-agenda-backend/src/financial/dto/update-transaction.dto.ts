import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsUUID,
  IsEnum,
  Min,
  MaxLength,
} from 'class-validator';
import { TransactionType, IncomeCategory, ExpenseCategory } from './create-transaction.dto';

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