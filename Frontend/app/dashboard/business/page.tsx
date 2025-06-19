import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBagIcon,
  ScissorsIcon,
  TrendingUpIcon,
  UsersIcon,
  CalendarIcon,
  PackageIcon,
  DollarSignIcon,
  AlertTriangleIcon,
} from "lucide-react"
import Link from "next/link"

export default function BusinessDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Panel de Empresa</h1>
        <p className="text-gray-600 mt-2">Gestiona tu petshop y servicios de grooming desde un solo lugar</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,350</div>
            <p className="text-xs text-muted-foreground">+20.1% desde ayer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 pendientes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <PackageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">8 con stock bajo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+5 nuevos esta semana</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PetShop Section */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <ShoppingBagIcon className="h-5 w-5" />
              PetShop
            </CardTitle>
            <CardDescription>Gestiona tu inventario, productos y ventas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">156</div>
                <div className="text-sm text-purple-600">Productos</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-700">$1,890</div>
                <div className="text-sm text-purple-600">Ventas Hoy</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Alertas de Stock</span>
                <Badge variant="destructive">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pedidos Pendientes</span>
                <Badge variant="secondary">3</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                <Link href="/dashboard/business/petshop/products">Ver Productos</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 border-purple-300 text-purple-600">
                <Link href="/dashboard/business/petshop/inventory">Inventario</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Grooming Section */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <ScissorsIcon className="h-5 w-5" />
              Grooming
            </CardTitle>
            <CardDescription>Administra servicios, citas y clientes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">12</div>
                <div className="text-sm text-blue-600">Citas Hoy</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-700">$460</div>
                <div className="text-sm text-blue-600">Ingresos Hoy</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Próximas Citas</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Servicios Activos</span>
                <Badge className="bg-blue-600">8</Badge>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                <Link href="/dashboard/business/grooming/appointments">Ver Citas</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="flex-1 border-blue-300 text-blue-600">
                <Link href="/dashboard/business/grooming/services">Servicios</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangleIcon className="h-5 w-5 text-orange-500" />
              Alertas Importantes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Stock Crítico</p>
                <p className="text-xs text-red-600">8 productos con stock bajo</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-800">Cita Próxima</p>
                <p className="text-xs text-yellow-600">Grooming en 30 minutos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Nuevo Pedido</p>
                <p className="text-xs text-blue-600">Pedido #1234 recibido</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/business/petshop/products">
                <PackageIcon className="h-4 w-4 mr-2" />
                Agregar Producto
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/business/grooming/appointments">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Nueva Cita
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/business/petshop/sales">
                <TrendingUpIcon className="h-4 w-4 mr-2" />
                Ver Reportes
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" variant="outline">
              <Link href="/dashboard/business/settings">
                <UsersIcon className="h-4 w-4 mr-2" />
                Configuración
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
