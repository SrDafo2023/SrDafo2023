"use client"

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getPetById, type Pet } from '@/lib/pet-storage';
import { AdoptionFormModal } from '@/components/AdoptionFormModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Loader2Icon, HeartHandshakeIcon } from 'lucide-react';

export default function PetDetailsPage() {
    const params = useParams();
    const petId = params.petId as string;
    const [pet, setPet] = useState<Pet | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (petId) {
            getPetById(petId).then(petData => {
                setPet(petData);
                setIsLoading(false);
            }).catch(error => {
                console.error("Failed to fetch pet:", error);
                setIsLoading(false);
            });
        }
    }, [petId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2Icon className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Card>
                    <CardHeader>
                        <CardTitle>Mascota no encontrada</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>No pudimos encontrar la mascota que buscas.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <Image
                            src={pet.imageUrl || '/placeholder.jpg'}
                            alt={`Foto de ${pet.name}`}
                            width={600}
                            height={600}
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <div className="md:w-1/2 p-8 flex flex-col">
                        <CardHeader className="p-0">
                            <CardTitle className="text-4xl font-bold">{pet.name}</CardTitle>
                            <CardDescription className="text-lg text-muted-foreground">{pet.breed} | {pet.age} años</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 flex-grow mt-6">
                            <p className="mb-4">{pet.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="font-semibold">Especie:</span> {pet.species}</div>
                                <div><span className="font-semibold">Sexo:</span> {pet.gender}</div>
                                <div><span className="font-semibold">Tamaño:</span> {pet.size}</div>
                                <div><span className="font-semibold">Estado:</span> <span className="capitalize">{pet.status || 'Disponible'}</span></div>
                            </div>
                        </CardContent>
                        <div className="mt-auto pt-6">
                            <AdoptionFormModal pet={pet}>
                                <Button size="lg" className="w-full">
                                    <HeartHandshakeIcon className="mr-2 h-5 w-5" />
                                    Solicitar Adopción
                                </Button>
                            </AdoptionFormModal>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
} 