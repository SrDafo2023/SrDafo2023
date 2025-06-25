"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HandshakeIcon } from 'lucide-react';

export default function AdoptionProcessesPage() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Procesos de Adopción</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Seguimiento de Adopciones</CardTitle>
                    <CardDescription>
                        Aquí podrás ver y gestionar el estado de todas las adopciones en curso.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <HandshakeIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">
                            Funcionalidad en Desarrollo
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Próximamente podrás gestionar las visitas, contratos y entregas finales desde aquí.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 