"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CameraIcon, DogIcon, BellIcon, ShieldIcon, CalendarIcon } from "lucide-react"

export default function GroomingSettingsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader role="grooming" title="Configuración de Grooming" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">Administra la configuración de tu servicio de grooming</p>
        </div>

        <Tabs defaultValue="business" className="space-y-4">
          <TabsList>
            <TabsTrigger value="business">Negocio</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="schedule">Horarios</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="business" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DogIcon className="h-5 w-5" />
                  Información del Negocio
                </CardTitle>
                <CardDescription>Configura los datos básicos de tu servicio de grooming</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-grooming.jpg" />
                    <AvatarFallback>GS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Cambiar logo
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nombre del negocio</Label>
                    <Input id="businessName" defaultValue="Grooming Premium" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessEmail">Email de contacto</Label>
                    <Input id="businessEmail" type="email" defaultValue="contacto@grooming.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessPhone">Teléfono</Label>
                    <Input id="businessPhone" defaultValue="+1 234 567 8900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessWebsite">Sitio web</Label>
                    <Input id="businessWebsite" defaultValue="www.grooming.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Dirección principal</Label>
                  <Textarea id="businessAddress" defaultValue="Av. Principal 123, Ciudad, Estado 12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Descripción del servicio</Label>
                  <Textarea
                    id="businessDescription"
                    defaultValue="Ofrecemos servicios profesionales de grooming para mascotas con más de 5 años de experiencia."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceRadius">Radio de servicio (km)</Label>
                    <Input id="serviceRadius" type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">Teléfono de emergencia</Label>
                    <Input id="emergencyPhone" defaultValue="+1 234 567 8999" />
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Guardar cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Servicios</CardTitle>
                <CardDescription>Ajustes generales para tus servicios de grooming</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Servicios a domicilio</Label>
                    <p className="text-sm text-muted-foreground">Ofrecer servicios en el hogar del cliente</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Servicios de emergencia</Label>
                    <p className="text-sm text-muted-foreground">Atender emergencias fuera del horario normal</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Descuentos por múltiples mascotas</Label>
                    <p className="text-sm text-muted-foreground">
                      Aplicar descuentos cuando el cliente tenga varias mascotas
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minAdvanceBooking">Reserva mínima con anticipación (horas)</Label>
                  <Input id="minAdvanceBooking" type="number" defaultValue="24" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceBooking">Reserva máxima con anticipación (días)</Label>
                  <Input id="maxAdvanceBooking" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationPolicy">Política de cancelación (horas)</Label>
                  <Input id="cancellationPolicy" type="number" defaultValue="12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultDuration">Duración predeterminada (minutos)</Label>
                  <Input id="defaultDuration" type="number" defaultValue="60" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Configuración de Horarios
                </CardTitle>
                <CardDescription>Define tus horarios de trabajo y disponibilidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { day: "Lunes", enabled: true, start: "08:00", end: "18:00" },
                    { day: "Martes", enabled: true, start: "08:00", end: "18:00" },
                    { day: "Miércoles", enabled: true, start: "08:00", end: "18:00" },
                    { day: "Jueves", enabled: true, start: "08:00", end: "18:00" },
                    { day: "Viernes", enabled: true, start: "08:00", end: "18:00" },
                    { day: "Sábado", enabled: true, start: "09:00", end: "15:00" },
                    { day: "Domingo", enabled: false, start: "09:00", end: "15:00" },
                  ].map((schedule, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 border rounded-lg">
                      <div className="w-20">
                        <Label>{schedule.day}</Label>
                      </div>
                      <Switch defaultChecked={schedule.enabled} />
                      <div className="flex items-center gap-2">
                        <Input type="time" defaultValue={schedule.start} className="w-32" />
                        <span>-</span>
                        <Input type="time" defaultValue={schedule.end} className="w-32" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Configuración adicional</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slotDuration">Duración de slots (minutos)</Label>
                      <Select defaultValue="30">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">60 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bufferTime">Tiempo de buffer (minutos)</Label>
                      <Input id="bufferTime" type="number" defaultValue="15" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5" />
                  Preferencias de Notificación
                </CardTitle>
                <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    {
                      id: "newBookings",
                      label: "Nuevas reservas",
                      description: "Notificaciones cuando recibas nuevas reservas",
                    },
                    {
                      id: "cancellations",
                      label: "Cancelaciones",
                      description: "Alertas cuando los clientes cancelen citas",
                    },
                    {
                      id: "reminders",
                      label: "Recordatorios de citas",
                      description: "Recordatorios antes de cada cita programada",
                    },
                    {
                      id: "reviews",
                      label: "Nuevas reseñas",
                      description: "Notificaciones sobre reseñas de clientes",
                    },
                    {
                      id: "payments",
                      label: "Pagos recibidos",
                      description: "Confirmaciones de pagos procesados",
                    },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <Switch id={item.id} defaultChecked />
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Métodos de notificación</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones por email</Label>
                        <p className="text-sm text-muted-foreground">Recibe notificaciones en tu correo</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones SMS</Label>
                        <p className="text-sm text-muted-foreground">Recibe alertas importantes por SMS</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Notificaciones push</Label>
                        <p className="text-sm text-muted-foreground">Notificaciones en tiempo real en la app</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldIcon className="h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>Administra la seguridad de tu cuenta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña actual</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">Cambiar contraseña</Button>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Autenticación de dos factores</h4>
                      <p className="text-sm text-muted-foreground">Agrega una capa extra de seguridad</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Sesiones activas</h4>
                  <div className="space-y-3">
                    {[
                      { device: "Chrome en Windows", location: "Ciudad, País", lastActive: "Ahora" },
                      { device: "Safari en iPhone", location: "Ciudad, País", lastActive: "Hace 1 hora" },
                    ].map((session, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{session.device}</p>
                          <p className="text-sm text-muted-foreground">
                            {session.location} • {session.lastActive}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Cerrar sesión
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
