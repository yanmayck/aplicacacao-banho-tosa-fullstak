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
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Alert, AlertDescription } from '../ui/alert';
import { Loader2, Database, Shield, Archive, FileText } from 'lucide-react';

import { BackupService } from '../../services/backupService';
import { CreateBackupRequest, BackupType } from '../../types/backup';

interface CreateBackupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBackup: (request: CreateBackupRequest) => void;
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

export const CreateBackupDialog: React.FC<CreateBackupDialogProps> = ({
  open,
  onOpenChange,
  onCreateBackup,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBackupRequest>({
    type: BackupType.FULL,
    description: '',
    includeUploads: true,
    includeConfig: false,
    encrypt: true,
    tables: [],
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação
    const validationErrors = BackupService.validateBackupRequest(formData);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    setLoading(true);

    try {
      await onCreateBackup(formData);
      handleClose();
    } catch (error) {
      console.error('Erro ao criar backup:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      type: BackupType.FULL,
      description: '',
      includeUploads: true,
      includeConfig: false,
      encrypt: true,
      tables: [],
    });
    setErrors([]);
    onOpenChange(false);
  };

  const handleTypeChange = (type: string) => {
    const backupType = type as BackupType;
    setFormData(prev => ({
      ...prev,
      type: backupType,
      // Ajusta configurações padrão baseado no tipo
      ...(backupType === BackupType.CONFIG && { includeConfig: true, includeUploads: false }),
      ...(backupType === BackupType.UPLOADS && { includeUploads: true, includeConfig: false }),
      ...(backupType === BackupType.DATABASE && { includeUploads: false, includeConfig: false }),
    }));
  };

  const handleTableToggle = (tableName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      tables: checked
        ? [...(prev.tables || []), tableName]
        : (prev.tables || []).filter(t => t !== tableName),
    }));
  };

  const getTypeDescription = (type: BackupType) => {
    switch (type) {
      case BackupType.FULL:
        return 'Backup completo de todos os dados do sistema, incluindo banco de dados, uploads e configurações.';
      case BackupType.DATABASE:
        return 'Backup apenas do banco de dados, incluindo todas as tabelas e relacionamentos.';
      case BackupType.CONFIG:
        return 'Backup das configurações do sistema e variáveis de ambiente.';
      case BackupType.UPLOADS:
        return 'Backup apenas dos arquivos enviados pelos usuários.';
      default:
        return '';
    }
  };

  const getTypeIcon = (type: BackupType) => {
    switch (type) {
      case BackupType.FULL:
        return <Database className="h-5 w-5" />;
      case BackupType.DATABASE:
        return <Database className="h-5 w-5" />;
      case BackupType.CONFIG:
        return <FileText className="h-5 w-5" />;
      case BackupType.UPLOADS:
        return <Archive className="h-5 w-5" />;
      default:
        return <Database className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {getTypeIcon(formData.type)}
            <span>Criar Novo Backup</span>
          </DialogTitle>
          <DialogDescription>
            Configure as opções do backup antes de iniciar o processo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de Backup */}
          <div className="space-y-3">
            <Label>Tipo de Backup</Label>
            <Select value={formData.type} onValueChange={handleTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={BackupType.FULL}>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span>Backup Completo</span>
                  </div>
                </SelectItem>
                <SelectItem value={BackupType.DATABASE}>
                  <div className="flex items-center space-x-2">
                    <Database className="h-4 w-4" />
                    <span>Apenas Banco de Dados</span>
                  </div>
                </SelectItem>
                <SelectItem value={BackupType.CONFIG}>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>Apenas Configurações</span>
                  </div>
                </SelectItem>
                <SelectItem value={BackupType.UPLOADS}>
                  <div className="flex items-center space-x-2">
                    <Archive className="h-4 w-4" />
                    <span>Apenas Uploads</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {getTypeDescription(formData.type)}
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva o propósito deste backup..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Opções de Backup */}
          <div className="space-y-4">
            <Label>Opções do Backup</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="encrypt"
                  checked={formData.encrypt || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, encrypt: checked }))}
                />
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <Label htmlFor="encrypt">Criptografia AES-256</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeUploads"
                  checked={formData.includeUploads || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeUploads: checked }))}
                />
                <div className="flex items-center space-x-2">
                  <Archive className="h-4 w-4" />
                  <Label htmlFor="includeUploads">Incluir Arquivos</Label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="includeConfig"
                  checked={formData.includeConfig || false}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeConfig: checked }))}
                />
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <Label htmlFor="includeConfig">Incluir Configurações</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Seleção de Tabelas (apenas para backups seletivos) */}
          {(formData.type === BackupType.DATABASE || formData.type === BackupType.FULL) && (
            <div className="space-y-3">
              <Label>Tabelas Específicas (opcional)</Label>
              <p className="text-sm text-muted-foreground">
                Deixe vazio para incluir todas as tabelas ou selecione tabelas específicas
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border rounded-md p-4">
                {availableTables.map((table) => (
                  <div key={table} className="flex items-center space-x-2">
                    <Checkbox
                      id={`table-${table}`}
                      checked={formData.tables?.includes(table) || false}
                      onCheckedChange={(checked) => handleTableToggle(table, checked as boolean)}
                    />
                    <Label htmlFor={`table-${table}`} className="text-sm">
                      {table}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Erros de validação */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Informações sobre o backup */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Sobre este backup:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• O backup será comprimido automaticamente</li>
              {formData.encrypt && <li>• Os dados serão criptografados com AES-256</li>}
              <li>• O processo pode levar alguns minutos dependendo do tamanho</li>
              <li>• Você será notificado quando o backup estiver concluído</li>
            </ul>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando Backup...
                </>
              ) : (
                'Criar Backup'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};