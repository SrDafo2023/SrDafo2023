"use client"

import { useState } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pet, savePet } from "@/lib/pet-storage"
import { useUser } from "@/hooks/useUser"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react' // Import loader icon
import { useToast } from '@/components/ui/use-toast'
import Image from 'next/image'
import { AdoptionFormModal } from "@/components/AdoptionFormModal"

export default function AddPetPage() {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Error', description: 'Debes iniciar sesión para añadir una mascota.', variant: 'destructive' });
      return;
    }
    if (!name || !species || !age || !description) {
      toast({ title: 'Campos incompletos', description: 'Por favor, rellena todos los campos obligatorios.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      await savePet({
        name,
        species,
        breed,
        age: parseInt(age),
        description,
        imageUrl,
        adoptionCenterId: user.id,
        status: 'available',
      }, imageFile);

      toast({ title: '¡Éxito!', description: `${name} ha sido añadido a la lista de adopción.` });
      router.push('/dashboard/adoption-center/pets');
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'No se pudo guardar la mascota.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <DashboardHeader title="Añadir Nueva Mascota" />
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Mascota</CardTitle>
          <CardDescription>Completa la información de la nueva mascota que entrará en adopción.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="species">Especie</Label>
                <Select onValueChange={setSpecies} value={species}>
                  <SelectTrigger id="species">
                    <SelectValue placeholder="Selecciona especie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perro">Perro</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="conejo">Conejo</SelectItem>
                    <SelectItem value="hamster">Hámster</SelectItem>
                    <SelectItem value="ave">Ave</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Raza</Label>
                <Input id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Edad (Años)</Label>
                <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Subir Imagen (Recomendado)</Label>
              <Input id="image-upload" type="file" onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)} />
              <p className="text-xs text-muted-foreground pt-1">O pega una URL de una imagen existente a continuación.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image-url">URL Imagen (Opcional)</Label>
              <Input id="image-url" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://example.com/pet-image.jpg" />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                Añadir Mascota
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {isModalOpen && selectedPet && (
        <AdoptionFormModal pet={selectedPet}>
          <div />
        </AdoptionFormModal>
      )}
    </div>
  )
} 