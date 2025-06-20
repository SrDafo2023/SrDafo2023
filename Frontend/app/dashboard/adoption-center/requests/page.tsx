"use client"

import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { getAdoptionFormsByAdoptionCenter, type AdoptionForm } from '@/lib/adoption-form-storage';
import { DashboardHeader } from '@/components/dashboard-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2Icon, EyeIcon, CheckCircle2, XCircle, Mail, User, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/pethelp/us-central1/api';

export default function AdoptionRequestsPage() {
    const { user, loading: isUserLoading } = useUser();
    const [forms, setForms] = useState<AdoptionForm[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedForm, setSelectedForm] = useState<AdoptionForm | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            getAdoptionFormsByAdoptionCenter(user.id)
                .then(setForms)
                .catch(err => {
                    console.error(err);
                    toast({ title: "Error", description: "No se pudieron cargar las solicitudes.", variant: "destructive" });
                })
                .finally(() => setIsLoading(false));
        } else if (!isUserLoading) {
            setIsLoading(false);
        }
    }, [user, isUserLoading, toast]);
    
    const handleStatusUpdate = async (formId: string, status: 'approved' | 'rejected') => {
        try {
            const response = await fetch(`${API_URL}/adoption-requests/${formId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'No se pudo actualizar el estado.');
            }
            
            setForms(forms.map(form => form.id === formId ? { ...form, status } : form));
            toast({ title: "Estado Actualizado", description: `La solicitud ha sido ${status === 'approved' ? 'aprobada' : 'rechazada'} y el usuario notificado.`});
        } catch (error) {
            console.error("Error al actualizar el estado:", error);
            toast({ title: "Error", description: `No se pudo actualizar la solicitud. ${error instanceof Error ? error.message : ''}`, variant: "destructive" });
        }
    };

    const getStatusBadge = (status: AdoptionForm['status']) => {
        switch (status) {
            case 'approved': return <Badge className="bg-green-600 hover:bg-green-700">Aprobada</Badge>;
            case 'rejected': return <Badge variant="destructive">Rechazada</Badge>;
            default: return <Badge variant="secondary">Pendiente</Badge>;
        }
    };

    if (isUserLoading || isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2Icon className="h-8 w-8 animate-spin" /></div>;
    }
    
    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <DashboardHeader title="Solicitudes de Adopción" />
            <Card>
                <CardHeader>
                    <CardTitle>Bandeja de Entrada</CardTitle>
                    <CardDescription>Revisa y gestiona las solicitudes de adopción para tus mascotas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Mascota</TableHead>
                                <TableHead>Solicitante</TableHead>
                                <TableHead>Fecha</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {forms.length === 0 ? (
                                <TableRow><TableCell colSpan={5} className="text-center h-24">No hay solicitudes por el momento.</TableCell></TableRow>
                            ) : (
                                forms.map(form => (
                                    <TableRow key={form.id}>
                                        <TableCell>{form.petName}</TableCell>
                                        <TableCell>{form.userName}</TableCell>
                                        <TableCell>{form.createdAt?.toDate().toLocaleDateString() || 'N/A'}</TableCell>
                                        <TableCell>{getStatusBadge(form.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedForm(null)}>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="icon" onClick={() => setSelectedForm(form)}><EyeIcon className="h-4 w-4" /></Button>
                                                </DialogTrigger>
                                                {selectedForm && selectedForm.id === form.id && (
                                                   <DialogContent className="max-w-3xl">
                                                       <DialogHeader>
                                                           <DialogTitle>Solicitud para {selectedForm.petName}</DialogTitle>
                                                           <DialogDescription>Revisa la información y toma una decisión.</DialogDescription>
                                                       </DialogHeader>
                                                       <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                                            <div className="space-y-4">
                                                                <h4 className="font-semibold text-lg border-b pb-2">Información del Solicitante</h4>
                                                                <div className="space-y-3 text-sm">
                                                                    <p className="flex items-center"><User className="h-4 w-4 mr-2 text-muted-foreground" /> <span className="font-medium">Nombre:</span><span className="ml-2">{selectedForm.userName}</span></p>
                                                                    <p className="flex items-center"><Mail className="h-4 w-4 mr-2 text-muted-foreground" /><span className="font-medium">Email:</span><a href={`mailto:${selectedForm.userEmail}`} className="ml-2 text-blue-500 hover:underline">{selectedForm.userEmail}</a></p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <h4 className="font-semibold text-lg border-b pb-2">Cuestionario</h4>
                                                                <dl className="space-y-3 text-sm max-h-60 overflow-y-auto pr-2">
                                                                    {Object.entries(selectedForm.answers).map(([question, answer]) => (
                                                                        <div key={question}>
                                                                            <dt className="font-medium">{question.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</dt>
                                                                            <dd className="text-muted-foreground mt-1 pl-2 border-l-2">{answer}</dd>
                                                                        </div>
                                                                    ))}
                                                                </dl>
                                                            </div>
                                                       </div>
                                                        {selectedForm.status === 'pending' && (
                                                            <div className="flex justify-end gap-2 pt-4 border-t mt-4">
                                                                <Button variant="destructive" onClick={() => handleStatusUpdate(selectedForm.id!, 'rejected')}><XCircle className="mr-2 h-4 w-4"/> Rechazar</Button>
                                                                <Button className="bg-green-600 text-white hover:bg-green-700" onClick={() => handleStatusUpdate(selectedForm.id!, 'approved')}><CheckCircle2 className="mr-2 h-4 w-4"/> Aprobar y Notificar</Button>
                                                            </div>
                                                        )}
                                                   </DialogContent>
                                                )}
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
} 