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
import { PlusIcon, MoreHorizontalIcon, SearchIcon, PackageIcon } from "lucide-react"
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

export default function CategoriesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const categories = [
    {
      id: 1,
      name: "Comida",
      description: "Alimentos para mascotas de todas las edades",
      productCount: 45,
      status: "active",
    },
    {
      id: 2,
      name: "Juguetes",
      description: "Juguetes interactivos y de entretenimiento",
      productCount: 32,
      status: "active",
    },
    {
      id: 3,
      name: "Snacks",
      description: "Premios y snacks saludables",
      productCount: 28,
      status: "active",
    },
    {
      id: 4,
      name: "Accesorios",
      description: "Collares, correas, camas y más",
      productCount: 56,
      status: "active",
    },
    {
      id: 5,
      name: "Higiene",
      description: "Productos de limpieza y cuidado",
      productCount: 23,
      status: "active",
    },
    {
      id: 6,
      name: "Medicamentos",
      description: "Productos veterinarios y suplementos",
      productCount: 15,
      status: "inactive",
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="petshop" title="Gestión de Categorías" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Categorías</h2>
            <p className="text-muted-foreground">Organiza tus productos por categorías</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nueva Categoría
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Categoría</DialogTitle>
                  <DialogDescription>Agrega una nueva categoría para organizar tus productos</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre de la categoría</Label>
                    <Input id="name" placeholder="Ej: Comida para perros" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe qué tipo de productos incluye esta categoría"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsDialogOpen(false)}>
                    Crear Categoría
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar categorías..." className="w-full pl-8 md:w-[300px]" />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <PackageIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          category.status === "active"
                            ? "border-green-500 text-green-700 bg-green-50"
                            : "border-gray-500 text-gray-700 bg-gray-50"
                        }
                      >
                        {category.status === "active" ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                  </div>
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
                      <DropdownMenuItem>Ver productos</DropdownMenuItem>
                      <DropdownMenuItem>Editar categoría</DropdownMenuItem>
                      <DropdownMenuItem>{category.status === "active" ? "Desactivar" : "Activar"}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Eliminar categoría</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{category.description}</CardDescription>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{category.productCount} productos</span>
                  <Button variant="outline" size="sm">
                    Ver productos
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Resumen de Categorías</CardTitle>
            <CardDescription>Vista detallada de todas las categorías</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-right">Productos</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                    <TableCell className="text-right">{category.productCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          category.status === "active"
                            ? "border-green-500 text-green-700 bg-green-50"
                            : "border-gray-500 text-gray-700 bg-gray-50"
                        }
                      >
                        {category.status === "active" ? "Activa" : "Inactiva"}
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
                          <DropdownMenuItem>Ver productos</DropdownMenuItem>
                          <DropdownMenuItem>Editar categoría</DropdownMenuItem>
                          <DropdownMenuItem>{category.status === "active" ? "Desactivar" : "Activar"}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Eliminar categoría</DropdownMenuItem>
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
