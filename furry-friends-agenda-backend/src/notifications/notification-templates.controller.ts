import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { NotificationTemplatesService } from './notification-templates.service';
import { CreateNotificationTemplateDto } from './dto/create-notification-template.dto';

@Controller('admin/notification-templates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class NotificationTemplatesController {
  constructor(
    private readonly templatesService: NotificationTemplatesService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  create(@Body() createTemplateDto: CreateNotificationTemplateDto) {
    return this.templatesService.create(createTemplateDto);
  }

  @Get()
  findAll(@Query('type') type?: string, @Query('channel') channel?: string) {
    return this.templatesService.findAll({
      type: type as any,
      channel: channel as any,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.templatesService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTemplateDto: Partial<CreateNotificationTemplateDto>,
  ) {
    return this.templatesService.update(id, updateTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.templatesService.remove(id);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id', ParseUUIDPipe) id: string) {
    return this.templatesService.duplicate(id);
  }

  @Get(':id/preview')
  preview(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() variables?: Record<string, any>,
  ) {
    return this.templatesService.preview(id, variables);
  }
}
