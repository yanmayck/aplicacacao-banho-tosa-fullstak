import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ReportFiltersDto,
  ReportType,
  FinancialReportFiltersDto,
  GroomerPerformanceFiltersDto,
  ClientAnalysisFiltersDto,
  ServiceRankingFiltersDto,
  OccupancyMetricsFiltersDto
} from './dto/report-filters.dto';
import {
  ReportResponseDto,
  FinancialReportDto,
  GroomerPerformanceDto,
  ClientAnalysisDto,
  ServiceRankingDto,
  OccupancyMetricsDto,
  AppointmentAnalysisDto,
  ReportMetadataDto,
  ChartDataPointDto
} from './dto/report-response.dto';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async generateReport(filters: ReportFiltersDto): Promise<ReportResponseDto> {
    const startTime = Date.now();

    try {
      let reportData: any;
      let metadata: ReportMetadataDto;

      switch (filters.type) {
        case ReportType.FINANCIAL:
          reportData = await this.generateFinancialReport(filters as FinancialReportFiltersDto);
          break;
        case ReportType.GROOMER_PERFORMANCE:
          reportData = await this.generateGroomerPerformanceReport(filters as GroomerPerformanceFiltersDto);
          break;
        case ReportType.CLIENT_ANALYSIS:
          reportData = await this.generateClientAnalysisReport(filters as ClientAnalysisFiltersDto);
          break;
        case ReportType.SERVICE_RANKING:
          reportData = await this.generateServiceRankingReport(filters as ServiceRankingFiltersDto);
          break;
        case ReportType.OCCUPANCY_METRICS:
          reportData = await this.generateOccupancyMetricsReport(filters as OccupancyMetricsFiltersDto);
          break;
        case ReportType.APPOINTMENT_ANALYSIS:
          reportData = await this.generateAppointmentAnalysisReport(filters);
          break;
        default:
          throw new BadRequestException('Tipo de relatório inválido');
      }

      const executionTime = Date.now() - startTime;

      metadata = {
        generatedAt: new Date(),
        totalRecords: Array.isArray(reportData) ? reportData.length : 1,
        filters,
        executionTime
      };

      return {
        success: true,
        message: 'Relatório gerado com sucesso',
        metadata,
        data: reportData
      };

    } catch (error) {
      throw new BadRequestException(`Erro ao gerar relatório: ${error.message}`);
    }
  }

  private async generateFinancialReport(filters: FinancialReportFiltersDto): Promise<FinancialReportDto> {
    const { startDate, endDate, transactionType } = filters;

    // Build date filter
    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) dateFilter.date.gte = new Date(startDate);
      if (endDate) dateFilter.date.lte = new Date(endDate);
    }

    // Build transaction type filter
    const typeFilter: any = {};
    if (transactionType && transactionType !== 'both') {
      typeFilter.type = transactionType.toUpperCase();
    }

    // Get all transactions with filters
    const transactions = await this.prisma.transaction.findMany({
      where: {
        ...dateFilter,
        ...typeFilter,
        isCashRegisterClosed: false
      },
      include: {
        category: true,
        appointment: {
          include: {
            client: true,
            groomer: true,
            appointmentServices: {
              include: {
                service: true
              }
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    });

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netProfit = totalIncome - totalExpenses;
    const transactionCount = transactions.length;
    const averageTicket = transactionCount > 0 ? totalIncome / transactionCount : 0;

    // Group by category for charts
    const incomeByCategory = this.groupTransactionsByCategory(transactions.filter(t => t.type === 'INCOME'));
    const expensesByCategory = this.groupTransactionsByCategory(transactions.filter(t => t.type === 'EXPENSE'));

    // Get top categories
    const topIncomeCategory = incomeByCategory.length > 0 ? incomeByCategory[0].label : 'N/A';
    const topExpenseCategory = expensesByCategory.length > 0 ? expensesByCategory[0].label : 'N/A';

    // Generate daily revenue data
    const dailyRevenue = this.generateDailyRevenueData(transactions);

    // Generate monthly trends
    const monthlyTrends = this.generateMonthlyTrends(transactions);

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      transactionCount,
      averageTicket,
      topIncomeCategory,
      topExpenseCategory,
      incomeByCategory,
      expensesByCategory,
      dailyRevenue,
      monthlyTrends
    };
  }

  private async generateGroomerPerformanceReport(filters: GroomerPerformanceFiltersDto): Promise<GroomerPerformanceDto[]> {
    const { startDate, endDate, groomerIds } = filters;

    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.dateTime = {};
      if (startDate) dateFilter.dateTime.gte = new Date(startDate);
      if (endDate) dateFilter.dateTime.lte = new Date(endDate);
    }

    const groomerFilter = groomerIds ? { id: { in: groomerIds } } : {};

    // Get groomers with their performance data
    const groomers = await this.prisma.groomer.findMany({
      where: groomerFilter,
      include: {
        appointments: {
          where: dateFilter,
          include: {
            client: true,
            appointmentServices: {
              include: {
                service: true
              }
            }
          }
        },
        receivedReviews: {
          where: {
            isApproved: true,
            isVisible: true
          }
        },
        transactions: {
          where: {
            ...dateFilter,
            type: 'INCOME'
          }
        },
        commissions: {
          where: {
            ...dateFilter,
            isPaid: true
          }
        }
      }
    });

    return groomers.map(groomer => {
      const appointments = groomer.appointments || [];
      const completedAppointments = appointments.filter((a: any) => a.status === 'COMPLETED');
      const totalRevenue = appointments
        .filter((a: any) => a.status === 'COMPLETED')
        .reduce((sum: number, a: any) => sum + a.totalPrice, 0);

      const totalCommissions = (groomer.commissions || []).reduce((sum: number, c: any) => sum + c.commissionAmount, 0);

      const averageRating = (groomer.receivedReviews || []).length > 0
        ? (groomer.receivedReviews || []).reduce((sum: number, r: any) => sum + r.rating, 0) / (groomer.receivedReviews || []).length
        : 0;

      const efficiency = appointments.length > 0
        ? (completedAppointments.length / appointments.length) * 100
        : 0;

      // Top services by this groomer
      const serviceCount = new Map<string, number>();
      appointments.forEach((appointment: any) => {
        (appointment.appointmentServices || []).forEach((as: any) => {
          const serviceName = as.service?.name || 'Serviço sem nome';
          serviceCount.set(serviceName, (serviceCount.get(serviceName) || 0) + 1);
        });
      });

      const topServices: ChartDataPointDto[] = Array.from(serviceCount.entries())
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // Monthly performance trend
      const monthlyPerformance = this.generateMonthlyPerformanceData(appointments);

      // Client retention (simplified calculation)
      const uniqueClients = new Set(appointments.map((a: any) => a.clientId)).size;
      const clientRetention = appointments.length > 0 ? (uniqueClients / appointments.length) * 100 : 0;

      return {
        groomerId: groomer.id,
        groomerName: groomer.name,
        totalAppointments: appointments.length,
        completedAppointments: completedAppointments.length,
        totalRevenue,
        totalCommissions,
        averageRating,
        efficiency,
        topServices,
        monthlyPerformance,
        clientRetention
      };
    });
  }

  private async generateClientAnalysisReport(filters: ClientAnalysisFiltersDto): Promise<ClientAnalysisDto> {
    const { startDate, endDate } = filters;

    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.lte = new Date(endDate);
    }

    // Get all clients
    const clients = await this.prisma.client.findMany({
      include: {
        appointments: true,
        loyaltyPoint: true
      }
    });

    const totalClients = clients.length;

    // Calculate new vs recurring clients (simplified)
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const newClients = clients.filter((client: any) => {
      const createdAt = new Date(client.createdAt);
      return createdAt >= threeMonthsAgo;
    }).length;

    const recurringClients = totalClients - newClients;

    // Calculate churned clients (no appointments in last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const churnedClients = clients.filter((client: any) => {
      const lastAppointment = client.appointments?.length > 0
        ? new Date(Math.max(...client.appointments.map((a: any) => new Date(a.dateTime).getTime())))
        : new Date(0);
      return lastAppointment < sixMonthsAgo;
    }).length;

    // Calculate averages
    const totalVisits = clients.reduce((sum: number, client: any) => sum + (client.appointments?.length || 0), 0);
    const averageVisitsPerClient = totalClients > 0 ? totalVisits / totalClients : 0;

    // Calculate total spent (simplified)
    const totalSpent = clients.reduce((sum: number, client: any) => {
      return sum + (client.appointments || []).reduce((appointmentSum: number, appointment: any) => {
        return appointmentSum + (appointment.totalPrice || 0);
      }, 0);
    }, 0);

    const averageSpentPerClient = totalClients > 0 ? totalSpent / totalClients : 0;

    // Calculate retention and churn rates
    const retentionRate = totalClients > 0 ? ((totalClients - churnedClients) / totalClients) * 100 : 0;
    const churnRate = totalClients > 0 ? (churnedClients / totalClients) * 100 : 0;

    // Client segmentation by visit frequency
    const clientSegmentation = this.generateClientSegmentation(clients);

    // Acquisition trends (clients acquired per month)
    const acquisitionTrends = this.generateAcquisitionTrends(clients);

    // Loyalty distribution
    const loyaltyDistribution = this.generateLoyaltyDistribution(clients);

    return {
      totalClients,
      newClients,
      recurringClients,
      churnedClients,
      averageVisitsPerClient,
      averageSpentPerClient,
      retentionRate,
      churnRate,
      clientSegmentation,
      acquisitionTrends,
      loyaltyDistribution
    };
  }

  private async generateServiceRankingReport(filters: ServiceRankingFiltersDto): Promise<ServiceRankingDto[]> {
    const { startDate, endDate } = filters;

    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.dateTime = {};
      if (startDate) dateFilter.dateTime.gte = new Date(startDate);
      if (endDate) dateFilter.dateTime.lte = new Date(endDate);
    }

    // Get services with appointment data
    const services = await this.prisma.servicePackage.findMany({
      include: {
        appointmentServices: {
          where: dateFilter,
          include: {
            appointment: {
              include: {
                reviews: true
              }
            }
          }
        }
      }
    });

    return services.map(service => {
      const appointmentServices = service.appointmentServices;
      const totalBookings = appointmentServices.length;

      const totalRevenue = appointmentServices.reduce((sum, as) => sum + as.priceAtTime, 0);

      // Calculate average rating from related appointments
      const ratings = appointmentServices
        .map(as => as.appointment.reviews)
        .flat()
        .filter(review => review && review.rating)
        .map(review => review.rating);

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
        : 0;

      // Calculate popularity score (bookings * average rating)
      const popularityScore = totalBookings * averageRating;

      // Calculate profitability index (revenue per booking)
      const profitabilityIndex = totalBookings > 0 ? totalRevenue / totalBookings : 0;

      // Simple trend calculation (comparing first half vs second half of period)
      const trend = this.calculateTrend(appointmentServices);

      // Growth rate calculation
      const growthRate = this.calculateGrowthRate(appointmentServices);

      return {
        serviceId: service.id,
        serviceName: service.name,
        totalBookings,
        totalRevenue,
        averageRating,
        popularityScore,
        profitabilityIndex,
        trend,
        growthRate
      };
    }).sort((a, b) => b.popularityScore - a.popularityScore);
  }

  private async generateOccupancyMetricsReport(filters: OccupancyMetricsFiltersDto): Promise<OccupancyMetricsDto> {
    const { startDate, endDate } = filters;

    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.dateTime = {};
      if (startDate) dateFilter.dateTime.gte = new Date(startDate);
      if (endDate) dateFilter.dateTime.lte = new Date(endDate);
    }

    // Get appointments for the period
    const appointments = await this.prisma.appointment.findMany({
      where: dateFilter,
      include: {
        groomer: true
      }
    });

    // Assuming 8 working hours per day and 5 groomers as capacity
    const workingHoursPerDay = 8;
    const totalGroomers = await this.prisma.groomer.count();
    const totalCapacity = workingHoursPerDay * totalGroomers;

    // Calculate occupancy metrics
    const dailyOccupancy = this.generateDailyOccupancyData(appointments);
    const averageOccupancy = dailyOccupancy.length > 0
      ? dailyOccupancy.reduce((sum, day) => sum + day.value, 0) / dailyOccupancy.length
      : 0;

    const peakHours = this.generatePeakHoursData(appointments);
    const weeklyTrends = this.generateWeeklyTrends(appointments);

    const utilizationRate = totalCapacity > 0 ? (averageOccupancy / totalCapacity) * 100 : 0;

    // Calculate idle time (simplified)
    const idleTime = Math.max(0, totalCapacity - averageOccupancy);

    // Find busiest and slowest days
    const dayNames = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const busiestDay = dailyOccupancy.length > 0 ? dailyOccupancy.reduce((max, day) => day.value > max.value ? day : max).label : 'N/A';
    const slowestDay = dailyOccupancy.length > 0 ? dailyOccupancy.reduce((min, day) => day.value < min.value ? day : min).label : 'N/A';

    return {
      totalCapacity,
      averageOccupancy,
      peakHours,
      dailyOccupancy,
      weeklyTrends,
      utilizationRate,
      idleTime,
      busiestDay,
      slowestDay
    };
  }

  private async generateAppointmentAnalysisReport(filters: ReportFiltersDto): Promise<AppointmentAnalysisDto> {
    const { startDate, endDate } = filters;

    const dateFilter: any = {};
    if (startDate || endDate) {
      dateFilter.dateTime = {};
      if (startDate) dateFilter.dateTime.gte = new Date(startDate);
      if (endDate) dateFilter.dateTime.lte = new Date(endDate);
    }

    const appointments = await this.prisma.appointment.findMany({
      where: dateFilter,
      include: {
        groomer: true,
        client: true,
        appointmentServices: {
          include: {
            service: true
          }
        }
      }
    });

    const totalAppointments = appointments.length;
    const scheduledAppointments = appointments.filter(a => a.status === 'SCHEDULED').length;
    const completedAppointments = appointments.filter(a => a.status === 'COMPLETED').length;
    const cancelledAppointments = appointments.filter(a => a.status === 'CANCELLED').length;
    const noShowAppointments = appointments.filter(a => a.status === 'NO_SHOW').length;

    const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;
    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0;
    const noShowRate = totalAppointments > 0 ? (noShowAppointments / totalAppointments) * 100 : 0;

    // Status distribution for charts
    const statusDistribution: ChartDataPointDto[] = [
      { label: 'Agendados', value: scheduledAppointments },
      { label: 'Concluídos', value: completedAppointments },
      { label: 'Cancelados', value: cancelledAppointments },
      { label: 'Faltaram', value: noShowAppointments }
    ];

    // Time distribution (by hour)
    const timeDistribution = this.generateTimeDistribution(appointments);

    // Groomer workload distribution
    const groomerWorkload = this.generateGroomerWorkload(appointments);

    return {
      totalAppointments,
      scheduledAppointments,
      completedAppointments,
      cancelledAppointments,
      noShowAppointments,
      completionRate,
      cancellationRate,
      noShowRate,
      statusDistribution,
      timeDistribution,
      groomerWorkload
    };
  }

  // Helper methods for data aggregation
  private groupTransactionsByCategory(transactions: any[]): ChartDataPointDto[] {
    const categoryMap = new Map<string, number>();

    transactions.forEach(transaction => {
      const categoryName = transaction.category?.name || 'Sem categoria';
      const currentAmount = categoryMap.get(categoryName) || 0;
      categoryMap.set(categoryName, currentAmount + transaction.amount);
    });

    return Array.from(categoryMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }

  private generateDailyRevenueData(transactions: any[]): ChartDataPointDto[] {
    const dailyMap = new Map<string, number>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date).toISOString().split('T')[0];
      const currentAmount = dailyMap.get(date) || 0;
      dailyMap.set(date, currentAmount + transaction.amount);
    });

    return Array.from(dailyMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private generateMonthlyTrends(transactions: any[]): ChartDataPointDto[] {
    const monthlyMap = new Map<string, number>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const currentAmount = monthlyMap.get(monthKey) || 0;
      monthlyMap.set(monthKey, currentAmount + transaction.amount);
    });

    return Array.from(monthlyMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private generateMonthlyPerformanceData(appointments: any[]): ChartDataPointDto[] {
    const monthlyMap = new Map<string, number>();

    appointments.forEach(appointment => {
      const date = new Date(appointment.dateTime);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const currentCount = monthlyMap.get(monthKey) || 0;
      monthlyMap.set(monthKey, currentCount + 1);
    });

    return Array.from(monthlyMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private generateClientSegmentation(clients: any[]): ChartDataPointDto[] {
    const segments = new Map<string, number>();

    clients.forEach(client => {
      const visitCount = client.appointments.length;
      let segment: string;

      if (visitCount === 1) segment = 'Primeira visita';
      else if (visitCount <= 3) segment = 'Poucas visitas';
      else if (visitCount <= 10) segment = 'Cliente regular';
      else segment = 'Cliente VIP';

      segments.set(segment, (segments.get(segment) || 0) + 1);
    });

    return Array.from(segments.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }

  private generateAcquisitionTrends(clients: any[]): ChartDataPointDto[] {
    const monthlyMap = new Map<string, number>();

    clients.forEach(client => {
      if (client.appointments.length > 0) {
        const firstAppointment = client.appointments.reduce((earliest, current) => {
          return new Date(current.dateTime) < new Date(earliest.dateTime) ? current : earliest;
        });

        const date = new Date(firstAppointment.dateTime);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        monthlyMap.set(monthKey, (monthlyMap.get(monthKey) || 0) + 1);
      }
    });

    return Array.from(monthlyMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private generateLoyaltyDistribution(clients: any[]): ChartDataPointDto[] {
    const distribution = new Map<string, number>();

    clients.forEach(client => {
      const points = client.loyaltyPoint?.points || 0;
      let tier: string;

      if (points === 0) tier = 'Sem pontos';
      else if (points < 100) tier = 'Bronze';
      else if (points < 500) tier = 'Prata';
      else tier = 'Ouro';

      distribution.set(tier, (distribution.get(tier) || 0) + 1);
    });

    return Array.from(distribution.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }

  private calculateTrend(appointmentServices: any[]): 'up' | 'down' | 'stable' {
    if (appointmentServices.length < 4) return 'stable';

    const midPoint = Math.floor(appointmentServices.length / 2);
    const firstHalf = appointmentServices.slice(0, midPoint);
    const secondHalf = appointmentServices.slice(midPoint);

    const firstHalfAvg = firstHalf.length;
    const secondHalfAvg = secondHalf.length;

    const change = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;

    if (change > 10) return 'up';
    if (change < -10) return 'down';
    return 'stable';
  }

  private calculateGrowthRate(appointmentServices: any[]): number {
    if (appointmentServices.length < 2) return 0;

    const sorted = appointmentServices.sort((a, b) =>
      new Date(a.appointment.dateTime).getTime() - new Date(b.appointment.dateTime).getTime()
    );

    const first = sorted[0];
    const last = sorted[sorted.length - 1];

    const timeDiff = new Date(last.appointment.dateTime).getTime() - new Date(first.appointment.dateTime).getTime();
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    if (daysDiff === 0) return 0;

    const growth = sorted.length - 1;
    return (growth / daysDiff) * 30; // Growth rate per month
  }

  private generateDailyOccupancyData(appointments: any[]): ChartDataPointDto[] {
    const dailyMap = new Map<string, number>();

    appointments.forEach(appointment => {
      const date = new Date(appointment.dateTime).toISOString().split('T')[0];
      const dayName = new Date(appointment.dateTime).toLocaleDateString('pt-BR', { weekday: 'long' });
      const key = `${date} - ${dayName}`;

      // Assuming each appointment takes 1 hour of capacity
      dailyMap.set(key, (dailyMap.get(key) || 0) + 1);
    });

    return Array.from(dailyMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private generatePeakHoursData(appointments: any[]): ChartDataPointDto[] {
    const hourlyMap = new Map<number, number>();

    appointments.forEach(appointment => {
      const hour = new Date(appointment.dateTime).getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    return Array.from(hourlyMap.entries())
      .map(([label, value]) => ({ label: `${label}h`, value }))
      .sort((a, b) => parseInt(a.label) - parseInt(b.label));
  }

  private generateWeeklyTrends(appointments: any[]): ChartDataPointDto[] {
    const weeklyMap = new Map<string, number>();

    appointments.forEach(appointment => {
      const date = new Date(appointment.dateTime);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      weeklyMap.set(weekKey, (weeklyMap.get(weekKey) || 0) + 1);
    });

    return Array.from(weeklyMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }

  private generateTimeDistribution(appointments: any[]): ChartDataPointDto[] {
    const hourlyMap = new Map<number, number>();

    appointments.forEach(appointment => {
      const hour = new Date(appointment.dateTime).getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    return Array.from(hourlyMap.entries())
      .map(([label, value]) => ({ label: `${label}:00`, value }))
      .sort((a, b) => parseInt(a.label.split(':')[0]) - parseInt(b.label.split(':')[0]));
  }

  private generateGroomerWorkload(appointments: any[]): ChartDataPointDto[] {
    const groomerMap = new Map<string, number>();

    appointments.forEach(appointment => {
      if (appointment.groomer) {
        const groomerName = appointment.groomer.name;
        groomerMap.set(groomerName, (groomerMap.get(groomerName) || 0) + 1);
      }
    });

    return Array.from(groomerMap.entries())
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }
}