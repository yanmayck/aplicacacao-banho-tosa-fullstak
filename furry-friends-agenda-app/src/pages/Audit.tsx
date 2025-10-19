import React, { useState } from 'react';
import { AuditProvider } from '../context/audit/AuditContext';
import { AuditDashboard } from '../components/audit/AuditDashboard';
import { AuditLogList } from '../components/audit/AuditLogList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';

function AuditContent() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Auditoria do Sistema</h1>
              <p className="text-gray-600 mt-2">
                Monitore e analise todas as atividades do sistema em tempo real
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                Sistema Ativo
              </Badge>
              <Button variant="outline">
                Configurações
              </Button>
            </div>
          </div>
        </div>

        {/* Abas principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="logs">Logs de Auditoria</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <AuditDashboard />
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Auditoria</CardTitle>
              </CardHeader>
              <CardContent>
                <AuditLogList showFilters={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alertas de Auditoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-gray-500 py-8">
                  <p>Sistema de alertas em desenvolvimento</p>
                  <p className="text-sm mt-2">Em breve você poderá configurar alertas personalizados</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export function Audit() {
  return (
    <AuditProvider>
      <AuditContent />
    </AuditProvider>
  );
}