import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportFiltersDto, ReportType } from './dto/report-filters.dto';
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
      type: ReportType.FINANCIAL,
    });
  }

  @Post('groomer-performance')
  async generateGroomerPerformanceReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: ReportType.GROOMER_PERFORMANCE,
    });
  }

  @Post('client-analysis')
  async generateClientAnalysisReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: ReportType.CLIENT_ANALYSIS,
    });
  }

  @Post('service-ranking')
  async generateServiceRankingReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: ReportType.SERVICE_RANKING,
    });
  }

  @Post('occupancy-metrics')
  async generateOccupancyMetricsReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: ReportType.OCCUPANCY_METRICS,
    });
  }

  @Post('appointment-analysis')
  async generateAppointmentAnalysisReport(@Body() filters: ReportFiltersDto) {
    return this.reportsService.generateReport({
      ...filters,
      type: ReportType.APPOINTMENT_ANALYSIS,
    });
  }
}
