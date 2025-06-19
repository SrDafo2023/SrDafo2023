import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { app, db } from '../../Base_de_datos/firebase';
import type { Notification as NotificationType } from '@shared/types/notification.types';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!VAPID_KEY) {
  console.error('VAPID key no configurada. Por favor, configura NEXT_PUBLIC_FIREBASE_VAPID_KEY en .env.local');
}

if (!API_URL) {
  console.error('API URL no configurada. Por favor, configura NEXT_PUBLIC_API_URL en .env.local');
}

class NotificationService {
  private messaging = getMessaging(app);

  // Solicitar permiso y registrar para notificaciones push
  async requestPermissionAndRegister(userToken: string): Promise<string | null> {
    try {
      console.log('Solicitando permiso para notificaciones...');
      const permission = await window.Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('Permiso concedido, obteniendo token FCM...');
        const token = await getToken(this.messaging, { vapidKey: VAPID_KEY });
        
        if (token) {
          console.log('Token FCM obtenido:', token);
          await this.registerTokenWithBackend(token, userToken);
          return token;
        } else {
          console.warn('No se pudo obtener el token FCM');
          return null;
        }
      } else {
        console.warn('Permiso de notificaciones denegado');
        return null;
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al solicitar permiso y registrar token:', error);
      throw new Error(`Error al configurar notificaciones: ${errorMessage}`);
    }
  }

  // Registrar el token con el backend
  private async registerTokenWithBackend(fcmToken: string, userToken: string): Promise<void> {
    try {
      if (!API_URL) {
        throw new Error('API_URL no configurada');
      }

      const response = await fetch(`${API_URL}/api/notifications/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ token: fcmToken })
      });

      if (!response.ok) {
        throw new Error(`Error al registrar token: ${response.statusText}`);
      }

      console.log('Token registrado exitosamente en el backend');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al registrar token con el backend:', error);
      throw new Error(`Error al registrar token: ${errorMessage}`);
    }
  }

  // Suscribirse a notificaciones del usuario
  subscribeToUserNotifications(
    userId: string,
    userType: string,
    callback: (notifications: NotificationType[]) => void
  ): () => void {
    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('recipientIds', 'array-contains', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NotificationType[];
      callback(notifications);
    });
  }

  // Escuchar notificaciones en primer plano
  listenToNotifications(callback: (notification: NotificationType) => void): () => void {
    return onMessage(this.messaging, (payload) => {
      console.log('Mensaje recibido:', payload);
      
      const notification: NotificationType = {
        title: payload.notification?.title || '',
        message: payload.notification?.body || '',
        type: (payload.data?.type as NotificationType['type']) || 'info',
        recipientType: (payload.data?.recipientType as NotificationType['recipientType']) || 'user',
        link: payload.data?.link,
        metadata: payload.data?.metadata ? JSON.parse(payload.data.metadata) : undefined
      };

      callback(notification);
    });
  }

  // Marcar notificación como leída
  async markAsRead(notificationId: string, userToken: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date()
      });

      // También notificar al backend
      if (API_URL) {
        await fetch(`${API_URL}/api/notifications/${notificationId}/mark-read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al marcar notificación como leída:', error);
      throw new Error(`Error al marcar notificación como leída: ${errorMessage}`);
    }
  }
}

// Exportar una instancia singleton del servicio
export const notificationService = new NotificationService();
export type { NotificationType as Notification }; 