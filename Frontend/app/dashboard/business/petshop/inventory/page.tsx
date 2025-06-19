import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangleIcon, PlusIcon, SearchIcon } from "lucide-react"

export default function InventoryPage() {
  // Datos de ejemplo para el inventario
  const inventoryItems = [
    {
      id: 1,
      name: "Alimento Premium Perro",
      category: "Alimentos",
      stock: 15,
      minStock: 20,
      price: "$25.990",
      status: "low",
    },
    {
      id: 2,
      name: "Arena Sanitaria Gato",
      category: "Higiene",
      stock: 32,
      minStock: 15,
      price: "$8.990",
      status: "ok",
    },
    {
      id: 3,
      name: "Juguete Interactivo",
      category: "Juguetes",
      stock: 8,
      minStock: 10,
      price: "$15.990",
      status: "low",
    },
    {
      id: 4,
      name: "Correa Retráctil",
      category: "Accesorios",
      stock: 25,
      minStock: 10,
      price: "$12.990",
      status: "ok",
    },
    {
      id: 5,
      name: "Shampoo Antipulgas",
      category: "Higiene",
      stock: 5,
      minStock: 8,
      price: "$9.990",
      status: "low",
    },
    {
      id: 6,
      name: "Cama para Perro Grande",
      category: "Accesorios",
      stock: 12,
      minStock: 5,
      price: "$32.990",
      status: "ok",
    },
    {
      id: 7,
      name: "Snacks Dentales",
      category: "Alimentos",
      stock: 45,
      minStock: 20,
      price: "$7.990",
      status: "ok",
    },
    {
      id: 8,
      name: "Rascador para Gatos",
      category: "Accesorios",
      stock: 3,
      minStock: 5,
      price: "$19.990",
      status: "low",
    },
  ]

  // Filtrar productos con stock bajo
  const lowStockItems = inventoryItems.filter((item) => item.status === "low")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
          <p className="text-gray-600 mt-2">Gestiona el stock de productos de tu tienda</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Agregar Producto
        </Button>
      </div>

      {/* Alertas de Stock */}
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-orange-800 flex items-center gap-2 text-lg">
              <AlertTriangleIcon className="h-5 w-5 text-orange-500" />
              Alertas de Stock
            </CardTitle>
            <CardDescription className="text-orange-700">
              {lowStockItems.length} productos con stock bajo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-white rounded-lg border border-orange-200"
                >
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Stock: {item.stock} / Min: {item.minStock}
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    Reabastecer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Buscar productos..." className="pl-9 w-full" />
            </div>
            <div className="flex gap-4">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="alimentos">Alimentos</SelectItem>
                  <SelectItem value="higiene">Higiene</SelectItem>
                  <SelectItem value="accesorios">Accesorios</SelectItem>
                  <SelectItem value="juguetes">Juguetes</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="low">Stock bajo</SelectItem>
                  <SelectItem value="ok">Stock normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Inventario */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Lista de Productos</CardTitle>
          <CardDescription>{inventoryItems.length} productos en inventario</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Stock Mínimo</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell className="text-right">{item.stock}</TableCell>
                  <TableCell className="text-right">{item.minStock}</TableCell>
                  <TableCell className="text-right">{item.price}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={item.status === "low" ? "destructive" : "outline"}>
                      {item.status === "low" ? "Stock Bajo" : "Normal"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        Reabastecer
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
