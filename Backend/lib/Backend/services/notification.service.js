"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BackendNotificationService = void 0;
const admin = __importStar(require("firebase-admin"));
class BackendNotificationService {
    constructor() {
        try {
            if (!admin.apps.length) {
                throw new Error('Firebase Admin no está inicializado. Asegúrate de inicializarlo antes de usar este servicio.');
            }
            this.db = admin.firestore();
            this.messaging = admin.messaging();
            console.log('Servicio de notificaciones inicializado correctamente');
        }
        catch (error) {
            console.error('Error al inicializar el servicio de notificaciones:', error);
            throw error;
        }
    }
    // Guardar o actualizar token FCM de un usuario
    async saveUserFCMToken(userId, token) {
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
        }
        catch (error) {
            console.error(`Error al guardar token FCM para usuario ${userId}:`, error);
            throw new Error(`Error al guardar token FCM: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
    // Eliminar token FCM de un usuario
    async removeUserFCMToken(userId, token) {
        try {
            console.log(`Eliminando token FCM para usuario ${userId}`);
            const userRef = this.db.collection('users').doc(userId);
            await userRef.update({
                fcmTokens: admin.firestore.FieldValue.arrayRemove(token)
            });
            console.log(`Token FCM eliminado exitosamente para usuario ${userId}`);
        }
        catch (error) {
            console.error(`Error al eliminar token FCM para usuario ${userId}:`, error);
            throw new Error(`Error al eliminar token FCM: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
    // Enviar notificación a usuarios específicos
    async sendNotificationToUsers(userIds, notification) {
        try {
            console.log(`Enviando notificación a usuarios:`, userIds);
            // Obtener tokens FCM de los usuarios
            const usersSnapshot = await this.db
                .collection('users')
                .where(admin.firestore.FieldPath.documentId(), 'in', userIds)
                .get();
            const tokens = [];
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
            const notificationData = Object.assign(Object.assign({}, notification), { read: false, createdAt: admin.firestore.FieldValue.serverTimestamp(), recipientIds: userIds });
            const notificationRef = await this.db.collection('notifications').add(notificationData);
            console.log(`Notificación creada en Firestore con ID: ${notificationRef.id}`);
            // Enviar notificación push
            const message = {
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
                var _a, _b;
                if (!resp.success && (((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) === 'messaging/invalid-registration-token' || ((_b = resp.error) === null || _b === void 0 ? void 0 : _b.code) === 'messaging/registration-token-not-registered')) {
                    acc.push(tokens[idx]);
                }
                return acc;
            }, []);
            if (invalidTokens.length > 0) {
                console.log(`Eliminando ${invalidTokens.length} tokens inválidos`);
                await Promise.all(userIds.map(userId => this.removeInvalidTokens(userId, invalidTokens)));
            }
        }
        catch (error) {
            console.error('Error al enviar notificación a usuarios:', error);
            throw new Error(`Error al enviar notificación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
        }
    }
    // Método privado para eliminar tokens inválidos
    async removeInvalidTokens(userId, invalidTokens) {
        try {
            const userRef = this.db.collection('users').doc(userId);
            await userRef.update({
                fcmTokens: admin.firestore.FieldValue.arrayRemove(...invalidTokens)
            });
            console.log(`Tokens inválidos eliminados para usuario ${userId}`);
        }
        catch (error) {
            console.error(`Error al eliminar tokens inválidos para usuario ${userId}:`, error);
        }
    }
    // Enviar notificación por tipo de usuario
    async sendNotificationByUserType(userType, notification) {
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
    async sendNotificationToAll(notification) {
        const notificationData = Object.assign(Object.assign({}, notification), { read: false, createdAt: admin.firestore.FieldValue.serverTimestamp(), recipientType: 'all' });
        // Guardar en Firestore
        await this.db.collection('notifications').add(notificationData);
        // Obtener todos los tokens FCM
        const usersSnapshot = await this.db.collection('users').get();
        const tokens = [];
        usersSnapshot.forEach(doc => {
            const userData = doc.data();
            if (userData.fcmTokens) {
                tokens.push(...userData.fcmTokens);
            }
        });
        if (tokens.length === 0)
            return;
        // Enviar en lotes de 500 tokens (límite de FCM)
        const tokenChunks = this.chunkArray(tokens, 500);
        for (const tokenChunk of tokenChunks) {
            const message = {
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
    async sendOrderNotification(orderId, customerId, petshopId, orderDetails) {
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
    async sendMaintenanceNotification(message, startTime, endTime) {
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
    chunkArray(array, size) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }
}
exports.BackendNotificationService = BackendNotificationService;
//# sourceMappingURL=notification.service.js.map