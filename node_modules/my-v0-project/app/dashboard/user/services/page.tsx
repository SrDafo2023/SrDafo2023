"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DogIcon, SearchIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ServicesPage() {
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const services = [
    {
      id: 1,
      name: "Baño y Corte Estándar",
      description: "Servicio completo de baño, secado y corte de pelo para tu mascota",
      price: 35.99,
      category: "grooming",
      duration: "1 hora",
    },
    {
      id: 2,
      name: "Spa Completo",
      description: "Tratamiento de spa que incluye baño con productos premium, masaje y aromaterapia",
      price: 49.99,
      category: "grooming",
      duration: "1.5 horas",
    },
    {
      id: 3,
      name: "Cuidado Dental",
      description: "Limpieza dental profesional para mantener la salud bucal de tu mascota",
      price: 29.99,
      category: "health",
      duration: "30 minutos",
    },
    {
      id: 4,
      name: "Corte de Uñas",
      description: "Servicio de corte y limado de uñas para evitar problemas de movilidad",
      price: 15.99,
      category: "grooming",
      duration: "15 minutos",
    },
    {
      id: 5,
      name: "Desparasitación",
      description: "Tratamiento preventivo contra parásitos internos y externos",
      price: 25.99,
      category: "health",
      duration: "20 minutos",
    },
    {
      id: 6,
      name: "Adiestramiento Básico",
      description: "Sesión de entrenamiento para enseñar comandos básicos a tu mascota",
      price: 39.99,
      category: "training",
      duration: "45 minutos",
    },
  ]

  const handleReservation = (service: any) => {
    setSelectedService(service)
    setIsReservationOpen(true)
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader role="user" title="Servicios Disponibles" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Servicios para tu Mascota</h2>
            <p className="text-muted-foreground">Explora nuestra variedad de servicios profesionales</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar servicios..."
                className="w-[200px] pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="grooming">Grooming</TabsTrigger>
            <TabsTrigger value="health">Salud</TabsTrigger>
            <TabsTrigger value="training">Entrenamiento</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardHeader className="pb-2">
                    <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-2">
                      <DogIcon className="h-12 w-12 text-blue-500" />
                    </div>
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between text-sm">
                        <span>Duración:</span>
                        <span className="font-medium">{service.duration}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">${service.price}</span>
                        <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                          <DialogTrigger asChild>
                            <Button
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleReservation(service)}
                            >
                              Reservar
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Reservar Servicio</DialogTitle>
                              <DialogDescription>
                                {selectedService?.name} - ${selectedService?.price}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid gap-2">
                                <Label>Fecha</Label>
                                <Calendar
                                  mode="single"
                                  selected={selectedDate}
                                  onSelect={setSelectedDate}
                                  className="rounded-md border"
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="time">Hora</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una hora" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="09:00">09:00 AM</SelectItem>
                                    <SelectItem value="10:00">10:00 AM</SelectItem>
                                    <SelectItem value="11:00">11:00 AM</SelectItem>
                                    <SelectItem value="14:00">02:00 PM</SelectItem>
                                    <SelectItem value="15:00">03:00 PM</SelectItem>
                                    <SelectItem value="16:00">04:00 PM</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="notes">Notas adicionales</Label>
                                <Textarea id="notes" placeholder="Información adicional sobre tu mascota..." />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsReservationOpen(false)}>
                                Cancelar
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => setIsReservationOpen(false)}
                              >
                                Confirmar Reserva
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="grooming" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((service) => service.category === "grooming")
                .map((service) => (
                  <Card key={service.id}>
                    <CardHeader className="pb-2">
                      <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-2">
                        <DogIcon className="h-12 w-12 text-blue-500" />
                      </div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span>Duración:</span>
                          <span className="font-medium">{service.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${service.price}</span>
                          <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                            <DialogTrigger asChild>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleReservation(service)}
                              >
                                Reservar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Reservar Servicio</DialogTitle>
                                <DialogDescription>
                                  {selectedService?.name} - ${selectedService?.price}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Fecha</Label>
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="time">Hora</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona una hora" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="09:00">09:00 AM</SelectItem>
                                      <SelectItem value="10:00">10:00 AM</SelectItem>
                                      <SelectItem value="11:00">11:00 AM</SelectItem>
                                      <SelectItem value="14:00">02:00 PM</SelectItem>
                                      <SelectItem value="15:00">03:00 PM</SelectItem>
                                      <SelectItem value="16:00">04:00 PM</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="notes">Notas adicionales</Label>
                                  <Textarea id="notes" placeholder="Información adicional sobre tu mascota..." />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReservationOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => setIsReservationOpen(false)}
                                >
                                  Confirmar Reserva
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="health" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((service) => service.category === "health")
                .map((service) => (
                  <Card key={service.id}>
                    <CardHeader className="pb-2">
                      <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-2">
                        <DogIcon className="h-12 w-12 text-blue-500" />
                      </div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span>Duración:</span>
                          <span className="font-medium">{service.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${service.price}</span>
                          <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                            <DialogTrigger asChild>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleReservation(service)}
                              >
                                Reservar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Reservar Servicio</DialogTitle>
                                <DialogDescription>
                                  {selectedService?.name} - ${selectedService?.price}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Fecha</Label>
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="time">Hora</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona una hora" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="09:00">09:00 AM</SelectItem>
                                      <SelectItem value="10:00">10:00 AM</SelectItem>
                                      <SelectItem value="11:00">11:00 AM</SelectItem>
                                      <SelectItem value="14:00">02:00 PM</SelectItem>
                                      <SelectItem value="15:00">03:00 PM</SelectItem>
                                      <SelectItem value="16:00">04:00 PM</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="notes">Notas adicionales</Label>
                                  <Textarea id="notes" placeholder="Información adicional sobre tu mascota..." />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReservationOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => setIsReservationOpen(false)}
                                >
                                  Confirmar Reserva
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="training" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services
                .filter((service) => service.category === "training")
                .map((service) => (
                  <Card key={service.id}>
                    <CardHeader className="pb-2">
                      <div className="h-40 bg-blue-100 rounded-md flex items-center justify-center mb-2">
                        <DogIcon className="h-12 w-12 text-blue-500" />
                      </div>
                      <CardTitle>{service.name}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between text-sm">
                          <span>Duración:</span>
                          <span className="font-medium">{service.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">${service.price}</span>
                          <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
                            <DialogTrigger asChild>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleReservation(service)}
                              >
                                Reservar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>Reservar Servicio</DialogTitle>
                                <DialogDescription>
                                  {selectedService?.name} - ${selectedService?.price}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Fecha</Label>
                                  <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-md border"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="time">Hora</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecciona una hora" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="09:00">09:00 AM</SelectItem>
                                      <SelectItem value="10:00">10:00 AM</SelectItem>
                                      <SelectItem value="11:00">11:00 AM</SelectItem>
                                      <SelectItem value="14:00">02:00 PM</SelectItem>
                                      <SelectItem value="15:00">03:00 PM</SelectItem>
                                      <SelectItem value="16:00">04:00 PM</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="notes">Notas adicionales</Label>
                                  <Textarea id="notes" placeholder="Información adicional sobre tu mascota..." />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setIsReservationOpen(false)}>
                                  Cancelar
                                </Button>
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700"
                                  onClick={() => setIsReservationOpen(false)}
                                >
                                  Confirmar Reserva
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
