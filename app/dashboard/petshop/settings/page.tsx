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
import { CameraIcon, StoreIcon, BellIcon, ShieldIcon } from "lucide-react"

export default function PetshopSettingsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader role="petshop" title="Configuración de PetShop" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">Administra la configuración de tu tienda</p>
        </div>

        <Tabs defaultValue="store" className="space-y-4">
          <TabsList>
            <TabsTrigger value="store">Tienda</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          <TabsContent value="store" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <StoreIcon className="h-5 w-5" />
                  Información de la Tienda
                </CardTitle>
                <CardDescription>Configura los datos básicos de tu PetShop</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-store.jpg" />
                    <AvatarFallback>PS</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Cambiar logo
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nombre de la tienda</Label>
                    <Input id="storeName" defaultValue="Mi PetShop" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Email de contacto</Label>
                    <Input id="storeEmail" type="email" defaultValue="contacto@mipetshop.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Teléfono</Label>
                    <Input id="storePhone" defaultValue="+1 234 567 8900" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeWebsite">Sitio web</Label>
                    <Input id="storeWebsite" defaultValue="www.mipetshop.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeAddress">Dirección</Label>
                  <Textarea id="storeAddress" defaultValue="Av. Principal 123, Ciudad, Estado 12345" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Descripción</Label>
                  <Textarea
                    id="storeDescription"
                    defaultValue="Somos una tienda especializada en productos para mascotas con más de 10 años de experiencia."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openTime">Hora de apertura</Label>
                    <Input id="openTime" type="time" defaultValue="08:00" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closeTime">Hora de cierre</Label>
                    <Input id="closeTime" type="time" defaultValue="18:00" />
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Guardar cambios</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Configuración de Productos</CardTitle>
                <CardDescription>Ajustes generales para la gestión de productos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mostrar productos agotados</Label>
                    <p className="text-sm text-muted-foreground">Permite que los clientes vean productos sin stock</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de stock bajo</Label>
                    <p className="text-sm text-muted-foreground">Recibe notificaciones cuando el stock esté bajo</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStockThreshold">Umbral de stock bajo</Label>
                  <Input id="lowStockThreshold" type="number" defaultValue="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="clp">CLP ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Actualiza tu información de perfil</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>PM</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Cambiar foto
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" defaultValue="PetShop" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" defaultValue="Manager" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" defaultValue="manager@petshop.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono personal</Label>
                    <Input id="phone" defaultValue="+1 234 567 8901" />
                  </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">Guardar cambios</Button>
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
                      id: "newOrders",
                      label: "Nuevos pedidos",
                      description: "Notificaciones cuando recibas nuevos pedidos",
                    },
                    {
                      id: "lowStock",
                      label: "Stock bajo",
                      description: "Alertas cuando los productos tengan poco stock",
                    },
                    {
                      id: "newReviews",
                      label: "Nuevas reseñas",
                      description: "Notificaciones sobre reseñas de productos",
                    },
                    {
                      id: "salesReports",
                      label: "Reportes de ventas",
                      description: "Resúmenes diarios y semanales de ventas",
                    },
                    {
                      id: "systemUpdates",
                      label: "Actualizaciones del sistema",
                      description: "Información sobre nuevas funciones y mantenimiento",
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
                  <Button className="bg-purple-600 hover:bg-purple-700">Cambiar contraseña</Button>
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
                      { device: "Safari en iPhone", location: "Ciudad, País", lastActive: "Hace 2 horas" },
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
