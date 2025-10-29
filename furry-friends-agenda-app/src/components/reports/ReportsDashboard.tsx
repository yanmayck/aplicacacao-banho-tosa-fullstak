import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Calendar, Download, Filter, TrendingUp, Users, DollarSign, Activity, BarChart3, FileText, PieChart, Target, Clock } from 'lucide-react';
import { useReports, ReportFilters } from '../../context/reports/ReportsContext';
import { FinancialReportView } from './FinancialReportView';
import { GroomerPerformanceView } from './GroomerPerformanceView';
import { ClientAnalysisView } from './ClientAnalysisView';
import { ServiceRankingView } from './ServiceRankingView';
import { OccupancyMetricsView } from './OccupancyMetricsView';
import { AppointmentAnalysisView } from './AppointmentAnalysisView';
import { ApiErrorType, getErrorMessage } from '../../types/api';

export function ReportsDashboard() {
  const { state, generateReport, updateFilters, exportReport } = useReports();
  const [activeTab, setActiveTab] = useState('financial');

  const reportTypes = [
    { value: 'financial', label: 'Relatório Financeiro', icon: DollarSign, description: 'Análise completa de receitas, despesas e lucros' },
    { value: 'groomer_performance', label: 'Performance de Tosadores', icon: Users, description: 'Avaliação de produtividade e comissões' },
    { value: 'client_analysis', label: 'Análise de Clientes', icon: TrendingUp, description: 'Comportamento e retenção de clientes' },
    { value: 'service_ranking', label: 'Ranking de Serviços', icon: BarChart3, description: 'Serviços mais populares e rentáveis' },
    { value: 'occupancy_metrics', label: 'Métricas de Ocupação', icon: Activity, description: 'Utilização da capacidade do estabelecimento' },
    { value: 'appointment_analysis', label: 'Análise de Agendamentos', icon: Calendar, description: 'Padrões de agendamento e cancelamentos' },
    { value: 'cash_flow', label: 'Fluxo de Caixa', icon: PieChart, description: 'Controle detalhado de entradas e saídas' },
    { value: 'productivity', label: 'Produtividade', icon: Target, description: 'Métricas de eficiência operacional' },
    { value: 'time_analysis', label: 'Análise Temporal', icon: Clock, description: 'Tendências ao longo do tempo' },
  ];

  const handleGenerateReport = async (reportType: string) => {
    const filters: ReportFilters = {
      type: reportType as ReportFilters['type'],
      period: 'monthly',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
    };

    await generateReport(filters);
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    await exportReport(format);
  };

  const getReportIcon = (type: string) => {
    const reportType = reportTypes.find(rt => rt.value === type);
    return reportType?.icon || BarChart3;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Relatórios</h1>
          <p className="text-muted-foreground">
            Análise avançada e insights do seu negócio de banho e tosa
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleExport('pdf')}
            disabled={!state.currentReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('excel')}
            disabled={!state.currentReport}
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Relatórios Disponíveis
          </CardTitle>
          <CardDescription>
            Selecione um relatório para gerar análises detalhadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((reportType) => {
              const Icon = reportType.icon;
              return (
                <Card
                  key={reportType.value}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{reportType.label}</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          {reportType.description}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateReport(reportType.value)}
                          className="w-full"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Gerar Relatório
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtros de Relatório
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select onValueChange={(value) => updateFilters({ period: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                  <SelectItem value="quarterly">Trimestral</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Input
                id="startDate"
                type="date"
                onChange={(e) => updateFilters({ startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Input
                id="endDate"
                type="date"
                onChange={(e) => updateFilters({ endDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="groomer">Tosador</Label>
              <Select onValueChange={(value) => updateFilters({ groomerId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tosadores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tosadores</SelectItem>
                  {/* TODO: Add groomer options */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => updateFilters({ categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as categorias</SelectItem>
                  {/* TODO: Add category options */}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filtros Avançados */}
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="includeCancelled" className="rounded" />
                <Label htmlFor="includeCancelled" className="text-sm">Incluir cancelados</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="groupByGroomer" className="rounded" />
                <Label htmlFor="groupByGroomer" className="text-sm">Agrupar por tosador</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="showDetails" className="rounded" />
                <Label htmlFor="showDetails" className="text-sm">Mostrar detalhes</Label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="exportReady" className="rounded" />
                <Label htmlFor="exportReady" className="text-sm">Pronto para exportação</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Content */}
      {state.currentReport && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {React.createElement(getReportIcon(state.currentReport.metadata.filters.type || ''), {
                    className: "w-5 h-5"
                  })}
                  {reportTypes.find(rt => rt.value === state.currentReport?.metadata.filters.type)?.label}
                </CardTitle>
                <CardDescription>
                  Gerado em {new Date(state.currentReport.metadata.generatedAt).toLocaleString('pt-BR')}
                  • {state.currentReport.metadata.totalRecords} registros
                  • {state.currentReport.metadata.executionTime}ms
                </CardDescription>
              </div>
              <Badge variant="secondary">
                {state.currentReport.metadata.filters.period || 'Período não especificado'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-9">
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                <TabsTrigger value="groomers">Tosadores</TabsTrigger>
                <TabsTrigger value="clients">Clientes</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="occupancy">Ocupação</TabsTrigger>
                <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
                <TabsTrigger value="cash_flow">Fluxo de Caixa</TabsTrigger>
                <TabsTrigger value="productivity">Produtividade</TabsTrigger>
                <TabsTrigger value="time_analysis">Temporal</TabsTrigger>
              </TabsList>

              <TabsContent value="financial" className="mt-6">
                <FinancialReportView data={state.currentReport?.data} />
              </TabsContent>

              <TabsContent value="groomers" className="mt-6">
                <GroomerPerformanceView data={state.currentReport?.data} />
              </TabsContent>

              <TabsContent value="clients" className="mt-6">
                <ClientAnalysisView data={state.currentReport?.data} />
              </TabsContent>

              <TabsContent value="services" className="mt-6">
                <ServiceRankingView data={state.currentReport?.data} />
              </TabsContent>

              <TabsContent value="occupancy" className="mt-6">
                <OccupancyMetricsView data={state.currentReport?.data} />
              </TabsContent>

              <TabsContent value="appointments" className="mt-6">
                <AppointmentAnalysisView data={state.currentReport?.data} />
              </TabsContent>

              <TabsContent value="cash_flow" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Relatório de Fluxo de Caixa em desenvolvimento</p>
                  <p className="text-sm">Análise detalhada de entradas e saídas por período</p>
                </div>
              </TabsContent>

              <TabsContent value="productivity" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Métricas de Produtividade em desenvolvimento</p>
                  <p className="text-sm">Indicadores de eficiência operacional e performance</p>
                </div>
              </TabsContent>

              <TabsContent value="time_analysis" className="mt-6">
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Análise Temporal em desenvolvimento</p>
                  <p className="text-sm">Tendências e padrões ao longo do tempo</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {state.loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2">Gerando relatório...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {state.error && (
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="text-destructive">
              <strong>Erro:</strong> {state.error}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}