"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPets, Pet } from "@/lib/pet-storage"
import { Loader2Icon, PawPrintIcon } from "lucide-react"
import Image from 'next/image'
import { toast } from "sonner"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AdoptionForm } from "@/components/AdoptionForm"

export default function UserPetsPage() {
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null)
  const [selectedAdoptionCenterId, setSelectedAdoptionCenterId] = useState<string | null>(null)

  useEffect(() => {
    const loadAllPets = async () => {
      setIsLoading(true);
      try {
        const allPets = await getPets();
        setPets(allPets);
      } catch (error) {
        console.error("Error loading all pets:", error);
        toast.error("Error al cargar las mascotas disponibles.");
      }
      setIsLoading(false);
    };

    loadAllPets();

  }, []);

  const openModal = (petId: string, adoptionCenterId: string) => {
    setSelectedPetId(petId);
    setSelectedAdoptionCenterId(adoptionCenterId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPetId(null);
    setSelectedAdoptionCenterId(null);
  };

  return (
    <div className="flex flex-col">
      <DashboardHeader role="user" title="Mascotas en Adopción" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Mascotas Disponibles</h2>
          <p className="text-muted-foreground">Explora las mascotas que buscan un hogar.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2Icon className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
            No hay mascotas disponibles para adopción en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pets.map((pet) => (
              <Card key={pet.id}>
                {pet.imageUrl && (
                  <div className="relative w-full h-40 rounded-t-lg overflow-hidden">
                    <Image
                      src={pet.imageUrl}
                      alt={pet.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{pet.name}</CardTitle>
                  <CardDescription>{pet.breed ? `${pet.species} - ${pet.breed}` : pet.species}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p><span className="font-semibold text-gray-800">Edad:</span> {pet.age} {pet.age === 1 ? 'año' : 'años'}</p>
                  <p className="mt-2"><span className="font-semibold text-gray-800">Descripción:</span> {pet.description}</p>
                  <div className="mt-4">
                    <Dialog open={isModalOpen && selectedPetId === pet.id} onOpenChange={setIsModalOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full bg-purple-600 hover:bg-purple-700"
                          onClick={() => {
                            console.log('Botón Adoptar clicado para mascota:', pet.id);
                            const currentAdoptionCenterId = pet.adoptionCenterId;
                            openModal(pet.id, currentAdoptionCenterId);
                          }}
                        >
                          Adoptar
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                        </DialogHeader>
                        {selectedPetId === pet.id && (
                          <AdoptionForm
                            petId={selectedPetId}
                            adoptionCenterId={selectedAdoptionCenterId}
                            onClose={closeModal}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      </main>
    </div>
  )
} 