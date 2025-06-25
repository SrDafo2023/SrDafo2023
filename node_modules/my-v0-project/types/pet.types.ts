export interface Pet {
  id: string
  name: string
  species: PetSpecies
  breed: string
  age: number
  weight: number
  clientId: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type PetSpecies = 
  | "dog"
  | "cat"
  | "bird"
  | "fish"
  | "other"

export interface CreatePetDTO {
  name: string
  species: PetSpecies
  breed: string
  age: number
  weight: number
  clientId: string
  notes?: string
}

export interface UpdatePetDTO {
  id: string
  name?: string
  species?: PetSpecies
  breed?: string
  age?: number
  weight?: number
  notes?: string
} 