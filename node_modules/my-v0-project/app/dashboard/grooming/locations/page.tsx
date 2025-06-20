"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PlusIcon, MoreHorizontalIcon, SearchIcon, MapPinIcon, PhoneIcon, ClockIcon } from "lucide-react"
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
import { useRouter } from 'next/navigation'
import { LocationsMap } from "@/components/locations/locations-map"

export default function LocationsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const locations = [
    {
      id: 1,
      name: "Sede Principal",
      address: "Av. Principal 123, Ciudad",
      phone: "+1 234 567 8900",
      hours: "Lun-Vie: 8:00-18:00, Sáb: 9:00-15:00",
      status: "active",
      services: ["Baño y Corte", "Spa Completo", "Cuidado Dental"],
      appointmentsToday: 8,
      lat: 40.7128,
      lng: -74.0060,
    },
    {
      id: 2,
      name: "Sucursal Norte",
      address: "Calle Secundaria 456, Ciudad",
      phone: "+1 234 567 8901",
      hours: "Lun-Vie: 9:00-17:00, Sáb: 10:00-14:00",
      status: "active",
      services: ["Baño y Corte", "Corte de Uñas"],
      appointmentsToday: 5,
      lat: 40.7580,
      lng: -73.9855,
    },
    {
      id: 3,
      name: "Centro Comercial",
      address: "Plaza Central 789, Ciudad",
      phone: "+1 234 567 8902",
      hours: "Lun-Dom: 10:00-20:00",
      status: "active",
      services: ["Baño y Corte", "Spa Completo", "Desparasitación"],
      appointmentsToday: 12,
      lat: 40.7484,
      lng: -73.9857,
    },
    {
      id: 4,
      name: "Sucursal Sur",
      address: "Av. Sur 321, Ciudad",
      phone: "+1 234 567 8903",
      hours: "Lun-Vie: 8:30-17:30",
      status: "maintenance",
      services: ["Baño y Corte"],
      appointmentsToday: 0,
      lat: 40.7050,
      lng: -74.0095,
    },
  ]

  const handleViewOnMap = (address: string) => {
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://www.google.com/maps?q=${encodedAddress}`, "_blank")
  }

  const handleViewAppointments = (locationId: number) => {
    router.push(`/dashboard/grooming/appointments?locationId=${locationId}`)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader role="grooming" title="Gestión de Ubicaciones" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">Mapa de Ubicaciones</h3>
          <p className="text-sm text-muted-foreground mb-4">Vista geográfica de todas las ubicaciones</p>
          <LocationsMap locations={locations} />
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Ubicaciones</h2>
            <p className="text-muted-foreground">Administra las ubicaciones donde ofreces servicios</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nueva Ubicación
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Agregar Nueva Ubicación</DialogTitle>
                  <DialogDescription>Agrega una nueva ubicación donde ofreces servicios</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre de la ubicación</Label>
                    <Input id="name" placeholder="Ej: Sede Principal" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Dirección completa</Label>
                    <Textarea id="address" placeholder="Calle, número, ciudad, código postal" rows={3} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="+1 234 567 8900" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="hours">Horarios de atención</Label>
                    <Input id="hours" placeholder="Lun-Vie: 8:00-18:00" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="services">Servicios disponibles</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona los servicios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bath-cut">Baño y Corte</SelectItem>
                        <SelectItem value="spa">Spa Completo</SelectItem>
                        <SelectItem value="dental">Cuidado Dental</SelectItem>
                        <SelectItem value="nails">Corte de Uñas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsDialogOpen(false)}>
                    Agregar Ubicación
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:w-auto">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar ubicaciones..." className="w-full pl-8 md:w-[300px]" />
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activas</SelectItem>
                <SelectItem value="maintenance">En mantenimiento</SelectItem>
                <SelectItem value="closed">Cerradas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {locations.map((location) => (
            <Card key={location.id} className="hover:shadow-md transition-shadow duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg">{location.name}</CardTitle>
                      <Badge
                        variant="outline"
                        className={
                          location.status === "active"
                            ? "border-green-500 text-green-700 bg-green-50"
                            : location.status === "maintenance"
                              ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                              : "border-red-500 text-red-700 bg-red-50"
                        }
                      >
                        {location.status === "active"
                          ? "Activa"
                          : location.status === "maintenance"
                            ? "Mantenimiento"
                            : "Cerrada"}
                      </Badge>
                    </div>
                    <CardDescription>{location.appointmentsToday} citas programadas hoy</CardDescription>
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
                      <DropdownMenuItem>Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Archivar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{location.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    <span>{location.hours}</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {location.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewOnMap(location.address)}
                  >
                    Ver en mapa
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleViewAppointments(location.id)}
                  >
                    Ver citas
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
