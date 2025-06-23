"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import {
  Package,
  ShoppingCart,
  Tags,
  BarChart3,
  Settings,
  DollarSign,
  AlertTriangle,
} from "lucide-react"

export default function PetshopDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Panel de Control</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card text-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Productos en Stock</p>
              <h3 className="text-2xl font-bold">150</h3>
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                8 con bajo stock
              </p>
            </div>
            <Package className="h-8 w-8 text-primary" />
          </div>
        </Card>

        <Card className="p-4 bg-card text-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              <h3 className="text-2xl font-bold">$2,500</h3>
              <p className="text-sm text-green-500 dark:text-green-400">+15% vs ayer</p>
            </div>
            <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>

        <Card className="p-4 bg-card text-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pedidos Pendientes</p>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-sm text-orange-500 dark:text-orange-400">7 en proceso</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
          </div>
        </Card>

        <Card className="p-4 bg-card text-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Ofertas Activas</p>
              <h3 className="text-2xl font-bold">3</h3>
              <p className="text-sm text-purple-500 dark:text-purple-400">2 próximas</p>
            </div>
            <DollarSign className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/petshop/inventory">
          <Card className="p-6 bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Gestionar Inventario</h3>
                <p className="text-sm text-muted-foreground">Administra tus productos y stock</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/petshop/orders">
          <Card className="p-6 bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <ShoppingCart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              <div>
                <h3 className="font-semibold">Procesar Pedidos</h3>
                <p className="text-sm text-muted-foreground">Gestiona los pedidos pendientes</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/petshop/categories">
          <Card className="p-6 bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Tags className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div>
                <h3 className="font-semibold">Categorías</h3>
                <p className="text-sm text-muted-foreground">Organiza tus productos</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/petshop/sales">
          <Card className="p-6 bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <BarChart3 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              <div>
                <h3 className="font-semibold">Reportes de Ventas</h3>
                <p className="text-sm text-muted-foreground">Analiza el rendimiento</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/petshop/offers">
          <Card className="p-6 bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <DollarSign className="h-8 w-8 text-red-600 dark:text-red-400" />
              <div>
                <h3 className="font-semibold">Gestionar Ofertas</h3>
                <p className="text-sm text-muted-foreground">Configura promociones</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/dashboard/petshop/settings">
          <Card className="p-6 bg-card text-foreground hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">Configuración</h3>
                <p className="text-sm text-muted-foreground">Ajusta la tienda</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
