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
app.use(express_1.default.json());
const db = admin.firestore();
const APPOINTMENTS_COLLECTION = "appointments";
const ADOPTION_FORMS_COLLECTION = "adoptionForms";
const PETS_COLLECTION = "pets";
const NOTIFICATIONS_COLLECTION = "notifications";
// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    var _a;
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
        res.status(401).send('Unauthorized: No token provided.');
        return;
    }
    const idToken = authorization.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const userDoc = await db.collection('users').doc(decodedToken.uid).get();
        if (userDoc.exists && ((_a = userDoc.data()) === null || _a === void 0 ? void 0 : _a.userType) === 'admin') {
            // Attach user to the request object if needed later
            // (req as any).user = decodedToken; 
            next();
        }
        else {
            res.status(403).send('Forbidden: User is not an admin.');
        }
    }
    catch (error) {
        console.error('Error verifying token or admin role:', error);
        res.status(403).send('Forbidden: Invalid token or role.');
    }
};
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
// Secure endpoint to update a user's role
app.post("/users/:userId/role", isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { role } = req.body;
        if (!role) {
            res.status(400).send("El campo 'role' es requerido.");
            return;
        }
        await db.collection('users').doc(userId).update({ userType: role });
        res.status(200).send({ message: `Rol del usuario ${userId} actualizado a ${role}.` });
    }
    catch (error) {
        console.error("Error al actualizar el rol del usuario:", error);
        res.status(500).send("Error interno del servidor.");
    }
});
// Crear una solicitud de adopción
app.post("/adoption-requests", async (req, res) => {
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
        const petData = petDoc.data();
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
    }
    catch (error) {
        console.error("Error al crear la solicitud de adopción:", error);
        res.status(500).send("Error interno del servidor al procesar la solicitud.");
    }
});
// Update adoption request status and notify user
app.patch("/adoption-requests/:formId", async (req, res) => {
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
        const formData = formDoc.data();
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
    }
    catch (error) {
        console.error("Error al actualizar el estado de la solicitud:", error);
        res.status(500).send("Error interno del servidor.");
    }
});
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