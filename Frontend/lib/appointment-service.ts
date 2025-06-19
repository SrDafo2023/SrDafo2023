import {
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "@/types/appointment.types"

// Esta URL será la de tu función desplegada. 
// Para desarrollo local con el emulador, será una URL local.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/pethelp-de31a/us-central1/api';

export const appointmentService = {
  // Obtener todas las citas
  async getAll(): Promise<Appointment[]> {
    const response = await fetch(`${API_URL}/appointments`);
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
    const response = await fetch(
      `${API_URL}/appointments/range?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    if (!response.ok) {
      throw new Error('Error al obtener las citas por rango');
    }
    const data = await response.json();
    return data.map((appointment: any) => ({
      ...appointment,
      date: new Date(appointment.date),
      createdAt: new Date(appointment.createdAt),
      updatedAt: new Date(appointment.updatedAt),
    }));
  },

  // Obtener una cita por ID
  async getById(id: string): Promise<Appointment | null> {
    const response = await fetch(`${API_URL}/appointments/${id}`);
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
    const response = await fetch(`${API_URL}/appointments`, {
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
    const response = await fetch(`${API_URL}/appointments/${appointmentData.id}`, {
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
    const response = await fetch(`${API_URL}/appointments/client/${clientId}`);
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