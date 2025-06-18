"use client"

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
import { PlusIcon, MoreHorizontalIcon, SearchIcon, EditIcon, TrashIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export default function AdminProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const products = [
    {
      id: 1,
      name: "Premium Dog Food",
      category: "Comida",
      price: 45.99,
      stock: 120,
      status: "active",
      petshop: "PetShop Central",
    },
    {
      id: 2,
      name: "Interactive Ball Toy",
      category: "Juguetes",
      price: 12.99,
      stock: 85,
      status: "active",
      petshop: "PetShop Norte",
    },
    {
      id: 3,
      name: "Dental Chew Treats",
      category: "Snacks",
      price: 8.99,
      stock: 200,
      status: "active",
      petshop: "PetShop Central",
    },
    {
      id: 4,
      name: "Cat Premium Food",
      category: "Comida",
      price: 39.99,
      stock: 75,
      status: "active",
      petshop: "PetShop Sur",
    },
    {
      id: 5,
      name: "Pet Bed - Medium",
      category: "Accesorios",
      price: 29.99,
      stock: 30,
      status: "inactive",
      petshop: "PetShop Norte",
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="admin" title="Gestión de Productos" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
            <p className="text-muted-foreground">Administra todos los productos del sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nuevo Producto
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Producto</DialogTitle>
                  <DialogDescription>Agrega un nuevo producto al sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del producto</Label>
                    <Input id="name" placeholder="Ej: Premium Dog Food" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" placeholder="Describe el producto" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Precio ($)</Label>
                      <Input id="price" type="number" placeholder="0.00" step="0.01" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="stock">Stock inicial</Label>
                      <Input id="stock" type="number" placeholder="0" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comida">Comida</SelectItem>
                        <SelectItem value="juguetes">Juguetes</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="accesorios">Accesorios</SelectItem>
                        <SelectItem value="higiene">Higiene</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="petshop">PetShop</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Asignar a PetShop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">PetShop Central</SelectItem>
                        <SelectItem value="norte">PetShop Norte</SelectItem>
                        <SelectItem value="sur">PetShop Sur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsDialogOpen(false)}>
                    Crear Producto
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
                <SelectItem value="comida">Comida</SelectItem>
                <SelectItem value="juguetes">Juguetes</SelectItem>
                <SelectItem value="snacks">Snacks</SelectItem>
                <SelectItem value="accesorios">Accesorios</SelectItem>
                <SelectItem value="higiene">Higiene</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="PetShop" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los PetShops</SelectItem>
                <SelectItem value="central">PetShop Central</SelectItem>
                <SelectItem value="norte">PetShop Norte</SelectItem>
                <SelectItem value="sur">PetShop Sur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Productos</CardTitle>
            <CardDescription>Mostrando {products.length} productos en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>PetShop</TableHead>
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
                    <TableCell>{product.petshop}</TableCell>
                    <TableCell className="text-right">${product.price}</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.status === "active"
                            ? "border-green-500 text-green-700 bg-green-50"
                            : "border-gray-500 text-gray-700 bg-gray-50"
                        }
                      >
                        {product.status === "active" ? "Activo" : "Inactivo"}
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
                          <DropdownMenuItem>
                            <EditIcon className="mr-2 h-4 w-4" />
                            Editar producto
                          </DropdownMenuItem>
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar PetShop</DropdownMenuItem>
                          <DropdownMenuItem>{product.status === "active" ? "Desactivar" : "Activar"}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Eliminar producto
                          </DropdownMenuItem>
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
