"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  CalendarCheck,
  Users,
  Scissors,
  Settings,
  Home,
  Clock,
  DollarSign,
  Map,
  Star,
  BarChart,
  LogOut
} from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "@/config/firebase/firebase"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/grooming",
    icon: Home,
  },
  {
    title: "Citas",
    href: "/dashboard/grooming/appointments",
    icon: CalendarCheck,
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
    title: "Horarios",
    href: "/dashboard/grooming/schedule",
    icon: Clock,
  },
  {
    title: "Ventas",
    href: "/dashboard/grooming/sales",
    icon: DollarSign,
  },
  {
    title: "Ubicaciones",
    href: "/dashboard/grooming/locations",
    icon: Map,
  },
  {
    title: "Reseñas",
    href: "/dashboard/grooming/reviews",
    icon: Star,
  },
  {
    title: "Reportes",
    href: "/dashboard/grooming/reports",
    icon: BarChart,
  },
  {
    title: "Configuración",
    href: "/dashboard/grooming/settings",
    icon: Settings,
  },
]

export function GroomingSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      })
      router.push("/login")
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al cerrar sesión",
        variant: "destructive",
      })
    }
  }

  return (
    <nav className="w-64 min-h-screen bg-slate-900 text-white p-4 flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Servicios Grooming
          </h2>
        </div>
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-200 transition-all hover:text-white",
                pathname === item.href ? "bg-slate-800 text-white" : "hover:bg-slate-800"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </div>
      </div>
      <div className="pt-4 border-t border-slate-800">
        <Button
          variant="ghost"
          className="w-full flex items-center gap-3 text-slate-200 hover:text-white hover:bg-slate-800"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </nav>
  )
} 