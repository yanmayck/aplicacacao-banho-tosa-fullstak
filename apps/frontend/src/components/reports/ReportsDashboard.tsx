import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Calendar, Download, Filter, TrendingUp, Users, DollarSign, Activity, BarChart3 } from 'lucide-react';
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
    { value: 'financial', label: 'Relatório Financeiro', icon: DollarSign },
    { value: 'groomer_performance', label: 'Performance de Tosadores', icon: Users },
    { value: 'client_analysis', label: 'Análise de Clientes', icon: TrendingUp },
    { value: 'service_ranking', label: 'Ranking de Serviços', icon: BarChart3 },
    { value: 'occupancy_metrics', label: 'Métricas de Ocupação', icon: Activity },
    { value: 'appointment_analysis', label: 'Análise de Agendamentos', icon: Calendar },
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
                  onClick={() => handleGenerateReport(reportType.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{reportType.label}</h3>
                        <p className="text-sm text-muted-foreground">
                          Clique para gerar
                        </p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select onValueChange={(value) => updateFilters({ period: value as ReportFilters['period'] })}>
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
              <Label htmlFor="reportType">Tipo de Relatório</Label>
              <Select onValueChange={(value) => updateFilters({ type: value as ReportFilters['type'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                <TabsTrigger value="groomers">Tosadores</TabsTrigger>
                <TabsTrigger value="clients">Clientes</TabsTrigger>
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="occupancy">Ocupação</TabsTrigger>
                <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
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