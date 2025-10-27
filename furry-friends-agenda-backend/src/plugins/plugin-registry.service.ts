import { Injectable, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PluginInterface,
  PluginInstance,
  PluginRegistryConfig,
  SystemHooks,
  PluginHookDefinition,
  HookContext,
  PluginConfig,
  PluginFilter,
  PluginSort,
  PaginatedResponse,
  PluginPagination,
} from '../types/plugin.types';

// Extensão do tipo para incluir plugin
interface PluginHookWithPlugin extends PluginHookDefinition {
  plugin: PluginInterface;
}
import { Plugin, PluginHook } from '@prisma/client';

@Injectable()
export class PluginRegistry {
  private readonly logger = new Logger(PluginRegistry.name);
  private plugins = new Map<string, PluginInstance>();
  private hooks = new Map<SystemHooks, PluginHookWithPlugin[]>();
  private config: PluginRegistryConfig;

  constructor(private prisma: PrismaService) {
    this.config = {
      pluginPath: process.env.PLUGIN_PATH || './plugins',
      maxPlugins: parseInt(process.env.MAX_PLUGINS || '50'),
      enableSandbox: process.env.ENABLE_PLUGIN_SANDBOX === 'true',
      logLevel: 'INFO',
    };
  }

  /**
   * Registra um plugin no sistema
   */
  async register(plugin: PluginInterface): Promise<void> {
    this.logger.log(`Registrando plugin: ${plugin.name} v${plugin.version}`);

    // Verificar se já existe
    const existing = this.plugins.get(plugin.name);
    if (existing) {
      throw new ConflictException(`Plugin ${plugin.name} já está registrado`);
    }

    // Verificar limite de plugins
    if (this.plugins.size >= this.config.maxPlugins) {
      throw new ConflictException(`Limite máximo de plugins atingido: ${this.config.maxPlugins}`);
    }

    // Criar instância
    const instance: PluginInstance = {
      plugin,
      config: plugin.getDefaultConfig(),
      isActive: false,
      loadedAt: new Date(),
      hooks: plugin.getHooks(),
    };

    // Registrar hooks
    this.registerHooks(instance);

    // Salvar no banco
    await this.saveToDatabase(plugin);

    // Adicionar ao registro
    this.plugins.set(plugin.name, instance);

    this.logger.log(`Plugin ${plugin.name} registrado com sucesso`);
  }

  /**
   * Ativa um plugin
   */
  async enable(pluginName: string): Promise<void> {
    this.logger.log(`Ativando plugin: ${pluginName}`);

    const instance = this.plugins.get(pluginName);
    if (!instance) {
      throw new NotFoundException(`Plugin ${pluginName} não encontrado`);
    }

    if (instance.isActive) {
      this.logger.warn(`Plugin ${pluginName} já está ativo`);
      return;
    }

    try {
      // Executar hook de ativação
      await instance.plugin.onEnable();

      // Atualizar status
      instance.isActive = true;

      // Atualizar banco
      await this.updateDatabaseStatus(pluginName, true);

      this.logger.log(`Plugin ${pluginName} ativado com sucesso`);
    } catch (error) {
      this.logger.error(`Erro ao ativar plugin ${pluginName}`, error);
      throw error;
    }
  }

  /**
   * Desativa um plugin
   */
  async disable(pluginName: string): Promise<void> {
    this.logger.log(`Desativando plugin: ${pluginName}`);

    const instance = this.plugins.get(pluginName);
    if (!instance) {
      throw new NotFoundException(`Plugin ${pluginName} não encontrado`);
    }

    if (!instance.isActive) {
      this.logger.warn(`Plugin ${pluginName} já está desativado`);
      return;
    }

    try {
      // Executar hook de desativação
      await instance.plugin.onDisable();

      // Atualizar status
      instance.isActive = false;

      // Atualizar banco
      await this.updateDatabaseStatus(pluginName, false);

      this.logger.log(`Plugin ${pluginName} desativado com sucesso`);
    } catch (error) {
      this.logger.error(`Erro ao desativar plugin ${pluginName}`, error);
      throw error;
    }
  }

  /**
   * Remove um plugin do registro
   */
  async unregister(pluginName: string): Promise<void> {
    this.logger.log(`Removendo plugin: ${pluginName}`);

    const instance = this.plugins.get(pluginName);
    if (!instance) {
      throw new NotFoundException(`Plugin ${pluginName} não encontrado`);
    }

    // Desativar se estiver ativo
    if (instance.isActive) {
      await this.disable(pluginName);
    }

    // Remover hooks
    this.unregisterHooks(instance);

    // Remover do registro
    this.plugins.delete(pluginName);

    // Remover do banco
    await this.removeFromDatabase(pluginName);

    this.logger.log(`Plugin ${pluginName} removido com sucesso`);
  }

  /**
   * Executa hooks para um evento específico
   */
  async executeHook(
    hookName: SystemHooks,
    data: any,
    context: Partial<HookContext> = {}
  ): Promise<any[]> {
    const registeredHooks = this.hooks.get(hookName) || [];
    const results: any[] = [];

    if (registeredHooks.length === 0) {
      return results;
    }

    this.logger.debug(`Executando ${registeredHooks.length} hooks para: ${hookName}`);

    // Ordenar por prioridade (menor número = maior prioridade)
    const sortedHooks = registeredHooks.sort((a, b) => (a.priority || 0) - (b.priority || 0));

    for (const hook of sortedHooks) {
      const instance = this.plugins.get(hook.plugin.name);
      if (!instance || !instance.isActive) {
        continue;
      }

      try {
        const startTime = Date.now();

        const hookContext: HookContext = {
          plugin: instance.plugin,
          requestId: context.requestId || this.generateRequestId(),
          timestamp: new Date(),
          cancellable: context.cancellable || false,
          ...context,
        };

        const result = await hook.handler(data, hookContext);

        const executionTime = Date.now() - startTime;

        // Registrar métricas
        await this.recordHookExecution(hook, executionTime);

        results.push(result);

        // Verificar se deve cancelar execução
        if (context.cancellable && result === false) {
          this.logger.debug(`Hook ${hook.plugin.name}:${hookName} cancelou execução`);
          break;
        }

        this.logger.debug(`Hook ${hook.plugin.name}:${hookName} executado em ${executionTime}ms`);
      } catch (error) {
        this.logger.error(`Erro no hook ${hook.plugin.name}:${hookName}`, error);
        await this.handleHookError(hook, error);
      }
    }

    return results;
  }

  /**
   * Lista plugins com filtros e paginação
   */
  async listPlugins(
    filter?: PluginFilter,
    sort?: PluginSort,
    page: number = 1,
    limit: number = 20
  ): Promise<PaginatedResponse<Plugin>> {
    const where: any = {};

    if (filter) {
      if (filter.isActive !== undefined) where.isActive = filter.isActive;
      if (filter.isInstalled !== undefined) where.isInstalled = filter.isInstalled;
      if (filter.author) where.author = { contains: filter.author, mode: 'insensitive' };
      if (filter.search) {
        where.OR = [
          { name: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ];
      }
    }

    const orderBy: any = {};
    if (sort) {
      orderBy[sort.field] = sort.order;
    } else {
      orderBy.name = 'asc';
    }

    const [plugins, total] = await Promise.all([
      this.prisma.plugin.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          hooks: true,
        },
      }),
      this.prisma.plugin.count({ where }),
    ]);

    return {
      items: plugins,
      pagination: {
        page,
        limit,
        total,
      },
      filters: filter,
      sort,
    };
  }

  /**
   * Obtém um plugin pelo nome
   */
  getPlugin(pluginName: string): PluginInstance | undefined {
    return this.plugins.get(pluginName);
  }

  /**
   * Verifica se um plugin está ativo
   */
  isActive(pluginName: string): boolean {
    const instance = this.plugins.get(pluginName);
    return instance?.isActive || false;
  }

  /**
   * Obtém estatísticas do registro
   */
  getStats() {
    const total = this.plugins.size;
    const active = Array.from(this.plugins.values()).filter(p => p.isActive).length;
    const inactive = total - active;

    return {
      total,
      active,
      inactive,
      hooks: Array.from(this.hooks.entries()).reduce((acc, [hookName, hooks]) => {
        acc[hookName] = hooks.length;
        return acc;
      }, {} as Record<string, number>),
    };
  }

  // === MÉTODOS PRIVADOS ===

  private registerHooks(instance: PluginInstance): void {
    for (const hook of instance.hooks) {
      if (!this.hooks.has(hook.name)) {
        this.hooks.set(hook.name, []);
      }

      this.hooks.get(hook.name)!.push({
        ...hook,
        priority: hook.priority || 0,
        plugin: instance.plugin,
      });
    }
  }

  private unregisterHooks(instance: PluginInstance): void {
    for (const hook of instance.hooks) {
      const hookList = this.hooks.get(hook.name);
      if (hookList) {
        const index = hookList.findIndex(h => h.plugin.name === instance.plugin.name);
        if (index !== -1) {
          hookList.splice(index, 1);
        }

        // Remover lista se vazia
        if (hookList.length === 0) {
          this.hooks.delete(hook.name);
        }
      }
    }
  }

  private async saveToDatabase(plugin: PluginInterface): Promise<void> {
    await this.prisma.plugin.create({
      data: {
        name: plugin.name,
        version: plugin.version,
        description: plugin.description,
        author: plugin.author,
        homepage: plugin.homepage,
        repository: plugin.repository,
        config: plugin.getDefaultConfig(),
        permissions: plugin.getRequiredPermissions() as any,
        dependencies: plugin.dependencies as any,
        isInstalled: true,
        installedAt: new Date(),
      },
    });
  }

  private async updateDatabaseStatus(pluginName: string, isActive: boolean): Promise<void> {
    await this.prisma.plugin.update({
      where: { name: pluginName },
      data: {
        isActive,
        activatedAt: isActive ? new Date() : null,
        updatedAt: new Date(),
      },
    });
  }

  private async removeFromDatabase(pluginName: string): Promise<void> {
    await this.prisma.plugin.delete({
      where: { name: pluginName },
    });
  }

  private async recordHookExecution(hook: PluginHookWithPlugin, executionTime: number): Promise<void> {
    // Atualizar estatísticas no banco
    await this.prisma.pluginHook.updateMany({
      where: {
        pluginId: await this.getPluginId(hook.plugin.name),
        hookName: hook.name,
      },
      data: {
        executionCount: { increment: 1 },
        lastExecutedAt: new Date(),
        averageExecutionTime: {
          // Calcular média ponderada (simplificada)
          set: executionTime,
        },
      },
    });
  }

  private async handleHookError(hook: PluginHookWithPlugin, error: any): Promise<void> {
    // Logar erro
    await this.prisma.pluginLog.create({
      data: {
        pluginId: await this.getPluginId(hook.plugin.name),
        level: 'ERROR',
        message: `Erro no hook ${hook.name}: ${error.message}`,
        data: {
          error: error.stack,
          hookName: hook.name,
        },
      },
    });

    // TODO: Implementar estratégia de retry ou desativação automática
  }

  private async getPluginId(pluginName: string): Promise<string> {
    const plugin = await this.prisma.plugin.findUnique({
      where: { name: pluginName },
      select: { id: true },
    });

    if (!plugin) {
      throw new NotFoundException(`Plugin ${pluginName} não encontrado no banco`);
    }

    return plugin.id;
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}