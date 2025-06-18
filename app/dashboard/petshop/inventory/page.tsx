import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SearchIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function InventoryPage() {
  const inventoryItems = [
    {
      id: 1,
      name: "Premium Dog Food",
      category: "Comida",
      stock: 120,
      minStock: 30,
      maxStock: 150,
      status: "normal",
    },
    {
      id: 2,
      name: "Interactive Ball Toy",
      category: "Juguetes",
      stock: 85,
      minStock: 20,
      maxStock: 100,
      status: "normal",
    },
    {
      id: 3,
      name: "Dental Chew Treats",
      category: "Snacks",
      stock: 200,
      minStock: 50,
      maxStock: 250,
      status: "normal",
    },
    {
      id: 4,
      name: "Cat Premium Food",
      category: "Comida",
      stock: 75,
      minStock: 30,
      maxStock: 120,
      status: "normal",
    },
    {
      id: 5,
      name: "Pet Bed - Medium",
      category: "Accesorios",
      stock: 30,
      minStock: 15,
      maxStock: 50,
      status: "normal",
    },
    {
      id: 6,
      name: "Pet Shampoo",
      category: "Higiene",
      stock: 45,
      minStock: 20,
      maxStock: 80,
      status: "normal",
    },
    {
      id: 7,
      name: "Cat Toy Mouse",
      category: "Juguetes",
      stock: 120,
      minStock: 30,
      maxStock: 150,
      status: "normal",
    },
    {
      id: 8,
      name: "Dog Leash",
      category: "Accesorios",
      stock: 25,
      minStock: 20,
      maxStock: 60,
      status: "low",
    },
    {
      id: 9,
      name: "Bird Food Mix",
      category: "Comida",
      stock: 60,
      minStock: 20,
      maxStock: 80,
      status: "normal",
    },
    {
      id: 10,
      name: "Fish Tank Filter",
      category: "Accesorios",
      stock: 15,
      minStock: 10,
      maxStock: 40,
      status: "low",
    },
  ]

  const getStockPercentage = (stock: number, maxStock: number) => {
    return Math.min(Math.round((stock / maxStock) * 100), 100)
  }

  const getProgressColor = (status: string) => {
    switch (status) {
      case "low":
        return "bg-yellow-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader role="petshop" title="Control de Inventario" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Inventario</h2>
            <p className="text-muted-foreground">Monitorea y gestiona tu stock de productos</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700">Actualizar Inventario</Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar en inventario..." className="w-full pl-8 md:w-[300px]" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="food">Comida</SelectItem>
                <SelectItem value="toys">Juguetes</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
                <SelectItem value="accessories">Accesorios</SelectItem>
                <SelectItem value="hygiene">Higiene</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Bajo stock</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              Filtrar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="low-stock">Bajo Stock</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Estado del Inventario</CardTitle>
                <CardDescription>Mostrando {inventoryItems.length} productos en inventario</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 p-3 border rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge
                              variant="outline"
                              className={
                                item.status === "normal"
                                  ? "border-green-500 text-green-700 bg-green-50"
                                  : item.status === "low"
                                    ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                    : "border-red-500 text-red-700 bg-red-50"
                              }
                            >
                              {item.status === "normal" ? "Normal" : item.status === "low" ? "Bajo stock" : "Crítico"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Categoría: {item.category}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-sm">
                            <span className="font-medium">{item.stock}</span> / {item.maxStock} unidades
                          </div>
                          <Button variant="outline" size="sm">
                            Ajustar
                          </Button>
                        </div>
                      </div>
                      <div className="w-full">
                        <Progress
                          value={getStockPercentage(item.stock, item.maxStock)}
                          className="h-2"
                          indicatorClassName={getProgressColor(item.status)}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Mínimo: {item.minStock}</span>
                        <span>Máximo: {item.maxStock}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="low-stock" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Productos con Bajo Stock</CardTitle>
                <CardDescription>Productos que necesitan reabastecimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems
                    .filter((item) => item.status === "low" || item.status === "critical")
                    .map((item) => (
                      <div key={item.id} className="flex flex-col gap-2 p-3 border rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{item.name}</h4>
                              <Badge
                                variant="outline"
                                className={
                                  item.status === "low"
                                    ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                    : "border-red-500 text-red-700 bg-red-50"
                                }
                              >
                                {item.status === "low" ? "Bajo stock" : "Crítico"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Categoría: {item.category}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm">
                              <span className="font-medium">{item.stock}</span> / {item.maxStock} unidades
                            </div>
                            <Button variant="outline" size="sm" className="bg-red-600 text-white hover:bg-red-700">
                              Reabastecer
                            </Button>
                          </div>
                        </div>
                        <div className="w-full">
                          <Progress
                            value={getStockPercentage(item.stock, item.maxStock)}
                            className="h-2"
                            indicatorClassName={getProgressColor(item.status)}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Mínimo: {item.minStock}</span>
                          <span>Máximo: {item.maxStock}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Alertas de Inventario</CardTitle>
                <CardDescription>Productos que requieren atención inmediata</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-800">Productos Críticos</h4>
                    <p className="text-sm text-red-600">2 productos necesitan reabastecimiento urgente</p>
                  </div>
                  <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <h4 className="font-medium text-yellow-800">Stock Bajo</h4>
                    <p className="text-sm text-yellow-600">3 productos están por debajo del stock mínimo</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
