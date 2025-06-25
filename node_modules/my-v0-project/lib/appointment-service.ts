import {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "@/types/appointment.types"
import { buildApiUrl, buildApiUrlWithParams } from "@/config/api";

export const appointmentService = {
  // Obtener todas las citas
  async getAll(): Promise<Appointment[]> {
    const response = await fetch(buildApiUrl('/appointments'));
    if (!response.ok) {
      throw new Error('Error al obtener las citas');
    }
    const data = await response.json();
    return data.map((appointment: any) => ({
      ...appointment,
      date: new Date(appointment.date),
      createdAt: new Date(appointment.createdAt),
      updatedAt: new Date(appointment.updatedAt),
    }));
  },

  // Obtener citas por rango de fechas
  async getByDateRange(startDate: Date, endDate: Date): Promise<Appointment[]> {
    // --- SIMULACIÓN DE RESPUESTA DEL BACKEND ---
    // Se devuelve una lista de citas de prueba para desarrollo sin emulador.
    console.log(`Simulando la obtención de citas entre ${startDate.toLocaleDateString()} y ${endDate.toLocaleDateString()}`);
    
    // Crear citas de ejemplo para hoy y los próximos días
    const today = new Date();
    const appointments: Appointment[] = [
      {
        id: 'appt-1',
        clientId: 'client-123',
        petId: 'pet-abc',
        serviceId: 'service-grooming',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0), // Hoy a las 10:00
        notes: 'Golden Retriever, un poco ansioso.',
        status: 'confirmed',
        createdAt: today,
        updatedAt: today,
      },
      {
        id: 'appt-2',
        clientId: 'client-456',
        petId: 'pet-def',
        serviceId: 'service-nails',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 30), // Hoy a las 14:30
        notes: 'Gato Siamés, cortar uñas.',
        status: 'pending',
        createdAt: today,
        updatedAt: today,
      },
      {
        id: 'appt-3',
        clientId: 'client-789',
        petId: 'pet-ghi',
        serviceId: 'service-full',
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 11, 0), // Mañana a las 11:00
        notes: 'Caniche, corte completo.',
        status: 'confirmed',
        createdAt: today,
        updatedAt: today,
      }
    ];

    // Simula la demora de la red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filtra las citas para devolver solo las que están dentro del rango solicitado
    return appointments.filter(appt => appt.date >= startDate && appt.date <= endDate);

    /*
    // --- CÓDIGO REAL DE CONEXIÓN AL BACKEND (TEMPORALMENTE DESACTIVADO) ---
    try {
      const response = await fetch(
        buildApiUrlWithParams('/appointments/range', {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString()
        })
      );
      if (!response.ok) {
        throw new Error('No se pudieron obtener las citas');
      }
      const data = await response.json();
      // Assuming the backend returns dates as ISO strings, we need to convert them back to Date objects
      return data.map((appt: any) => ({
        ...appt,
        date: new Date(appt.date),
        createdAt: new Date(appt.createdAt),
        updatedAt: new Date(appt.updatedAt),
      }));
    } catch (error) {
       console.error("Failed to fetch appointments:", error);
       throw error; // Re-throw the error to be handled by the calling component
    }
    */
  },

  // Obtener una cita por ID
  async getById(id: string): Promise<Appointment | null> {
    const response = await fetch(buildApiUrl(`/appointments/${id}`));
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Error al obtener la cita');
    }
    const data = await response.json();
    return {
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  },

  // Crear una nueva cita
  async create(appointmentData: CreateAppointmentDTO): Promise<Appointment> {
    const response = await fetch(buildApiUrl('/appointments'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok) {
      throw new Error('Error al crear la cita');
    }
    const data = await response.json();
    return {
      ...data,
      date: new Date(data.date),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  },

  // Actualizar una cita
  async update(appointmentData: UpdateAppointmentDTO): Promise<void> {
    const response = await fetch(buildApiUrl(`/appointments/${appointmentData.id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la cita');
    }
  },

  // Obtener citas por cliente
  async getByClientId(clientId: string): Promise<Appointment[]> {
    const response = await fetch(buildApiUrl(`/appointments/client/${clientId}`));
    if (!response.ok) {
      throw new Error('Error al obtener las citas del cliente');
    }
    const data = await response.json();
    return data.map((appointment: any) => ({
      ...appointment,
      date: new Date(appointment.date),
      createdAt: new Date(appointment.createdAt),
      updatedAt: new Date(appointment.updatedAt),
    }));
  },
}; 