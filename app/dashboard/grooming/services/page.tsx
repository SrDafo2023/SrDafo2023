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
import { PlusIcon, MoreHorizontalIcon, SearchIcon, DogIcon } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function ServicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const services = [
    {
      id: 1,
      name: "Baño y Corte Estándar",
      description: "Servicio completo de baño, secado y corte de pelo",
      price: 35.99,
      duration: 60,
      category: "grooming",
      status: "active",
    },
    {
      id: 2,
      name: "Spa Completo",
      description: "Tratamiento de spa con productos premium y aromaterapia",
      price: 49.99,
      duration: 90,
      category: "grooming",
      status: "active",
    },
    {
      id: 3,
      name: "Cuidado Dental",
      description: "Limpieza dental profesional para mantener la salud bucal",
      price: 29.99,
      duration: 30,
      category: "health",
      status: "active",
    },
    {
      id: 4,
      name: "Corte de Uñas",
      description: "Servicio de corte y limado de uñas",
      price: 15.99,
      duration: 15,
      category: "grooming",
      status: "active",
    },
    {
      id: 5,
      name: "Desparasitación",
      description: "Tratamiento preventivo contra parásitos",
      price: 25.99,
      duration: 20,
      category: "health",
      status: "active",
    },
    {
      id: 6,
      name: "Adiestramiento Básico",
      description: "Sesión de entrenamiento para comandos básicos",
      price: 39.99,
      duration: 45,
      category: "training",
      status: "inactive",
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="grooming" title="Gestión de Servicios" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Servicios</h2>
            <p className="text-muted-foreground">Administra los servicios que ofreces</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nuevo Servicio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                  <DialogDescription>Agrega un nuevo servicio a tu catálogo</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del servicio</Label>
                    <Input id="name" placeholder="Ej: Baño y corte premium" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" placeholder="Describe el servicio que ofreces" rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price">Precio ($)</Label>
                      <Input id="price" type="number" placeholder="0.00" step="0.01" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="duration">Duración (min)</Label>
                      <Input id="duration" type="number" placeholder="60" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grooming">Grooming</SelectItem>
                        <SelectItem value="health">Salud</SelectItem>
                        <SelectItem value="training">Entrenamiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsDialogOpen(false)}>
                    Crear Servicio
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
              <Input type="search" placeholder="Buscar servicios..." className="w-full pl-8 md:w-[300px]" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="grooming">Grooming</SelectItem>
                <SelectItem value="health">Salud</SelectItem>
                <SelectItem value="training">Entrenamiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <DogIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          service.status === "active"
                            ? "border-green-500 text-green-700 bg-green-50"
                            : "border-gray-500 text-gray-700 bg-gray-50"
                        }
                      >
                        {service.status === "active" ? "Activo" : "Inactivo"}
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
                      <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                      <DropdownMenuItem>Editar servicio</DropdownMenuItem>
                      <DropdownMenuItem>{service.status === "active" ? "Desactivar" : "Activar"}</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Eliminar servicio</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3">{service.description}</CardDescription>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">${service.price}</span>
                  <span className="text-sm text-muted-foreground">{service.duration} min</span>
                </div>
                <Button variant="outline" className="w-full">
                  Ver citas programadas
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista Completa de Servicios</CardTitle>
            <CardDescription>Vista detallada de todos los servicios</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Duración</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-xs">{service.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {service.category === "grooming"
                          ? "Grooming"
                          : service.category === "health"
                            ? "Salud"
                            : "Entrenamiento"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${service.price}</TableCell>
                    <TableCell className="text-right">{service.duration} min</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          service.status === "active"
                            ? "border-green-500 text-green-700 bg-green-50"
                            : "border-gray-500 text-gray-700 bg-gray-50"
                        }
                      >
                        {service.status === "active" ? "Activo" : "Inactivo"}
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
                          <DropdownMenuItem>Editar servicio</DropdownMenuItem>
                          <DropdownMenuItem>{service.status === "active" ? "Desactivar" : "Activar"}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Eliminar servicio</DropdownMenuItem>
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
