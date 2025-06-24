"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import Link from "next/link"
// Import Firebase Authentication functions
import { signInWithEmailAndPassword, AuthError, Auth } from "firebase/auth"
// Import Firestore functions and db instance
import { doc, getDoc, setDoc } from "firebase/firestore"
// Import db directly, get auth from context
import { db } from "@/config/firebase/firebase"
// Remove the import for the old storage functions
// import { initializeDefaultUsers, validateCredentials } from "@/lib/user-storage"
import { Loader2Icon } from "lucide-react"
import { useFirebaseAuth } from "@/config/firebase/firebase-auth-provider" // Updated import path
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // Get auth and loadingAuth from the context
  const { auth, loadingAuth } = useFirebaseAuth();

  const router = useRouter()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role")

  // Remove the check for auth initialization here as it's handled by the provider
  // useEffect(() => {
  //   if (auth) {
  //     setIsAuthReady(true);
  //   } else {
  //     console.error("Firebase Auth not initialized.");
  //     // Potentially handle this case, maybe show a fatal error message
  //   }
  // }, [auth]); // Depend on the auth object

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Limpieza de espacios
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      setIsLoading(false);
      return;
    }
    if (cleanPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    // Ensure auth is ready before attempting login - Check loadingAuth explicitly
    if (loadingAuth || !auth) {
        console.error("Auth is not ready yet or still loading.");
        setError("Firebase Authentication is not ready. Please wait a moment and try again.");
        setIsLoading(false);
        return;
    }

    try {
      // Use Firebase Authentication to sign in with auth from context
      console.log("Email:", cleanEmail);
      console.log("Password:", cleanPassword);
      await signInWithEmailAndPassword(auth, cleanEmail, cleanPassword);

      // If sign-in is successful, the onAuthStateChanged listener in useUser hook
      // will be triggered, fetch the user's profile, and update the user state.
      // The redirection logic will then be handled by the pages/components
      // that use the useUser hook and check the user's role.

      // For now, let's add a small delay or check for user in useUser hook
      // before redirecting, or simply rely on the downstream components.
      // A simple approach is to just let the useUser hook handle the state change
      // and subsequent rendering/redirection in protected routes.

      // However, to match the previous flow and immediately attempt redirection after sign-in,
      // we could potentially fetch the user's profile immediately after signInWithEmailAndPassword
      // or rely on the useUser hook to update quickly. Let's assume useUser updates quickly
      // and the protected routes handle redirection based on the user state from useUser.

      // If a specific role was required from the URL param, we would check it here after
      // fetching the user's profile. But since the protected routes already do this
      // based on the user object from useUser, we can simplify this login handler.

      // We can add a slight delay to allow the useUser hook to update
      // await new Promise((resolve) => setTimeout(resolve, 500));

      // The useUser hook will now detect the authenticated user and fetch their profile.
      // Pages using useUser should handle redirection based on the fetched user object.

      // Since the redirect logic was here before, let's keep a basic redirection.
      // A more robust solution would be to handle this in a dedicated auth guard or layout.
      // For now, redirect to the default user dashboard or handle based on roleParam if needed.

       // We need to wait for the user state to update via the useUser hook
       // A simple (but not ideal) way is a small delay.
       await new Promise((resolve) => setTimeout(resolve, 1500)); // Wait for useUser to potentially update

        // After the delay, the useUser hook should have updated. The protected routes
        // will check the user and redirect. If we are still on the login page,
        // it might indicate an issue with role-based redirection in the protected routes.
        // For a basic success indication without immediate redirection here, we can just toast.
        // toast.success("Inicio de sesión exitoso.");

         // To maintain the previous immediate redirection logic, we'd need to get the user object
         // and its role here. Fetching the user profile immediately after sign-in is an option.

         // Let's revert to the previous redirection switch, assuming useUser updates the user object
         // containing userType soon after. This is not the cleanest approach for production,
         // but aligns with the existing structure.

          // We need the user object with userType here to redirect. We can get it from auth.currentUser
          // and potentially fetch the profile data immediately, or rely on the useUser hook to update
          // and then check auth.currentUser. Let's rely on the useUser hook updating and then checking auth.currentUser.

          const firebaseUser = auth.currentUser; // Get the current Firebase Auth user

          if (firebaseUser) {
               // Now fetch the profile data to get the userType for redirection
               const userDocRef = doc(db, 'users', firebaseUser.uid);
               const userDocSnap = await getDoc(userDocRef);

               if (userDocSnap.exists()) {
                   const profileData = userDocSnap.data();
                   const userType = profileData.userType;

                   // Si hay un rol específico en la URL, verificar que coincida
                   if (roleParam && roleParam !== userType) {
                      setError(`Este usuario no tiene permisos de ${roleParam}.`);
                      setIsLoading(false);
                      // Optionally sign out the user who logged in with the wrong role
                      // auth.signOut(); // Use auth from context
                      return;
                   }

                   // Redirigir según el rol del usuario
                   switch (userType) {
                       case "admin":
                           router.push("/dashboard/admin");
                           break;
                       case "user":
                           router.push("/"); // Redirect user role to the main page
                           break;
                       case "petshop":
                           router.push("/dashboard/petshop");
                           break;
                       case "grooming":
                           router.push("/dashboard/grooming");
                           break;
                       case "adoption-center":
                           router.push("/dashboard/adoption-center");
                           break;
                       default:
                           // Default redirect if userType is unknown or not handled
                           router.push("/dashboard/user");
                   }
               } else {
                   // User profile not found in Firestore after successful auth
                   console.warn("User profile missing in Firestore for UID:", firebaseUser.uid, ". Attempting to create.");
                   // Determine userType based on roleParam or default to "user"
                   const newUserType = roleParam && ["admin", "user", "petshop", "grooming", "adoption-center"].includes(roleParam) ? roleParam : "user";
                   // Create a basic user profile in Firestore
                   await setDoc(userDocRef, {
                       email: firebaseUser.email,
                       userType: newUserType,
                       firstName: "", // Default empty
                       lastName: "",  // Default empty
                       phone: "",     // Default empty
                       rut: "",       // Default empty
                       createdAt: new Date(),
                   });
                   console.log("User profile created in Firestore with userType:", newUserType);

                   // Now redirect based on the newly set userType
                   switch (newUserType) {
                       case "admin":
                           router.push("/dashboard/admin");
                           break;
                       case "user":
                           router.push("/"); // Redirect user role to the main page
                           break;
                       case "petshop":
                           router.push("/dashboard/petshop");
                           break;
                       case "grooming":
                           router.push("/dashboard/grooming");
                           break;
                       case "adoption-center":
                           router.push("/dashboard/adoption-center");
                           break;
                       default:
                           router.push("/dashboard/user");
                   }
               }
          } else {
              // Should not happen if signInWithEmailAndPassword was successful, but as a fallback
              setError("Error during login. User not authenticated.");
          }


    } catch (error) {
      console.error("Firebase Authentication Error:", error);
      // Handle specific Firebase Auth errors
      if ((error as AuthError).code === 'auth/invalid-credential') {
        setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
      } else if ((error as AuthError).code === 'auth/user-not-found' || (error as AuthError).code === 'auth/wrong-password') {
         setError("Credenciales incorrectas. Por favor, verifica tu email y contraseña.");
      } else {
        setError("Error al iniciar sesión. Inténtalo de nuevo.");
      }
    }

    setIsLoading(false);
  };

  // Show a loading indicator if auth is not ready
  if (loadingAuth || !auth) {
      return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex items-center justify-center p-4">
              <Loader2Icon className="h-8 w-8 animate-spin text-purple-600" />
              <p className="text-muted-foreground mt-2">Cargando autenticación...</p>
          </div>
      );
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Iniciar Sesión</h1>
            <p className="text-balance text-muted-foreground">
              Ingresa tu correo para acceder a tu cuenta
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="email">Correo Electrónico</Label>
              </div>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Contraseña</Label>
                <Link
                  href="/forgot-password"
                  className="ml-auto inline-block text-sm underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
               <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full bg-white text-purple-600 border border-purple-600 hover:bg-purple-50" disabled={isLoading || loadingAuth}>
              {isLoading ? <Loader2Icon className="animate-spin" /> : "Iniciar Sesión"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            ¿No tienes una cuenta?{" "}
            <Link href="/register" className="underline">
              Regístrate
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="/images/dog-cat.jpg" // Assuming you have a nice image here
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.4] dark:grayscale"
        />
      </div>
    </div>
  )
}
