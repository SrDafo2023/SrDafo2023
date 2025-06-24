"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notification_service_1 = require("../services/notification.service");
const firebase_admin_1 = require("../config/firebase-admin");
const router = express_1.default.Router();
const notificationService = new notification_service_1.BackendNotificationService();
// Middleware para verificar el token de Firebase
const verifyFirebaseToken = async (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('Bearer ')[1];
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        const decodedToken = await firebase_admin_1.auth.verifyIdToken(token);
        req.user = decodedToken;
        next();
    }
    catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
};
// Middleware para verificar rol de administrador
const verifyAdmin = async (req, res, next) => {
    var _a;
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const userRecord = await firebase_admin_1.auth.getUser(req.user.uid);
        const isAdmin = ((_a = userRecord.customClaims) === null || _a === void 0 ? void 0 : _a.role) === 'admin';
        if (!isAdmin) {
            res.status(403).json({ error: 'No autorizado' });
            return;
        }
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Error verifying admin role' });
    }
};
// Registrar token FCM
router.post('/register-token', verifyFirebaseToken, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const { token } = req.body;
        await notificationService.saveUserFCMToken(req.user.uid, token);
        res.status(200).json({ message: 'Token registered successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error registering token' });
    }
});
// Eliminar token FCM
router.post('/unregister-token', verifyFirebaseToken, async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'User not authenticated' });
            return;
        }
        const { token } = req.body;
        await notificationService.removeUserFCMToken(req.user.uid, token);
        res.status(200).json({ message: 'Token unregistered successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error unregistering token' });
    }
});
// Enviar notificación (solo admin)
router.post('/send', verifyFirebaseToken, verifyAdmin, async (req, res) => {
    try {
        const { userIds, userType, notification } = req.body;
        if (userIds) {
            await notificationService.sendNotificationToUsers(userIds, notification);
        }
        else if (userType) {
            await notificationService.sendNotificationByUserType(userType, notification);
        }
        else {
            await notificationService.sendNotificationToAll(notification);
        }
        res.status(200).json({ message: 'Notification sent successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error sending notification' });
    }
});
// Enviar notificación de mantenimiento (solo admin)
router.post('/maintenance', verifyFirebaseToken, verifyAdmin, async (req, res) => {
    try {
        const { message, startTime, endTime } = req.body;
        await notificationService.sendMaintenanceNotification(message, new Date(startTime), new Date(endTime));
        res.status(200).json({ message: 'Maintenance notification sent successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error sending maintenance notification' });
    }
});
exports.default = router;
//# sourceMappingURL=notification.routes.js.map