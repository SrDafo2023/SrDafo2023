"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  CircleUser,
  Home,
  Menu,
  Package2,
  Users,
  Settings,
  Dog,
  FileText,
  ClipboardCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/adoption-center", icon: Home },
    { title: "Mascotas", href: "/dashboard/adoption-center/pets", icon: Dog },
    { title: "Solicitudes", href: "/dashboard/adoption-center/requests", icon: FileText },
    { title: "Procesos", href: "/dashboard/adoption-center/processes", icon: ClipboardCheck },
    { title: "Configuración", href: "/dashboard/adoption-center/settings", icon: Settings },
]

export default function AdoptionCenterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const SidebarNav = ({ className }: { className?: string }) => (
    <nav className={cn("flex flex-col text-lg font-medium", className)}>
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4">
        <Package2 className="h-6 w-6" />
        <span className="">Centro de Adopción</span>
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
    </nav>
  )

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1">
            <SidebarNav className="p-4" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <SidebarNav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add a search bar here later if needed */}
          </div>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 