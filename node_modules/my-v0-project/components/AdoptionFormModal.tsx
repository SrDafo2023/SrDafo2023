"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
// Import the types for Pet and AdoptionForm if they are used directly here
import { Pet } from "@/lib/pet-storage";
import { saveForm } from "@/lib/adoption-form-storage"; // Assuming saveForm is here
import { useUser } from "@/hooks/useUser";
import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';

// !!! IMPORTANT: You need to have a Modal/Dialog component from your UI library !!!
// Import your specific Modal/Dialog components here.
// Example using hypothetical components:
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

// Define the props the modal component will receive
interface AdoptionFormModalProps {
  pet: Pet; // The pet object for which the form is being submitted
  // We are getting adoptionCenterId from the pet object now,
  // but keeping it as a prop is also fine if needed elsewhere.
  // If getting from pet.adoptionCenterId, you might not need this prop.
  // For clarity, let's use the one from the pet prop.
  // adoptionCenterId: string; // The ID of the adoption center
  isOpen: boolean; // To control the visibility of the modal
  onClose: () => void; // Function to call to close the modal
}

// This will be the modal component
// Make sure it's exported as default
export default function AdoptionFormModal({ pet, isOpen, onClose }: AdoptionFormModalProps) { // Adjusted props
  const { user, isLoading: isUserLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for form data
  const [formData, setFormData] = useState<Record<string, string>>({
    livingSituation: '',
    previousPets: '',
    timeAlone: '',
    // Add more questions here based on your form structure (e.g., question1: '', question2: '')
    // Make sure these keys match what you expect to save
  });

  // Assuming user object includes RUT and other applicant info
  // We will use user info directly from the hook when submitting
  const userRUT = user?.rut || ''; // Get RUT from user object

  // Effect to potentially pre-fill form data if needed (less common for an adoption form)
  // No need to fetch pet data here as it's passed as a prop

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!user) {
      toast.error("Debes iniciar sesión para enviar un formulario de adopción.");
      setIsSubmitting(false);
      return;
    }

    // Pet data is now guaranteed by the parent component rendering the modal
    // But a check is still good practice
    if (!pet || !pet.adoptionCenterId) {
        toast.error("Error: Información de la mascota o centro de adopción no disponible.");
        setIsSubmitting(false);
        return;
    }

    // Basic validation for required fields
     if (!formData.livingSituation || !userRUT) { // Check livingSituation and RUT as examples
        toast.error("Por favor, llena todos los campos obligatorios.");
        setIsSubmitting(false);
        return;
    }


    try {
      // Call the saveForm function from your storage file
      await saveForm({
        petId: pet.id,
        userId: user.id,
        applicantName: `${user.firstName} ${user.lastName}`, // Get name from user
        applicantEmail: user.email, // Get email from user
        applicantPhone: user.phone, // Get phone from user
        applicantRUT: userRUT, // Get RUT from user (or form if editable)
        answers: formData, // Include user-provided answers
        adoptionCenterId: pet.adoptionCenterId, // Use adoptionCenterId from the pet object
      });

      toast.success("Formulario de adopción enviado con éxito!");
      setIsSubmitting(false);
      onClose(); // Close the modal on successful submission

    } catch (error) {
      console.error("Error saving adoption form:", error);
      toast.error("Hubo un error al enviar el formulario.");
      setIsSubmitting(false);
    }
  };

  // Loading state while user is being loaded
   if (isUserLoading) {
    return (
        // Wrap this in your DialogContent if using Shadcn Dialog
         <div className="flex justify-center items-center p-8">
            <Loader2Icon className="h-8 w-8 animate-spin text-purple-600" />
            <span className="ml-2">Cargando usuario...</span> {/* Added text for clarity */}
         </div>
    );
   }

  // Show message if user is not logged in
  if (!user) {
     return (
        // Wrap this in your DialogContent if using Shadcn Dialog
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <h2 className="text-xl font-bold">Acceso Requerido</h2>
            <p className="text-muted-foreground mt-2">Debes iniciar sesión como usuario para llenar un formulario de adopción.</p>
             {/* Provide a way to close the modal */}
             <Button onClick={onClose} className="mt-4">Cerrar</Button>
        </div>
     );
  }


  // The main form content wrapped in your Modal/Dialog component
  // Use your specific Modal/Dialog component here, controlling its open/close state
  // using the `isOpen` prop and `onClose` callback.

  // Example using Shadcn Dialog:
  /*
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]"> // Adjust max-width as needed
        <DialogHeader>
          <DialogTitle>Aplicar para {pet.name}</DialogTitle>
          <DialogDescription>
             Por favor, responde las siguientes preguntas para tu solicitud de adopción.
          </DialogDescription>
        </DialogHeader>
         // Your form content goes here, inside the DialogContent
        <div className="py-4"> // Added padding/margin as needed
           // Your form content below
             <Card className="border-none shadow-none"> // Remove card styling if already in DialogContent
                <CardHeader className="p-0 mb-4"> // Adjust padding/margin
                  <CardTitle className="text-xl">Tu Información y Preguntas</CardTitle> // Adjust font size
                  <CardDescription>Los campos de tu perfil se llenarán automáticamente.</CardDescription>
                </CardHeader>
                <CardContent className="p-0"> // Adjust padding
                  <form onSubmit={handleSubmit} className="grid gap-6"> // Adjust gap/padding
                     // User Info (Display Only)
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

                    // Form Questions (Adjust layout as needed within modal)
                    <div className="grid gap-4"> // Use grid or flex for question layout
                         <div> // Wrap each question group
                            <Label htmlFor="livingSituation">Describe tu situación de vivienda (casa/departamento, patio, etc.):</Label>
                            <Textarea id="livingSituation" value={formData.livingSituation} onChange={e => handleInputChange('livingSituation', e.target.value)} className="mt-1" required />
                          </div>

                          <div>
                            <Label htmlFor="previousPets">¿Has tenido mascotas antes? ¿Cuáles y qué pasó con ellas?</Label>
                            <Textarea id="previousPets" value={formData.previousPets} onChange={e => handleInputChange('previousPets', e.target.value)} className="mt-1" />
                          </div>

                          <div>
                            <Label htmlFor="timeAlone">¿Cuánto tiempo pasaría la mascota sola en casa?</Label>
                            <Input id="timeAlone" type="text" value={formData.timeAlone} onChange={e => handleInputChange('timeAlone', e.target.value)} className="mt-1" />
                          </div>
                         // Add more questions here following the same pattern
                    </div>

                    // Form Actions (Buttons)
                    <div className="flex justify-end gap-2 mt-6">
                       <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSubmitting ? "Enviando..." : "Enviar Solicitud de Adopción"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
        </div> // End of py-4 div
      </DialogContent>
    </Dialog>
  );
  */

  // Fallback render if you don't have a Dialog component set up yet
  // This will render the form directly, useful for seeing if the component code itself works
   return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
       <div className="bg-white p-6 rounded-lg max-w-sm mx-auto" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Aplicar para {pet.name}</h2>
          <p className="text-muted-foreground mb-6">Por favor, responde las siguientes preguntas para tu solicitud de adopción.</p>

            {/* Your form content here (copy from inside the Card in the Shadcn example above) */}
            <div className="py-4"> {/* Added padding/margin as needed */}
             <Card className="border-none shadow-none"> {/* Remove card styling if already in DialogContent */}
                <CardHeader className="p-0 mb-4"> {/* Adjust padding/margin */}
                  <CardTitle className="text-xl">Tu Información y Preguntas</CardTitle> {/* Adjust font size */}
                  <CardDescription>Los campos de tu perfil se llenarán automáticamente.</CardDescription>
                </CardHeader>
                <CardContent className="p-0"> {/* Adjust padding */}
                  <form onSubmit={handleSubmit} className="grid gap-6"> {/* Adjust gap/padding */}
                     {/* User Info (Display Only) */}
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

                    {/* Form Questions (Adjust layout as needed within modal) */}
                    <div className="grid gap-4"> {/* Use grid or flex for question layout */}
                         <div> {/* Wrap each question group */}
                            <Label htmlFor="livingSituation">Describe tu situación de vivienda (casa/departamento, patio, etc.):</Label>
                            <Textarea id="livingSituation" value={formData.livingSituation} onChange={e => handleInputChange('livingSituation', e.target.value)} className="mt-1" required />
                          </div>

                          <div>
                            <Label htmlFor="previousPets">¿Has tenido mascotas antes? ¿Cuáles y qué pasó con ellas?</Label>
                            <Textarea id="previousPets" value={formData.previousPets} onChange={e => handleInputChange('previousPets', e.target.value)} className="mt-1" />
                          </div>

                          <div>
                            <Label htmlFor="timeAlone">¿Cuánto tiempo pasaría la mascota sola en casa?</Label>
                            <Input id="timeAlone" type="text" value={formData.timeAlone} onChange={e => handleInputChange('timeAlone', e.target.value)} className="mt-1" />
                          </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                       <Button variant="outline" onClick={onClose} type="button">Cancelar</Button>
                      <Button type="submit" className="bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
                        {isSubmitting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {isSubmitting ? "Enviando..." : "Enviar Solicitud de Adopción"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
        </div> {/* End of py-4 div */}

       </div>
     </div>
   );
} 