import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import {
  Download,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash2,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
} from 'lucide-react';

import { BackupService } from '../../services/backupService';
import { BackupMetadata, BackupType, BackupStatus } from '../../types/backup';

interface BackupListProps {
  backups: BackupMetadata[];
  onRestore: (backup: BackupMetadata) => void;
  onDownload: (backup: BackupMetadata) => void;
  onRefresh: () => void;
}

export const BackupList: React.FC<BackupListProps> = ({
  backups,
  onRestore,
  onDownload,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [backupToDelete, setBackupToDelete] = useState<BackupMetadata | null>(null);

  // Filtra backups baseado nos filtros
  const filteredBackups = backups.filter((backup) => {
    const matchesSearch = backup.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         backup.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === 'all' || backup.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || backup.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleDeleteBackup = async (backup: BackupMetadata) => {
    setBackupToDelete(backup);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!backupToDelete) return;

    try {
      // Em uma implementação real, você faria uma chamada para deletar o backup
      console.log('Deletando backup:', backupToDelete.id);
      setDeleteDialogOpen(false);
      setBackupToDelete(null);
      onRefresh();
    } catch (error) {
      console.error('Erro ao deletar backup:', error);
    }
  };

  const getStatusIcon = (status: BackupStatus) => {
    switch (status) {
      case BackupStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case BackupStatus.FAILED:
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case BackupStatus.IN_PROGRESS:
        return <Clock className="h-4 w-4 text-blue-600" />;
      case BackupStatus.PENDING:
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadgeVariant = (status: BackupStatus) => {
    switch (status) {
      case BackupStatus.COMPLETED:
        return 'default';
      case BackupStatus.FAILED:
        return 'destructive';
      case BackupStatus.IN_PROGRESS:
        return 'secondary';
      case BackupStatus.PENDING:
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Histórico de Backups</span>
          </CardTitle>
          <CardDescription>
            Lista de todos os backups criados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar backups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tipo de backup" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value={BackupType.FULL}>Completo</SelectItem>
                <SelectItem value={BackupType.DATABASE}>Banco de Dados</SelectItem>
                <SelectItem value={BackupType.CONFIG}>Configurações</SelectItem>
                <SelectItem value={BackupType.UPLOADS}>Uploads</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value={BackupStatus.COMPLETED}>Concluído</SelectItem>
                <SelectItem value={BackupStatus.FAILED}>Falhou</SelectItem>
                <SelectItem value={BackupStatus.IN_PROGRESS}>Em Andamento</SelectItem>
                <SelectItem value={BackupStatus.PENDING}>Pendente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de backups */}
          {filteredBackups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum backup encontrado</p>
              <p className="text-sm">Tente ajustar os filtros ou criar um novo backup</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome do Arquivo</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tamanho</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBackups.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(backup.status)}
                          <div>
                            <div className="font-medium">{backup.fileName}</div>
                            {backup.description && (
                              <div className="text-sm text-muted-foreground">
                                {backup.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {BackupService.getBackupTypeIcon(backup.type)}
                          {backup.type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(backup.status)}>
                          {BackupService.getStatusText(backup.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>{BackupService.formatFileSize(backup.fileSize)}</TableCell>
                      <TableCell>
                        {BackupService.formatDate(backup.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onDownload(backup)}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRestore(backup)}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Restaurar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteBackup(backup)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogo de confirmação de exclusão */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Backup</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o backup "{backupToDelete?.fileName}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};