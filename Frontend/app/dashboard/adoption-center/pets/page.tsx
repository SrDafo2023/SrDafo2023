"use client"

import { useEffect, useState } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPetsByAdoptionCenterId, deletePet, Pet } from "@/lib/pet-storage"
import { useUser } from "@/hooks/useUser"
import { Loader2Icon, PawPrintIcon, TrashIcon, PencilIcon } from "lucide-react"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import Link from "next/link"

export default function AdoptionCenterPetsPage() {
  const { user } = useUser(); // Assuming useUser hook provides the logged-in user
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [petToDelete, setPetToDelete] = useState<string | null>(null);

  const loadPets = async () => {
    if (user?.userType === 'adoption-center') {
      try {
        const userPets = await getPetsByAdoptionCenterId(user.id);
        setPets(userPets);
      } catch (error) {
        console.error("Error loading pets:", error);
        toast.error("Error al cargar las mascotas.");
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (user) {
      loadPets();
    }
  }, [user]); // Reload pets when user data is available

  const handleDeletePet = async () => {
    if (petToDelete) {
      try {
        const success = await deletePet(petToDelete);
        if (success) {
          toast.success("Mascota eliminada con éxito!");
          setPetToDelete(null); // Close the dialog
          loadPets(); // Reload the list
        } else {
           toast.error("Error al eliminar la mascota.");
        }
      } catch (error) {
         console.error("Error deleting pet:", error);
         toast.error("Error al eliminar la mascota.");
      }
    }
  };

  if (!user || user.userType !== 'adoption-center') {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold">Acceso Denegado</h2>
            <p className="text-muted-foreground">Debes iniciar sesión como Centro de Adopción para ver esta página.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Mascotas en Adopción</h2>
                <p className="text-muted-foreground">Gestiona las mascotas que has puesto en adopción.</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/dashboard/adoption-center/add-pet">Añadir Nueva Mascota</Link>
            </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2Icon className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
            Aún no has añadido ninguna mascota para adopción.
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
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{pet.name}</CardTitle>
                  <CardDescription>{pet.species} - {pet.breed || 'Raza Desconocida'}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <p>{pet.description}</p>
                  <p>Edad: {pet.age} {pet.age === 1 ? 'año' : 'años'}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild><Link href={`/dashboard/adoption-center/pets/edit/${pet.id}`}><PencilIcon className="h-4 w-4 mr-1" /> Editar</Link></Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setPetToDelete(pet.id)}><TrashIcon className="h-4 w-4 mr-1" /> Eliminar</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la mascota.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleDeletePet}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

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