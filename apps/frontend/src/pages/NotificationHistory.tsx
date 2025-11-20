import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Search, Bell, CheckCircle, AlertCircle, Info, Star } from 'lucide-react';
import { useNotifications, NotificationData } from '../hooks/useNotifications';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NotificationHistory: React.FC = () => {
  const { notifications, isLoading, loadNotifications } = useNotifications();
  const [filteredNotifications, setFilteredNotifications] = useState<NotificationData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  useEffect(() => {
    let filtered = notifications;

    // Filtro por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo
    if (typeFilter !== 'all') {
      filtered = filtered.filter((notification) => notification.type === typeFilter);
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((notification) =>
        statusFilter === 'read' ? notification.isRead : !notification.isRead
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, typeFilter, statusFilter]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'APPOINTMENT_CONFIRMATION':
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'APPOINTMENT_REMINDER':
      case 'REMINDER':
        return <Bell className="h-5 w-5 text-blue-600" />;
      case 'WARNING':
      case 'ERROR':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'VACCINE_REMINDER':
        return <span className="text-2xl">💉</span>;
      case 'PROMOTION':
      case 'SPECIAL_OFFER':
        return <span className="text-2xl">🎁</span>;
      case 'LOYALTY_POINTS':
        return <Star className="h-5 w-5 text-orange-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'APPOINTMENT_CONFIRMATION':
      case 'SUCCESS':
        return 'border-l-green-500';
      case 'APPOINTMENT_REMINDER':
      case 'REMINDER':
        return 'border-l-blue-500';
      case 'WARNING':
        return 'border-l-yellow-500';
      case 'ERROR':
        return 'border-l-red-500';
      case 'VACCINE_REMINDER':
        return 'border-l-purple-500';
      case 'PROMOTION':
      case 'SPECIAL_OFFER':
        return 'border-l-pink-500';
      case 'LOYALTY_POINTS':
        return 'border-l-orange-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const NOTIFICATION_TYPE_LABELS = {
    APPOINTMENT_CONFIRMATION: 'Confirmação de Agendamento',
    APPOINTMENT_REMINDER: 'Lembrete de Agendamento',
    APPOINTMENT_CANCELLED: 'Cancelamento de Agendamento',
    SERVICE_STATUS_UPDATE: 'Status do Serviço',
    VACCINE_REMINDER: 'Lembrete de Vacinas',
    PAYMENT_REMINDER: 'Lembrete de Pagamento',
    LOYALTY_POINTS: 'Pontos de Fidelidade',
    PROMOTION: 'Promoções',
    SPECIAL_OFFER: 'Ofertas Especiais',
    INFO: 'Informação',
    WARNING: 'Aviso',
    SUCCESS: 'Sucesso',
    ERROR: 'Erro',
    REMINDER: 'Lembrete',
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="h-6 w-6" />
          Histórico de Notificações
        </h1>
        <p className="text-muted-foreground mt-2">
          Veja todas as notificações recebidas
        </p>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Tipo de notificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {Object.entries(NOTIFICATION_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="unread">Não lidas</SelectItem>
                <SelectItem value="read">Lidas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{notifications.length}</div>
            <p className="text-xs text-muted-foreground">Total de notificações</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {notifications.filter(n => !n.isRead).length}
            </div>
            <p className="text-xs text-muted-foreground">Não lidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {notifications.filter(n => n.isRead).length}
            </div>
            <p className="text-xs text-muted-foreground">Lidas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(notifications.map(n => n.type)).size}
            </div>
            <p className="text-xs text-muted-foreground">Tipos diferentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de notificações */}
      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            {filteredNotifications.length} de {notifications.length} notificações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {notifications.length === 0
                    ? 'Nenhuma notificação encontrada'
                    : 'Nenhuma notificação corresponde aos filtros'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-l-4 rounded-r-lg bg-card ${getNotificationColor(
                      notification.type
                    )} ${!notification.isRead ? 'bg-blue-50/50' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 ml-4">
                            {!notification.isRead && (
                              <Badge variant="secondary" className="text-xs">
                                Nova
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {NOTIFICATION_TYPE_LABELS[notification.type as keyof typeof NOTIFICATION_TYPE_LABELS] || notification.type}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm')}
                          </span>
                          <span>
                            {formatDistanceToNow(new Date(notification.createdAt), {
                              addSuffix: true,
                              locale: ptBR,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationHistory;