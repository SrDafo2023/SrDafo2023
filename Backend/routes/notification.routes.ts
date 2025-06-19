import express from 'express';
import { BackendNotificationService } from '../services/notification.service';
import { auth } from '../config/firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

// Extender la interfaz Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

const router = express.Router();
const notificationService = new BackendNotificationService();

// Middleware para verificar el token de Firebase
const verifyFirebaseToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware para verificar rol de administrador
const verifyAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const userRecord = await auth.getUser(req.user.uid);
    const isAdmin = userRecord.customClaims?.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error verifying admin role' });
  }
};

// Registrar token FCM
router.post('/register-token', verifyFirebaseToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { token } = req.body;
    await notificationService.saveUserFCMToken(req.user.uid, token);
    res.status(200).json({ message: 'Token registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error registering token' });
  }
});

// Eliminar token FCM
router.post('/unregister-token', verifyFirebaseToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const { token } = req.body;
    await notificationService.removeUserFCMToken(req.user.uid, token);
    res.status(200).json({ message: 'Token unregistered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error unregistering token' });
  }
});

// Enviar notificación (solo admin)
router.post('/send', verifyFirebaseToken, verifyAdmin, async (req, res) => {
  try {
    const { userIds, userType, notification } = req.body;

    if (userIds) {
      await notificationService.sendNotificationToUsers(userIds, notification);
    } else if (userType) {
      await notificationService.sendNotificationByUserType(userType, notification);
    } else {
      await notificationService.sendNotificationToAll(notification);
    }

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending notification' });
  }
});

// Enviar notificación de mantenimiento (solo admin)
router.post('/maintenance', verifyFirebaseToken, verifyAdmin, async (req, res) => {
  try {
    const { message, startTime, endTime } = req.body;
    await notificationService.sendMaintenanceNotification(
      message,
      new Date(startTime),
      new Date(endTime)
    );
    res.status(200).json({ message: 'Maintenance notification sent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error sending maintenance notification' });
  }
});

export default router; 