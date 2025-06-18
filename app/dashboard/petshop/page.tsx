import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3Icon, PackageIcon, ShoppingBagIcon, UsersIcon } from "lucide-react"

export default function PetshopDashboard() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Productos
              </CardTitle>
              <PackageIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">324</div>
              <p className="text-xs text-muted-foreground">
                +45 desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ventas
              </CardTitle>
              <ShoppingBagIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">621</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Clientes
              </CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">248</div>
              <p className="text-xs text-muted-foreground">
                +18 desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Ingresos
              </CardTitle>
              <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234.89</div>
              <p className="text-xs text-muted-foreground">
                +15.3% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="inventory">Inventario</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Ventas por Categoría</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                    Gráfico de ventas por categoría
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                  <CardDescription>
                    Top 5 productos del mes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            Producto #{i + 1}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {i % 2 === 0 ? "Comida" : i % 3 === 0 ? "Juguetes" : "Snacks"}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {120 - (i * 15)} unidades
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Productos con Bajo Stock</CardTitle>
                <CardDescription>
                  Productos que necesitan reabastecimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                        <PackageIcon className="h-4 w-4 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Producto con bajo stock {i + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {i % 2 === 0 ? "Comida" : "Snacks"}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-red-500">
                        {3 - i}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
