"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserIcon, ShoppingBagIcon, ScissorsIcon, ShieldIcon, HomeIcon } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const router = useRouter()

  const profiles = [
    {
      id: "user",
      name: "Usuario",
      description: "Accede a compras y servicios para tu mascota",
      icon: UserIcon,
      color: "blue",
      path: "/login?role=user",
    },
    {
      id: "petshop",
      name: "PetShop",
      description: "Gestiona tu tienda de productos para mascotas",
      icon: ShoppingBagIcon,
      color: "purple",
      path: "/login?role=petshop",
    },
    {
      id: "grooming",
      name: "Grooming",
      description: "Administra tus servicios de cuidado y belleza",
      icon: ScissorsIcon,
      color: "green",
      path: "/login?role=grooming",
    },
    {
      id: "admin",
      name: "Administrador",
      description: "Control total del sistema",
      icon: ShieldIcon,
      color: "gray",
      path: "/login?role=admin",
    },
    {
      id: "adoption-center",
      name: "Centro de Adopción",
      description: "Gestiona mascotas en adopción y procesos",
      icon: HomeIcon,
      color: "orange",
      path: "/login?role=adoption-center",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">PetHelp</h1>
          <p className="text-blue-200">Selecciona tu tipo de acceso</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {profiles.map((profile) => {
            const IconComponent = profile.icon
            return (
              <Card
                key={profile.id}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader
                  className={`pb-2 ${
                    profile.color === "blue"
                      ? "bg-blue-50"
                      : profile.color === "purple"
                        ? "bg-purple-50"
                        : profile.color === "green"
                          ? "bg-green-50"
                          : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-center">
                    <div
                      className={`p-3 rounded-full ${
                        profile.color === "blue"
                          ? "bg-blue-100"
                          : profile.color === "purple"
                            ? "bg-purple-100"
                            : profile.color === "green"
                              ? "bg-green-100"
                              : "bg-gray-100"
                      }`}
                    >
                      <IconComponent
                        className={`h-6 w-6 ${
                          profile.color === "blue"
                            ? "text-blue-600"
                            : profile.color === "purple"
                              ? "text-purple-600"
                              : profile.color === "green"
                                ? "text-green-600"
                                : "text-gray-600"
                        }`}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="text-center pt-4">
                  <CardTitle className="text-xl mb-2">{profile.name}</CardTitle>
                  <CardDescription className="mb-4">{profile.description}</CardDescription>
                  <Button
                    className={`w-full ${
                      profile.color === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : profile.color === "purple"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : profile.color === "green"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-600 hover:bg-gray-700"
                    }`}
                    onClick={() => router.push(profile.path)}
                  >
                    Acceder
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/" className="text-blue-200 hover:text-white transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
