import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { CalendarIcon, DogIcon, HomeIcon, UsersIcon, TrendingUpIcon, DollarSignIcon, StarIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

export default function GroomingDashboard() {
  return (
    <div className="flex flex-col">
      <DashboardHeader role="grooming" title="Panel de Servicios Grooming" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        {/* Carousel Section */}
        <div className="w-full px-12">
          <Carousel className="w-full">
            <CarouselContent>
              {/* Slide 1: Resumen de Ingresos */}
              <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSignIcon className="h-5 w-5 text-green-500" />
                      Resumen de Ingresos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">$1,250</p>
                        <p className="text-sm text-muted-foreground">Hoy</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">$8,750</p>
                        <p className="text-sm text-muted-foreground">Esta Semana</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">$32,500</p>
                        <p className="text-sm text-muted-foreground">Este Mes</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              {/* Slide 2: Estadísticas de Servicios */}
              <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUpIcon className="h-5 w-5 text-blue-500" />
                      Estadísticas de Servicios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">85%</p>
                        <p className="text-sm text-muted-foreground">Ocupación</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">45</p>
                        <p className="text-sm text-muted-foreground">Servicios/Semana</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">4.8</p>
                        <p className="text-sm text-muted-foreground">Calificación</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>

              {/* Slide 3: Servicios Populares */}
              <CarouselItem>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                      Servicios Más Populares
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>Baño y Corte</span>
                        <Badge variant="secondary">45%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Spa Completo</span>
                        <Badge variant="secondary">30%</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Corte de Uñas</span>
                        <Badge variant="secondary">25%</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Citas Hoy</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Servicios Activos</CardTitle>
              <DogIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 desde el mes pasado</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">145</div>
              <p className="text-xs text-muted-foreground">+12 nuevos este mes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ubicaciones</CardTitle>
              <HomeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Todas activas</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appointments" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointments">Citas de Hoy</TabsTrigger>
            <TabsTrigger value="calendar">Calendario</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
          </TabsList>
          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Próximas Citas</CardTitle>
                <CardDescription>Citas programadas para hoy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <DogIcon className="h-6 w-6 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {["Baño y Corte", "Spa Completo", "Corte de Uñas", "Baño", "Desparasitación"][i]}
                          </p>
                          <Badge
                            variant="outline"
                            className={
                              i < 2
                                ? "border-yellow-500 text-yellow-700 bg-yellow-50"
                                : i < 4
                                  ? "border-green-500 text-green-700 bg-green-50"
                                  : "border-blue-500 text-blue-700 bg-blue-50"
                            }
                          >
                            {i < 2 ? "Pendiente" : i < 4 ? "En proceso" : "Completado"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Cliente:{" "}
                          {["Juan Pérez", "María López", "Carlos Rodríguez", "Ana Martínez", "Pedro Sánchez"][i]}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Hora: {["10:00 AM", "11:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"][i]}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Detalles
                      </Button>
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
                <div className="h-[400px] bg-muted/20 rounded-md flex items-center justify-center">
                  Aquí iría un componente de calendario con las citas programadas
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Servicios Disponibles</CardTitle>
                <CardDescription>Lista de servicios que ofreces</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Baño y Corte Estándar", "Spa Completo", "Cuidado Dental", "Corte de Uñas", "Desparasitación"].map(
                    (service, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-12 h-12 rounded-md bg-blue-100 flex items-center justify-center">
                          <DogIcon className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{service}</p>
                          <p className="text-sm text-muted-foreground">
                            Duración: {["1 hora", "1.5 horas", "30 minutos", "15 minutos", "20 minutos"][i]}
                          </p>
                        </div>
                        <div className="text-lg font-bold">${[35.99, 49.99, 29.99, 15.99, 25.99][i]}</div>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Ubicaciones de Servicio</CardTitle>
              <CardDescription>Direcciones donde ofreces servicios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["Av. Principal 123, Ciudad", "Calle Secundaria 456, Ciudad", "Plaza Central 789, Ciudad"].map(
                  (location, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <HomeIcon className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">Ubicación {i + 1}</p>
                        <p className="text-sm text-muted-foreground">{location}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Ver mapa
                      </Button>
                    </div>
                  ),
                )}
              </div>
              <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Agregar Nueva Ubicación</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clientes Recientes</CardTitle>
              <CardDescription>Últimos clientes atendidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <UsersIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {["Juan Pérez", "María López", "Carlos Rodríguez", "Ana Martínez", "Pedro Sánchez"][i]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Mascota: {["Firulais", "Luna", "Rocky", "Bella", "Max"][i]}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      Ver historial
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
