import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import notificationRoutes from "../routes/notification.routes";
import { createSubscription } from "../services/subscription.service";

// Inicializar Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const db = admin.firestore();
const APPOINTMENTS_COLLECTION = "appointments";
const ADOPTION_FORMS_COLLECTION = "adoptionForms";
const PETS_COLLECTION = "pets";
const NOTIFICATIONS_COLLECTION = "notifications";

// Middleware to check if the user is an admin
const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).send('Unauthorized: No token provided.');
        return;
    }

    const idToken = authorization.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        
        if (userDoc.exists && userDoc.data()?.userType === 'admin') {
            // Attach user to the request object if needed later
            // (req as any).user = decodedToken; 
            next();
        } else {
            res.status(403).send('Forbidden: User is not an admin.');
        }
    } catch (error) {
        console.error('Error verifying token or admin role:', error);
        res.status(403).send('Forbidden: Invalid token or role.');
    }
};

// Middleware to check if the user is authenticated (without checking for admin role)
const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).send({ error: 'Unauthorized: No token provided.' });
        return;
    }

    const idToken = authorization.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // Attach user to the request object, so we can get the UID in the handler
        (req as any).user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(403).send({ error: 'Forbidden: Invalid token.' });
    }
};

// Helper para convertir Timestamps
const convertTimestampToDate = (data: any) => {
  if (!data) return data;
  const convertedData = { ...data };
  for (const key in convertedData) {
    if (convertedData[key] instanceof admin.firestore.Timestamp) {
      convertedData[key] = convertedData[key].toDate();
    }
  }
  return convertedData;
};

// --- Rutas de la API ---

// Define routes
app.use("/notifications", notificationRoutes);

// Secure endpoint to update a user's role
// This now uses PATCH for semantic correctness and updates Auth claims.
app.patch("/users/:userId/role", isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!role) {
            res.status(400).send({ error: "Role field is required."});
            return;
        }

        // Set the custom claim for the user in Firebase Auth
        await admin.auth().setCustomUserClaims(userId, { role });

        // Also update the user's document in Firestore to keep it in sync
        await db.collection('users').doc(userId).update({ userType: role });
        
        res.status(200).send({ message: `User role for ${userId} updated to ${role}.` });
    } catch (error) {
        console.error("Error updating user role:", error);
        res.status(500).send({ error: "Internal server error." });
    }
});

// Create a new subscription
app.post("/subscriptions", isAuthenticated, async (req: Request, res: Response): Promise<void> => {
    try {
        const { uid } = (req as any).user; // Get UID from authenticated user
        const { planId } = req.body as { planId: 'monthly' | 'yearly' };

        if (!planId || (planId !== 'monthly' && planId !== 'yearly')) {
            res.status(400).send({ error: "Field 'planId' is required and must be 'monthly' or 'yearly'."});
            return;
        }

        await createSubscription(uid, planId);
        
        res.status(200).send({ message: `Subscription created successfully for user ${uid}.` });
    } catch (error) {
        console.error("Error creating subscription:", error);
        res.status(500).send({ error: "Internal server error during subscription." });
    }
});

// Crear una solicitud de adopción
app.post("/adoption-requests", async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, userName, userEmail, petId, answers } = req.body;

        if (!userId || !userName || !userEmail || !petId || !answers) {
            res.status(400).send("Faltan campos requeridos para la solicitud.");
            return;
        }

        // 1. Obtener los datos de la mascota para conseguir el ID del centro de adopción
        const petDoc = await db.collection(PETS_COLLECTION).doc(petId).get();
        if (!petDoc.exists) {
            res.status(404).send("La mascota solicitada no existe.");
            return;
        }
        const petData = petDoc.data()!;
        const { adoptionCenterId, name: petName } = petData;

        if (!adoptionCenterId) {
            res.status(500).send("Error crítico: La mascota no tiene un centro de adopción asociado.");
            return;
        }

        // 2. Guardar el formulario de adopción
        const now = admin.firestore.Timestamp.now();
        const formData = {
            userId,
            userName,
            userEmail,
            petId,
            petName,
            adoptionCenterId,
            answers,
            status: "pending",
            createdAt: now,
        };
        const formRef = await db.collection(ADOPTION_FORMS_COLLECTION).add(formData);

        // 3. Crear una notificación para el usuario
        const notificationMessage = `Tu solicitud para adoptar a ${petName} ha sido recibida. El centro de adopción se pondrá en contacto contigo pronto.`;
        await db.collection(NOTIFICATIONS_COLLECTION).add({
            userId,
            message: notificationMessage,
            createdAt: now,
            read: false,
            link: `/user/pets`, // Opcional: un link relevante
        });

        res.status(201).send({ id: formRef.id, message: "Solicitud y notificación creadas con éxito." });

    } catch (error) {
        console.error("Error al crear la solicitud de adopción:", error);
        res.status(500).send("Error interno del servidor al procesar la solicitud.");
    }
});

// Update adoption request status and notify user
app.patch("/adoption-requests/:formId", async (req: Request, res: Response): Promise<void> => {
    try {
        const { formId } = req.params;
        const { status } = req.body;

        if (!status || (status !== 'approved' && status !== 'rejected')) {
            res.status(400).send("El estado proporcionado es inválido. Debe ser 'approved' o 'rejected'.");
            return;
        }

        const formRef = db.collection(ADOPTION_FORMS_COLLECTION).doc(formId);
        const formDoc = await formRef.get();

        if (!formDoc.exists) {
            res.status(404).send("La solicitud de adopción no fue encontrada.");
            return;
        }

        // 1. Update the form status
        await formRef.update({ status });

        // 2. Create a notification for the applicant
        const formData = formDoc.data()!;
        const { userId, petName } = formData;
        const notificationMessage = `Tu solicitud de adopción para ${petName} ha sido ${status === 'approved' ? 'aprobada' : 'rechazada'}.`;

        await db.collection(NOTIFICATIONS_COLLECTION).add({
            userId,
            message: notificationMessage,
            createdAt: admin.firestore.Timestamp.now(),
            read: false,
            link: `/user/pets`, // Link to their pets/applications page
        });
        
        res.status(200).send({ message: `Solicitud ${status} y notificación enviada.` });

    } catch (error) {
        console.error("Error al actualizar el estado de la solicitud:", error);
        res.status(500).send("Error interno del servidor.");
    }
});

// Crear una nueva cita
app.post("/appointments", async (req: Request, res: Response): Promise<void> => {
  try {
    const { clientId, petId, serviceId, date, notes } = req.body;
    
    // Validar datos de entrada
    if (!clientId || !petId || !serviceId || !date) {
      res.status(400).send("Faltan campos requeridos.");
      return;
    }

    const now = admin.firestore.Timestamp.now();
    const appointmentDate = admin.firestore.Timestamp.fromDate(new Date(date));
    
    const appointmentData = {
      clientId,
      petId,
      serviceId,
      date: appointmentDate,
      notes: notes || "",
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    
    const docRef = await db.collection(APPOINTMENTS_COLLECTION).add(appointmentData);
    res.status(201).send({ id: docRef.id, ...appointmentData });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener todas las citas
app.get("/appointments", async (req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection(APPOINTMENTS_COLLECTION).orderBy("date", "asc").get();
    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data()),
    }));
    res.status(200).send(appointments);
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// Obtener citas por rango de fechas
app.get('/appointments/range', async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Se requieren fechas de inicio y fin' });
      return;
    }
    const snapshot = await db.collection(APPOINTMENTS_COLLECTION)
      .where("date", ">=", admin.firestore.Timestamp.fromDate(new Date(startDate as string)))
      .where("date", "<=", admin.firestore.Timestamp.fromDate(new Date(endDate as string)))
      .orderBy("date", "asc")
      .get();

    const appointments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...convertTimestampToDate(doc.data()),
    }));
    res.status(200).send(appointments);
  } catch (error) {
    console.error("Error al obtener las citas por rango:", error);
    res.status(500).send("Error interno del servidor");
  }
});


// Actualizar una cita
app.put("/appointments/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updates: any = {
      ...updateData,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    if (updateData.date) {
      updates.date = admin.firestore.Timestamp.fromDate(new Date(updateData.date));
    }
    
    await db.collection(APPOINTMENTS_COLLECTION).doc(id).update(updates);
    res.status(200).send({ message: "Cita actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// --- ENDPOINTS DE REPORTES PARA ADMIN ---

// Productos más comprados con filtro de fechas
app.get("/admin/top-products", isAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    let queryRef: any = db.collection("orders");
    if (startDate && endDate) {
      queryRef = queryRef
        .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(new Date(startDate as string)))
        .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(new Date(endDate as string)));
    }
    const ordersSnapshot = await queryRef.get();
    const productCount: Record<string, { productId: string, productName: string, quantity: number }> = {};

    ordersSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const order = doc.data();
      if (Array.isArray(order.items)) {
        order.items.forEach((item: any) => {
          if (!productCount[item.productId]) {
            productCount[item.productId] = {
              productId: item.productId,
              productName: item.productName,
              quantity: 0
            };
          }
          productCount[item.productId].quantity += item.quantity;
        });
      }
    });

    const result = Object.values(productCount).sort((a, b) => b.quantity - a.quantity);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener productos más comprados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Servicios más solicitados con filtro de fechas
app.get("/admin/top-services", isAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    let queryRef: any = db.collection("appointments");
    if (startDate && endDate) {
      queryRef = queryRef
        .where("createdAt", ">=", admin.firestore.Timestamp.fromDate(new Date(startDate as string)))
        .where("createdAt", "<=", admin.firestore.Timestamp.fromDate(new Date(endDate as string)));
    }
    const appointmentsSnapshot = await queryRef.get();
    const serviceCount: Record<string, { serviceId: string, serviceName: string, count: number }> = {};

    appointmentsSnapshot.forEach((doc: FirebaseFirestore.QueryDocumentSnapshot) => {
      const appt = doc.data();
      if (appt.serviceId && appt.serviceName) {
        if (!serviceCount[appt.serviceId]) {
          serviceCount[appt.serviceId] = {
            serviceId: appt.serviceId,
            serviceName: appt.serviceName,
            count: 0
          };
        }
        serviceCount[appt.serviceId].count += 1;
      }
    });

    const result = Object.values(serviceCount).sort((a, b) => b.count - a.count);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener servicios más solicitados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Exportar la API como una sola función
export const api = functions.https.onRequest(app); 