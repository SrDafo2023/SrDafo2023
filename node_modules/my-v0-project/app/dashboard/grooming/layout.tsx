"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from "@/config/firebase/firebase"
import { GroomingNav } from "@/components/ui/grooming-nav"
import { Calendar, Users, Scissors, MapPin, Settings, LayoutDashboard } from "lucide-react"

export default function GroomingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, loading] = useAuthState(auth)
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard/grooming",
      icon: LayoutDashboard,
    },
    {
      title: "Horarios",
      href: "/dashboard/grooming/schedule",
      icon: Calendar,
    },
    {
      title: "Citas",
      href: "/dashboard/grooming/appointments",
      icon: Scissors,
    },
    {
      title: "Clientes",
      href: "/dashboard/grooming/clients",
      icon: Users,
    },
    {
      title: "Servicios",
      href: "/dashboard/grooming/services",
      icon: Scissors,
    },
    {
      title: "Ubicaciones",
      href: "/dashboard/grooming/locations",
      icon: MapPin,
    },
    {
      title: "Configuración",
      href: "/dashboard/grooming/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex h-screen overflow-hidden">
      <GroomingNav items={navItems} />
      <main className="flex-1 overflow-y-auto bg-white">
        {children}
      </main>
    </div>
  )
}
