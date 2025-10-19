import React, { useState, useEffect } from 'react';
import { Settings, Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { useNotifications, NotificationPreferences as NotificationPreferencesType } from '../../hooks/useNotifications';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface NotificationPreferencesProps {
  onClose?: () => void;
}

const NOTIFICATION_TYPES = [
  {
    key: 'APPOINTMENT_CONFIRMATION',
    label: 'Confirmação de Agendamento',
    description: 'Receber confirmação quando agendamento for marcado',
    icon: '✅',
  },
  {
    key: 'APPOINTMENT_REMINDER',
    label: 'Lembrete de Agendamento',
    description: 'Lembrete 24h antes do agendamento',
    icon: '⏰',
  },
  {
    key: 'APPOINTMENT_CANCELLED',
    label: 'Cancelamento de Agendamento',
    description: 'Notificação quando agendamento for cancelado',
    icon: '❌',
  },
  {
    key: 'SERVICE_STATUS_UPDATE',
    label: 'Status do Serviço',
    description: 'Atualizações sobre o andamento do serviço',
    icon: '🔄',
  },
  {
    key: 'VACCINE_REMINDER',
    label: 'Lembrete de Vacinas',
    description: 'Avisos sobre vacinas vencidas ou próximas de vencer',
    icon: '💉',
  },
  {
    key: 'PAYMENT_REMINDER',
    label: 'Lembrete de Pagamento',
    description: 'Avisos sobre pagamentos pendentes',
    icon: '💳',
  },
  {
    key: 'LOYALTY_POINTS',
    label: 'Pontos de Fidelidade',
    description: 'Notificações sobre pontos ganhos',
    icon: '⭐',
  },
  {
    key: 'PROMOTION',
    label: 'Promoções',
    description: 'Ofertas e promoções especiais',
    icon: '🎁',
  },
  {
    key: 'SPECIAL_OFFER',
    label: 'Ofertas Especiais',
    description: 'Ofertas exclusivas para você',
    icon: '🏷️',
  },
];

const CHANNELS = [
  {
    key: 'IN_APP',
    label: 'No App',
    description: 'Notificações dentro da aplicação',
    icon: Bell,
  },
  {
    key: 'PUSH',
    label: 'Push',
    description: 'Notificações push no navegador',
    icon: Smartphone,
  },
  {
    key: 'EMAIL',
    label: 'Email',
    description: 'Notificações por email',
    icon: Mail,
  },
  {
    key: 'SMS',
    label: 'SMS',
    description: 'Notificações por mensagem de texto',
    icon: MessageSquare,
  },
  {
    key: 'WHATSAPP',
    label: 'WhatsApp',
    description: 'Notificações via WhatsApp',
    icon: MessageSquare,
  },
];

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  onClose,
}) => {
  const { preferences, updatePreferences, requestPushPermission, isSupported, permission } = useNotifications();
  const [localPreferences, setLocalPreferences] = useState<NotificationPreferencesType | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  const handlePreferenceChange = (
    notificationType: string,
    channel: string,
    enabled: boolean
  ) => {
    if (!localPreferences) return;

    setLocalPreferences(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        [notificationType]: {
          ...prev[notificationType],
          [channel]: enabled,
        },
      };
    });
  };

  const handleSave = async () => {
    if (!localPreferences) return;

    setIsSaving(true);
    try {
      await updatePreferences(localPreferences);
      if (onClose) onClose();
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRequestPushPermission = async () => {
    try {
      await requestPushPermission();
    } catch (error) {
      console.error('Erro ao solicitar permissão para push:', error);
    }
  };

  const getChannelIcon = (channelKey: string) => {
    const channel = CHANNELS.find(c => c.key === channelKey);
    if (!channel) return <Bell className="h-4 w-4" />;

    const IconComponent = channel.icon;
    return <IconComponent className="h-4 w-4" />;
  };

  if (!localPreferences) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Configurações de Notificações
        </h1>
        <p className="text-muted-foreground mt-2">
          Gerencie como e quando você deseja receber notificações
        </p>
      </div>

      {/* Configurações de Push Notifications */}
      {isSupported && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Notificações Push
            </CardTitle>
            <CardDescription>
              Receba notificações mesmo quando a aplicação estiver fechada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Habilitar notificações push</p>
                <p className="text-sm text-muted-foreground">
                  Status atual: {permission === 'granted' ? 'Ativas' : permission === 'denied' ? 'Bloqueadas' : 'Não solicitadas'}
                </p>
              </div>
              {permission !== 'granted' && (
                <Button onClick={handleRequestPushPermission}>
                  {permission === 'denied' ? 'Solicitar Permissão' : 'Ativar'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preferências por tipo de notificação */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificação</CardTitle>
          <CardDescription>
            Escolha quais tipos de notificação você deseja receber e por quais canais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            <div className="space-y-6">
              {NOTIFICATION_TYPES.map((notificationType) => (
                <div key={notificationType.key} className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-lg">{notificationType.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-medium">{notificationType.label}</h3>
                      <p className="text-sm text-muted-foreground">
                        {notificationType.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-7">
                    {CHANNELS.map((channel) => {
                      const isEnabled = localPreferences[notificationType.key]?.[channel.key] ?? false;

                      return (
                        <div
                          key={channel.key}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            {getChannelIcon(channel.key)}
                            <div>
                              <Label className="text-sm font-medium">
                                {channel.label}
                              </Label>
                              <p className="text-xs text-muted-foreground">
                                {channel.description}
                              </p>
                            </div>
                          </div>

                          <Switch
                            checked={isEnabled}
                            onCheckedChange={(checked) =>
                              handlePreferenceChange(notificationType.key, channel.key, checked)
                            }
                          />
                        </div>
                      );
                    })}
                  </div>

                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="flex justify-end gap-2 mt-6">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
        )}
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Salvando...' : 'Salvar Preferências'}
        </Button>
      </div>
    </div>
  );
};