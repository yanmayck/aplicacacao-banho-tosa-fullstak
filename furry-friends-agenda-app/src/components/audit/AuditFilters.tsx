import React, { useState } from 'react';
import { useAudit } from '../../context/audit/AuditContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Calendar, Filter, Save, Trash2 } from 'lucide-react';
import { AuditLogFilters, AuditActionType, AuditSeverity } from '../../types/audit';
import { auditService } from '../../services/auditService';

interface AuditFiltersProps {
  compact?: boolean;
}

export function AuditFilters({ compact = false }: AuditFiltersProps) {
  const { filters, setFilters, clearFilters, saveFilter, deleteSavedFilter, savedFilters } = useAudit();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterDescription, setFilterDescription] = useState('');

  const handleFilterChange = (key: keyof AuditLogFilters, value: string) => {
    setFilters({
      ...filters,
      [key]: value || undefined,
    });
  };

  const handleDateRangeChange = (type: 'startDate' | 'endDate', value: string) => {
    setFilters({
      ...filters,
      [type]: value || undefined,
    });
  };

  const handleSaveFilter = async () => {
    if (!filterName.trim()) return;

    await saveFilter(filterName, filterDescription);
    setShowSaveDialog(false);
    setFilterName('');
    setFilterDescription('');
  };

  const handleLoadFilter = (savedFilter: any) => {
    setFilters(savedFilter.filters);
  };

  const handleDeleteFilter = async (id: string) => {
    await deleteSavedFilter(id);
  };

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Filtros Básicos */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium">Filtros</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary">{activeFilterCount} ativo{activeFilterCount > 1 ? 's' : ''}</Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Menos' : 'Mais'} Filtros
            </Button>

            <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Salvar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Salvar Filtros</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="filterName">Nome do Filtro</Label>
                    <Input
                      id="filterName"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      placeholder="Ex: Logs de hoje"
                    />
                  </div>
                  <div>
                    <Label htmlFor="filterDescription">Descrição (opcional)</Label>
                    <Input
                      id="filterDescription"
                      value={filterDescription}
                      onChange={(e) => setFilterDescription(e.target.value)}
                      placeholder="Ex: Filtro para visualizar logs do dia atual"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                      Cancelar
                    </Button>
                    <Button onClick={handleSaveFilter} disabled={!filterName.trim()}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className={`grid gap-4 ${compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'}`}>
          {/* Ação */}
          <div>
            <Label className="text-sm font-medium">Ação</Label>
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

          {/* Severidade */}
          <div>
            <Label className="text-sm font-medium">Severidade</Label>
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

          {/* Módulo */}
          <div>
            <Label className="text-sm font-medium">Módulo</Label>
            <Input
              placeholder="Ex: financial, appointments"
              value={filters.module || ''}
              onChange={(e) => handleFilterChange('module', e.target.value)}
            />
          </div>

          {/* Busca */}
          <div>
            <Label className="text-sm font-medium">Busca</Label>
            <Input
              placeholder="Buscar em descrições..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
        </div>

        {/* Filtros Avançados */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t space-y-4">
            <h4 className="font-medium text-sm">Filtros Avançados</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Período */}
              <div>
                <Label className="text-sm font-medium">Data Inicial</Label>
                <Input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleDateRangeChange('startDate', e.target.value)}
                />
              </div>

              <div>
                <Label className="text-sm font-medium">Data Final</Label>
                <Input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleDateRangeChange('endDate', e.target.value)}
                />
              </div>

              {/* Tipo de Entidade */}
              <div>
                <Label className="text-sm font-medium">Tipo de Entidade</Label>
                <Input
                  placeholder="Ex: Transaction, User"
                  value={filters.entityType || ''}
                  onChange={(e) => handleFilterChange('entityType', e.target.value)}
                />
              </div>

              {/* ID da Entidade */}
              <div>
                <Label className="text-sm font-medium">ID da Entidade</Label>
                <Input
                  placeholder="ID específico"
                  value={filters.entityId || ''}
                  onChange={(e) => handleFilterChange('entityId', e.target.value)}
                />
              </div>

              {/* ID do Usuário */}
              <div>
                <Label className="text-sm font-medium">ID do Usuário</Label>
                <Input
                  placeholder="ID do usuário"
                  value={filters.userId || ''}
                  onChange={(e) => handleFilterChange('userId', e.target.value)}
                />
              </div>

              {/* Sucesso/Falha */}
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <Select
                  value={filters.success?.toString() || ''}
                  onValueChange={(value) => handleFilterChange('success', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="true">Sucesso</SelectItem>
                    <SelectItem value="false">Falha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filtros Salvos */}
      {savedFilters.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-medium mb-3">Filtros Salvos</h3>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((filter) => (
              <div key={filter.id} className="flex items-center space-x-2">
                <button
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleLoadFilter(filter)}
                >
                  {filter.name}
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteFilter(filter.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}