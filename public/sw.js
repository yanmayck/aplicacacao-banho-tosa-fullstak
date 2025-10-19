// Service Worker para notificações push
const CACHE_NAME = 'furry-friends-v1';
const API_BASE_URL = 'http://localhost:3000'; // Ajustar conforme necessário

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/icon-192x192.png',
        '/icon-512x512.png',
        '/badge-72x72.png',
      ]);
    })
  );
});

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker ativado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptar notificações push
self.addEventListener('push', (event) => {
  console.log('Push recebido:', event);

  let notificationData = {
    title: 'Furry Friends',
    body: 'Você tem uma nova notificação',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: 'furry-friends-notification',
    data: {
      url: '/',
    },
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
      };
    } catch (error) {
      console.error('Erro ao processar dados do push:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: [
        {
          action: 'view',
          title: 'Ver',
          icon: '/icon-192x192.png',
        },
        {
          action: 'dismiss',
          title: 'Dispensar',
        },
      ],
      requireInteraction: false,
      silent: false,
    })
  );
});

// Interceptar cliques nas notificações
self.addEventListener('notificationclick', (event) => {
  console.log('Notificação clicada:', event);

  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Abrir a aplicação
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        const url = event.notification.data?.url || '/';

        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  } else if (event.action === 'dismiss') {
    // Apenas fechar a notificação
    return;
  }
});

// Interceptar quando a notificação é fechada
self.addEventListener('notificationclose', (event) => {
  console.log('Notificação fechada:', event);
});

// Sincronização em background (se suportado)
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);

  if (event.tag === 'notification-sync') {
    event.waitUntil(syncNotifications());
  }
});

// Função para sincronizar notificações em background
async function syncNotifications() {
  try {
    const response = await fetch(`${API_BASE_URL}/client/notifications?unreadOnly=true`);
    const notifications = await response.json();

    for (const notification of notifications) {
      await self.registration.showNotification(notification.title, {
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        tag: `notification-${notification.id}`,
        data: {
          id: notification.id,
          url: `/notifications/${notification.id}`,
        },
      });
    }
  } catch (error) {
    console.error('Erro ao sincronizar notificações:', error);
  }
}

// Interceptar mensagens do aplicativo principal
self.addEventListener('message', (event) => {
  console.log('Mensagem recebida do app principal:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});