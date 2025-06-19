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
import { PlusIcon, MoreHorizontalIcon, SearchIcon, EditIcon, TrashIcon, FileTextIcon } from "lucide-react"
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

export default function AdminServicesPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const exportToCSV = () => {
    const headers = Object.keys(services[0])
    const csvContent = headers.join(',') + '\n' + 
      services.map(service => 
        headers.map(header => 
          `"${service[header].toString().replace(/"/g, '""')}"`
        ).join(',')
      ).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', 'reporte_servicios.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const services = [
    {
      id: 1,
      name: "Baño y Corte Estándar",
      category: "Grooming",
      price: 35.99,
      duration: 60,
      provider: "Grooming Central",
      status: "active",
    },
    {
      id: 2,
      name: "Spa Completo",
      category: "Grooming",
      price: 49.99,
      duration: 90,
      provider: "Grooming Premium",
      status: "active",
    },
    {
      id: 3,
      name: "Cuidado Dental",
      category: "Salud",
      price: 29.99,
      duration: 30,
      provider: "Clínica Veterinaria",
      status: "active",
    },
    {
      id: 4,
      name: "Corte de Uñas",
      category: "Grooming",
      price: 15.99,
      duration: 15,
      provider: "Grooming Express",
      status: "active",
    },
    {
      id: 5,
      name: "Adiestramiento Básico",
      category: "Entrenamiento",
      price: 39.99,
      duration: 45,
      provider: "Centro de Entrenamiento",
      status: "inactive",
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="admin" title="Gestión de Servicios" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Servicios</h2>
            <p className="text-muted-foreground">Administra todos los servicios del sistema</p>
          </div>
          <div className="flex items-center gap-2 justify-end">
            <Button onClick={exportToCSV} className="bg-black text-white hover:bg-gray-800">
              <FileTextIcon className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nuevo Servicio
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Servicio</DialogTitle>
                  <DialogDescription>Agrega un nuevo servicio al sistema</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre del servicio</Label>
                    <Input id="name" placeholder="Ej: Baño y corte premium" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea id="description" placeholder="Describe el servicio" rows={3} />
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
                        <SelectItem value="salud">Salud</SelectItem>
                        <SelectItem value="entrenamiento">Entrenamiento</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider">Proveedor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Asignar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="central">Grooming Central</SelectItem>
                        <SelectItem value="premium">Grooming Premium</SelectItem>
                        <SelectItem value="express">Grooming Express</SelectItem>
                        <SelectItem value="veterinaria">Clínica Veterinaria</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" onClick={() => setIsDialogOpen(false)}>
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
                <SelectItem value="salud">Salud</SelectItem>
                <SelectItem value="entrenamiento">Entrenamiento</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proveedores</SelectItem>
                <SelectItem value="central">Grooming Central</SelectItem>
                <SelectItem value="premium">Grooming Premium</SelectItem>
                <SelectItem value="express">Grooming Express</SelectItem>
                <SelectItem value="veterinaria">Clínica Veterinaria</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Servicios</CardTitle>
            <CardDescription>Mostrando {services.length} servicios en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead className="text-right">Duración</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell className="font-medium">{service.name}</TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>{service.provider}</TableCell>
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
                          <DropdownMenuItem>
                            <EditIcon className="mr-2 h-4 w-4" />
                            Editar servicio
                          </DropdownMenuItem>
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar proveedor</DropdownMenuItem>
                          <DropdownMenuItem>{service.status === "active" ? "Desactivar" : "Activar"}</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Eliminar servicio
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
