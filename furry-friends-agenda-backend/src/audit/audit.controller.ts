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
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createLog(@Body() createLogDto: any, @Request() req: { user: JwtPayload }) {
    return this.auditService.createLog(createLogDto, req.user.userId);
  }

  @Get('logs')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findAllLogs(@Query() query: AuditLogQueryDto) {
    return this.auditService.findLogs(query);
  }

  @Get('logs/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  findLogById(@Param('id', ParseUUIDPipe) id: string) {
    return this.auditService.findLogById(id);
  }

  @Get('logs/entity/:entityType/:entityId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getLogsByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.getLogsByEntity(entityType, entityId);
  }

  @Get('logs/user/:userId')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getLogsByUser(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.auditService.getLogsByUser(userId);
  }

  @Get('logs/module/:module')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getLogsByModule(
    @Param('module') module: string,
    @Query() filters?: AuditLogFiltersDto,
  ) {
    return this.auditService.getLogsByModule(module, filters);
  }

  // ========== ESTATÍSTICAS E RELATÓRIOS ==========

  @Get('statistics')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getAuditStatistics(
    @Request() req: { user: JwtPayload },
    @Query() filters?: AuditLogFiltersDto,
  ) {
    return this.auditService.getAuditStatistics(filters);
  }

  @Get('reports')
  @Roles(UserRole.ADMIN, UserRole.USER)
  generateAuditReport(
    @Request() req: { user: JwtPayload },
    @Query() filters?: AuditLogFiltersDto,
  ) {
    return this.auditService.generateAuditReport(filters || {});
  }

  // ========== CONFIGURAÇÕES ==========

  @Get('config')
  @Roles(UserRole.ADMIN)
  getAuditConfig(@Request() req: { user: JwtPayload }) {
    return this.auditService.getAuditConfig();
  }

  @Patch('config')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateAuditConfig(
    @Body() configData: any,
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.updateAuditConfig(configData);
  }

  // ========== FILTROS SALVOS ==========

  @Post('filters')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  saveFilter(
    @Body() filterData: { name: string; description?: string; filters: any },
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.saveFilter(
      filterData.name,
      filterData.description || '',
      filterData.filters,
      req.user.userId,
    );
  }

  @Get('filters')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getSavedFilters(@Request() req: { user: JwtPayload }) {
    return this.auditService.getSavedFilters(req.user.userId);
  }

  @Get('filters/public')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getPublicFilters() {
    return this.auditService.getSavedFilters();
  }

  @Delete('filters/:id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  deleteSavedFilter(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.deleteSavedFilter(id, req.user.userId);
  }

  // ========== ALERTAS ==========

  @Post('alerts')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  createAlert(@Body() alertData: any, @Request() req: { user: JwtPayload }) {
    return this.auditService.createAlert(alertData, req.user.userId);
  }

  @Get('alerts')
  @Roles(UserRole.ADMIN, UserRole.USER)
  getAlerts(@Request() req: { user: JwtPayload }) {
    return this.auditService.getAlerts(req.user.userId);
  }

  @Patch('alerts/:id')
  @Roles(UserRole.ADMIN)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updateAlert(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() alertData: any,
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.updateAlert(id, alertData, req.user.userId);
  }

  @Delete('alerts/:id')
  @Roles(UserRole.ADMIN)
  deleteAlert(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: { user: JwtPayload },
  ) {
    return this.auditService.deleteAlert(id, req.user.userId);
  }

  // ========== MANUTENÇÃO ==========

  @Post('maintenance/archive')
  @Roles(UserRole.ADMIN)
  archiveOldLogs(@Request() req: { user: JwtPayload }) {
    return this.auditService.archiveOldLogs();
  }

  @Post('maintenance/cleanup')
  @Roles(UserRole.ADMIN)
  cleanupOldLogs(@Request() req: { user: JwtPayload }) {
    return this.auditService.deleteOldLogs();
  }
}
