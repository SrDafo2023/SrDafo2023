"use client"

import { useState } from "react"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function DashboardHeader() {
  const [notifications] = useState([
    {
      id: 1,
      title: "Nuevo pedido recibido",
      description: "Pedido #1234 recibido hace 5 minutos",
      read: false,
    },
    {
      id: 2,
      title: "Stock bajo",
      description: "Alimento Premium Perro tiene stock bajo",
      read: false,
    },
    {
      id: 3,
      title: "Nueva reseña",
      description: "Has recibido una nueva reseña de 5 estrellas",
      read: true,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center w-full max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="search" placeholder="Buscar..." className="w-full pl-9 h-9 md:w-[300px] lg:w-[400px]" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                  variant="destructive"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="py-4 text-center text-sm text-gray-500">No hay notificaciones</div>
            ) : (
              notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`flex flex-col items-start p-3 ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{notification.description}</div>
                </DropdownMenuItem>
              ))
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/notifications" className="w-full text-center text-sm text-blue-600">
                Ver todas las notificaciones
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/business/settings">Configuración</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/business/settings/profile">Perfil</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={async () => {
              const { signOut } = await import('firebase/auth');
              const { auth } = await import('@/lib/firebase');
              await signOut(auth);
              window.location.href = '/';
            }} className="text-red-600 cursor-pointer">
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
