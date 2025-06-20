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
import { CameraIcon, SettingsIcon, BellIcon, ShieldIcon, DatabaseIcon } from "lucide-react"

export default function AdminSettingsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader role="admin" title="Configuración del Sistema" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">Administra la configuración global del sistema</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="system">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  Configuración General
                </CardTitle>
                <CardDescription>Configuración básica del sistema PetHelp</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-logo.jpg" />
                    <AvatarFallback>PH</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Cambiar logo
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="systemName">Nombre del sistema</Label>
                    <Input id="systemName" defaultValue="PetHelp" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemEmail">Email de contacto</Label>
                    <Input id="systemEmail" type="email" defaultValue="admin@pethelp.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemPhone">Teléfono de soporte</Label>
                    <Input id="systemPhone" defaultValue="+1 800 PET HELP" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="systemWebsite">Sitio web</Label>
                    <Input id="systemWebsite" defaultValue="www.pethelp.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="systemDescription">Descripción del sistema</Label>
                  <Textarea
                    id="systemDescription"
                    defaultValue="PetHelp es un sistema integral para la gestión de servicios y productos para mascotas."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona horaria</Label>
                    <Select defaultValue="utc-5">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc-5">UTC-5 (América/Lima)</SelectItem>
                        <SelectItem value="utc-3">UTC-3 (América/Santiago)</SelectItem>
                        <SelectItem value="utc-6">UTC-6 (América/México)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma predeterminado</Label>
                    <Select defaultValue="es">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Guardar cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Usuarios</CardTitle>
                <CardDescription>Ajustes para la gestión de usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Registro automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que los usuarios se registren automáticamente
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Verificación de email</Label>
                    <p className="text-sm text-muted-foreground">Requerir verificación de email para nuevos usuarios</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Aprobación manual</Label>
                    <p className="text-sm text-muted-foreground">Los nuevos PetShops requieren aprobación manual</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxUsers">Máximo de usuarios por PetShop</Label>
                  <Input id="maxUsers" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de sesión (minutos)</Label>
                  <Input id="sessionTimeout" type="number" defaultValue="120" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5" />
                  Configuración de Notificaciones
                </CardTitle>
                <CardDescription>Ajustes globales para notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    {
                      id: "emailNotifications",
                      label: "Notificaciones por email",
                      description: "Enviar notificaciones importantes por correo electrónico",
                    },
                    {
                      id: "smsNotifications",
                      label: "Notificaciones SMS",
                      description: "Enviar alertas críticas por mensaje de texto",
                    },
                    {
                      id: "systemAlerts",
                      label: "Alertas del sistema",
                      description: "Notificaciones sobre el estado del sistema",
                    },
                    {
                      id: "maintenanceAlerts",
                      label: "Alertas de mantenimiento",
                      description: "Notificar sobre mantenimientos programados",
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emailServer">Servidor SMTP</Label>
                    <Input id="emailServer" defaultValue="smtp.pethelp.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailPort">Puerto SMTP</Label>
                    <Input id="emailPort" type="number" defaultValue="587" />
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
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>Ajustes de seguridad y protección del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación de dos factores obligatoria</Label>
                    <p className="text-sm text-muted-foreground">Requerir 2FA para todos los administradores</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bloqueo por intentos fallidos</Label>
                    <p className="text-sm text-muted-foreground">
                      Bloquear cuentas después de varios intentos fallidos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAttempts">Máximo intentos de login</Label>
                  <Input id="maxAttempts" type="number" defaultValue="5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lockoutTime">Tiempo de bloqueo (minutos)</Label>
                  <Input id="lockoutTime" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Política de contraseñas</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Básica (6 caracteres)</SelectItem>
                      <SelectItem value="medium">Media (8 caracteres + números)</SelectItem>
                      <SelectItem value="strong">Fuerte (8 caracteres + números + símbolos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DatabaseIcon className="h-5 w-5" />
                  Configuración del Sistema
                </CardTitle>
                <CardDescription>Ajustes técnicos y de rendimiento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo de mantenimiento</Label>
                    <p className="text-sm text-muted-foreground">Activar modo de mantenimiento del sistema</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Logs detallados</Label>
                    <p className="text-sm text-muted-foreground">Registrar actividad detallada del sistema</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Frecuencia de respaldos</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Cada hora</SelectItem>
                      <SelectItem value="daily">Diario</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cacheTime">Tiempo de caché (minutos)</Label>
                  <Input id="cacheTime" type="number" defaultValue="60" />
                </div>
                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-4">Información del Sistema</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium">Versión:</p>
                      <p className="text-muted-foreground">PetHelp v2.1.0</p>
                    </div>
                    <div>
                      <p className="font-medium">Base de datos:</p>
                      <p className="text-muted-foreground">PostgreSQL 14.2</p>
                    </div>
                    <div>
                      <p className="font-medium">Última actualización:</p>
                      <p className="text-muted-foreground">15 de junio, 2023</p>
                    </div>
                    <div>
                      <p className="font-medium">Uptime:</p>
                      <p className="text-muted-foreground">15 días, 8 horas</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="bg-purple-600 hover:bg-purple-700">Guardar configuración</Button>
                  <Button variant="outline">Crear respaldo</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
