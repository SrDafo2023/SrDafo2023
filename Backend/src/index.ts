import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

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

// Secure endpoint to update a user's role
app.post("/users/:userId/role", isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { role } = req.body;

        if (!role) {
            res.status(400).send("El campo 'role' es requerido.");
            return;
        }

        await db.collection('users').doc(userId).update({ userType: role });
        res.status(200).send({ message: `Rol del usuario ${userId} actualizado a ${role}.` });
    } catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        res.status(500).send("Error interno del servidor.");
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


// Exportar la API como una sola función
export const api = functions.https.onRequest(app); 