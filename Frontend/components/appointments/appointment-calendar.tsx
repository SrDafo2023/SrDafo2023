"use client"

import { useState } from "react"
import { Appointment } from "@/types/appointment.types"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AppointmentCalendarProps {
  appointments: Appointment[]
  onStatusUpdate: (appointmentId: string, status: string) => void
  loading: boolean
}

export function AppointmentCalendar({
  appointments,
  onStatusUpdate,
  loading,
}: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getStatusBadgeStyle = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
      confirmed: "bg-blue-100 text-blue-800 border-blue-300",
      completed: "bg-green-100 text-green-800 border-green-300",
      cancelled: "bg-red-100 text-red-800 border-red-300",
      "no-show": "bg-gray-100 text-gray-800 border-gray-300",
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const getActionButton = (appointment: Appointment) => {
    switch (appointment.status) {
      case "pending":
        return (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(appointment.id, "confirmed")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Confirmar
          </Button>
        )
      case "confirmed":
        return (
          <Button
            size="sm"
            onClick={() => onStatusUpdate(appointment.id, "completed")}
            className="bg-green-600 hover:bg-green-700"
          >
            Completar
          </Button>
        )
      case "completed":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onStatusUpdate(appointment.id, "confirmed")}
          >
            Reabrir
          </Button>
        )
      default:
        return null
    }
  }

  const selectedDayAppointments = appointments.filter(appointment => {
    if (!selectedDate) return false
    const appointmentDate = appointment.date
    return (
      appointmentDate.getDate() === selectedDate.getDate() &&
      appointmentDate.getMonth() === selectedDate.getMonth() &&
      appointmentDate.getFullYear() === selectedDate.getFullYear()
    )
  }).sort((a, b) => a.date.getTime() - b.date.getTime())

  if (loading) {
    return <div className="text-center py-4">Cargando calendario...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Calendario de Citas</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
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
          <CardTitle>
            Citas del{" "}
            {selectedDate
              ? format(selectedDate, "d 'de' MMMM", { locale: es })
              : "día"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {selectedDayAppointments.length > 0 ? (
              <div className="space-y-4">
                {selectedDayAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-4 border rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{appointment.clientName}</p>
                      <Badge className={getStatusBadgeStyle(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Hora:</span>{" "}
                      {format(appointment.date, "h:mm a", { locale: es })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Mascota:</span>{" "}
                      {appointment.petName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Servicio:</span>{" "}
                      {appointment.serviceName}
                    </p>
                    {appointment.notes && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium">Notas:</span>{" "}
                        {appointment.notes}
                      </p>
                    )}
                    <div className="flex justify-end gap-2 pt-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {getActionButton(appointment)}
                    </div>
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
  )
} 