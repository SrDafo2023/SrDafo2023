import * as admin from 'firebase-admin';
import { Notification } from '@shared/types/notification.types';

export class BackendNotificationService {
  private readonly db: admin.firestore.Firestore;
  private readonly messaging: admin.messaging.Messaging;

  constructor() {
    try {
      if (!admin.apps.length) {
        throw new Error('Firebase Admin no está inicializado. Asegúrate de inicializarlo antes de usar este servicio.');
      }
      this.db = admin.firestore();
      this.messaging = admin.messaging();
      console.log('Servicio de notificaciones inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar el servicio de notificaciones:', error);
      throw error;
    }
  }

  // Guardar o actualizar token FCM de un usuario
  async saveUserFCMToken(userId: string, token: string): Promise<void> {
    try {
      if (!userId || !token) {
        throw new Error('userId y token son requeridos');
      }

      console.log(`Guardando token FCM para usuario ${userId}`);
      const userRef = this.db.collection('users').doc(userId);
      
      // Verificar si el usuario existe
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        throw new Error(`Usuario ${userId} no encontrado`);
      }

      await userRef.update({
        fcmTokens: admin.firestore.FieldValue.arrayUnion(token)
      });
      console.log(`Token FCM guardado exitosamente para usuario ${userId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`Error al guardar token FCM para usuario ${userId}:`, error);
      throw new Error(`Error al guardar token FCM: ${errorMessage}`);
    }
  }

  // Eliminar token FCM de un usuario
  async removeUserFCMToken(userId: string, token: string): Promise<void> {
    try {
      console.log(`Eliminando token FCM para usuario ${userId}`);
      const userRef = this.db.collection('users').doc(userId);
      await userRef.update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(token)
      });
      console.log(`Token FCM eliminado exitosamente para usuario ${userId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`Error al eliminar token FCM para usuario ${userId}:`, error);
      throw new Error(`Error al eliminar token FCM: ${errorMessage}`);
    }
  }

  // Enviar notificación a usuarios específicos
  async sendNotificationToUsers(
    userIds: string[],
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ): Promise<void> {
    try {
      console.log(`Enviando notificación a usuarios:`, userIds);
      
      // Obtener tokens FCM de los usuarios
      const usersSnapshot = await this.db
        .collection('users')
        .where(admin.firestore.FieldPath.documentId(), 'in', userIds)
        .get();

      const tokens: string[] = [];
      usersSnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.fcmTokens) {
          tokens.push(...userData.fcmTokens);
        }
      });

      console.log(`Tokens FCM encontrados: ${tokens.length}`);
      if (tokens.length === 0) {
        console.warn('No se encontraron tokens FCM para los usuarios especificados');
        return;
      }

      // Crear la notificación en Firestore
      const notificationData = {
        ...notification,
        read: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        recipientIds: userIds
      };

      const notificationRef = await this.db.collection('notifications').add(notificationData);
      console.log(`Notificación creada en Firestore con ID: ${notificationRef.id}`);

      // Enviar notificación push
      const message: admin.messaging.MulticastMessage = {
        tokens,
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          type: notification.type,
          recipientType: notification.recipientType,
          link: notification.link || '',
          metadata: notification.metadata ? JSON.stringify(notification.metadata) : ''
        }
      };

      const response = await this.messaging.sendMulticast(message);
      console.log(`Notificación push enviada. Éxito: ${response.successCount}/${response.responses.length}`);

      // Manejar tokens inválidos
      const invalidTokens = response.responses.reduce((acc, resp, idx) => {
        if (!resp.success && (resp.error?.code === 'messaging/invalid-registration-token' || resp.error?.code === 'messaging/registration-token-not-registered')) {
          acc.push(tokens[idx]);
        }
        return acc;
      }, [] as string[]);

      if (invalidTokens.length > 0) {
        console.log(`Eliminando ${invalidTokens.length} tokens inválidos`);
        await Promise.all(userIds.map(userId => 
          this.removeInvalidTokens(userId, invalidTokens)
        ));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error('Error al enviar notificación a usuarios:', error);
      throw new Error(`Error al enviar notificación: ${errorMessage}`);
    }
  }

  // Método privado para eliminar tokens inválidos
  private async removeInvalidTokens(userId: string, invalidTokens: string[]): Promise<void> {
    try {
      const userRef = this.db.collection('users').doc(userId);
      await userRef.update({
        fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens)
      });
      console.log(`Tokens inválidos eliminados para usuario ${userId}`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      console.error(`Error al eliminar tokens inválidos para usuario ${userId}:`, error);
    }
  }

  // Enviar notificación por tipo de usuario
  async sendNotificationByUserType(
    userType: 'admin' | 'petshop' | 'user',
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ): Promise<void> {
    const usersSnapshot = await this.db
      .collection('users')
      .where('userType', '==', userType)
      .get();

    const userIds = usersSnapshot.docs.map(doc => doc.id);
    if (userIds.length > 0) {
      await this.sendNotificationToUsers(userIds, notification);
    }
  }

  // Enviar notificación a todos los usuarios
  async sendNotificationToAll(
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ): Promise<void> {
    const notificationData = {
      ...notification,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      recipientType: 'all'
    };

    // Guardar en Firestore
    await this.db.collection('notifications').add(notificationData);

    // Obtener todos los tokens FCM
    const usersSnapshot = await this.db.collection('users').get();
    const tokens: string[] = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      if (userData.fcmTokens) {
        tokens.push(...userData.fcmTokens);
      }
    });

    if (tokens.length === 0) return;

    // Enviar en lotes de 500 tokens (límite de FCM)
    const tokenChunks = this.chunkArray(tokens, 500);
    for (const tokenChunk of tokenChunks) {
      const message: admin.messaging.MulticastMessage = {
        tokens: tokenChunk,
        notification: {
          title: notification.title,
          body: notification.message
        },
        data: {
          type: notification.type,
          recipientType: 'all',
          link: notification.link || '',
          metadata: notification.metadata ? JSON.stringify(notification.metadata) : ''
        }
      };

      await this.messaging.sendMulticast(message);
    }
  }

  // Enviar notificación automática para nuevos pedidos
  async sendOrderNotification(
    orderId: string,
    customerId: string,
    petshopId: string,
    orderDetails: any
  ): Promise<void> {
    // Notificación para el cliente
    await this.sendNotificationToUsers([customerId], {
      title: 'Pedido Confirmado',
      message: `Tu pedido #${orderId} ha sido confirmado y está siendo procesado.`,
      type: 'success',
      recipientType: 'user',
      link: `/dashboard/user/orders/${orderId}`
    });

    // Notificación para la tienda
    await this.sendNotificationToUsers([petshopId], {
      title: 'Nuevo Pedido Recibido',
      message: `Has recibido un nuevo pedido #${orderId}`,
      type: 'info',
      recipientType: 'petshop',
      link: `/dashboard/petshop/orders/${orderId}`,
      metadata: { orderDetails }
    });
  }

  // Enviar notificación de mantenimiento
  async sendMaintenanceNotification(
    message: string,
    startTime: Date,
    endTime: Date
  ): Promise<void> {
    await this.sendNotificationToAll({
      title: 'Mantenimiento Programado',
      message,
      type: 'warning',
      recipientType: 'all',
      metadata: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString()
      }
    });
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // Método para verificar la validez de un token FCM
  private async isValidFCMToken(token: string): Promise<boolean> {
    try {
      await this.messaging.send({
        token,
        data: { test: 'true' },
      }, true); // dryRun = true
      return true;
    } catch (error) {
      return false;
    }
  }

  // Método para manejar errores de envío de notificaciones
  private handleSendError(error: any, userIds: string[]): void {
    console.error('Error al enviar notificación:', {
      error: error.message,
      code: error.code,
      userIds
    });

    // Registrar el error para análisis posterior
    this.db.collection('notification_errors').add({
      error: error.message,
      code: error.code,
      userIds,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    }).catch(err => {
      console.error('Error al registrar el error de notificación:', err);
    });
  }
} 