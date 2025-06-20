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
import { auth, db } from "@/lib/firebase"

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="space-y-1 text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-3xl">🐾</span>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Crear Cuenta
          </CardTitle>
          <CardDescription className="text-gray-600">Únete a la comunidad PetHelp</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                placeholder="+56 9 1234 5678"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="rut" className="text-sm font-medium text-gray-700">
                RUT
              </label>
              <Input
                id="rut"
                type="text"
                value={formData.rut}
                onChange={(e) => handleInputChange("rut", e.target.value)}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="userType" className="text-sm font-medium text-gray-700">
                Tipo de Usuario
              </label>
              <Select onValueChange={(value) => handleInputChange("userType", value)} value={formData.userType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu tipo de usuario" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="petshop">PetShop</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="adoption-center">Centro de Adopción</SelectItem>
                  {/* Admin role is not typically selectable during registration */}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => router.push("/")}
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Atrás
              </Button>
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={isLoading || success}
              >
                {isLoading && "Registrando..."}
                {success && <CheckIcon className="mr-2 h-4 w-4" />}
                {!isLoading && !success && "Crear cuenta"}
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
