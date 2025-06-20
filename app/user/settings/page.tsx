"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useTheme } from 'next-themes'; // Assuming next-themes is used for theme management
import { Loader2Icon, ArrowLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import { signOut } from 'firebase/auth'; // Import signOut

export default function UserSettingsPage() {
  const { user, loading } = useUser();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaveStatus, setNameSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const { theme, setTheme } = useTheme(); // For theme management
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    if (user && user.id) {
      // Fetch user name from Firestore when user object is available
      const fetchUserName = async () => {
        const userDocRef = doc(db, 'users', user.id);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setFirstName(userData.firstName || '');
          setLastName(userData.lastName || '');
        }
      };
      fetchUserName();
    } else if (!loading && !user) {
      // Handle case where user is not logged in - maybe redirect to login?
      // For now, just clear the state
      setFirstName('');
      setLastName('');
    }
  }, [user, loading]); // Refetch when user or loading state changes

  const handleSaveName = async () => {
    if (!user || !user.id || (!firstName && !lastName)) {
      setNameSaveStatus({ type: 'error', message: 'Nombre o apellido no pueden estar vacíos.' });
      return;
    }

    setIsSavingName(true);
    setNameSaveStatus(null);

    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, {
        firstName: firstName,
        lastName: lastName,
        // Optionally update userName field if you use it elsewhere
        // userName: `${firstName} ${lastName}`.trim()
      });
      setNameSaveStatus({ type: 'success', message: 'Nombre actualizado con éxito!' });
    } catch (error) {
      console.error('Error updating user name:', error);
      setNameSaveStatus({ type: 'error', message: 'Error al actualizar el nombre.' });
    } finally {
      setIsSavingName(false);
    }
  };

  // Function to handle signing out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Redirect to login page after successful sign out
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      // Optionally show an error message to the user
      alert('Error al cerrar sesión. Por favor, intenta nuevamente.');
    }
  };

  // Show loading state if user is still being fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="h-10 w-10 animate-spin text-purple-600" />
        <p className="text-muted-foreground mt-2">Cargando configuración...</p>
      </div>
    );
  }

  // Redirect to login if no user is found after loading
  if (!user) {
      // You might want a proper redirect using useRouter here
       return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
             <h2 className="text-xl font-bold mb-4">Acceso Denegado</h2>
             <p className="text-gray-600 mb-4">Por favor, inicia sesión para ver esta página.</p>
             <Button asChild>
                 <Link href="/login">Ir a Iniciar Sesión</Link>
             </Button>
          </div>
       );
  }


  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="text-purple-600 hover:text-purple-700">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Volver Atrás
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">Configuración de Usuario</h1>

      {/* Profile Information Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Información del Perfil</CardTitle>
          <CardDescription>Actualiza tu nombre y otra información personal.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setNameSaveStatus(null); }}
                disabled={isSavingName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setNameSaveStatus(null); }}
                disabled={isSavingName}
              />
            </div>
          </div>
          {nameSaveStatus && (
            <div className={`p-3 rounded-md text-sm ${nameSaveStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {nameSaveStatus.message}
            </div>
          )}
          <Button onClick={handleSaveName} disabled={isSavingName}>
            {isSavingName ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </CardContent>
      </Card>

      {/* Theme Settings Section */}
       {/* Note: Requires integration with a theme provider like next-themes */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Apariencia</CardTitle>
          <CardDescription>Personaliza la apariencia de la aplicación.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select value={theme} onValueChange={setTheme}>
                 <SelectTrigger id="theme" className="w-[180px]">
                   <SelectValue placeholder="Seleccionar tema" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="light">Claro</SelectItem>
                   <SelectItem value="dark">Oscuro</SelectItem>
                   <SelectItem value="system">Sistema</SelectItem>
                 </SelectContent>
              </Select>
           </div>
           <p className="text-sm text-gray-500">Esta funcionalidad requiere que una biblioteca de gestión de temas (ej: next-themes) esté configurada en el proyecto.</p>
        </CardContent>
      </Card>

      {/* Payment Methods Section */}
       {/* Note: Handling payment information requires careful security considerations and integration with a payment gateway. */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
          <CardDescription>Gestiona tus tarjetas de débito/crédito.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {/* Placeholder for listing existing cards */}
           <div className="text-gray-600">No hay métodos de pago guardados.</div>

           {/* Button to add a new card - actual form/modal would be needed */}
           <Button variant="outline">
              Agregar Nueva Tarjeta
           </Button>
           <p className="text-sm text-red-500">La integración real para agregar y gestionar tarjetas de pago implica manejar datos sensibles de forma segura y requerirá la integración con una pasarela de pagos (ej: Stripe, PayPal). Esto es solo una interfaz placeholder.</p>
        </CardContent>
      </Card>

       {/* You can add more settings sections here */}

      {/* Account Actions Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Acciones de Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={handleSignOut}>
            Cerrar Sesión
          </Button>
        </CardContent>
      </Card>

    </div>
  );
} 