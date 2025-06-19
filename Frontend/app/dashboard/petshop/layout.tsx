"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { DashboardHeader } from "@/components/dashboard-header"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  BarChart3,
  Settings,
  FileText,
  DollarSign,
  HelpCircle,
  MessageSquare,
  LogOut
} from "lucide-react"
import { useFirebaseAuth } from "../../../../Base_de_datos/firebase-auth-provider"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard/petshop",
    icon: LayoutDashboard
  },
  {
    title: "Inventario",
    href: "/dashboard/petshop/inventory",
    icon: Package
  },
  {
    title: "Pedidos",
    href: "/dashboard/petshop/orders",
    icon: ShoppingCart
  },
  {
    title: "Categorías",
    href: "/dashboard/petshop/categories",
    icon: Tags
  },
  {
    title: "Ventas",
    href: "/dashboard/petshop/sales",
    icon: BarChart3
  },
  {
    title: "Ofertas",
    href: "/dashboard/petshop/offers",
    icon: DollarSign
  },
  {
    title: "Reportes",
    href: "/dashboard/petshop/reports",
    icon: FileText
  },
  {
    title: "Configuración",
    href: "/dashboard/petshop/settings",
    icon: Settings
  },
  {
    title: "Ayuda",
    href: "/dashboard/petshop/help",
    icon: HelpCircle
  },
  {
    title: "Feedback",
    href: "/dashboard/petshop/feedback",
    icon: MessageSquare
  }
]

export default function PetshopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { auth } = useFirebaseAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await auth?.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0">
        <div className="flex flex-col flex-grow bg-[#1a237e] text-white">
          <div className="flex items-center h-16 px-4">
            <span className="text-xl font-bold">PetShop Dashboard</span>
          </div>
          <div className="flex-1 space-y-1 px-3">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive 
                      ? "bg-[#3949ab] text-white" 
                      : "text-gray-300 hover:bg-[#283593] hover:text-white"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
              )
            })}
          </div>
          {/* Botón de Cerrar Sesión */}
          <div className="px-3 py-4 border-t border-[#283593]">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-[#283593] hover:text-white w-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 md:pl-64">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
