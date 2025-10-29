import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { PluginsService } from './plugins.service';
import { PluginConfig, PluginFilter, PluginSort } from '../types/plugin.types';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('plugins')
@UseGuards(JwtAuthGuard)
export class PluginsController {
  private readonly logger = new Logger(PluginsController.name);

  constructor(private readonly pluginsService: PluginsService) {}

  /**
   * Lista plugins instalados
   */
  @Get()
  async listPlugins(
    @Query() filter: PluginFilter,
    @Query('sort') sortQuery: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    let sort: PluginSort | undefined;

    if (sortQuery) {
      try {
        sort = JSON.parse(sortQuery);
      } catch (error) {
        this.logger.warn('Invalid sort parameter', error);
      }
    }

    return this.pluginsService.listPlugins(filter, sort, page, limit);
  }

  /**
   * Lista plugins disponíveis para instalação
   */
  @Get('available')
  async getAvailablePlugins() {
    return {
      plugins: this.pluginsService.getAvailablePlugins(),
    };
  }

  /**
   * Obtém detalhes de um plugin específico
   */
  @Get(':name')
  async getPluginDetails(@Param('name') pluginName: string) {
    return this.pluginsService.getPluginDetails(pluginName);
  }

  /**
   * Carrega e registra um plugin
   */
  @Post(':name/load')
  async loadAndRegisterPlugin(@Param('name') pluginName: string) {
    return this.pluginsService.loadAndRegisterPlugin(pluginName);
  }

  /**
   * Instala um plugin
   */
  @Post(':name/install')
  async installPlugin(@Param('name') pluginName: string) {
    return this.pluginsService.installPlugin(pluginName);
  }

  /**
   * Ativa um plugin
   */
  @Post(':name/enable')
  async enablePlugin(@Param('name') pluginName: string) {
    return this.pluginsService.enablePlugin(pluginName);
  }

  /**
   * Desativa um plugin
   */
  @Post(':name/disable')
  async disablePlugin(@Param('name') pluginName: string) {
    return this.pluginsService.disablePlugin(pluginName);
  }

  /**
   * Desinstala um plugin
   */
  @Delete(':name')
  async uninstallPlugin(@Param('name') pluginName: string) {
    return this.pluginsService.uninstallPlugin(pluginName);
  }

  /**
   * Atualiza configuração de um plugin
   */
  @Put(':name/config')
  async updatePluginConfig(
    @Param('name') pluginName: string,
    @Body() config: PluginConfig,
  ) {
    return this.pluginsService.updatePluginConfig(pluginName, config);
  }

  /**
   * Obtém estatísticas do sistema de plugins
   */
  @Get('system/stats')
  async getSystemStats() {
    return this.pluginsService.getSystemStats();
  }

  /**
   * Executa manutenção no sistema de plugins
   */
  @Post('system/maintenance')
  async performMaintenance() {
    return this.pluginsService.performMaintenance();
  }
}
