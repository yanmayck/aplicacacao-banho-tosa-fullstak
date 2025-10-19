import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import {
  Loader2,
  AlertTriangle,
  Database,
  RotateCcw,
  CheckCircle,
  Clock,
  FileText,
} from 'lucide-react';

import { BackupService } from '../../services/backupService';
import { BackupMetadata, RestoreBackupRequest } from '../../types/backup';

interface RestoreBackupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  backup: BackupMetadata;
  onRestoreComplete: () => void;
}

const availableTables = [
  'User',
  'Client',
  'Pet',
  'Appointment',
  'Transaction',
  'Groomer',
  'ServicePackage',
  'Product',
  'StockMovement',
  'Review',
  'Notification',
];

export const RestoreBackupDialog: React.FC<RestoreBackupDialogProps> = ({
  open,
  onOpenChange,
  backup,
  onRestoreComplete,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [dryRun, setDryRun] = useState(true);
  const [force, setForce] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTables.length === 0) {
      setError('Selecione pelo menos uma tabela para restaurar');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: RestoreBackupRequest = {
        backupId: backup.id,
        tables: selectedTables,
        dryRun,
        force,
      };

      const response = await BackupService.restoreBackup(request);

      if (response.success) {
        onRestoreComplete();
      } else {
        setError(response.message || 'Erro ao restaurar backup');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao restaurar backup');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTables([]);
    setDryRun(true);
    setForce(false);
    setError(null);
    onOpenChange(false);
  };

  const handleTableToggle = (tableName: string, checked: boolean) => {
    setSelectedTables(prev =>
      checked
        ? [...prev, tableName]
        : prev.filter(t => t !== tableName)
    );
  };

  const toggleAllTables = () => {
    if (selectedTables.length === availableTables.length) {
      setSelectedTables([]);
    } else {
      setSelectedTables([...availableTables]);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Database className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <RotateCcw className="h-5 w-5" />
            <span>Restaurar Backup</span>
          </DialogTitle>
          <DialogDescription>
            Configure as opções de restauração para o backup selecionado
          </DialogDescription>
        </DialogHeader>

        {/* Informações do Backup */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getStatusIcon(backup.status)}
              <span className="font-medium">{backup.fileName}</span>
            </div>
            <Badge variant={backup.status === 'completed' ? 'default' : 'destructive'}>
              {BackupService.getStatusText(backup.status)}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Tipo:</span>
              <div className="flex items-center space-x-1 mt-1">
                <span>{BackupService.getBackupTypeIcon(backup.type)}</span>
                <span className="capitalize">{backup.type}</span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Tamanho:</span>
              <span className="ml-1">{BackupService.formatFileSize(backup.fileSize)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Criado em:</span>
              <span className="ml-1">{BackupService.formatDate(backup.createdAt)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Criptografado:</span>
              <span className="ml-1">{backup.encrypted ? 'Sim' : 'Não'}</span>
            </div>
          </div>

          {backup.description && (
            <div>
              <span className="text-muted-foreground text-sm">Descrição:</span>
              <p className="text-sm mt-1">{backup.description}</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Tabelas */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Tabelas para Restaurar</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleAllTables}
              >
                {selectedTables.length === availableTables.length ? 'Desmarcar Todas' : 'Selecionar Todas'}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border rounded-md p-4">
              {availableTables.map((table) => (
                <div key={table} className="flex items-center space-x-2">
                  <Checkbox
                    id={`restore-${table}`}
                    checked={selectedTables.includes(table)}
                    onCheckedChange={(checked) => handleTableToggle(table, checked as boolean)}
                  />
                  <Label htmlFor={`restore-${table}`} className="text-sm">
                    {table}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Opções de Restauração */}
          <div className="space-y-4">
            <Label>Opções de Restauração</Label>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="dryRun"
                  checked={dryRun}
                  onCheckedChange={(checked) => setDryRun(checked as boolean)}
                />
                <Label htmlFor="dryRun" className="text-sm">
                  Modo de teste (não altera dados)
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="force"
                  checked={force}
                  onCheckedChange={(checked) => setForce(checked as boolean)}
                />
                <Label htmlFor="force" className="text-sm">
                  Forçar restauração (sobrescreve dados existentes)
                </Label>
              </div>
            </div>
          </div>

          {/* Avisos */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Atenção:</p>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>A restauração pode levar vários minutos dependendo do tamanho do backup</li>
                  <li>Em modo de teste, nenhuma alteração será feita nos dados</li>
                  <li>Certifique-se de ter um backup recente antes de proceder</li>
                  {force && (
                    <li className="text-red-600 font-medium">
                      Modo forçado irá sobrescrever todos os dados existentes!
                    </li>
                  )}
                </ul>
              </div>
            </AlertDescription>
          </Alert>

          {/* Erro */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || selectedTables.length === 0}
              variant={force ? "destructive" : "default"}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {dryRun ? 'Executando Teste...' : 'Restaurando...'}
                </>
              ) : (
                <>
                  {dryRun ? 'Executar Teste' : 'Restaurar Dados'}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};