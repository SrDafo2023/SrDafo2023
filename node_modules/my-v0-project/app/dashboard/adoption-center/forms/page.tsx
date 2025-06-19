"use client"

import { useEffect, useState } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdoptionForm, AdoptionFormStorage } from "@/lib/adoption-form-storage"
import { PetStorage, Pet } from "@/lib/pet-storage"
import { useUser } from "@/hooks/useUser"
import { Loader2Icon, DownloadIcon } from "lucide-react"
import { format } from 'date-fns'
import { Button } from "@/components/ui/button"

// Helper to flatten form data for display/CSV
const flattenFormData = (formData: Record<string, string>) => {
  return Object.entries(formData).map(([key, value]) => `${key}: ${value}`).join(', ');
};

// Helper to generate CSV content (basic implementation)
const generateCsv = (forms: AdoptionForm[], pets: Pet[]) => {
  if (forms.length === 0) return '';

  // Create a map for quick pet lookup
  const petMap = pets.reduce((map, pet) => {
    map[pet.id] = pet;
    return map;
  }, {} as Record<string, Pet>);

  // Extract all unique answer keys from all forms
  const allAnswerKeys = forms.reduce((keys, form) => {
    Object.keys(form.answers).forEach(key => {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    });
    return keys;
  }, [] as string[]);

  // CSV Header
  const header = ['ID Formulario', 'Mascota', 'Nombre Solicitante', 'Email Solicitante', 'Teléfono Solicitante', 'RUT Solicitante', 'Fecha Envío', ...allAnswerKeys.map(key => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim())].join(',');

  // CSV Rows
  const rows = forms.map(form => {
    const pet = petMap[form.petId] || { name: 'Desconocido' };
    const rowData = [
      form.id,
      pet.name,
      form.applicantName,
      form.applicantEmail,
      form.applicantPhone,
      form.applicantRUT,
      format(form.submittedAt, 'yyyy-MM-dd HH:mm'),
      ...allAnswerKeys.map(key => {
        // Escape commas and quotes in answer values
        const answer = form.answers[key] || '';
        return `"${answer.replace(/"/g, '""')}"`;
      })
    ];
    return rowData.join(',');
  }).join('\n');

  return `${header}\n${rows}`;
};

export default function AdoptionCenterFormsPage() {
  const { user, isLoading: isUserLoading } = useUser();
  const [forms, setForms] = useState<AdoptionForm[]>([])
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoadingForms, setIsLoadingForms] = useState(true)

  const loadFormsAndPets = () => {
    if (user?.userType === 'adoption-center') {
      // Get pets belonging to this adoption center
      const userPets = PetStorage.getPetsByAdoptionCenterId(user.id);
      setPets(userPets);

      // Get all forms and filter those for the user's pets
      const allForms = AdoptionFormStorage.getForms();
      const userPetIds = userPets.map(pet => pet.id);
      const userForms = allForms.filter(form => userPetIds.includes(form.petId));
      setForms(userForms);
    }
    setIsLoadingForms(false);
  };

  useEffect(() => {
    if (user) {
      loadFormsAndPets();
    }
  }, [user]); // Reload forms when user data is available

   const handleDownloadCSV = () => {
    const csvContent = generateCsv(forms, pets);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'adoption_forms.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2Icon className="h-10 w-10 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user || user.userType !== 'adoption-center') {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold">Acceso Denegado</h2>
            <p className="text-muted-foreground">Debes iniciar sesión como Centro de Adopción para ver esta página.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader role="adoption-center" title="Solicitudes de Adopción" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Formularios Recibidos</h2>
                <p className="text-muted-foreground">Revisa las solicitudes de adopción para tus mascotas.</p>
            </div>
             {forms.length > 0 && (
               <Button className="bg-green-600 hover:bg-green-700" onClick={handleDownloadCSV}>
                 <DownloadIcon className="mr-2 h-4 w-4" />
                 Descargar CSV
               </Button>
             )}
        </div>

        {isLoadingForms ? (
          <div className="flex justify-center items-center h-40">
            <Loader2Icon className="h-8 w-8 animate-spin text-purple-600" />
          </div>
        ) : forms.length === 0 ? (
          <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
            Aún no has recibido solicitudes de adopción.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => {
              const pet = pets.find(p => p.id === form.petId) || { name: 'Mascota Desconocida' };
              return (
                <Card key={form.id}>
                  <CardHeader>
                    <CardTitle>Solicitud para {pet.name}</CardTitle>
                    <CardDescription>Recibida el {format(form.submittedAt, 'dd/MM/yyyy HH:mm')}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p><span className="font-semibold text-gray-800">Solicitante:</span> {form.applicantName}</p>
                    <p><span className="font-semibold text-gray-800">Correo:</span> {form.applicantEmail}</p>
                    <p><span className="font-semibold text-gray-800">Teléfono:</span> {form.applicantPhone}</p>
                    <p><span className="font-semibold text-gray-800">RUT:</span> {form.applicantRUT}</p>
                    <div className="mt-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Respuestas del Formulario:</h4>
                      {Object.entries(form.answers).map(([question, answer]) => (
                        <p key={question} className="mb-1"><span className="font-medium">{question}:</span> {answer}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

      </main>
    </div>
  )
} 