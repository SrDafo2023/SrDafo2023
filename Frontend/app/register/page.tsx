"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EyeIcon, EyeOffIcon, ArrowLeftIcon, CheckIcon } from "lucide-react"
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/config/firebase/firebase"
import { Label } from "@/components/ui/label"
import { Loader2Icon } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    userType: "",
    rut: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    if (!formData.userType) {
      setError("Por favor selecciona el tipo de usuario")
      setIsLoading(false)
      return
    }

    // --- Firebase Registration ---
    try {
      // 1. Create user account in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // 2. Save user profile data in Firestore using the user's UID
      const userDocRef = doc(db, "users", user.uid)
      await setDoc(userDocRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        userType: formData.userType, // Save userType from form
        rut: formData.rut,
        createdAt: new Date(), // Add a timestamp
        // Do NOT save password here
      })

      // --- Registration Successful ---
      setIsLoading(false)
      setSuccess(true)

      // Redirect after 2 seconds
      setTimeout(() => {
        // Redirect to login page after successful registration
        if (formData.userType === 'user') {
          router.push('/');
        } else {
          router.push(`/login?role=${formData.userType}`);
        }
      }, 2000)

    } catch (error) {
      console.error("Firebase Registration Error:", error) // Log the error for debugging

      // Handle specific Firebase Auth errors
      let errorMessage = "Error al crear la cuenta. Por favor, intenta nuevamente."
      if (error instanceof AuthError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "El correo electrónico ya está registrado."
            break
          case "auth/invalid-email":
            errorMessage = "El formato del correo electrónico es inválido."
            break
          case "auth/operation-not-allowed":
            errorMessage = "El registro con correo y contraseña no está habilitado en Firebase. Contacta al administrador."
            break // Should not happen if you enabled it, but good to handle
          case "auth/weak-password":
            errorMessage = "La contraseña es demasiado débil."
            break
          default:
            // Generic Firebase Auth error
            errorMessage = `Error de autenticación: ${error.message}`
        }
      } else if (error instanceof Error) {
        // Other potential errors (e.g., Firestore write error)
        errorMessage = `Error: ${error.message}`
      }

      setError(errorMessage)
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
        <Card className="w-full max-w-md shadow-xl border-0">
          <CardContent className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Registro Exitoso!</h2>
            <p className="text-gray-600 mb-4">
              Tu cuenta ha sido creada correctamente. Serás redirigido al inicio de sesión.
            </p>
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Crear una cuenta</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa tus datos para registrarte
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">Nombre</Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Tu nombre"
                required
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Apellido</Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Tu apellido"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userType">Tipo de Cuenta</Label>
              <Select onValueChange={(value) => handleInputChange("userType", value)} value={formData.userType}>
                <SelectTrigger className="w-full bg-gray-100 dark:bg-gray-800">
                  <SelectValue placeholder="Selecciona un tipo de cuenta" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="petshop">Dueño de PetShop</SelectItem>
                  <SelectItem value="grooming">Dueño de Peluquería</SelectItem>
                  <SelectItem value="adoption-center">Centro de Adopción</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading || success}>
              {isLoading ? <Loader2Icon className="animate-spin" /> : success ? <CheckIcon className="mr-2 h-4 w-4" /> : "Crear cuenta"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="underline">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
         <img
          src="/images/dog-cat.jpg" // Reusing the same image
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
        />
      </div>
    </div>
  )
}
