export interface Appointment {
  id: string
  clientId: string
  clientName: string
  petId: string
  petName: string
  serviceId: string
  serviceName: string
  date: Date
  duration: number // en minutos
  status: AppointmentStatus
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type AppointmentStatus = 
  | "pending" 
  | "confirmed" 
  | "completed" 
  | "cancelled" 
  | "no-show"

export interface CreateAppointmentDTO {
  clientId: string
  petId: string
  serviceId: string
  date: Date
  notes?: string
}

export interface UpdateAppointmentDTO {
  id: string
  status?: AppointmentStatus
  date?: Date
  notes?: string
} 