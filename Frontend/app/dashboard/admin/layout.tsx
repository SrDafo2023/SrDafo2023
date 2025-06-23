"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
  Settings,
  ShieldAlert,
  Sun,
  Moon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const sidebarItems = [
    { title: "Dashboard", href: "/dashboard/admin", icon: Home },
    { title: "Pedidos", href: "/dashboard/admin/orders", icon: ShoppingCart },
    { title: "Productos", href: "/dashboard/admin/products", icon: Package },
    { title: "Usuarios", href: "/dashboard/admin/users", icon: Users },
    { title: "Analíticas", href: "/dashboard/admin/analytics", icon: LineChart },
    { title: "Configuración", href: "/dashboard/admin/settings", icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const SidebarNav = ({ className }: { className?: string }) => (
    <nav className={cn("flex flex-col text-lg font-medium", className)}>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
          <Package2 className="h-6 w-6" />
          <span className="">Admin Panel</span>
        </Link>
        <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
      <div className="flex-1">
        <Link
          href="/dashboard/admin"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 transition-all hover:text-primary dark:hover:text-primary"
        >
          <Home className="h-4 w-4" />
          Dashboard
        </Link>
        <Link
          href="/dashboard/admin/orders"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 transition-all hover:text-primary dark:hover:text-primary"
        >
          <ShoppingCart className="h-4 w-4" />
          Pedidos
          <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
            6
          </Badge>
        </Link>
        <Link
          href="/dashboard/admin/products"
          className="flex items-center gap-3 rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-2 text-primary dark:text-slate-50 transition-all"
        >
          <Package className="h-4 w-4" />
          Productos{" "}
        </Link>
        <Link
          href="/dashboard/admin/users"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 transition-all hover:text-primary dark:hover:text-primary"
        >
          <Users className="h-4 w-4" />
          Usuarios
        </Link>
        <Link
          href="/dashboard/admin/analytics"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 transition-all hover:text-primary dark:hover:text-primary"
        >
          <LineChart className="h-4 w-4" />
          Analíticas
        </Link>
        <Link
          href="/dashboard/admin/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 dark:text-gray-200 transition-all hover:text-primary dark:hover:text-primary"
        >
          <Settings className="h-4 w-4" />
          Configuración
        </Link>
      </div>
    </nav>
  )

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-slate-100 dark:bg-slate-800/80 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex-1">
            <SidebarNav className="p-4" />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-slate-100 dark:bg-black px-4 lg:h-[60px] lg:px-6 dark:border-slate-800">
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-slate-50 dark:bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  )
}
