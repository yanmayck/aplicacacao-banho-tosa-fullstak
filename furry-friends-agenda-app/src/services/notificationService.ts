interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, unknown>;
  actions?: Array<{
    action: string;
    title: string;
    icon?: string;
  }>;
  requireInteraction?: boolean;
  silent?: boolean;
}

class NotificationService {
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.initializeServiceWorker();
  }

  private async initializeServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        this.serviceWorkerRegistration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado com sucesso');
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Este navegador não suporta notificações');
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission === 'denied') {
      throw new Error('Permissões de notificação foram negadas');
    }

    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribeToPush(vapidPublicKey: string): Promise<PushSubscription> {
    if (!this.serviceWorkerRegistration) {
      throw new Error('Service Worker não está registrado');
    }

    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permissão de notificação não concedida');
    }

    const subscription = await this.serviceWorkerRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8ArrayFixed(vapidPublicKey),
    });

    return subscription;
  }

  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.serviceWorkerRegistration) {
      return false;
    }

    const subscription = await this.serviceWorkerRegistration.pushManager.getSubscription();
    if (subscription) {
      return subscription.unsubscribe();
    }

    return false;
  }

  async showLocalNotification(payload: NotificationPayload): Promise<void> {
    const permission = await this.requestPermission();
    if (permission !== 'granted') {
      throw new Error('Permissão de notificação não concedida');
    }

    if (this.serviceWorkerRegistration) {
      // Usar service worker para mostrar notificação
      await this.serviceWorkerRegistration.showNotification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        badge: payload.badge || '/badge-72x72.png',
        ...(payload.tag !== undefined && { tag: payload.tag }),
        ...(payload.data !== undefined && { data: payload.data }),
        ...(payload.requireInteraction !== undefined && { requireInteraction: payload.requireInteraction }),
        ...(payload.silent !== undefined && { silent: payload.silent }),
      });
    } else {
      // Fallback para notificação nativa
      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || '/icon-192x192.png',
        ...(payload.tag !== undefined && { tag: payload.tag }),
        ...(payload.data !== undefined && { data: payload.data }),
        ...(payload.silent !== undefined && { silent: payload.silent }),
      });
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  private urlBase64ToUint8ArrayFixed(base64String: string): ArrayBuffer {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const buffer = new ArrayBuffer(rawData.length);
    const bytes = new Uint8Array(buffer);

    for (let i = 0; i < rawData.length; ++i) {
      bytes[i] = rawData.charCodeAt(i);
    }

    return buffer;
  }

  // Método para verificar se notificações estão suportadas
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Método para obter o estado atual das permissões
  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }
}

export const notificationService = new NotificationService();
export default notificationService;