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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// Inicializar Firebase Admin
admin.initializeApp();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: true }));
const db = admin.firestore();
const APPOINTMENTS_COLLECTION = "appointments";
// Helper para convertir Timestamps
const convertTimestampToDate = (data) => {
    if (!data)
        return data;
    const convertedData = Object.assign({}, data);
    for (const key in convertedData) {
        if (convertedData[key] instanceof admin.firestore.Timestamp) {
            convertedData[key] = convertedData[key].toDate();
        }
    }
    return convertedData;
};
// --- Rutas de la API ---
// Crear una nueva cita
app.post("/appointments", async (req, res) => {
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
        res.status(201).send(Object.assign({ id: docRef.id }, appointmentData));
    }
    catch (error) {
        console.error("Error al crear la cita:", error);
        res.status(500).send("Error interno del servidor");
    }
});
// Obtener todas las citas
app.get("/appointments", async (req, res) => {
    try {
        const snapshot = await db.collection(APPOINTMENTS_COLLECTION).orderBy("date", "asc").get();
        const appointments = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, convertTimestampToDate(doc.data()))));
        res.status(200).send(appointments);
    }
    catch (error) {
        console.error("Error al obtener las citas:", error);
        res.status(500).send("Error interno del servidor");
    }
});
// Obtener citas por rango de fechas
app.get('/appointments/range', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            res.status(400).json({ error: 'Se requieren fechas de inicio y fin' });
            return;
        }
        const snapshot = await db.collection(APPOINTMENTS_COLLECTION)
            .where("date", ">=", admin.firestore.Timestamp.fromDate(new Date(startDate)))
            .where("date", "<=", admin.firestore.Timestamp.fromDate(new Date(endDate)))
            .orderBy("date", "asc")
            .get();
        const appointments = snapshot.docs.map(doc => (Object.assign({ id: doc.id }, convertTimestampToDate(doc.data()))));
        res.status(200).send(appointments);
    }
    catch (error) {
        console.error("Error al obtener las citas por rango:", error);
        res.status(500).send("Error interno del servidor");
    }
});
// Actualizar una cita
app.put("/appointments/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updates = Object.assign(Object.assign({}, updateData), { updatedAt: admin.firestore.Timestamp.now() });
        if (updateData.date) {
            updates.date = admin.firestore.Timestamp.fromDate(new Date(updateData.date));
        }
        await db.collection(APPOINTMENTS_COLLECTION).doc(id).update(updates);
        res.status(200).send({ message: "Cita actualizada correctamente" });
    }
    catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).send("Error interno del servidor");
    }
});
// Exportar la API como una sola función
exports.api = functions.https.onRequest(app);
//# sourceMappingURL=index.js.map