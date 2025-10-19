import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Database,
  HardDrive,
  Calendar,
  Clock,
} from 'lucide-react';

import { BackupService } from '../../services/backupService';
import { BackupStats } from '../../types/backup';

interface BackupStatsCardProps {
  stats: BackupStats;
}

export const BackupStatsCard: React.FC<BackupStatsCardProps> = ({ stats }) => {
  const formatFileSize = (bytes: number) => {
    return BackupService.formatFileSize(bytes);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Nunca';
    return BackupService.formatDate(dateString);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total de Backups */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Backups</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBackups}</div>
          <p className="text-xs text-muted-foreground">
            {stats.completedBackups} concluídos, {stats.failedBackups} com falha
          </p>
        </CardContent>
      </Card>

      {/* Tamanho Total */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Espaço Utilizado</CardTitle>
          <HardDrive className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatFileSize(stats.totalSize)}</div>
          <p className="text-xs text-muted-foreground">
            Média: {formatFileSize(stats.averageSize)}
          </p>
        </CardContent>
      </Card>

      {/* Backup Mais Recente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {formatDate(stats.newestBackup)}
          </div>
          <p className="text-xs text-muted-foreground">
            Backup mais recente
          </p>
        </CardContent>
      </Card>

      {/* Backup Mais Antigo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Primeiro Backup</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-sm font-medium">
            {formatDate(stats.oldestBackup)}
          </div>
          <p className="text-xs text-muted-foreground">
            Backup mais antigo
          </p>
        </CardContent>
      </Card>
    </div>
  );
};