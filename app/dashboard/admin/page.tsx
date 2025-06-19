import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersIcon, ShoppingBagIcon, DogIcon, BarChart3Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DownloadIcon, FileTextIcon, TableIcon } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col">
      <DashboardHeader title="Panel de Administración" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground">+180 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Productos</CardTitle>
              <ShoppingBagIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324</div>
              <p className="text-xs text-muted-foreground">+45 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios</CardTitle>
              <DogIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+3 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">+20.1% desde el mes pasado</p>
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-4 mt-8">
          <Link href="/dashboard/admin/users" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Usuarios</Link>
          <Link href="/dashboard/admin/analytics" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Analytics</Link>
          <Link href="/dashboard/admin/products" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Productos</Link>
          <Link href="/dashboard/admin/services" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Servicios</Link>
        </div>
      </main>
    </div>
  )
}
