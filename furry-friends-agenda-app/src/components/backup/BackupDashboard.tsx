import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Alert, AlertDescription } from '../ui/alert';
import { Progress } from '../ui/progress';
import {
  Download,
  RefreshCw,
  Plus,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Database,
  FileText,
  Archive,
  TrendingUp,
} from 'lucide-react';

import { BackupService } from '../../services/backupService';
import {
  BackupMetadata,
  BackupProgress,
  BackupStats,
  BackupType,
  CreateBackupRequest,
} from '../../types/backup';
import { ApiErrorType, getErrorMessage } from '../../types/api';

import { BackupList } from './BackupList';
import { CreateBackupDialog } from './CreateBackupDialog';
import { BackupStatsCard } from './BackupStatsCard';
import { RestoreBackupDialog } from './RestoreBackupDialog';

export const BackupDashboard: React.FC = () => {
  const [backups, setBackups] = useState<BackupMetadata[]>([]);
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentProgress, setCurrentProgress] = useState<BackupProgress | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupMetadata | null>(null);

  // Carrega dados iniciais
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [backupsResponse, statsResponse] = await Promise.all([
        BackupService.getBackups(),
        BackupService.getBackupStats(),
      ]);

      setBackups(backupsResponse.data);
      setStats(statsResponse.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err as ApiErrorType) || 'Erro ao carregar dados do painel');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (request: CreateBackupRequest) => {
    try {
      const response = await BackupService.createBackup(request);

      if (response.success) {
        setShowCreateDialog(false);
        loadDashboardData();

        // Se há progresso disponível, inicia o polling
        if (response.data?.backupId) {
          startProgressPolling(response.data.backupId);
        }
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err as ApiErrorType) || 'Erro ao criar backup');
    }
  };

  const handleRestoreBackup = (backup: BackupMetadata) => {
    setSelectedBackup(backup);
    setShowRestoreDialog(true);
  };

  const handleDownloadBackup = async (backup: BackupMetadata) => {
    try {
      const blob = await BackupService.downloadBackup(backup.id);

      // Cria URL para download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = backup.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      setError(getErrorMessage(err as ApiErrorType) || 'Erro ao fazer download do backup');
    }
  };

  const startProgressPolling = (backupId: string) => {
    BackupService.pollBackupProgress(
      backupId,
      (progress) => setCurrentProgress(progress),
      (finalProgress) => {
        setCurrentProgress(null);
        loadDashboardData(); // Recarrega dados após conclusão
      },
      (error) => {
        setError(error);
        setCurrentProgress(null);
      }
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Carregando painel de backup...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Backup e Recuperação</h1>
          <p className="text-muted-foreground">
            Gerencie backups automáticos e manuais dos seus dados
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={loadDashboardData}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Backup
          </Button>
        </div>
      </div>

      {/* Progresso de backup atual */}
      {currentProgress && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getStatusIcon(currentProgress.status)}
              <span>Backup em Andamento</span>
            </CardTitle>
            <CardDescription>
              {currentProgress.currentStep}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progresso</span>
                <span>{Math.round(currentProgress.progress)}%</span>
              </div>
              <Progress value={currentProgress.progress} className="w-full" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  {BackupService.formatFileSize(currentProgress.bytesProcessed)} de{' '}
                  {BackupService.formatFileSize(currentProgress.totalBytes)}
                </span>
                <span>
                  Iniciado em {BackupService.formatDate(currentProgress.startTime)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas */}
      {stats && <BackupStatsCard stats={stats} />}

      {/* Abas principais */}
      <Tabs defaultValue="backups" className="space-y-4">
        <TabsList>
          <TabsTrigger value="backups">Histórico de Backups</TabsTrigger>
          <TabsTrigger value="restore">Restauração</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>

        <TabsContent value="backups" className="space-y-4">
          <BackupList
            backups={backups}
            onRestore={handleRestoreBackup}
            onDownload={handleDownloadBackup}
            onRefresh={loadDashboardData}
          />
        </TabsContent>

        <TabsContent value="restore" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Restauração de Dados</CardTitle>
              <CardDescription>
                Selecione um backup para restaurar dados do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use a aba "Histórico de Backups" para selecionar e restaurar um backup específico.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Backup</CardTitle>
              <CardDescription>
                Configure agendamentos automáticos e preferências de backup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Backup Automático</label>
                    <p className="text-sm text-muted-foreground">
                      Backups são executados automaticamente todos os dias às 2:00 AM
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Retenção</label>
                    <p className="text-sm text-muted-foreground">
                      Backups são mantidos por 30 dias
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Criptografia</label>
                    <p className="text-sm text-muted-foreground">
                      Todos os backups são criptografados com AES-256
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Compressão</label>
                    <p className="text-sm text-muted-foreground">
                      Arquivos são comprimidos com nível máximo
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogos */}
      <CreateBackupDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateBackup={handleCreateBackup}
      />

      {selectedBackup && (
        <RestoreBackupDialog
          open={showRestoreDialog}
          onOpenChange={setShowRestoreDialog}
          backup={selectedBackup}
          onRestoreComplete={() => {
            setShowRestoreDialog(false);
            setSelectedBackup(null);
            loadDashboardData();
          }}
        />
      )}
    </div>
  );
};