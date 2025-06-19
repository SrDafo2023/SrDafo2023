"use client"

import { useState } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pet, savePet } from "@/lib/pet-storage"
import { useUser } from "@/hooks/useUser"
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2Icon } from 'lucide-react' // Import loader icon

export default function AddPetPage() {
  const { user, loading } = useUser(); // Get loading state from the hook
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    description: '',
    imageUrl: '',
    // Add a state for the file input if you plan to handle file uploads
    // petImageFile: null as File | null,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle file input change
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setFormData(prev => ({ ...prev, petImageFile: e.target.files![0] }));
  //   } else {
  //     setFormData(prev => ({ ...prev, petImageFile: null }));
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // The check for user and userType should be sufficient now that loading is handled
    if (!user || user.userType !== 'adoption-center') {
      toast.error("Debes ser un centro de adopción para añadir mascotas.");
      return;
    }

    if (!formData.name || !formData.species || !formData.age || !formData.description) {
        toast.error("Por favor, llena todos los campos obligatorios.");
        return;
    }

    try {
      const ageNumber = parseInt(formData.age);
      if (isNaN(ageNumber) || ageNumber < 0) {
          toast.error("La edad debe ser un número válido.");
          return;
      }

      // TODO: Implement image upload to Firebase Storage here if handling file uploads
      // Get the download URL after uploading and use it in savePet
      let imageUrlToSave = formData.imageUrl; // Use the URL from the input for now

      // Example for file upload (requires Firebase Storage implementation)
      // if (formData.petImageFile) {
      //   const storageRef = firebase.storage().ref(`pet_images/${formData.petImageFile.name}`);
      //   const snapshot = await storageRef.put(formData.petImageFile);
      //   imageUrlToSave = await snapshot.ref.getDownloadURL();
      // }

      await savePet({
        name: formData.name,
        species: formData.species,
        breed: formData.breed || undefined,
        age: ageNumber,
        description: formData.description,
        imageUrl: imageUrlToSave === '' ? null : imageUrlToSave,
        adoptionCenterId: user.id,
      });

      toast.success("Mascota añadida con éxito!");
      setFormData({ // Clear form
        name: '',
        species: '',
        breed: '',
        age: '',
        description: '',
        imageUrl: '',
        // petImageFile: null,
      });
      // Optionally redirect to the pets list page
      router.push('/dashboard/adoption-center/pets');

    } catch (error) {
      console.error("Error saving pet:", error); // Log the full error object
      console.error("Error name:", (error as any).name);
      console.error("Error code:", (error as any).code);
      console.error("Error message:", (error as any).message);
      toast.error("Hubo un error al añadir la mascota.");
    }
  };

  // Show loading state or access denied message while loading or if user is not an adoption center
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader2Icon className="h-8 w-8 animate-spin text-purple-600" />
        <p className="text-muted-foreground mt-2">Cargando...</p>
      </div>
    );
  }

  // Redirect or show access denied if user is not an adoption center after loading
  if (!user || user.userType !== 'adoption-center') {
     // Optionally redirect to a different page, e.g., a homepage or an access denied page
     // router.push('/'); 
     return (
         <div className="flex flex-col items-center justify-center h-screen">
             <h2 className="text-2xl font-bold">Acceso Denegado</h2>
             <p className="text-muted-foreground">Debes iniciar sesión como Centro de Adopción para añadir mascotas.</p>
         </div>
     );
  }

  return (
    <div className="flex flex-col">
      {/* Removed DashboardHeader as it's in the layout.tsx */}
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Añadir Nueva Mascota</h2>
          <p className="text-muted-foreground">Ingresa los detalles de la mascota disponible para adopción.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Mascota</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="species" className="text-right">Especie</Label>
                <Select onValueChange={value => handleInputChange('species', value)} value={formData.species} required>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona especie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dog">Perro</SelectItem>
                    <SelectItem value="cat">Gato</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="breed" className="text-right">Raza (Opcional)</Label>
                <Input id="breed" value={formData.breed} onChange={e => handleInputChange('breed', e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="age" className="text-right">Edad (Años)</Label>
                <Input id="age" type="number" value={formData.age} onChange={e => handleInputChange('age', e.target.value)} className="col-span-3" required min="0" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Descripción</Label>
                <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="col-span-3" required />
              </div>

              {/* Input for Image URL */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="imageUrl" className="text-right">URL Imagen (Opcional)</Label>
                <Input id="imageUrl" type="url" value={formData.imageUrl} onChange={e => handleInputChange('imageUrl', e.target.value)} className="col-span-3" placeholder="https://example.com/pet-image.jpg" />
              </div>

              {/* TODO: Add file input for image upload to Firebase Storage */}
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="petImage" className="text-right">Subir Imagen (Opcional)</Label>
                <Input id="petImage" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" />
              </div> */}

              <div className="flex justify-end">
                <Button type="submit" className="bg-purple-600 hover:bg-purple-700">Añadir Mascota</Button>
              </div>
            </form>
          </CardContent>
        </Card>

      </main>
    </div>
  )
} 