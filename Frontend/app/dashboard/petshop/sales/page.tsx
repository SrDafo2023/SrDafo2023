import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DownloadIcon, TrendingUpIcon, DollarSignIcon, ShoppingCartIcon, UsersIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SalesPage() {
  const salesData = [
    {
      id: 1,
      orderId: "ORD-001",
      customer: "Juan Pérez",
      products: ["Premium Dog Food", "Interactive Ball Toy"],
      total: 58.98,
      date: "2023-06-15",
      status: "completed",
    },
    {
      id: 2,
      orderId: "ORD-002",
      customer: "María López",
      products: ["Cat Premium Food", "Pet Bed"],
      total: 69.98,
      date: "2023-06-15",
      status: "completed",
    },
    {
      id: 3,
      orderId: "ORD-003",
      customer: "Carlos Rodríguez",
      products: ["Dental Chew Treats"],
      total: 8.99,
      date: "2023-06-14",
      status: "pending",
    },
    {
      id: 4,
      orderId: "ORD-004",
      customer: "Ana Martínez",
      products: ["Pet Shampoo", "Dog Leash"],
      total: 33.98,
      date: "2023-06-14",
      status: "completed",
    },
    {
      id: 5,
      orderId: "ORD-005",
      customer: "Pedro Sánchez",
      products: ["Cat Toy Mouse", "Bird Food Mix"],
      total: 17.98,
      date: "2023-06-13",
      status: "completed",
    },
  ]

  const topProducts = [
    { name: "Premium Dog Food", sales: 120, revenue: 5519.8 },
    { name: "Cat Premium Food", sales: 95, revenue: 3799.05 },
    { name: "Interactive Ball Toy", sales: 85, revenue: 1104.15 },
    { name: "Dental Chew Treats", sales: 78, revenue: 701.22 },
    { name: "Pet Bed - Medium", sales: 65, revenue: 1949.35 },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="petshop" title="Análisis de Ventas" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Ventas</h2>
            <p className="text-muted-foreground">Analiza el rendimiento de tus ventas</p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="30">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Últimos 7 días</SelectItem>
                <SelectItem value="30">Últimos 30 días</SelectItem>
                <SelectItem value="90">Últimos 3 meses</SelectItem>
                <SelectItem value="365">Último año</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234.89</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+15.3%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
              <ShoppingCartIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">621</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+12%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Nuevos</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">48</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+8%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
              <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$19.70</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+3.2%</span> desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="orders">Órdenes</TabsTrigger>
            <TabsTrigger value="products">Productos Top</TabsTrigger>
            <TabsTrigger value="customers">Clientes</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Ventas por Mes</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full bg-muted/20 rounded-md flex items-center justify-center">
                    Gráfico de ventas mensuales
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Ventas por Categoría</CardTitle>
                  <CardDescription>Distribución de ventas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { category: "Comida", percentage: 35, amount: "$4,282.21" },
                      { category: "Juguetes", percentage: 25, amount: "$3,058.72" },
                      { category: "Accesorios", percentage: 20, amount: "$2,446.98" },
                      { category: "Snacks", percentage: 15, amount: "$1,835.23" },
                      { category: "Higiene", percentage: 5, amount: "$611.75" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{item.category}</p>
                          <p className="text-sm text-muted-foreground">{item.percentage}%</p>
                        </div>
                        <div className="text-sm font-medium">{item.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Órdenes Recientes</CardTitle>
                <CardDescription>Últimas transacciones realizadas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orden</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Productos</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesData.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.orderId}</TableCell>
                        <TableCell>{sale.customer}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate">{sale.products.join(", ")}</div>
                        </TableCell>
                        <TableCell className="text-right">${sale.total}</TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              sale.status === "completed"
                                ? "border-green-500 text-green-700 bg-green-50"
                                : "border-yellow-500 text-yellow-700 bg-yellow-50"
                            }
                          >
                            {sale.status === "completed" ? "Completada" : "Pendiente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Productos Más Vendidos</CardTitle>
                <CardDescription>Top 5 productos por ventas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-sm font-bold text-purple-600">#{i + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} unidades vendidas</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${product.revenue.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Ingresos</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="customers" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Clientes Frecuentes</CardTitle>
                <CardDescription>Clientes con más compras</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Juan Pérez", orders: 12, total: 458.9 },
                    { name: "María López", orders: 8, total: 325.45 },
                    { name: "Carlos Rodríguez", orders: 6, total: 289.3 },
                    { name: "Ana Martínez", orders: 5, total: 198.75 },
                    { name: "Pedro Sánchez", orders: 4, total: 156.2 },
                  ].map((customer, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-muted-foreground">{customer.orders} órdenes</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${customer.total}</p>
                        <p className="text-sm text-muted-foreground">Total gastado</p>
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
