import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PluginInterface, PluginConfig } from '../types/plugin.types';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PluginLoader {
  private readonly logger = new Logger(PluginLoader.name);
  private readonly pluginPath: string;

  constructor(private prisma: PrismaService) {
    this.pluginPath = process.env.PLUGIN_PATH || path.join(process.cwd(), 'plugins');
  }

  /**
   * Carrega um plugin do sistema de arquivos
   */
  async loadPlugin(pluginName: string): Promise<PluginInterface> {
    this.logger.log(`Carregando plugin: ${pluginName}`);

    const pluginDir = path.join(this.pluginPath, pluginName);

    // Verificar se o diretório existe
    if (!fs.existsSync(pluginDir)) {
      throw new NotFoundException(`Diretório do plugin não encontrado: ${pluginDir}`);
    }

    // Verificar package.json
    const packageJsonPath = path.join(pluginDir, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new BadRequestException(`Plugin ${pluginName} não possui package.json`);
    }

    // Ler metadados do plugin
    const packageJson = this.readPackageJson(packageJsonPath);
    const entryPoint = this.getEntryPoint(packageJson, pluginDir);

    // Carregar módulo do plugin
    const pluginModule = await this.loadPluginModule(entryPoint);

    // Validar interface do plugin
    const plugin = this.validateAndInstantiatePlugin(pluginModule, pluginName);

    this.logger.log(`Plugin ${pluginName} carregado com sucesso`);
    return plugin;
  }

  /**
   * Instala um plugin no banco de dados
   */
  async installPlugin(plugin: PluginInterface): Promise<void> {
    this.logger.log(`Instalando plugin: ${plugin.name}`);

    const existingPlugin = await this.prisma.plugin.findUnique({
      where: { name: plugin.name }
    });

    if (existingPlugin) {
      throw new BadRequestException(`Plugin ${plugin.name} já está instalado`);
    }

    // Validar dependências
    await this.validateDependencies(plugin);

    // Salvar no banco
    await this.prisma.plugin.create({
      data: {
        name: plugin.name,
        version: plugin.version,
        description: plugin.description,
        author: plugin.author,
        homepage: plugin.homepage,
        repository: plugin.repository,
        config: plugin.getDefaultConfig() as any,
        permissions: plugin.getRequiredPermissions() as any,
        dependencies: plugin.dependencies as any,
        isInstalled: true,
        installedAt: new Date(),
      },
    });

    this.logger.log(`Plugin ${plugin.name} instalado com sucesso`);
  }

  /**
   * Desinstala um plugin do banco de dados
   */
  async uninstallPlugin(pluginName: string): Promise<void> {
    this.logger.log(`Desinstalando plugin: ${pluginName}`);

    const plugin = await this.prisma.plugin.findUnique({
      where: { name: pluginName }
    });

    if (!plugin) {
      throw new NotFoundException(`Plugin ${pluginName} não encontrado`);
    }

    if (plugin.isActive) {
      throw new BadRequestException(`Plugin ${pluginName} está ativo. Desative antes de desinstalar.`);
    }

    // Remover do banco
    await this.prisma.plugin.delete({
      where: { name: pluginName }
    });

    this.logger.log(`Plugin ${pluginName} desinstalado com sucesso`);
  }

  /**
   * Lista plugins disponíveis no sistema de arquivos
   */
  listAvailablePlugins(): string[] {
    try {
      if (!fs.existsSync(this.pluginPath)) {
        return [];
      }

      const entries = fs.readdirSync(this.pluginPath, { withFileTypes: true });
      return entries
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
        .filter(name => {
          const packageJsonPath = path.join(this.pluginPath, name, 'package.json');
          return fs.existsSync(packageJsonPath);
        });
    } catch (error) {
      this.logger.error('Erro ao listar plugins disponíveis', error);
      return [];
    }
  }

  /**
   * Verifica se um plugin está disponível para carregamento
   */
  isPluginAvailable(pluginName: string): boolean {
    const pluginDir = path.join(this.pluginPath, pluginName);
    const packageJsonPath = path.join(pluginDir, 'package.json');

    return fs.existsSync(pluginDir) && fs.existsSync(packageJsonPath);
  }

  // === MÉTODOS PRIVADOS ===

  private readPackageJson(packageJsonPath: string): any {
    try {
      const content = fs.readFileSync(packageJsonPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      throw new BadRequestException(`Erro ao ler package.json: ${error.message}`);
    }
  }

  private getEntryPoint(packageJson: any, pluginDir: string): string {
    const entryPoint = packageJson.main || packageJson.module || 'index.js';
    const fullPath = path.join(pluginDir, entryPoint);

    if (!fs.existsSync(fullPath)) {
      throw new BadRequestException(`Ponto de entrada não encontrado: ${entryPoint}`);
    }

    return fullPath;
  }

  private async loadPluginModule(entryPath: string): Promise<any> {
    try {
      // Para TypeScript, precisamos compilar ou usar ts-node
      // Por simplicidade, assumimos que o plugin está em JavaScript
      const pluginModule = await import(entryPath);

      if (!pluginModule.default) {
        throw new BadRequestException('Plugin deve exportar uma classe padrão');
      }

      return pluginModule;
    } catch (error) {
      throw new BadRequestException(`Erro ao carregar módulo do plugin: ${error.message}`);
    }
  }

  private validateAndInstantiatePlugin(pluginModule: any, pluginName: string): PluginInterface {
    try {
      const PluginClass = pluginModule.default;

      if (typeof PluginClass !== 'function') {
        throw new BadRequestException('Plugin deve exportar uma classe construtora');
      }

      const plugin = new PluginClass();

      // Validar métodos obrigatórios
      this.validatePluginInterface(plugin);

      return plugin;
    } catch (error) {
      throw new BadRequestException(`Erro ao instanciar plugin ${pluginName}: ${error.message}`);
    }
  }

  private validatePluginInterface(plugin: any): void {
    const requiredMethods = [
      'getHooks',
      'getConfigSchema',
      'validateConfig',
      'getDefaultConfig',
      'getRequiredPermissions',
      'onInstall',
      'onUninstall',
      'onEnable',
      'onDisable'
    ];

    const requiredProperties = ['name', 'version', 'author'];

    // Verificar propriedades
    for (const prop of requiredProperties) {
      if (!plugin[prop]) {
        throw new BadRequestException(`Plugin deve definir propriedade: ${prop}`);
      }
    }

    // Verificar métodos
    for (const method of requiredMethods) {
      if (typeof plugin[method] !== 'function') {
        throw new BadRequestException(`Plugin deve implementar método: ${method}`);
      }
    }
  }

  private async validateDependencies(plugin: PluginInterface): Promise<void> {
    if (!plugin.dependencies) return;

    for (const dependency of plugin.dependencies) {
      const installedPlugin = await this.prisma.plugin.findUnique({
        where: { name: dependency.name }
      });

      if (!installedPlugin) {
        if (dependency.required) {
          throw new BadRequestException(
            `Dependência obrigatória não encontrada: ${dependency.name}`
          );
        } else {
          this.logger.warn(`Dependência opcional não encontrada: ${dependency.name}`);
        }
      } else if (installedPlugin.version < dependency.version) {
        throw new BadRequestException(
          `Versão da dependência ${dependency.name} incompatível. Requer: ${dependency.version}, Instalada: ${installedPlugin.version}`
        );
      }
    }
  }
}