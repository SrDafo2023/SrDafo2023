import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, ClockIcon, MapPinIcon, PlusIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AppointmentsPage() {
  const appointments = [
    {
      id: 1,
      service: "Baño y Corte",
      pet: "Firulais",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "confirmed",
      location: "Av. Principal 123, Ciudad",
      price: 35.99,
    },
    {
      id: 2,
      service: "Spa Completo",
      pet: "Luna",
      date: "2023-06-22",
      time: "2:30 PM",
      status: "pending",
      location: "Calle Secundaria 456, Ciudad",
      price: 49.99,
    },
    {
      id: 3,
      service: "Cuidado Dental",
      pet: "Rocky",
      date: "2023-06-10",
      time: "11:00 AM",
      status: "completed",
      location: "Plaza Central 789, Ciudad",
      price: 29.99,
    },
    {
      id: 4,
      service: "Corte de Uñas",
      pet: "Bella",
      date: "2023-06-05",
      time: "3:00 PM",
      status: "completed",
      location: "Av. Principal 123, Ciudad",
      price: 15.99,
    },
  ]

  const upcomingAppointments = appointments.filter((apt) => apt.status !== "completed")
  const pastAppointments = appointments.filter((apt) => apt.status === "completed")

  return (
    <div className="flex flex-col">
      <DashboardHeader role="user" title="Mis Citas" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Mis Citas</h2>
            <p className="text-muted-foreground">Gestiona las citas de tus mascotas</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nueva Cita
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Próximas Citas ({upcomingAppointments.length})</TabsTrigger>
            <TabsTrigger value="past">Historial ({pastAppointments.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{appointment.service}</CardTitle>
                        <Badge
                          variant="outline"
                          className={
                            appointment.status === "confirmed"
                              ? "border-green-500 text-green-700 bg-green-50"
                              : "border-yellow-500 text-yellow-700 bg-yellow-50"
                          }
                        >
                          {appointment.status === "confirmed" ? "Confirmada" : "Pendiente"}
                        </Badge>
                      </div>
                      <CardDescription>Mascota: {appointment.pet}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.location}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-bold text-lg">${appointment.price}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Reagendar
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes citas programadas</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Agenda una cita para el cuidado de tu mascota
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Agendar Cita
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="past" className="space-y-4">
            {pastAppointments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {pastAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{appointment.service}</CardTitle>
                        <Badge variant="outline" className="border-blue-500 text-blue-700 bg-blue-50">
                          Completada
                        </Badge>
                      </div>
                      <CardDescription>Mascota: {appointment.pet}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <ClockIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{appointment.location}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <span className="font-bold text-lg">${appointment.price}</span>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              Ver detalles
                            </Button>
                            <Button variant="outline" size="sm" className="bg-blue-600 text-white hover:bg-blue-700">
                              Repetir cita
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No tienes historial de citas</h3>
                  <p className="text-muted-foreground text-center">Aquí aparecerán las citas que hayas completado</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
