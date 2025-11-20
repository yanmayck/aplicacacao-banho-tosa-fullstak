// Interfaces específicas para relatórios
export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export interface DateFilter {
  date?: {
    gte?: Date;
    lte?: Date;
  };
  dateTime?: {
    gte?: Date;
    lte?: Date;
  };
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface TypeFilter {
  type?: string;
}

export interface BaseReportData {
  totalIncome?: number;
  totalExpenses?: number;
  netProfit?: number;
  transactionCount?: number;
  averageTicket?: number;
  topIncomeCategory?: string;
  topExpenseCategory?: string;
  incomeByCategory?: Array<{
    label: string;
    value: number;
  }>;
  expensesByCategory?: Array<{
    label: string;
    value: number;
  }>;
  dailyRevenue?: Array<{
    label: string;
    value: number;
  }>;
  monthlyTrends?: Array<{
    label: string;
    value: number;
  }>;
}

export interface GroomerReportData {
  groomerId: string;
  groomerName: string;
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  totalCommissions: number;
  averageRating: number;
  efficiency: number;
  topServices: Array<{
    label: string;
    value: number;
  }>;
  monthlyPerformance: Array<{
    label: string;
    value: number;
  }>;
  clientRetention: number;
}

export interface ClientAnalysisData {
  totalClients: number;
  newClients: number;
  recurringClients: number;
  churnedClients: number;
  averageVisitsPerClient: number;
  averageSpentPerClient: number;
  retentionRate: number;
  churnRate: number;
  clientSegmentation: Array<{
    label: string;
    value: number;
  }>;
  acquisitionTrends: Array<{
    label: string;
    value: number;
  }>;
  loyaltyDistribution: Array<{
    label: string;
    value: number;
  }>;
}

export interface ServiceRankingData {
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

export interface OccupancyMetricsData {
  totalCapacity: number;
  averageOccupancy: number;
  peakHours: Array<{
    label: string;
    value: number;
  }>;
  dailyOccupancy: Array<{
    label: string;
    value: number;
  }>;
  weeklyTrends: Array<{
    label: string;
    value: number;
  }>;
  utilizationRate: number;
  idleTime: number;
  busiestDay: string;
  slowestDay: string;
}

export interface AppointmentAnalysisData {
  totalAppointments: number;
  scheduledAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
  statusDistribution: Array<{
    label: string;
    value: number;
  }>;
  timeDistribution: Array<{
    label: string;
    value: number;
  }>;
  groomerWorkload: Array<{
    label: string;
    value: number;
  }>;
}
