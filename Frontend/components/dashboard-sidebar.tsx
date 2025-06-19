"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  LayoutDashboardIcon,
  ShoppingBagIcon,
  UsersIcon,
  BarChart3Icon,
  SettingsIcon,
  ScissorsIcon,
  LogOutIcon,
  ChevronDownIcon,
  MenuIcon,
  ShieldIcon,
  PackageIcon,
  CalendarIcon,
  CreditCardIcon,
  HomeIcon,
  ClipboardListIcon,
  HandshakeIcon,
} from "lucide-react"

// Mapa de iconos para usar dinámicamente
const IconMap: Record<string, React.ElementType> = {
  LayoutDashboard: LayoutDashboardIcon,
  ShoppingBag: ShoppingBagIcon,
  Users: UsersIcon,
  BarChart3: BarChart3Icon,
  Settings: SettingsIcon,
  Scissors: ScissorsIcon,
  Shield: ShieldIcon,
  Package: PackageIcon,
  Calendar: CalendarIcon,
  CreditCard: CreditCardIcon,
  Home: HomeIcon,
  ClipboardList: ClipboardListIcon,
  Handshake: HandshakeIcon,
}

type NavItem = {
  title: string
  href: string
  icon: string
  children?: { title: string; href: string }[]
}

// Define navigation items for each role
const navigationItems: Record<string, NavItem[]> = {
  user: [
    { title: "Mi Panel", href: "/dashboard/user", icon: "LayoutDashboardIcon" },
    { title: "Mis Pedidos", href: "/dashboard/user/orders", icon: "ShoppingBagIcon" },
    { title: "Mis Citas", href: "/dashboard/user/appointments", icon: "CalendarIcon" },
    { title: "Mi Perfil", href: "/dashboard/user/profile", icon: "UsersIcon" },
  ],
  petshop: [
    { title: "Panel PetShop", href: "/dashboard/petshop", icon: "LayoutDashboardIcon" },
    { title: "Productos", href: "/dashboard/petshop/products", icon: "PackageIcon" },
    { title: "Pedidos", href: "/dashboard/petshop/orders", icon: "ShoppingBagIcon" },
    { title: "Configuración", href: "/dashboard/petshop/settings", icon: "SettingsIcon" },
  ],
  grooming: [
    { title: "Panel Grooming", href: "/dashboard/grooming", icon: "LayoutDashboardIcon" },
    { title: "Citas", href: "/dashboard/grooming/appointments", icon: "CalendarIcon" },
    { title: "Servicios", href: "/dashboard/grooming/services", icon: "ScissorsIcon" },
    { title: "Configuración", href: "/dashboard/grooming/settings", icon: "SettingsIcon" },
  ],
  admin: [
    { title: "Panel Administrador", href: "/dashboard/admin", icon: "LayoutDashboardIcon" },
    { title: "Usuarios", href: "/dashboard/admin/users", icon: "UsersIcon" },
    { title: "Pedidos", href: "/dashboard/admin/orders", icon: "ShoppingBagIcon" },
    { title: "Configuración", href: "/dashboard/admin/settings", icon: "SettingsIcon" },
  ],
  // Add navigation items for the adoption-center role
  "adoption-center": [
    { title: "Panel Adopción", href: "/dashboard/adoption-center", icon: "LayoutDashboardIcon" },
    { title: "Mascotas en Adopción", href: "/dashboard/adoption-center/pets", icon: "HomeIcon" },
    { title: "Solicitudes de Adopción", href: "/dashboard/adoption-center/requests", icon: "ClipboardListIcon" },
    { title: "Procesos de Adopción", href: "/dashboard/adoption-center/processes", icon: "HandshakeIcon" },
    { title: "Configuración", href: "/dashboard/adoption-center/settings", icon: "SettingsIcon" },
  ],
}

interface DashboardSidebarProps {
  userRole: string
  userName: string
}

export function DashboardSidebar({ userRole, userName }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  // Get navigation items based on user role
  const navigation = navigationItems[userRole] || []

  const toggleSubmenu = (title: string) => {
    setOpenSubmenu(openSubmenu === title ? null : title)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out transform lg:translate-x-0 lg:static lg:w-64 lg:shrink-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="ml-2 font-semibold text-gray-800">PetHelp</span>
            </div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-medium">{userName.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">{userName}</p>
                <p className="text-xs text-gray-500">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navigation.map((item) => {
                const IconComponent = IconMap[item.icon] || LayoutDashboardIcon
                const active = isActive(item.href)
                const hasChildren = item.children && item.children.length > 0
                const isSubmenuOpen = openSubmenu === item.title

                return (
                  <li key={item.title}>
                    {hasChildren ? (
                      <div className="mb-1">
                        <Button
                          variant="ghost"
                          className={cn("w-full justify-between", active && "bg-gray-100 text-purple-600")}
                          onClick={() => toggleSubmenu(item.title)}
                        >
                          <div className="flex items-center">
                            <IconComponent className="mr-2 h-4 w-4" />
                            <span>{item.title}</span>
                          </div>
                          <ChevronDownIcon
                            className={cn("h-4 w-4 transition-transform", isSubmenuOpen && "transform rotate-180")}
                          />
                        </Button>
                        {isSubmenuOpen && (
                          <ul className="mt-1 ml-6 space-y-1">
                            {item.children?.map((child) => (
                              <li key={child.title}>
                                <Link
                                  href={child.href}
                                  className={cn(
                                    "flex items-center text-sm px-2 py-1.5 rounded-md hover:bg-gray-100",
                                    isActive(child.href) && "bg-purple-50 text-purple-600 font-medium",
                                  )}
                                >
                                  {child.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center px-2 py-1.5 rounded-md hover:bg-gray-100",
                          active && "bg-purple-50 text-purple-600 font-medium",
                        )}
                      >
                        <IconComponent className="mr-2 h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              asChild
            >
              <Link href="/auth">
                <LogOutIcon className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
