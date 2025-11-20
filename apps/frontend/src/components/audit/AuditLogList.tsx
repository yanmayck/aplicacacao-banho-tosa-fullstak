import React, { useState } from 'react';
import { useAudit } from '../../context/audit/AuditContext';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AuditLog, AuditActionType, AuditSeverity } from '../../types/audit';
import { auditService } from '../../services/auditService';

interface AuditLogListProps {
  showFilters?: boolean;
  compact?: boolean;
}

export function AuditLogList({ showFilters = true, compact = false }: AuditLogListProps) {
  const { logs, loading, error, filters, setFilters, query, setQuery, totalLogs, currentPage, totalPages } = useAudit();
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handlePageChange = (page: number) => {
    setQuery({ ...query, page });
  };

  const toggleDetails = (logId: string) => {
    setShowDetails(showDetails === logId ? null : logId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg border space-y-4">
          <h3 className="font-medium">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Ação</label>
              <Select
                value={filters.action || ''}
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as ações</SelectItem>
                  {Object.values(AuditActionType).map((action) => (
                    <SelectItem key={action} value={action}>
                      {auditService.getActionDescription(action)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Severidade</label>
              <Select
                value={filters.severity || ''}
                onValueChange={(value) => handleFilterChange('severity', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas as severidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as severidades</SelectItem>
                  {Object.values(AuditSeverity).map((severity) => (
                    <SelectItem key={severity} value={severity}>
                      {auditService.getSeverityDescription(severity)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Módulo</label>
              <Input
                placeholder="Ex: financial, appointments"
                value={filters.module || ''}
                onChange={(e) => handleFilterChange('module', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Busca</label>
              <Input
                placeholder="Buscar em descrições..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Lista de Logs */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Logs de Auditoria ({totalLogs.toLocaleString()})
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                Página {currentPage} de {totalPages}
              </span>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>Nenhum log encontrado</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={auditService.getSeverityColor(log.severity)}>
                        {auditService.getSeverityDescription(log.severity)}
                      </Badge>
                      <Badge variant="outline">
                        {auditService.getActionDescription(log.action)}
                      </Badge>
                      {log.module && (
                        <Badge variant="secondary">{log.module}</Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-900 mb-1">{log.actionDescription}</p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{auditService.formatTimestamp(log.timestamp)}</span>
                      {log.user && (
                        <span>Usuário: {log.user.name || log.user.email}</span>
                      )}
                      {log.client && (
                        <span>Cliente: {log.client.name}</span>
                      )}
                      {log.ipAddress && (
                        <span>IP: {log.ipAddress}</span>
                      )}
                      {log.executionTime && (
                        <span>{log.executionTime}ms</span>
                      )}
                    </div>

                    {/* Detalhes Expandidos */}
                    {showDetails === log.id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-md space-y-2">
                        {log.oldValues && (
                          <div>
                            <h5 className="font-medium text-sm">Valores Anteriores:</h5>
                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                              {JSON.stringify(log.oldValues, null, 2)}
                            </pre>
                          </div>
                        )}

                        {log.newValues && (
                          <div>
                            <h5 className="font-medium text-sm">Novos Valores:</h5>
                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                              {JSON.stringify(log.newValues, null, 2)}
                            </pre>
                          </div>
                        )}

                        {log.errorMessage && (
                          <div>
                            <h5 className="font-medium text-sm text-red-600">Erro:</h5>
                            <p className="text-xs text-red-600">{log.errorMessage}</p>
                          </div>
                        )}

                        {log.metadata && (
                          <div>
                            <h5 className="font-medium text-sm">Metadados:</h5>
                            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    {!compact && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleDetails(log.id)}
                      >
                        {showDetails === log.id ? 'Ocultar' : 'Detalhes'}
                      </Button>
                    )}

                    {!log.success && (
                      <Badge variant="destructive">Falha</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Mostrando {((currentPage - 1) * (query.limit || 50)) + 1} até{' '}
              {Math.min(currentPage * (query.limit || 50), totalLogs)} de {totalLogs} resultados
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Anterior
              </Button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  return (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}