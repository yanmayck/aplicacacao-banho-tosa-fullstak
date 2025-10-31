
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
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditService } from './audit.service';
import { AuditLogQueryDto, AuditLogFiltersDto } from './dto/audit-log.dto';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  // ========== LOGS DE AUDITORIA ==========

  @Post('logs')
  @Roles(UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createLog(@Body() createLogDto: any, @Request() req: { user: JwtPayload }) {
    return this.auditService.createLog(createLogDto, undefined, undefined, req.user);
  }

  @Get('logs')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  findAllLogs(
    @Query() query: AuditLogQueryDto,
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.findLogs(query, req.user);
  }

  @Get('logs/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  findLogById(@Param('id', ParseUUIDPipe) id: string) {
    return this.auditService.findLogById(id);
  }

  @Get('logs/entity/:entityType/:entityId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  getLogsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.getLogsByEntity(entityType, entityId);
  }

  @Get('logs/user/:userId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  getLogsByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.auditService.getLogsByUser(userId);
  }

  @Get('logs/module/:module')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  getLogsByModule(
    @Param('module') module: string,
    @Query() filters?: AuditLogFiltersDto,
  ) {
    return this.auditService.getLogsByModule(module, filters);
  }

  // ========== ESTATÍSTICAS E RELATÓRIOS ==========

  @Get('statistics')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  getAuditStatistics(@Query() filters?: AuditLogFiltersDto) {
    return this.auditService.getAuditStatistics(filters || {});
  }

  @Get('reports')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  generateAuditReport(@Query() filters?: AuditLogFiltersDto) {
    return this.auditService.generateAuditReport(filters || {});
  }

  // ========== CONFIGURAÇÕES ==========

  @Get('config')
  @Roles(UserRole.SUPER_ADMIN)
  getAuditConfig() {
    return this.auditService.getAuditConfig();
  }

  @Patch('config')
  @Roles(UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateAuditConfig(@Body() configData: any) {
    return this.auditService.updateAuditConfig(configData);
  }

  // ========== FILTROS SALVOS ==========

  @Post('filters')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  saveFilter(
    @Body() filterData: { name: string; description?: string; filters: any },
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.saveFilter(
      filterData.name,
      filterData.description || '',
      filterData.filters,
      req.user,
    );
  }

  @Get('filters')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  getSavedFilters(@Request() req: { user: JwtPayload }) {
    return this.auditService.getSavedFilters(req.user);
  }

  @Get('filters/public')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  getPublicFilters() {
    return this.auditService.getPublicFilters();
  }

  @Delete('filters/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  deleteSavedFilter(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.deleteSavedFilter(id, req.user);
  }

  // ========== ALERTAS ==========

  @Post('alerts')
  @Roles(UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createAlert(@Body() alertData: any, @Request() req: { user: JwtPayload }) {
    return this.auditService.createAlert(alertData, req.user);
  }

  @Get('alerts')
  @Roles(UserRole.SUPER_ADMIN, UserRole.COMPANY_ADMIN)
  getAlerts(@Request() req: { user: JwtPayload }) {
    return this.auditService.getAlerts(req.user);
  }

  @Patch('alerts/:id')
  @Roles(UserRole.SUPER_ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateAlert(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() alertData: any,
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.updateAlert(id, alertData, req.user);
  }

  @Delete('alerts/:id')
  @Roles(UserRole.SUPER_ADMIN)
  deleteAlert(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.deleteAlert(id, req.user);
  }

  // ========== MANUTENÇÃO ==========

  @Post('maintenance/archive')
  @Roles(UserRole.SUPER_ADMIN)
  archiveOldLogs() {
    return this.auditService.archiveOldLogs();
  }

  @Post('maintenance/cleanup')
  @Roles(UserRole.SUPER_ADMIN)
  cleanupOldLogs() {
    return this.auditService.deleteOldLogs();
  }
}
