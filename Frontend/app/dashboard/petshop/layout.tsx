"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  CircleUser,
  CreditCard,
  Home,
  LineChart,
  Menu,
  MessageSquare,
  Package,
  Package2,
  ShoppingCart,
  Users,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/petshop", icon: Home },
    { title: "Productos", href: "/dashboard/petshop/products", icon: Package },
    { title: "Pedidos", href: "/dashboard/petshop/orders", icon: ShoppingCart },
    { title: "Inventario", href: "/dashboard/petshop/inventory", icon: LineChart },
    { title: "Categorías", href: "/dashboard/petshop/categories", icon: Package2 },
    { title: "Facturación", href: "/dashboard/petshop/billing", icon: CreditCard },
    { title: "Reseñas", href: "/dashboard/petshop/reviews", icon: MessageSquare },
    { title: "Ayuda", href: "/dashboard/petshop/help", icon: HelpCircle },
    { title: "Configuración", href: "/dashboard/petshop/settings", icon: CircleUser },
]

export default function PetshopLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme();

  const SidebarNav = ({ className }: { className?: string }) => (
    <nav className={cn("flex flex-col text-lg font-medium", className)}>
      <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4 text-foreground">
        <Package2 className="h-6 w-6 text-primary" />
        <span>Petshop Panel</span>
      </Link>
      {sidebarItems.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground",
            pathname === item.href ? "bg-card text-primary" : "text-muted-foreground"
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
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1">
            <SidebarNav className="p-4" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-background">
              <SidebarNav />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add a search bar here later if needed */}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="mx-2"
            aria-label="Cambiar tema"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5 text-primary" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
