import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';

const serviceAccountPath = path.resolve(__dirname, '..', 'pethelp-credencial.json');

// Verificar si el archivo existe
if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Firebase credentials file not found at ${serviceAccountPath}`);
}

// Leer y parsear el archivo de credenciales
let serviceAccount;
try {
  const rawdata = fs.readFileSync(serviceAccountPath, 'utf8');
  serviceAccount = JSON.parse(rawdata);
} catch (error: any) {
  throw new Error(`Error reading Firebase credentials: ${error.message}`);
}

// Inicializar Firebase Admin si aún no está inicializado
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`,
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error: any) {
    console.error('Error initializing Firebase Admin:', error);
    throw error;
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
export const messaging = admin.messaging();
export default admin; 