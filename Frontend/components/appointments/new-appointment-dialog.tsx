"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { appointmentService } from "@/lib/appointment-service"

interface NewAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAppointmentCreated: () => void
}

export function NewAppointmentDialog({
  open,
  onOpenChange,
  onAppointmentCreated,
}: NewAppointmentDialogProps) {
  const [loading, setLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [clientId, setClientId] = useState("")
  const [petId, setPetId] = useState("")
  const [serviceId, setServiceId] = useState("")
  const [notes, setNotes] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !time || !clientId || !petId || !serviceId) {
      return
    }

    try {
      setLoading(true)
      const [hours, minutes] = time.split(":")
      const appointmentDate = new Date(date)
      appointmentDate.setHours(parseInt(hours), parseInt(minutes))

      await appointmentService.create({
        clientId,
        petId,
        serviceId,
        date: appointmentDate,
        notes,
      })

      onAppointmentCreated()
      onOpenChange(false)
      resetForm()
    } catch (error) {
      console.error("Error al crear la cita:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setDate(undefined)
    setTime("")
    setClientId("")
    setPetId("")
    setServiceId("")
    setNotes("")
  }

  // TODO: Obtener estos datos de la base de datos
  const clients = [
    { id: "1", name: "Juan Pérez" },
    { id: "2", name: "María López" },
  ]

  const pets = [
    { id: "1", name: "Firulais", clientId: "1" },
    { id: "2", name: "Luna", clientId: "2" },
  ]

  const services = [
    { id: "1", name: "Baño y Corte", duration: 60 },
    { id: "2", name: "Spa Completo", duration: 90 },
    { id: "3", name: "Corte de Uñas", duration: 30 },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Nueva Cita</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Columna Izquierda */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pet">Mascota</Label>
              <Select value={petId} onValueChange={setPetId} disabled={!clientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar mascota" />
                </SelectTrigger>
                <SelectContent>
                  {pets
                    .filter((pet) => pet.clientId === clientId)
                    .map((pet) => (
                      <SelectItem key={pet.id} value={pet.id}>
                        {pet.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Servicio</Label>
              <Select value={serviceId} onValueChange={setServiceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service.id} value={service.id}>
                      {service.name} ({service.duration} min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notas</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionales..."
                className="h-24"
              />
            </div>
          </div>

          {/* Columna Derecha */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                locale={es}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="md:col-span-2 flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Cita"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 