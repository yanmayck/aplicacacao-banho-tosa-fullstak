import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  PluginInterface,
  PluginPermission,
  SecurityContext,
  SecurityCheckResult,
  OperationResult,
} from '../types/plugin.types';

@Injectable()
export class PluginSecurityService {
  private readonly logger = new Logger(PluginSecurityService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Valida se um plugin tem as permissões necessárias
   */
  async validatePermissions(
    plugin: PluginInterface,
    requestedPermissions: PluginPermission[],
  ): Promise<SecurityCheckResult> {
    try {
      const requiredPermissions = plugin.getRequiredPermissions();

      for (const required of requiredPermissions) {
        const hasPermission = requestedPermissions.some((requested) =>
          this.matchesPermission(required, requested),
        );

        if (!hasPermission) {
          return {
            allowed: false,
            reason: `Permissão negada: ${required.resource}:${required.actions.join(',')}`,
            requiredPermissions: [required],
          };
        }
      }

      return { allowed: true };
    } catch (error) {
      this.logger.error(
        `Erro ao validar permissões para plugin ${plugin.name}`,
        error,
      );
      return {
        allowed: false,
        reason: 'Erro interno na validação de permissões',
      };
    }
  }

  /**
   * Executa uma operação em sandbox
   */
  async executeInSandbox<T>(
    plugin: PluginInterface,
    operation: () => Promise<T>,
    context: SecurityContext,
  ): Promise<OperationResult<T>> {
    const startTime = Date.now();

    try {
      // Criar contexto isolado
      const sandboxContext = this.createSandboxContext(plugin, context);

      // Executar operação no contexto isolado
      const result = await operation.call(sandboxContext);

      const executionTime = Date.now() - startTime;
      this.logger.debug(
        `Plugin ${plugin.name} executou operação em ${executionTime}ms`,
      );

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;
      this.logger.error(
        `Plugin ${plugin.name} falhou após ${executionTime}ms`,
        error,
      );

      // Logar erro de segurança
      await this.logSecurityError(plugin, error, context);

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Verifica se uma operação é permitida
   */
  async checkOperationAllowed(
    plugin: PluginInterface,
    operation: string,
    resource: string,
    context: SecurityContext,
  ): Promise<boolean> {
    // Verificar permissões do plugin
    const permissions = plugin.getRequiredPermissions();
    const hasPermission = permissions.some(
      (p) => p.resource === resource && p.actions.includes(operation),
    );

    if (!hasPermission) {
      await this.logSecurityViolation(plugin, operation, resource, context);
      return false;
    }

    return true;
  }

  /**
   * Valida configuração do plugin
   */
  async validatePluginConfig(
    plugin: PluginInterface,
    config: any,
  ): Promise<SecurityCheckResult> {
    try {
      const validation = plugin.validateConfig(config);

      if (!validation.valid) {
        return {
          allowed: false,
          reason: `Configuração inválida: ${validation.errors?.join(', ')}`,
        };
      }

      // Verificar se não há dados maliciosos na configuração
      const securityCheck = this.checkConfigSecurity(config);
      if (!securityCheck.allowed) {
        return securityCheck;
      }

      return { allowed: true };
    } catch (error) {
      return {
        allowed: false,
        reason: `Erro na validação: ${error.message}`,
      };
    }
  }

  // === MÉTODOS PRIVADOS ===

  private matchesPermission(
    required: PluginPermission,
    granted: PluginPermission,
  ): boolean {
    // Verificar se o recurso corresponde
    if (required.resource !== granted.resource) {
      return false;
    }

    // Verificar se todas as ações necessárias estão concedidas
    return required.actions.every((action) => granted.actions.includes(action));
  }

  private createSandboxContext(
    plugin: PluginInterface,
    context: SecurityContext,
  ): any {
    // Criar proxy para interceptar acessos perigosos
    const safePrisma = this.createPrismaProxy(plugin, context);
    const safeHttp = this.createHttpProxy(plugin, context);
    const safeFs = this.createFilesystemProxy(plugin, context);

    return {
      // APIs seguras
      database: safePrisma,
      http: safeHttp,
      filesystem: safeFs,

      // Utilitários
      logger: this.createLogger(plugin),
      config: plugin.getDefaultConfig(),

      // Contexto limitado
      user: context.user ? this.sanitizeUser(context.user) : null,
      sessionId: context.sessionId,
    };
  }

  private createPrismaProxy(
    plugin: PluginInterface,
    context: SecurityContext,
  ): any {
    return new Proxy(this.prisma, {
      get: (target, prop) => {
        if (typeof prop === 'string' && this.isDangerousPrismaMethod(prop)) {
          throw new Error(`Método Prisma perigoso não permitido: ${prop}`);
        }

        const targetMethod = target[prop as keyof typeof target];

        if (typeof targetMethod === 'function') {
          return (...args: any[]) => {
            // Verificar permissões antes de executar
            if (
              !this.checkDatabasePermission(plugin, prop as string, context)
            ) {
              throw new Error(
                `Acesso negado ao banco de dados: ${String(prop)}`,
              );
            }

            // Logar operação
            this.logger.debug(
              `Plugin ${plugin.name} acessando ${String(prop)}`,
            );

            return (targetMethod as any)(...args);
          };
        }

        return targetMethod;
      },
    });
  }

  private createHttpProxy(
    plugin: PluginInterface,
    context: SecurityContext,
  ): any {
    return {
      get: async (url: string) => {
        if (!this.isAllowedUrl(url)) {
          throw new Error(`URL não permitida: ${url}`);
        }

        if (
          !(await this.checkOperationAllowed(
            plugin,
            'http.get',
            'network',
            context,
          ))
        ) {
          throw new Error('Acesso à rede não permitido');
        }

        this.logger.debug(
          `Plugin ${plugin.name} fazendo requisição HTTP: ${url}`,
        );
        // Implementar chamada HTTP segura
      },

      post: async (url: string, data: any) => {
        if (!this.isAllowedUrl(url)) {
          throw new Error(`URL não permitida: ${url}`);
        }

        if (
          !(await this.checkOperationAllowed(
            plugin,
            'http.post',
            'network',
            context,
          ))
        ) {
          throw new Error('Acesso à rede não permitido');
        }

        this.logger.debug(
          `Plugin ${plugin.name} fazendo requisição POST: ${url}`,
        );
        // Implementar chamada HTTP segura
      },
    };
  }

  private createFilesystemProxy(
    plugin: PluginInterface,
    context: SecurityContext,
  ): any {
    const allowedPaths = [`./plugins/${plugin.name}`];

    return {
      readFile: async (path: string) => {
        if (!this.isPathAllowed(path, allowedPaths)) {
          throw new Error(`Caminho não permitido: ${path}`);
        }

        if (
          !(await this.checkOperationAllowed(
            plugin,
            'fs.read',
            'filesystem',
            context,
          ))
        ) {
          throw new Error('Acesso ao sistema de arquivos não permitido');
        }

        this.logger.debug(`Plugin ${plugin.name} lendo arquivo: ${path}`);
        // Implementar leitura segura
      },

      writeFile: async (path: string, content: string) => {
        if (!this.isPathAllowed(path, allowedPaths)) {
          throw new Error(`Caminho não permitido: ${path}`);
        }

        if (
          !(await this.checkOperationAllowed(
            plugin,
            'fs.write',
            'filesystem',
            context,
          ))
        ) {
          throw new Error('Escrita no sistema de arquivos não permitida');
        }

        this.logger.debug(`Plugin ${plugin.name} escrevendo arquivo: ${path}`);
        // Implementar escrita segura
      },
    };
  }

  private createLogger(plugin: PluginInterface) {
    return {
      debug: (message: string, data?: any) => {
        this.logger.debug(`[${plugin.name}] ${message}`, data);
      },
      info: (message: string, data?: any) => {
        this.logger.log(`[${plugin.name}] ${message}`, data);
      },
      warn: (message: string, data?: any) => {
        this.logger.warn(`[${plugin.name}] ${message}`, data);
      },
      error: (message: string, data?: any) => {
        this.logger.error(`[${plugin.name}] ${message}`, data);
      },
    };
  }

  private isDangerousPrismaMethod(method: string): boolean {
    const dangerousMethods = [
      '$executeRaw',
      '$executeRawUnsafe',
      '$queryRaw',
      '$queryRawUnsafe',
      '$runCommandRaw',
    ];

    return dangerousMethods.includes(method);
  }

  private checkDatabasePermission(
    plugin: PluginInterface,
    operation: string,
    context: SecurityContext,
  ): boolean {
    // Verificar se o plugin tem permissão para operações de banco
    const permissions = plugin.getRequiredPermissions();
    return permissions.some(
      (p) => p.resource === 'database' && p.actions.includes(operation),
    );
  }

  private isAllowedUrl(url: string): boolean {
    // Lista de domínios permitidos
    const allowedDomains = [
      'api.github.com',
      'registry.npmjs.org',
      'httpbin.org', // Para testes
    ];

    try {
      const urlObj = new URL(url);
      return allowedDomains.some(
        (domain) =>
          urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`),
      );
    } catch {
      return false;
    }
  }

  private isPathAllowed(path: string, allowedPaths: string[]): boolean {
    const resolvedPath = require('path').resolve(path);

    return allowedPaths.some((allowedPath) => {
      const resolvedAllowed = require('path').resolve(allowedPath);
      return resolvedPath.startsWith(resolvedAllowed);
    });
  }

  private sanitizeUser(user: any): any {
    // Remover dados sensíveis do usuário
    const { password, ...sanitized } = user;
    return sanitized;
  }

  private checkConfigSecurity(config: any): SecurityCheckResult {
    // Verificar se há scripts ou código executável na configuração
    const configStr = JSON.stringify(config);

    if (configStr.includes('<script') || configStr.includes('javascript:')) {
      return {
        allowed: false,
        reason: 'Configuração contém código potencialmente perigoso',
      };
    }

    return { allowed: true };
  }

  private async logSecurityError(
    plugin: PluginInterface,
    error: any,
    context: SecurityContext,
  ): Promise<void> {
    await this.prisma.pluginLog.create({
      data: {
        pluginId: await this.getPluginId(plugin.name),
        level: 'ERROR',
        message: `Erro de segurança: ${error.message}`,
        data: {
          error: error.stack,
          context: context as any,
          plugin: plugin.name,
        },
      },
    });
  }

  private async logSecurityViolation(
    plugin: PluginInterface,
    operation: string,
    resource: string,
    context: SecurityContext,
  ): Promise<void> {
    await this.prisma.pluginLog.create({
      data: {
        pluginId: await this.getPluginId(plugin.name),
        level: 'ERROR',
        message: `Violação de segurança: ${operation} em ${resource}`,
        data: {
          operation,
          resource,
          context: context as any,
          plugin: plugin.name,
        },
      },
    });
  }

  private async getPluginId(pluginName: string): Promise<string> {
    const plugin = await this.prisma.plugin.findUnique({
      where: { name: pluginName },
      select: { id: true },
    });

    if (!plugin) {
      throw new Error(`Plugin ${pluginName} não encontrado`);
    }

    return plugin.id;
  }
}
