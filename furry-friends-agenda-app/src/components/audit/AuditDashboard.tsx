import React from 'react';
import { useAudit } from '../../context/audit/AuditContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { AuditActionType, AuditSeverity } from '../../types/audit';
import { auditService } from '../../services/auditService';

export function AuditDashboard() {
  const { statistics, loading, error, exportLogs } = useAudit();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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

  if (!statistics) {
    return (
      <div className="text-center text-gray-500 mt-8">
        <p>Nenhuma estatística disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Logs</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalLogs.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atividade Recente</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.recentActivity}</div>
            <p className="text-xs text-muted-foreground">Últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Operações Críticas</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.logsBySeverity.find(s => s.severity === AuditSeverity.CRITICAL)?.count || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falhas</CardTitle>
            <svg
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statistics.failedOperations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos de Distribuição */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logs por Ação */}
        <Card>
          <CardHeader>
            <CardTitle>Logs por Tipo de Ação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statistics.logsByAction.map((item) => (
                <div key={item.action} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {auditService.getActionDescription(item.action)}
                    </span>
                  </div>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Logs por Severidade */}
        <Card>
          <CardHeader>
            <CardTitle>Logs por Severidade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statistics.logsBySeverity.map((item) => (
                <div key={item.severity} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge className={auditService.getSeverityColor(item.severity)}>
                      {auditService.getSeverityDescription(item.severity)}
                    </Badge>
                  </div>
                  <Badge variant="secondary">{item.count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Módulos Mais Auditados */}
      {statistics.logsByModule.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Atividade por Módulo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {statistics.logsByModule.map((item) => (
                <div key={item.module} className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{item.count}</div>
                  <div className="text-sm text-gray-600 capitalize">{item.module}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => exportLogs('csv')}
            >
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => exportLogs('excel')}
            >
              Exportar Excel
            </Button>
            <Button
              variant="outline"
              onClick={() => exportLogs('pdf')}
            >
              Exportar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}