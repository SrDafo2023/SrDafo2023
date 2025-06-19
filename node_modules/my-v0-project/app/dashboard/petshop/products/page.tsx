import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusIcon, MoreHorizontalIcon, SearchIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProductsPage() {
  const products = [
    {
      id: 1,
      name: "Premium Dog Food",
      category: "Comida",
      price: 45.99,
      stock: 120,
      status: "in-stock",
    },
    {
      id: 2,
      name: "Interactive Ball Toy",
      category: "Juguetes",
      price: 12.99,
      stock: 85,
      status: "in-stock",
    },
    {
      id: 3,
      name: "Dental Chew Treats",
      category: "Snacks",
      price: 8.99,
      stock: 200,
      status: "in-stock",
    },
    {
      id: 4,
      name: "Cat Premium Food",
      category: "Comida",
      price: 39.99,
      stock: 75,
      status: "in-stock",
    },
    {
      id: 5,
      name: "Pet Bed - Medium",
      category: "Accesorios",
      price: 29.99,
      stock: 30,
      status: "in-stock",
    },
    {
      id: 6,
      name: "Pet Shampoo",
      category: "Higiene",
      price: 14.99,
      stock: 45,
      status: "in-stock",
    },
    {
      id: 7,
      name: "Cat Toy Mouse",
      category: "Juguetes",
      price: 5.99,
      stock: 120,
      status: "in-stock",
    },
    {
      id: 8,
      name: "Dog Leash",
      category: "Accesorios",
      price: 18.99,
      stock: 25,
      status: "low-stock",
    },
    {
      id: 9,
      name: "Bird Food Mix",
      category: "Comida",
      price: 11.99,
      stock: 60,
      status: "in-stock",
    },
    {
      id: 10,
      name: "Fish Tank Filter",
      category: "Accesorios",
      price: 24.99,
      stock: 15,
      status: "low-stock",
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="petshop" title="Gestión de Productos" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
            <p className="text-muted-foreground">Administra tu inventario de productos</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Producto
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar productos..." className="w-full pl-8 md:w-[300px]" />
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
                <SelectItem value="in-stock">En stock</SelectItem>
                <SelectItem value="low-stock">Bajo stock</SelectItem>
                <SelectItem value="out-of-stock">Sin stock</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full md:w-auto">
              Filtrar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Productos</CardTitle>
            <CardDescription>Mostrando {products.length} productos en inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell className="text-right">${product.price}</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.status === "in-stock"
                            ? "border-green-500 text-green-700 bg-green-50"
                            : product.status === "low-stock"
                              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                              : "border-red-500 text-red-700 bg-red-50"
                        }
                      >
                        {product.status === "in-stock"
                          ? "En stock"
                          : product.status === "low-stock"
                            ? "Bajo stock"
                            : "Sin stock"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar producto</DropdownMenuItem>
                          <DropdownMenuItem>Actualizar stock</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Eliminar producto</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
