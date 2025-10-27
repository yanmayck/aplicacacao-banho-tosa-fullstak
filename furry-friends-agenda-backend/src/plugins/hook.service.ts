import { Injectable, Logger } from '@nestjs/common';
import { PluginRegistry } from './plugin-registry.service';
import { SystemHooks, HookContext, HookData } from '../types/plugin.types';

@Injectable()
export class HookService {
  private readonly logger = new Logger(HookService.name);

  constructor(private pluginRegistry: PluginRegistry) {}

  /**
   * Executa hooks para um evento específico
   */
  async executeHook(
    hookName: SystemHooks,
    data: HookData,
    context: Partial<HookContext> = {}
  ): Promise<any[]> {
    this.logger.debug(`Executando hook: ${hookName}`);
    return this.pluginRegistry.executeHook(hookName, data, context);
  }

  /**
   * Executa hook de forma síncrona (útil para validações)
   */
  async executeHookSync(
    hookName: SystemHooks,
    data: HookData,
    context: Partial<HookContext> = {}
  ): Promise<any[]> {
    this.logger.debug(`Executando hook síncrono: ${hookName}`);
    return this.pluginRegistry.executeHook(hookName, data, { ...context, cancellable: true });
  }

  /**
   * Verifica se existem hooks registrados para um evento
   */
  hasHooks(hookName: SystemHooks): boolean {
    const stats = this.pluginRegistry.getStats();
    return (stats.hooks[hookName] || 0) > 0;
  }

  /**
   * Obtém estatísticas dos hooks
   */
  getHookStats() {
    return this.pluginRegistry.getStats();
  }

  // === MÉTODOS DE CONVENIÊNCIA PARA HOOKS COMUNS ===

  /**
   * Hook para criação de entidade
   */
  async onEntityCreated(entityType: string, entity: any, context?: Partial<HookContext>) {
    const hookName = `${entityType}.created` as SystemHooks;
    return this.executeHook(hookName, { entity, entityType }, context);
  }

  /**
   * Hook para atualização de entidade
   */
  async onEntityUpdated(entityType: string, entity: any, changes: any, context?: Partial<HookContext>) {
    const hookName = `${entityType}.updated` as SystemHooks;
    return this.executeHook(hookName, { entity, entityType, changes }, context);
  }

  /**
   * Hook para exclusão de entidade
   */
  async onEntityDeleted(entityType: string, entityId: string, context?: Partial<HookContext>) {
    const hookName = `${entityType}.deleted` as SystemHooks;
    return this.executeHook(hookName, { entityId, entityType }, context);
  }

  /**
   * Hook para eventos de sistema
   */
  async onSystemEvent(event: string, data: any, context?: Partial<HookContext>) {
    const hookName = `system.${event}` as SystemHooks;
    return this.executeHook(hookName, data, context);
  }

  /**
   * Hook para eventos de negócio
   */
  async onBusinessEvent(event: string, data: any, context?: Partial<HookContext>) {
    const hookName = `business.${event}` as SystemHooks;
    return this.executeHook(hookName, data, context);
  }

  // === HOOKS ESPECÍFICOS DO SISTEMA ===

  /**
   * Hook executado quando um agendamento é criado
   */
  async onAppointmentCreated(appointment: any, context?: Partial<HookContext>) {
    return this.executeHook(SystemHooks.APPOINTMENT_CREATED, { appointment }, context);
  }

  /**
   * Hook executado quando um agendamento é concluído
   */
  async onAppointmentCompleted(appointment: any, context?: Partial<HookContext>) {
    return this.executeHook(SystemHooks.APPOINTMENT_COMPLETED, { appointment }, context);
  }

  /**
   * Hook executado quando um pagamento é recebido
   */
  async onPaymentCompleted(payment: any, context?: Partial<HookContext>) {
    return this.executeHook(SystemHooks.PAYMENT_COMPLETED, { payment }, context);
  }

  /**
   * Hook executado quando um cliente é registrado
   */
  async onClientRegistered(client: any, context?: Partial<HookContext>) {
    return this.executeHook(SystemHooks.CLIENT_REGISTERED, { client }, context);
  }

  /**
   * Hook executado quando uma transação financeira é criada
   */
  async onFinancialTransactionCreated(transaction: any, context?: Partial<HookContext>) {
    return this.executeHook(SystemHooks.FINANCIAL_TRANSACTION_CREATED, { transaction }, context);
  }

  /**
   * Hook executado quando um relatório é gerado
   */
  async onReportGenerated(report: any, context?: Partial<HookContext>) {
    return this.executeHook(SystemHooks.REPORT_GENERATED, { report }, context);
  }
}