import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PlusIcon, SearchIcon, PencilIcon, TrashIcon } from "lucide-react"

export default function CategoriesPage() {
  // Datos de ejemplo para las categorías
  const categories = [
    {
      id: 1,
      name: "Alimentos",
      description: "Alimentos secos y húmedos para mascotas",
      products: 45,
      status: "active",
    },
    {
      id: 2,
      name: "Higiene",
      description: "Productos para la higiene y cuidado",
      products: 28,
      status: "active",
    },
    {
      id: 3,
      name: "Accesorios",
      description: "Accesorios y complementos para mascotas",
      products: 36,
      status: "active",
    },
    {
      id: 4,
      name: "Juguetes",
      description: "Juguetes interactivos y recreativos",
      products: 22,
      status: "active",
    },
    {
      id: 5,
      name: "Medicamentos",
      description: "Medicamentos y suplementos",
      products: 15,
      status: "inactive",
    },
    {
      id: 6,
      name: "Ropa",
      description: "Ropa y accesorios de vestir",
      products: 8,
      status: "active",
    },
    {
      id: 7,
      name: "Camas",
      description: "Camas y lugares de descanso",
      products: 12,
      status: "active",
    },
    {
      id: 8,
      name: "Transporte",
      description: "Productos para transporte de mascotas",
      products: 7,
      status: "inactive",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
          <p className="text-gray-600 mt-2">Gestiona las categorías de productos</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <PlusIcon className="h-4 w-4 mr-2" />
          Nueva Categoría
        </Button>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Buscar categorías..." className="pl-9 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Categorías */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle>Lista de Categorías</CardTitle>
          <CardDescription>{categories.length} categorías en total</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Productos</TableHead>
                <TableHead className="text-right">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell className="text-right">{category.products}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={category.status === "active" ? "outline" : "secondary"}
                      className={category.status === "active" ? "border-green-500 text-green-600" : ""}
                    >
                      {category.status === "active" ? "Activa" : "Inactiva"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4" />
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
