import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportFiltersDto } from './dto/report-filters.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  async generateReport(
    @Body() filters: ReportFiltersDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.reportsService.generateReport(filters, user);
  }

  @Post('financial')
  async generateFinancialReport(
    @Body() filters: ReportFiltersDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.reportsService.generateReport(
      {
        ...filters,
        type: 'financial' as any,
      },
      user,
    );
  }

  @Post('groomer-performance')
  async generateGroomerPerformanceReport(
    @Body() filters: ReportFiltersDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.reportsService.generateReport(
      {
        ...filters,
        type: 'groomer_performance' as any,
      },
      user,
    );
  }

  @Post('client-analysis')
  async generateClientAnalysisReport(
    @Body() filters: ReportFiltersDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.reportsService.generateReport(
      {
        ...filters,
        type: 'client_analysis' as any,
      },
      user,
    );
  }

  @Post('service-ranking')
  async generateServiceRankingReport(
    @Body() filters: ReportFiltersDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.reportsService.generateReport(
      {
        ...filters,
        type: 'service_ranking' as any,
      },
      user,
    );
  }

  @Post('occupancy-metrics')
  async generateOccupancyMetricsReport(
    @Body() filters: ReportFiltersDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.reportsService.generateReport(
      {
        ...filters,
        type: 'occupancy_metrics' as any,
      },
      user,
    );
  }

  @Post('appointment-analysis')
  async generateAppointmentAnalysisReport(
    @Body() filters: ReportFiltersDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.reportsService.generateReport(
      {
        ...filters,
        type: 'appointment_analysis' as any,
      },
      user,
    );
  }
}
