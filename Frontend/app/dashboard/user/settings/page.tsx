import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CameraIcon } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader role="user" title="Configuración" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Configuración</h2>
          <p className="text-muted-foreground">Administra tu perfil y preferencias</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="pets">Mis Mascotas</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>
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
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <CameraIcon className="mr-2 h-4 w-4" />
                    Cambiar foto
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" defaultValue="Doe" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" defaultValue="+1 234 567 8900" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Textarea id="address" defaultValue="123 Main St, City, State 12345" />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Guardar cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mis Mascotas</CardTitle>
                <CardDescription>Administra la información de tus mascotas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { name: "Firulais", type: "Perro", breed: "Golden Retriever", age: "3 años" },
                    { name: "Luna", type: "Gata", breed: "Siamés", age: "2 años" },
                  ].map((pet, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{pet.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {pet.type} • {pet.breed} • {pet.age}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Eliminar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">Agregar mascota</Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias de Notificación</CardTitle>
                <CardDescription>Configura cómo quieres recibir notificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    {
                      id: "email",
                      label: "Notificaciones por email",
                      description: "Recibe actualizaciones por correo electrónico",
                    },
                    {
                      id: "sms",
                      label: "Notificaciones SMS",
                      description: "Recibe recordatorios por mensaje de texto",
                    },
                    {
                      id: "appointments",
                      label: "Recordatorios de citas",
                      description: "Notificaciones sobre próximas citas",
                    },
                    {
                      id: "promotions",
                      label: "Ofertas y promociones",
                      description: "Recibe información sobre descuentos y ofertas especiales",
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
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Seguridad</CardTitle>
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
                      <p className="text-sm text-muted-foreground">Agrega una capa extra de seguridad a tu cuenta</p>
                    </div>
                    <Switch />
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
