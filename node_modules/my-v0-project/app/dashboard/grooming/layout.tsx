"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  Calendar,
  CircleUser,
  CreditCard,
  Home,
  LineChart,
  Menu,
  MessageSquare,
  Package,
  Package2,
  Scissors,
  Settings,
  Users,
  MapPin,
  Sun,
  Moon,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { useFirebaseAuth } from "@/config/firebase/firebase-auth-provider"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

// Duplicating the sidebarItems array here to keep the component self-contained
const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/grooming", icon: Home },
    { title: "Citas", href: "/dashboard/grooming/appointments", icon: Calendar },
    { title: "Clientes", href: "/dashboard/grooming/clients", icon: Users },
    { title: "Servicios", href: "/dashboard/grooming/services", icon: Scissors },
    { title: "Ubicaciones", href: "/dashboard/grooming/locations", icon: MapPin },
    { title: "Facturación", href: "/dashboard/grooming/billing", icon: CreditCard },
    { title: "Reseñas", href: "/dashboard/grooming/reviews", icon: MessageSquare },
    { title: "Configuración", href: "/dashboard/grooming/settings", icon: Settings },
]

export default function GroomingLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { auth } = useFirebaseAuth()
  const router = useRouter()
  const [logoutOpen, setLogoutOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut(auth)
    localStorage.removeItem("token") // Si usas tokens propios
    setLogoutOpen(false)
    router.push("/login")
  }

  const SidebarNav = ({ className }: { className?: string }) => (
    <nav className={cn("flex flex-col text-lg font-medium h-full", className)}>
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
        <Package2 className="h-6 w-6" />
        <span className="">Grooming Panel</span>
      </Link>
      {sidebarItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
            pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
      <div className="flex-1" />
      <button
        onClick={() => setLogoutOpen(true)}
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-500 hover:bg-red-100 transition-all mt-4"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </nav>
  )

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-background text-foreground">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2 bg-background">
          <div className="flex-1">
            <SidebarNav className="p-4" />
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-background text-foreground">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-background text-foreground">
              <SidebarNav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1" />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Cambiar tema"
            className="mx-2"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full mx-2" onClick={() => setLogoutOpen(true)}>
            <LogOut className="h-5 w-5 text-primary" />
            <span className="sr-only">Cerrar sesión</span>
          </Button>
          <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
            <DialogContent className="max-w-sm">
              <div className="flex flex-col items-center gap-4">
                <LogOut className="h-8 w-8 text-red-600" />
                <p className="text-lg font-semibold text-center">¿Estás seguro de que deseas cerrar sesión?</p>
                <div className="flex gap-4 mt-2">
                  <Button variant="destructive" onClick={handleSignOut}>Sí, Cerrar Sesión</Button>
                  <Button variant="outline" onClick={() => setLogoutOpen(false)}>Cancelar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background text-foreground">
          {children}
        </main>
      </div>
    </div>
  )
}
