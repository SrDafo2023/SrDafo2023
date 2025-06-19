"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Star, Calendar, MapPin, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GroomingPage() {
  const { toast } = useToast()
  const [isReservationOpen, setIsReservationOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedTime, setSelectedTime] = useState<string>("")

  const services = [
    {
      id: 1,
      name: "Baño y Secado Completo",
      price: "$15.990",
      originalPrice: "$19.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
      rating: 5,
      duration: "1-2 horas",
      description: "Baño con shampoo especializado, secado y cepillado",
    },
    {
      id: 2,
      name: "Corte de Pelo Profesional",
      price: "$25.990",
      originalPrice: "$32.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
      rating: 5,
      duration: "2-3 horas",
      description: "Corte según raza y preferencias del cliente",
    },
    {
      id: 3,
      name: "Corte de Uñas",
      price: "$5.990",
      originalPrice: "$8.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300&fit=crop",
      rating: 4,
      duration: "30 min",
      description: "Corte profesional de uñas con lima",
    },
    {
      id: 4,
      name: "Limpieza Dental",
      price: "$12.990",
      originalPrice: "$16.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
      rating: 5,
      duration: "45 min",
      description: "Limpieza dental profesional sin anestesia",
    },
    {
      id: 5,
      name: "Paquete Completo",
      price: "$45.990",
      originalPrice: "$59.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
      rating: 5,
      duration: "3-4 horas",
      description: "Baño, corte, uñas, limpieza dental y más",
    },
    {
      id: 6,
      name: "Tratamiento Antipulgas",
      price: "$18.990",
      originalPrice: "$24.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop",
      rating: 4,
      duration: "1 hora",
      description: "Tratamiento completo contra pulgas y garrapatas",
    },
  ]

  const handleReservation = (service: any) => {
    setSelectedService(service)
    setIsReservationOpen(true)
  }

  const handleConfirmReservation = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Error",
        description: "Por favor selecciona fecha y hora",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Reserva confirmada",
      description: `Has reservado ${selectedService?.name} para el ${selectedDate} a las ${selectedTime}`,
    })
    setIsReservationOpen(false)
    setSelectedDate("")
    setSelectedTime("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-6xl">✂️</span>
            <div>
              <h1 className="text-4xl font-bold">Servicios de Grooming</h1>
              <p className="text-xl text-purple-100">Cuidado profesional para tu mascota</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Servicio a domicilio disponible</h3>
              <p className="text-blue-600">Agenda tu cita y nuestros profesionales irán a tu hogar</p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{service.discount}</Badge>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{service.duration}</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-purple-600">{service.price}</span>
                  <span className="text-sm text-gray-500 line-through">{service.originalPrice}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < service.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({service.rating})</span>
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleReservation(service)}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Cita
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reservation Dialog */}
        <Dialog open={isReservationOpen} onOpenChange={setIsReservationOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reservar Servicio</DialogTitle>
              <DialogDescription>
                {selectedService?.name} - {selectedService?.price}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="date">Fecha</Label>
                <input
                  id="date"
                  type="date"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="time">Hora</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
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
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleConfirmReservation}>
                Confirmar Reserva
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Contact Info */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">¿Necesitas más información?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📞</div>
              <h3 className="font-semibold">Llámanos</h3>
              <p className="text-gray-600">(+56) 2 2760 7777</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold">WhatsApp</h3>
              <p className="text-gray-600">(+56) 9 7214 9999</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600">grooming@pethelp.cl</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
