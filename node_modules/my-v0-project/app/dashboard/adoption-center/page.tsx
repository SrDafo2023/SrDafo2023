"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/config/firebase/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PawPrintIcon, FileTextIcon, HandshakeIcon } from 'lucide-react';
import { Pet } from '@/lib/pet-storage';

interface Stats {
    availablePets: number;
    adoptionRequests: number;
    activeProcesses: number;
}

export default function AdoptionCenterDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentPets, setRecentPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                // Contar mascotas disponibles
                const petsQuery = query(collection(db, 'pets'), where('status', '==', 'disponible'));
                const petsSnapshot = await getDocs(petsQuery);
                const availablePets = petsSnapshot.size;

                // Fetch recent pets
                const recentPetsQuery = query(collection(db, 'pets'), orderBy('createdAt', 'desc'), limit(4));
                const recentPetsSnapshot = await getDocs(recentPetsQuery);
                const petsData = recentPetsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Pet[];
                setRecentPets(petsData);

                // TODO: Implementar lógica para contar solicitudes y procesos cuando las colecciones existan
                const adoptionRequests = 0;
                const activeProcesses = 0;

                setStats({ availablePets, adoptionRequests, activeProcesses });
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
                setError("No se pudieron cargar los datos del panel.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Panel del Centro de Adopción</h1>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
                    <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
                </div>
                <div className="mt-8">
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <Card key={i}>
                                <Skeleton className="h-48 w-full" />
                                <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
                                <CardContent><Skeleton className="h-5 w-1/4" /></CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return <div className="p-6 text-center text-red-500">{error}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Panel del Centro de Adopción</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/dashboard/adoption-center/pets">
                    <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Mascotas en Adopción</CardTitle>
                            <PawPrintIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.availablePets}</div>
                            <p className="text-xs text-muted-foreground">Total de mascotas disponibles</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="#">
                     <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors opacity-50 cursor-not-allowed">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Solicitudes de Adopción</CardTitle>
                            <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.adoptionRequests}</div>
                             <p className="text-xs text-muted-foreground">Nuevas solicitudes sin revisar</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="#">
                    <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors opacity-50 cursor-not-allowed">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Procesos de Adopción</CardTitle>
                             <HandshakeIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.activeProcesses}</div>
                            <p className="text-xs text-muted-foreground">Adopciones actualmente en proceso</p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
            
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Mascotas Registradas Recientemente</h2>
                {recentPets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {recentPets.map((pet) => (
                            <Card key={pet.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
                                    <Image
                                        src={pet.imageUrl || '/placeholder.jpg'}
                                        alt={`Foto de ${pet.name}`}
                                        layout="fill"
                                        className="object-contain"
                                    />
                                </div>
                                <CardHeader>
                                    <CardTitle>{pet.name}</CardTitle>
                                    <CardDescription>{pet.breed || pet.species}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {pet.status ? (
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            pet.status === 'disponible' ? 'bg-green-200 text-green-800' :
                                            pet.status === 'en proceso' ? 'bg-yellow-200 text-yellow-800' :
                                            'bg-gray-200 text-gray-800'
                                        }`}>
                                            {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                                        </span>
                                    ) : null}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No hay mascotas registradas recientemente.</p>
                    </div>
                )}
            </div>
        </div>
    );
} 