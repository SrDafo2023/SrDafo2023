import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CalendarIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AppointmentsPage() {
  const appointments = [
    {
      id: 1,
      client: "Juan Pérez",
      pet: "Firulais",
      service: "Baño y Corte",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "pending",
      location: "Av. Principal 123, Ciudad",
    },
    {
      id: 2,
      client: "María López",
      pet: "Luna",
      service: "Spa Completo",
      date: "2023-06-15",
      time: "11:30 AM",
      status: "pending",
      location: "Calle Secundaria 456, Ciudad",
    },
    {
      id: 3,
      client: "Carlos Rodríguez",
      pet: "Rocky",
      service: "Corte de Uñas",
      date: "2023-06-15",
      time: "1:00 PM",
      status: "in-progress",
      location: "Plaza Central 789, Ciudad",
    },
    {
      id: 4,
      client: "Ana Martínez",
      pet: "Bella",
      service: "Baño",
      date: "2023-06-15",
      time: "2:30 PM",
      status: "in-progress",
      location: "Av. Principal 123, Ciudad",
    },
    {
      id: 5,
      client: "Pedro Sánchez",
      pet: "Max",
      service: "Desparasitación",
      date: "2023-06-15",
      time: "4:00 PM",
      status: "completed",
      location: "Calle Secundaria 456, Ciudad",
    },
    {
      id: 6,
      client: "Laura Gómez",
      pet: "Coco",
      service: "Baño y Corte",
      date: "2023-06-16",
      time: "9:30 AM",
      status: "pending",
      location: "Plaza Central 789, Ciudad",
    },
    {
      id: 7,
      client: "Roberto Díaz",
      pet: "Toby",
      service: "Spa Completo",
      date: "2023-06-16",
      time: "11:00 AM",
      status: "pending",
      location: "Av. Principal 123, Ciudad",
    },
    {
      id: 8,
      client: "Carmen Flores",
      pet: "Lola",
      service: "Cuidado Dental",
      date: "2023-06-16",
      time: "2:00 PM",
      status: "pending",
      location: "Calle Secundaria 456, Ciudad",
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="grooming" title="Gestión de Citas" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Citas</h2>
            <p className="text-muted-foreground">Administra las citas de tus clientes</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nueva Cita
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar citas..." className="w-full pl-8 md:w-[300px]" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="in-progress">En proceso</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Hoy
            </Button>
            <Button variant="outline" className="w-full md:w-auto">
              Esta semana
            </Button>
          </div>
        </div>

        <Tabs defaultValue="list" className="space-y-4">
          <TabsList>
            <TabsTrigger value="list">Lista</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Citas Programadas</CardTitle>
                <CardDescription>Mostrando {appointments.length} citas programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col md:flex-row md:items-center gap-4 p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                          <p className="font-medium">{appointment.client}</p>
                          <Badge
                            variant="outline"
                            className={
                              appointment.status === "pending"
                                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                : appointment.status === "in-progress"
                                  ? "border-green-500 text-green-700 bg-green-50"
                                  : "border-blue-500 text-blue-700 bg-blue-50"
                            }
                          >
                            {appointment.status === "pending"
                              ? "Pendiente"
                              : appointment.status === "in-progress"
                                ? "En proceso"
                                : "Completado"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                          <p>
                            <span className="font-medium">Mascota:</span> {appointment.pet}
                          </p>
                          <p>
                            <span className="font-medium">Servicio:</span> {appointment.service}
                          </p>
                          <p>
                            <span className="font-medium">Fecha:</span> {appointment.date}, {appointment.time}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Ubicación:</span> {appointment.location}
                        </p>
                      </div>
                      <div className="flex gap-2 self-end md:self-center">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          className={
                            appointment.status === "pending"
                              ? "bg-blue-600 hover:bg-blue-700"
                              : appointment.status === "in-progress"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-600 hover:bg-gray-700"
                          }
                        >
                          {appointment.status === "pending"
                            ? "Iniciar"
                            : appointment.status === "in-progress"
                              ? "Completar"
                              : "Ver detalles"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Calendario de Citas</CardTitle>
                <CardDescription>Vista mensual de todas las citas programadas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] bg-muted/20 rounded-md flex items-center justify-center">
                  Aquí iría un componente de calendario con las citas programadas
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
