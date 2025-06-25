"use client"

import { useState, useEffect, type FormEvent } from 'react';
import { useUser } from '@/hooks/useUser';
import { updateUserProfile } from '@/lib/user-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2Icon } from 'lucide-react';

export default function AdoptionCenterSettingsPage() {
    const { user, loading: userLoading, refreshUser } = useUser();
    const { toast } = useToast();
    
    const [formData, setFormData] = useState({
        displayName: '',
        address: '',
        phone: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                displayName: user.displayName || '',
                address: user.address || '',
                phone: user.phone || '',
                description: user.description || '',
            });
        }
    }, [user]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Error", description: "Debes iniciar sesión para actualizar tu perfil.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);
        try {
            await updateUserProfile(user.id, formData);
            toast({ title: "¡Éxito!", description: "Tu perfil ha sido actualizado correctamente." });
            refreshUser(); // Refresh user data in the context
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({ title: "Error", description: "No se pudo actualizar tu perfil.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (userLoading) {
        return <div className="p-6 flex justify-center"><Loader2Icon className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Configuración</h1>
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Perfil del Centro de Adopción</CardTitle>
                    <CardDescription>
                        Actualiza la información pública de tu centro de adopción.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="displayName">Nombre del Centro</Label>
                            <Input id="displayName" value={formData.displayName} onChange={handleInputChange} placeholder="Ej: Refugio Patitas Felices" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input id="address" value={formData.address} onChange={handleInputChange} placeholder="Ej: Av. Siempreviva 123, Springfield" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono de Contacto</Label>
                            <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="+56 9 1234 5678" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Descripción del Centro</Label>
                            <Textarea id="description" value={formData.description} onChange={handleInputChange} placeholder="Cuéntanos sobre la misión y visión de tu centro." />
                        </div>
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
} 