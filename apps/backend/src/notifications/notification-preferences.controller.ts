import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtClientGuard } from '../public-client/guards/jwt-client.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { NotificationPreferencesService } from './notification-preferences.service';

@Controller('client/notification-preferences')
@UseGuards(JwtClientGuard)
export class ClientNotificationPreferencesController {
  constructor(
    private readonly preferencesService: NotificationPreferencesService,
  ) {}

  @Get()
  getPreferences(@Request() req: { user: { sub: string } }) {
    return this.preferencesService.getUserPreferences('client', req.user.sub);
  }

  @Patch()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updatePreferences(
    @Request() req: { user: { sub: string } },
    @Body() preferences: Record<string, Record<string, boolean>>,
  ) {
    return this.preferencesService.updateUserPreferences(
      'client',
      req.user.sub,
      preferences,
    );
  }

  @Post('reset')
  resetToDefaults(@Request() req: { user: { sub: string } }) {
    return this.preferencesService.resetToDefaults('client', req.user.sub);
  }

  @Post('bulk-update')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  bulkUpdate(
    @Request() req: { user: { sub: string } },
    @Body()
    updates: Array<{
      notificationType: string;
      channel: string;
      enabled: boolean;
    }>,
  ) {
    return this.preferencesService.bulkUpdatePreferences(
      'client' as any,
      req.user.sub,
      updates as any,
    );
  }
}

@Controller('groomer/notification-preferences')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class GroomerNotificationPreferencesController {
  constructor(
    private readonly preferencesService: NotificationPreferencesService,
  ) {}

  @Get(':groomerId')
  getPreferences(@Param('groomerId', ParseUUIDPipe) groomerId: string) {
    return this.preferencesService.getUserPreferences('groomer', groomerId);
  }

  @Patch(':groomerId')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  updatePreferences(
    @Param('groomerId', ParseUUIDPipe) groomerId: string,
    @Body() preferences: Record<string, Record<string, boolean>>,
  ) {
    return this.preferencesService.updateUserPreferences(
      'groomer',
      groomerId,
      preferences,
    );
  }

  @Post(':groomerId/reset')
  resetToDefaults(@Param('groomerId', ParseUUIDPipe) groomerId: string) {
    return this.preferencesService.resetToDefaults('groomer', groomerId);
  }
}

@Controller('admin/notification-preferences')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminNotificationPreferencesController {
  constructor(
    private readonly preferencesService: NotificationPreferencesService,
  ) {}

  @Get('stats')
  getStats() {
    return this.preferencesService.getPreferenceStats();
  }
}
