import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import express, { Request, Response } from "express";
import cors from "cors";

// Inicializar Firebase Admin
admin.initializeApp();

const app = express();
app.use(cors({ origin: true }));

const db = admin.firestore();
const APPOINTMENTS_COLLECTION = "appointments";

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