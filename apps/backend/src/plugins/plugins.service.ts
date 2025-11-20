import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PluginRegistry } from './plugin-registry.service';
import { PluginLoader } from './plugin-loader.service';
import { PluginSecurityService } from './plugin-security.service';
import { HookService } from './hook.service';
import { Prisma } from '@prisma/client'; // Importar Prisma
import {
  PluginConfig,
  PluginFilter,
  PluginSort,
  PaginatedResponse,
  OperationResult,
  PluginDetails,
} from '../types/plugin.types';

@Injectable()
export class PluginsService {
  private readonly logger = new Logger(PluginsService.name);

  constructor(
    private prisma: PrismaService,
    private pluginRegistry: PluginRegistry,
    private pluginLoader: PluginLoader,
    private pluginSecurity: PluginSecurityService,
    private hookService: HookService,
  ) {}

  /**
   * Carrega e registra um plugin
   */
  async loadAndRegisterPlugin(pluginName: string): Promise<OperationResult> {
    try {
      this.logger.log(`Carregando e registrando plugin: ${pluginName}`);

      // Verificar se está disponível
      if (!this.pluginLoader.isPluginAvailable(pluginName)) {
        throw new NotFoundException(`Plugin ${pluginName} não está disponível`);
      }

      // Carregar plugin
      const plugin = await this.pluginLoader.loadPlugin(pluginName);

      // Validar segurança
      const securityCheck = await this.pluginSecurity.validatePermissions(
        plugin,
        plugin.getRequiredPermissions(),
      );

      if (!securityCheck.allowed) {
        throw new BadRequestException(securityCheck.reason);
      }

      // Registrar no sistema
      await this.pluginRegistry.register(plugin);

      this.logger.log(
        `Plugin ${pluginName} carregado e registrado com sucesso`,
      );

      return {
        success: true,
        data: { pluginName, version: plugin.version },
      };
    } catch (error) {
      this.logger.error(`Erro ao carregar plugin ${pluginName}`, error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Instala um plugin
   */
  async installPlugin(pluginName: string): Promise<OperationResult> {
    try {
      this.logger.log(`Instalando plugin: ${pluginName}`);

      // Carregar plugin
      const plugin = await this.pluginLoader.loadPlugin(pluginName);

      // Instalar
      await this.pluginLoader.installPlugin(plugin);

      // Executar hook de instalação
      await this.pluginSecurity.executeInSandbox(
        plugin,
        async () => {
          await plugin.onInstall(plugin.getDefaultConfig());
        },
        {
          plugin,
          permissions: plugin.getRequiredPermissions(),
          user: undefined,
          sessionId: undefined,
        },
      );

      this.logger.log(`Plugin ${pluginName} instalado com sucesso`);

      return {
        success: true,
        data: { pluginName, version: plugin.version },
      };
    } catch (error) {
      this.logger.error(`Erro ao instalar plugin ${pluginName}`, error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Ativa um plugin
   */
  async enablePlugin(pluginName: string): Promise<OperationResult> {
    try {
      this.logger.log(`Ativando plugin: ${pluginName}`);

      await this.pluginRegistry.enable(pluginName);

      this.logger.log(`Plugin ${pluginName} ativado com sucesso`);

      return {
        success: true,
        data: { pluginName, status: 'active' },
      };
    } catch (error) {
      this.logger.error(`Erro ao ativar plugin ${pluginName}`, error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Desativa um plugin
   */
  async disablePlugin(pluginName: string): Promise<OperationResult> {
    try {
      this.logger.log(`Desativando plugin: ${pluginName}`);

      await this.pluginRegistry.disable(pluginName);

      this.logger.log(`Plugin ${pluginName} desativado com sucesso`);

      return {
        success: true,
        data: { pluginName, status: 'inactive' },
      };
    } catch (error) {
      this.logger.error(`Erro ao desativar plugin ${pluginName}`, error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Desinstala um plugin
   */
  async uninstallPlugin(pluginName: string): Promise<OperationResult> {
    try {
      this.logger.log(`Desinstalando plugin: ${pluginName}`);

      // Desregistrar
      await this.pluginRegistry.unregister(pluginName);

      // Desinstalar
      await this.pluginLoader.uninstallPlugin(pluginName);

      this.logger.log(`Plugin ${pluginName} desinstalado com sucesso`);

      return {
        success: true,
        data: { pluginName, status: 'uninstalled' },
      };
    } catch (error) {
      this.logger.error(`Erro ao desinstalar plugin ${pluginName}`, error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Lista plugins com filtros
   */
  async listPlugins(
    filter?: PluginFilter,
    sort?: PluginSort,
    page: number = 1,
    limit: number = 20,
  ): Promise<PaginatedResponse<any>> {
    return this.pluginRegistry.listPlugins(filter, sort, page, limit);
  }

  /**
   * Obtém detalhes de um plugin
   */
  getPluginDetails(pluginName: string): PluginDetails {
    const instance = this.pluginRegistry.getPlugin(pluginName);
    if (!instance) {
      throw new NotFoundException(`Plugin ${pluginName} não encontrado`);
    }

    return {
      name: instance.plugin.name,
      version: instance.plugin.version,
      description: instance.plugin.description,
      author: instance.plugin.author,
      isActive: instance.isActive,
      loadedAt: instance.loadedAt,
      hooksCount: instance.hooks.length,
    };
  }

  /**
   * Atualiza configuração de um plugin
   */
  async updatePluginConfig(
    pluginName: string,
    config: PluginConfig,
  ): Promise<OperationResult> {
    try {
      this.logger.log(`Atualizando configuração do plugin: ${pluginName}`);

      const instance = this.pluginRegistry.getPlugin(pluginName);
      if (!instance) {
        throw new NotFoundException(`Plugin ${pluginName} não encontrado`);
      }

      // Validar configuração
      const validation = await this.pluginSecurity.validatePluginConfig(
        instance.plugin,
        config,
      );

      if (!validation.allowed) {
        throw new BadRequestException(validation.reason);
      }

      // Atualizar no banco
      await (this.prisma as any).plugin.update({
        where: { name: pluginName },
        data: { config: config as Prisma.JsonValue, updatedAt: new Date() },
      });

      // Atualizar instância
      instance.config = config;

      this.logger.log(`Configuração do plugin ${pluginName} atualizada`);

      return {
        success: true,
        data: { pluginName, config },
      };
    } catch (error) {
      this.logger.error(
        `Erro ao atualizar configuração do plugin ${pluginName}`,
        error,
      );
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Lista plugins disponíveis para instalação
   */
  getAvailablePlugins(): string[] {
    return this.pluginLoader.listAvailablePlugins();
  }

  /**
   * Obtém estatísticas do sistema de plugins
   */
  getSystemStats() {
    const registryStats = this.pluginRegistry.getStats();
    const availablePlugins = this.pluginLoader.listAvailablePlugins();

    return {
      ...registryStats,
      available: availablePlugins.length,
      availablePlugins,
    };
  }

  /**
   * Executa manutenção no sistema de plugins
   */
  async performMaintenance(): Promise<OperationResult> {
    try {
      this.logger.log('Executando manutenção do sistema de plugins');

      // Verificar integridade dos plugins
      const plugins = await (this.prisma as any).plugin.findMany();
      let fixedCount = 0;

      for (const plugin of plugins) {
        // Verificar se o plugin ainda existe no sistema de arquivos
        if (!this.pluginLoader.isPluginAvailable(plugin.name)) {
          this.logger.warn(
            `Plugin ${plugin.name} não encontrado no sistema de arquivos, removendo do registro`,
          );
          await this.pluginRegistry.unregister(plugin.name);
          fixedCount++;
        }
      }

      // Executar hook de manutenção
      await this.hookService.onSystemEvent('maintenance', {
        fixedCount,
        timestamp: new Date(),
      });

      this.logger.log('Manutenção concluída com sucesso');

      return {
        success: true,
        data: { fixedCount, totalPlugins: plugins.length },
      };
    } catch (error) {
      this.logger.error('Erro durante manutenção', error);
      return {
        success: false,
        error: (error as Error).message,
      };
    }
  }
}
