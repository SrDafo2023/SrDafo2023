"use client"

import { Appointment } from "@/types/appointment.types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface AppointmentListProps {
  appointments: Appointment[]
  onStatusUpdate: (appointmentId: string, status: string) => void
  loading: boolean
}

export function AppointmentList({
  appointments,
  onStatusUpdate,
  loading,
}: AppointmentListProps) {
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
            onClick={() => onStatusUpdate(appointment.id, "confirmed")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Confirmar
          </Button>
        )
      case "confirmed":
        return (
          <Button
            onClick={() => onStatusUpdate(appointment.id, "completed")}
            className="bg-green-600 hover:bg-green-700"
          >
            Completar
          </Button>
        )
      case "completed":
        return (
          <Button
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

  if (loading) {
    return <div className="text-center py-4">Cargando citas...</div>
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No hay citas programadas
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Citas Programadas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex flex-col md:flex-row md:items-center gap-4 p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <p className="font-medium">{appointment.clientName}</p>
                  <Badge className={getStatusBadgeStyle(appointment.status)}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                  <p>
                    <span className="font-medium">Mascota:</span> {appointment.petName}
                  </p>
                  <p>
                    <span className="font-medium">Servicio:</span>{" "}
                    {appointment.serviceName}
                  </p>
                  <p>
                    <span className="font-medium">Fecha:</span>{" "}
                    {format(appointment.date, "PPpp", { locale: es })}
                  </p>
                </div>
                {appointment.notes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="font-medium">Notas:</span> {appointment.notes}
                  </p>
                )}
              </div>
              <div className="flex gap-2 self-end md:self-center">
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                {getActionButton(appointment)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 