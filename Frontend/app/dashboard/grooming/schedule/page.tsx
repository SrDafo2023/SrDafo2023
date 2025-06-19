"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Scissors, Clock, Users } from "lucide-react"
import { appointmentService } from "@/lib/appointment-service"
import { Appointment } from "@/types/appointment.types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function SchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("day")
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (date) {
          // Obtener el primer y último día del mes
          const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
          const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)
          
          const monthAppointments = await appointmentService.getByDateRange(
            startOfMonth,
            endOfMonth
          )
          setAppointments(monthAppointments)
        }
      } catch (error) {
        console.error("Error al cargar las citas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [date?.getMonth(), date?.getFullYear()])

  // Filtrar citas para el día seleccionado
  const selectedDayAppointments = appointments.filter(appointment => {
    if (!date) return false
    const appointmentDate = appointment.date
    return (
      appointmentDate.getDate() === date.getDate() &&
      appointmentDate.getMonth() === date.getMonth() &&
      appointmentDate.getFullYear() === date.getFullYear()
    )
  })

  // Función para formatear la hora
  const formatTime = (date: Date) => {
    return format(date, "h:mm a", { locale: es })
  }

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-500",
      confirmed: "bg-green-500",
      completed: "bg-blue-500",
      cancelled: "bg-red-500",
      "no-show": "bg-gray-500",
    }
    return statusColors[status as keyof typeof statusColors] || "bg-gray-500"
  }

  if (loading) {
    return <div className="p-6">Cargando horarios...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Horarios</h1>
          <p className="text-muted-foreground">Gestiona las citas y horarios disponibles</p>
        </div>
        <Select value={view} onValueChange={(value: "day" | "week" | "month") => setView(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecciona vista" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Vista Diaria</SelectItem>
            <SelectItem value="week">Vista Semanal</SelectItem>
            <SelectItem value="month">Vista Mensual</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Calendario</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              locale={es}
              modifiers={{
                booked: appointments.map(apt => apt.date),
              }}
              modifiersStyles={{
                booked: { color: 'white', backgroundColor: '#3b82f6' }
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citas del Día</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              {selectedDayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {selectedDayAppointments
                    .sort((a, b) => a.date.getTime() - b.date.getTime())
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-4 border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTime(appointment.date)}</span>
                          </div>
                          <Badge
                            className={getStatusColor(appointment.status)}
                          >
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Scissors className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.serviceName}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Mascota: {appointment.petName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Duración: {appointment.duration} min
                        </div>
                        {appointment.notes && (
                          <div className="text-sm text-muted-foreground">
                            Notas: {appointment.notes}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  No hay citas programadas para este día
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 