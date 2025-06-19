"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Calendar as CalendarIcon } from "lucide-react"
import { appointmentService } from "@/lib/appointment-service"
import { Appointment } from "@/types/appointment.types"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { AppointmentList } from "@/components/appointments/appointment-list"
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar"
import { NewAppointmentDialog } from "@/components/appointments/new-appointment-dialog"

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<"today" | "week" | "all">("all")
  const [showNewAppointmentDialog, setShowNewAppointmentDialog] = useState(false)

  useEffect(() => {
    loadAppointments()
  }, [dateFilter])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      let startDate, endDate
      
      if (dateFilter === "today") {
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setHours(23, 59, 59, 999)
      } else if (dateFilter === "week") {
        startDate = new Date()
        startDate.setHours(0, 0, 0, 0)
        endDate = new Date()
        endDate.setDate(endDate.getDate() + 7)
        endDate.setHours(23, 59, 59, 999)
      }

      let fetchedAppointments
      if (startDate && endDate) {
        fetchedAppointments = await appointmentService.getByDateRange(startDate, endDate)
      } else {
        fetchedAppointments = await appointmentService.getAll()
      }
      setAppointments(fetchedAppointments)
    } catch (error) {
      console.error("Error al cargar las citas:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || appointment.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleAppointmentUpdate = async (appointmentId: string, status: string) => {
    try {
      await appointmentService.update({
        id: appointmentId,
        status: status as any,
      })
      await loadAppointments()
    } catch (error) {
      console.error("Error al actualizar la cita:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Citas</h1>
          <p className="text-muted-foreground">
            Administra las citas de tus clientes
          </p>
        </div>
        <Button onClick={() => setShowNewAppointmentDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Cita
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <Input
          placeholder="Buscar citas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendiente</SelectItem>
            <SelectItem value="confirmed">Confirmado</SelectItem>
            <SelectItem value="completed">Completado</SelectItem>
            <SelectItem value="cancelled">Cancelado</SelectItem>
            <SelectItem value="no-show">No asistió</SelectItem>
          </SelectContent>
        </Select>
        <Select value={dateFilter} onValueChange={(value: any) => setDateFilter(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por fecha" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las fechas</SelectItem>
            <SelectItem value="today">Hoy</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList>
          <TabsTrigger value="list">Lista</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="mt-4">
          <AppointmentList
            appointments={filteredAppointments}
            onStatusUpdate={handleAppointmentUpdate}
            loading={loading}
          />
        </TabsContent>
        <TabsContent value="calendar" className="mt-4">
          <AppointmentCalendar
            appointments={filteredAppointments}
            onStatusUpdate={handleAppointmentUpdate}
            loading={loading}
          />
        </TabsContent>
      </Tabs>

      <NewAppointmentDialog
        open={showNewAppointmentDialog}
        onOpenChange={setShowNewAppointmentDialog}
        onAppointmentCreated={loadAppointments}
      />
    </div>
  )
}
