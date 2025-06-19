"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useUser } from "@/hooks/useUser"
import { useEffect, useState } from "react"
import { getPetsByAdoptionCenterId } from "@/lib/pet-storage"
import { Loader2Icon, PawPrintIcon } from 'lucide-react'

export default function AdoptionCenterDashboard() {
  const { user, loading: userLoading } = useUser();
  const [petCount, setPetCount] = useState<number | null>(null);
  const [petsLoading, setPetsLoading] = useState(true);

  useEffect(() => {
    const fetchPetCount = async () => {
      if (user?.userType === 'adoption-center') {
        try {
          setPetsLoading(true);
          const userPets = await getPetsByAdoptionCenterId(user.id);
          setPetCount(userPets.length);
        } catch (error) {
          console.error("Error fetching pet count:", error);
          setPetCount(0); // Assume 0 on error
        } finally {
          setPetsLoading(false);
        }
      } else {
        setPetCount(0); // No user or not an adoption center
        setPetsLoading(false);
      }
    };

    if (!userLoading) { // Only fetch pets once user data is loaded
      fetchPetCount();
    }
  }, [user, userLoading]);

  // Show loading state while user or pets are loading
  if (userLoading || petsLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-muted-foreground mt-2">Cargando panel...</p>
      </div>
    );
  }

  // Redirect or show access denied if user is not an adoption center after loading
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
      {/* <DashboardHeader role="adoption-center" title="Panel del Centro de Adopción" /> */}
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Bienvenido, Centro de Adopción</h2>
            <p className="text-muted-foreground">Gestiona tus mascotas en adopción y procesos.</p>
          </div>
          {/* Add button to add new pet */}
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <Link href="/dashboard/adoption-center/add-pet">Añadir Nueva Mascota</Link>
          </Button>
        </div>

        {/* Add specific cards/components for Adoption Center dashboard here */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Example Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mascotas en Adopción</CardTitle>
              <PawPrintIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{petCount !== null ? petCount : ''}</div> {/* Display actual count */}
              <p className="text-xs text-muted-foreground">Total de mascotas disponibles</p>
            </CardContent>
          </Card>
          {/* Add more cards as needed */}
        </div>

      </main>
    </div>
  )
} 