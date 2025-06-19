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
import { db } from "@/Base_de_datos/firebase"
// Remove the import for the old storage functions
// import { initializeDefaultUsers, validateCredentials } from "@/lib/user-storage"
import { Loader2Icon } from "lucide-react"
import { useFirebaseAuth } from "@/Base_de_datos/firebase-auth-provider" // Import the context hook

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

    // Ensure auth is ready before attempting login - Check loadingAuth explicitly
    if (loadingAuth || !auth) {
        console.error("Auth is not ready yet or still loading.");
        setError("Firebase Authentication is not ready. Please wait a moment and try again.");
        setIsLoading(false);
        return;
    }

    try {
      // Use Firebase Authentication to sign in with auth from context
      console.log("Email:", email);
      console.log("Password:", password);
      await signInWithEmailAndPassword(auth, email, password);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Button variant="ghost" asChild className="text-purple-600 hover:text-purple-700">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al inicio
            </Link>
          </Button>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
              <span className="text-white text-xl font-bold">🐾</span>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {roleParam ? `Accede como ${roleParam}` : "Accede como Usuario"}
            </CardTitle>
            <CardDescription className="text-gray-600">Ingresa tus credenciales para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{" "}
                <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
                  Regístrate aquí
                </Link>
              </p>
            </div>

            {/* Credenciales de prueba */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-2">Credenciales de prueba:</p>
              <div className="text-xs text-gray-600 space-y-1">
                <div>
                  <strong>Admin:</strong> admin@pethelp.com / admin123
                </div>
                <div>
                  <strong>Usuario:</strong> usuario@pethelp.com / user123
                </div>
                <div>
                  <strong>PetShop:</strong> petshop@pethelp.com / petshop123
                </div>
                <div>
                  <strong>Grooming:</strong> grooming@pethelp.com / grooming123
                </div>
                 <div>
                  <strong>Centro Adopción:</strong> adoption@pethelp.com / adoption123 {/* Added adoption center credentials */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
