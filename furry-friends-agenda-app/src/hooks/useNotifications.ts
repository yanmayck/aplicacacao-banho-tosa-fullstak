import { useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationService';
import { api } from '../lib/api';

export interface NotificationData {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

export interface NotificationPreferences {
  [key: string]: {
    [channel: string]: boolean;
  };
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Verificar suporte e permissões iniciais
  useEffect(() => {
    setIsSupported(notificationService.isSupported());
    setPermission(notificationService.getPermissionStatus());
  }, []);

  // Carregar notificações
  const loadNotifications = useCallback(async (unreadOnly = false) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/client/notifications${unreadOnly ? '?unreadOnly=true' : ''}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar contador de não lidas
  const loadUnreadCount = useCallback(async () => {
    try {
      const response = await api.get('/client/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Erro ao carregar contador de notificações:', error);
    }
  }, []);

  // Carregar preferências
  const loadPreferences = useCallback(async () => {
    try {
      const response = await api.get('/client/notification-preferences');
      setPreferences(response.data.preferences);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
    }
  }, []);

  // Marcar notificação como lida
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await api.patch(`/client/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error);
    }
  }, []);

  // Marcar todas como lidas
  const markAllAsRead = useCallback(async () => {
    try {
      await api.patch('/client/notifications/mark-all-read');
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error);
    }
  }, []);

  // Atualizar preferências
  const updatePreferences = useCallback(async (newPreferences: NotificationPreferences) => {
    try {
      await api.patch('/client/notification-preferences', newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      throw error;
    }
  }, []);

  // Solicitar permissão para notificações push
  const requestPushPermission = useCallback(async () => {
    try {
      const permission = await notificationService.requestPermission();
      setPermission(permission);

      if (permission === 'granted') {
        // Inscrever-se para push notifications
        const vapidPublicKey = process.env.REACT_APP_VAPID_PUBLIC_KEY || '';
        if (vapidPublicKey) {
          const subscription = await notificationService.subscribeToPush(vapidPublicKey);

          // Enviar subscription para o backend
          await api.post('/client/push-subscription', {
            subscription: subscription.toJSON(),
          });
        }
      }

      return permission;
    } catch (error) {
      console.error('Erro ao solicitar permissão para push:', error);
      throw error;
    }
  }, []);

  // Mostrar notificação local
  const showLocalNotification = useCallback(async (notification: Omit<NotificationData, 'id' | 'isRead' | 'createdAt'>) => {
    try {
      await notificationService.showLocalNotification({
        title: notification.title,
        body: notification.message,
        tag: `notification-${Date.now()}`,
        ...(notification.data && { data: notification.data }),
      });
    } catch (error) {
      console.error('Erro ao mostrar notificação local:', error);
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    loadPreferences();
  }, [loadNotifications, loadUnreadCount, loadPreferences]);

  // Configurar listener para mensagens do service worker
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'NOTIFICATION_RECEIVED') {
        // Recarregar notificações quando receber nova
        loadNotifications();
        loadUnreadCount();
      }
    };

    navigator.serviceWorker?.addEventListener('message', handleMessage);

    return () => {
      navigator.serviceWorker?.removeEventListener('message', handleMessage);
    };
  }, [loadNotifications, loadUnreadCount]);

  return {
    // Estado
    notifications,
    unreadCount,
    preferences,
    isLoading,
    isSupported,
    permission,

    // Ações
    loadNotifications,
    loadUnreadCount,
    loadPreferences,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    requestPushPermission,
    showLocalNotification,

    // Computed
    hasUnread: unreadCount > 0,
    recentNotifications: notifications.slice(0, 5),
  };
};