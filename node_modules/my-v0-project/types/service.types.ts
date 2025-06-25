export interface Service {
  id: string
  name: string
  description: string
  duration: number // en minutos
  price: number
  category: ServiceCategory
  createdAt: Date
  updatedAt: Date
}

export type ServiceCategory = 
  | "grooming"
  | "spa"
  | "medical"
  | "training"
  | "other"

export interface CreateServiceDTO {
  name: string
  description: string
  duration: number
  price: number
  category: ServiceCategory
}

export interface UpdateServiceDTO {
  id: string
  name?: string
  description?: string
  duration?: number
  price?: number
  category?: ServiceCategory
} 