"use client"

import { useEffect, useState } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { findPetById, Pet } from "@/lib/pet-storage"
import { saveForm } from "@/lib/adoption-form-storage"
import { useUser } from "@/hooks/useUser"
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react'

export function AdoptionForm({ petId, adoptionCenterId, onClose }: { petId: string, adoptionCenterId: string, onClose: () => void }) {
  const { user, loading: isUserLoading } = useUser();

  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoadingPet, setIsLoadingPet] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Record<string, string>>({
    livingSituation: '',
    previousPets: '',
    timeAlone: '',
    // Add more questions here
  });

  const userRUT = user?.rut || ''; // Get RUT from user object

  useEffect(() => {
    if (petId) {
      const fetchPet = async () => {
        const foundPet = await findPetById(petId);
        setPet(foundPet);
        setIsLoadingPet(false);
        if (!foundPet) {
          toast.error("Mascota no encontrada.");
        }
      };
      fetchPet();
    } else {
      setIsLoadingPet(false);
    }
  }, [petId]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast.error("Debes iniciar sesión para enviar un formulario de adopción.");
      setIsSubmitting(false);
      return;
    }

    if (!pet) {
        toast.error("No se pudo encontrar la mascota para el formulario.");
        setIsSubmitting(false);
        return;
    }

    if (!formData.livingSituation || !userRUT || !adoptionCenterId) {
        toast.error("Por favor, llena todos los campos obligatorios y asegúrate de que la información de la mascota esté completa.");
        setIsSubmitting(false);
        return;
    }

    try {
      saveForm({
        petId: pet.id,
        userId: user.id,
        applicantName: `${user.firstName} ${user.lastName}`,
        applicantEmail: user.email,
        applicantPhone: user.phone,
        applicantRUT: userRUT,
        answers: formData,
        adoptionCenterId: adoptionCenterId,
      });

      toast.success("Formulario de adopción enviado con éxito!");
      setIsSubmitting(false);
      onClose();

    } catch (error) {
      console.error("Error saving adoption form:", error);
      toast.error("Hubo un error al enviar el formulario.");
      setIsSubmitting(false);
    }
  };

  if (isUserLoading || isLoadingPet) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2Icon className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user) {
     return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-xl font-bold">Acceso Requerido</h2>
            <p className="text-muted-foreground">Debes iniciar sesión como usuario para llenar un formulario de adopción.</p>
        </div>
     );
  }

  if (!pet) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-xl font-bold">Mascota no encontrada</h2>
            <p className="text-muted-foreground">La mascota para la que intentas aplicar no existe.</p>
        </div>
      );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Información y Preguntas</CardTitle>
        <CardDescription>Los campos de tu perfil se llenarán automáticamente.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Nombre:</Label>
            <div className="col-span-3 font-medium">{`${user.firstName} ${user.lastName}`}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Correo:</Label>
            <div className="col-span-3 font-medium">{user.email}</div>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Teléfono:</Label>
            <div className="col-span-3 font-medium">{user.phone}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="applicantRUT" className="text-right">RUT:</Label>
            <div className="col-span-3 font-medium">{userRUT}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="livingSituation" className="text-right">Describe tu situación de vivienda (casa/departamento, patio, etc.):</Label>
            <Textarea id="livingSituation" value={formData.livingSituation} onChange={e => handleInputChange('livingSituation', e.target.value)} className="col-span-3" required />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="previousPets" className="text-right">¿Has tenido mascotas antes? ¿Cuáles y qué pasó con ellas?</Label>
            <Textarea id="previousPets" value={formData.previousPets} onChange={e => handleInputChange('previousPets', e.target.value)} className="col-span-3" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="timeAlone" className="text-right">¿Cuánto tiempo pasaría la mascota sola en casa?</Label>
            <Input id="timeAlone" type="text" value={formData.timeAlone} onChange={e => handleInputChange('timeAlone', e.target.value)} className="col-span-3" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
              {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting ? "Enviando..." : "Enviar Solicitud de Adopción"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
} 