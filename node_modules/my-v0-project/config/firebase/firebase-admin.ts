import { initializeApp, cert, getApps, getApp, AppOptions } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';

let app;

if (!getApps().length) {
  let serviceAccount;
  // Intenta leer desde archivo físico primero
  const filePath = path.resolve(process.cwd(), 'firebase-service-account.json');
  if (fs.existsSync(filePath)) {
    serviceAccount = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    throw new Error('No se encontró la clave de servicio de Firebase');
  }
  app = initializeApp({
    credential: cert(serviceAccount),
  } as AppOptions);
} else {
  app = getApp();
}

export { app, getAuth }; 