"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getPets, Pet } from "@/lib/pet-storage";
import { Loader2Icon } from "lucide-react";
import Image from 'next/image';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdoptionFormModal } from "@/components/AdoptionFormModal";
import { useRouter } from "next/navigation";

export default function CentrosAdopcionPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Centros de Adopción</h1>
        </div>
      </header>
      <main className="flex-1 space-y-4 p-4 md:p-6 container mx-auto">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-800">Mascotas Disponibles</h2>
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
                  <div className="relative w-full h-40 rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    <Image
                      src={pet.imageUrl}
                      alt={pet.name}
                      layout="fill"
                      className="object-contain transition-transform duration-300 ease-in-out hover:scale-105"
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
                    <AdoptionFormModal pet={pet}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Adoptar
                      </Button>
                    </AdoptionFormModal>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      
      {/* Botón Volver al principio */}
      <button
        onClick={() => router.push('/')}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1000,
          background: '#f97316',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontWeight: 'bold',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          cursor: 'pointer',
        }}
      >
        Volver al inicio
      </button>
    </div>
  );
} 