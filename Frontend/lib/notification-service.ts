import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, Firestore } from 'firebase/firestore';
import { app, db } from '@/config/firebase/firebase';
import type { Notification } from '@/types/notification.types';
import type { FirebaseApp } from 'firebase/app';

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
const API_URL = process.env.NEXT_PUBLIC_API_URL;

class NotificationService {
  private messaging: Messaging | undefined;
  private db: Firestore;
  private app: FirebaseApp;
  private initialized = false;

  constructor() {
    this.app = app;
    this.db = db;
    try {
      this.messaging = getMessaging(this.app);
      this.initialized = true;
    } catch (error) {
      console.error('Error al inicializar Firebase Messaging:', error);
      this.initialized = false;
    }
  }

  // Solicitar permiso y registrar para notificaciones push
  async requestPermissionAndRegister(userToken: string): Promise<string | null> {
    if (!this.initialized || !this.messaging) {
      console.warn('Firebase Messaging no está inicializado');
      return null;
    }

    try {
      if (!VAPID_KEY) {
        throw new Error('VAPID key no configurada');
      }

      if (typeof window === 'undefined' || !('Notification' in window)) {
        console.warn('Las notificaciones no están soportadas en este navegador');
        return null;
      }

      const permission = await window.Notification.requestPermission();
      
      if (permission === 'granted') {
        const token = await getToken(this.messaging, { vapidKey: VAPID_KEY });
        
        if (token) {
          await this.registerTokenWithBackend(token, userToken);
          return token;
        }
      }
      
      return null;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al solicitar permiso y registrar token:', error);
      return null;
    }
  }

  // Registrar el token con el backend
  private async registerTokenWithBackend(fcmToken: string, userToken: string): Promise<void> {
    if (!API_URL) {
      console.warn('API_URL no configurada');
      return;
    }

    try {
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
    } catch (error) {
      console.error('Error al registrar token con el backend:', error);
    }
  }

  // Suscribirse a notificaciones del usuario
  subscribeToUserNotifications(
    userId: string,
    userType: string,
    callback: (notifications: Notification[]) => void
  ): () => void {
    try {
      const notificationsQuery = query(
        collection(this.db, 'notifications'),
        where('recipientIds', 'array-contains', userId),
        orderBy('timestamp', 'desc')
      );

      return onSnapshot(notificationsQuery, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Notification[];
        callback(notifications);
      }, (error) => {
        console.error('Error en la suscripción a notificaciones:', error);
        callback([]);
      });
    } catch (error) {
      console.error('Error al crear suscripción a notificaciones:', error);
      return () => {};
    }
  }

  // Escuchar notificaciones en primer plano
  listenToNotifications(callback: (notification: Notification) => void): () => void {
    if (!this.initialized || !this.messaging) {
      console.warn('Firebase Messaging no está inicializado');
      return () => {};
    }

    return onMessage(this.messaging, (payload) => {
      try {
        const notification: Notification = {
          title: payload.notification?.title || '',
          message: payload.notification?.body || '',
          type: (payload.data?.type as Notification['type']) || 'info',
          recipientType: (payload.data?.recipientType as Notification['recipientType']) || 'user',
          link: payload.data?.link,
          metadata: payload.data?.metadata ? JSON.parse(payload.data.metadata) : undefined,
          timestamp: new Date().toISOString()
        };

        callback(notification);
      } catch (error) {
        console.error('Error al procesar notificación:', error);
      }
    });
  }

  // Marcar notificación como leída
  async markAsRead(notificationId: string, userToken: string): Promise<void> {
    try {
      const notificationRef = doc(this.db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date().toISOString()
      });

      if (API_URL) {
        await fetch(`${API_URL}/api/notifications/${notificationId}/mark-read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${userToken}`
          }
        });
      }
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  }
}

export const notificationService = new NotificationService();
export type { Notification }; 