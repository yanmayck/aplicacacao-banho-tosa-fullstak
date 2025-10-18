import { Controller, Post, Body, UseGuards, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportFiltersDto } from './dto/report-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  async generateReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport(filters);
  }

  @Post('financial')
  async generateFinancialReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: 'financial' as any
    });
  }

  @Post('groomer-performance')
  async generateGroomerPerformanceReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: 'groomer_performance' as any
    });
  }

  @Post('client-analysis')
  async generateClientAnalysisReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: 'client_analysis' as any
    });
  }

  @Post('service-ranking')
  async generateServiceRankingReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: 'service_ranking' as any
    });
  }

  @Post('occupancy-metrics')
  async generateOccupancyMetricsReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: 'occupancy_metrics' as any
    });
  }

  @Post('appointment-analysis')
  async generateAppointmentAnalysisReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: 'appointment_analysis' as any
    });
  }
}