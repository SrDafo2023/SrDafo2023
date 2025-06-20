"use client";

import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { type Pet } from '@/lib/pet-storage';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdoptionForm } from './AdoptionForm';

// La URL base de tu API de Cloud Functions
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/pethelp/us-central1/api';

interface AdoptionFormModalProps {
    pet: Pet;
    children: React.ReactNode; // To use as the trigger
}

export function AdoptionFormModal({ pet, children }: AdoptionFormModalProps) {
    const { user } = useUser();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (answers: Record<string, string>) => {
        if (!user) {
            toast({ title: "Error de autenticación", description: "Debes iniciar sesión para poder adoptar.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_URL}/adoption-requests`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    userName: user.displayName || 'Usuario sin nombre',
                    userEmail: user.email || 'Sin correo',
                    petId: pet.id,
                    answers,
                }),
            });

            const responseData = await response.json();
            console.log('Respuesta del Backend:', responseData);

            if (!response.ok) {
                throw new Error(responseData.message || 'La respuesta del servidor no fue exitosa.');
            }

            toast({ title: "¡Solicitud Enviada!", description: `Tu solicitud para adoptar a ${pet.name} ha sido enviada con éxito. Revisa tus notificaciones.` });
            setIsOpen(false);
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
            toast({ title: "Error", description: `No se pudo enviar tu solicitud. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Formulario de Adopción para {pet.name}</DialogTitle>
                    <DialogDescription>
                        Responde a las siguientes preguntas con honestidad. Tu solicitud será revisada por el centro de adopción.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <AdoptionForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </DialogContent>
        </Dialog>
    );
} 