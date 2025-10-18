export class ReportMetadataDto {
  generatedAt: Date;
  generatedBy?: string;
  totalRecords: number;
  filters: Record<string, any>;
  executionTime: number; // in milliseconds
}

export class ChartDataPointDto {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}

export class FinancialReportDto {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
  averageTicket: number;
  topIncomeCategory: string;
  topExpenseCategory: string;
  incomeByCategory: ChartDataPointDto[];
  expensesByCategory: ChartDataPointDto[];
  dailyRevenue: ChartDataPointDto[];
  monthlyTrends: ChartDataPointDto[];
}

export class GroomerPerformanceDto {
  groomerId: string;
  groomerName: string;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  totalCommissions: number;
  averageRating: number;
  efficiency: number; // percentage
  topServices: ChartDataPointDto[];
  monthlyPerformance: ChartDataPointDto[];
  clientRetention: number;
}

export class ClientAnalysisDto {
  totalClients: number;
  newClients: number;
  recurringClients: number;
  churnedClients: number;
  averageVisitsPerClient: number;
  averageSpentPerClient: number;
  retentionRate: number;
  churnRate: number;
  clientSegmentation: ChartDataPointDto[];
  acquisitionTrends: ChartDataPointDto[];
  loyaltyDistribution: ChartDataPointDto[];
}

export class ServiceRankingDto {
  serviceId: string;
  serviceName: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
  popularityScore: number;
  profitabilityIndex: number;
  trend: 'up' | 'down' | 'stable';
  growthRate: number;
}

export class OccupancyMetricsDto {
  totalCapacity: number;
  averageOccupancy: number;
  peakHours: ChartDataPointDto[];
  dailyOccupancy: ChartDataPointDto[];
  weeklyTrends: ChartDataPointDto[];
  utilizationRate: number;
  idleTime: number;
  busiestDay: string;
  slowestDay: string;
}

export class AppointmentAnalysisDto {
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  statusDistribution: ChartDataPointDto[];
  timeDistribution: ChartDataPointDto[];
  groomerWorkload: ChartDataPointDto[];
}

export class ReportResponseDto {
  success: boolean;
  message: string;
  metadata: ReportMetadataDto;
  data: FinancialReportDto | GroomerPerformanceDto[] | ClientAnalysisDto | ServiceRankingDto[] | OccupancyMetricsDto | AppointmentAnalysisDto;
  exportUrl?: string;
  scheduledFor?: Date;
}