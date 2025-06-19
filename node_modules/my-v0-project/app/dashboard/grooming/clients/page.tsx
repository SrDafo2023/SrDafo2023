import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlusIcon, MoreHorizontalIcon, SearchIcon, UserIcon, PhoneIcon, MailIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ClientsPage() {
  const clients = [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "+1 234 567 8900",
      pets: [
        { name: "Firulais", type: "Perro", breed: "Golden Retriever" },
        { name: "Luna", type: "Gata", breed: "Siamés" },
      ],
      lastVisit: "2023-06-10",
      totalVisits: 12,
      totalSpent: 458.9,
      status: "active",
    },
    {
      id: 2,
      name: "María López",
      email: "maria@example.com",
      phone: "+1 234 567 8901",
      pets: [{ name: "Rocky", type: "Perro", breed: "Bulldog" }],
      lastVisit: "2023-06-08",
      totalVisits: 8,
      totalSpent: 325.45,
      status: "active",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      phone: "+1 234 567 8902",
      pets: [
        { name: "Bella", type: "Perra", breed: "Labrador" },
        { name: "Max", type: "Perro", breed: "Pastor Alemán" },
      ],
      lastVisit: "2023-06-05",
      totalVisits: 15,
      totalSpent: 612.3,
      status: "active",
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana@example.com",
      phone: "+1 234 567 8903",
      pets: [{ name: "Coco", type: "Gata", breed: "Persa" }],
      lastVisit: "2023-05-28",
      totalVisits: 5,
      totalSpent: 198.75,
      status: "inactive",
    },
    {
      id: 5,
      name: "Pedro Sánchez",
      email: "pedro@example.com",
      phone: "+1 234 567 8904",
      pets: [{ name: "Toby", type: "Perro", breed: "Beagle" }],
      lastVisit: "2023-06-12",
      totalVisits: 6,
      totalSpent: 245.6,
      status: "active",
    },
  ]

  const recentAppointments = [
    {
      id: 1,
      client: "Juan Pérez",
      pet: "Firulais",
      service: "Baño y Corte",
      date: "2023-06-15",
      time: "10:00 AM",
      status: "completed",
    },
    {
      id: 2,
      client: "María López",
      pet: "Rocky",
      service: "Spa Completo",
      date: "2023-06-15",
      time: "11:30 AM",
      status: "completed",
    },
    {
      id: 3,
      client: "Pedro Sánchez",
      pet: "Toby",
      service: "Corte de Uñas",
      date: "2023-06-15",
      time: "2:00 PM",
      status: "pending",
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="grooming" title="Gestión de Clientes" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Clientes</h2>
            <p className="text-muted-foreground">Administra la información de tus clientes y sus mascotas</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Cliente
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar clientes..." className="w-full pl-8 md:w-[300px]" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="clients" className="space-y-4">
          <TabsList>
            <TabsTrigger value="clients">Clientes ({clients.length})</TabsTrigger>
            <TabsTrigger value="recent">Citas Recientes</TabsTrigger>
            <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          </TabsList>
          <TabsContent value="clients" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clients.map((client) => (
                <Card key={client.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={`/placeholder-user.jpg`} />
                          <AvatarFallback>
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{client.name}</CardTitle>
                          <Badge
                            variant="outline"
                            className={
                              client.status === "active"
                                ? "border-green-500 text-green-700 bg-green-50"
                                : "border-gray-500 text-gray-700 bg-gray-50"
                            }
                          >
                            {client.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver perfil completo</DropdownMenuItem>
                          <DropdownMenuItem>Editar información</DropdownMenuItem>
                          <DropdownMenuItem>Ver historial</DropdownMenuItem>
                          <DropdownMenuItem>Nueva cita</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">Eliminar cliente</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MailIcon className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-1">Mascotas:</p>
                        <div className="space-y-1">
                          {client.pets.map((pet, i) => (
                            <div key={i} className="text-sm text-muted-foreground">
                              {pet.name} - {pet.type} ({pet.breed})
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="font-medium">{client.totalVisits}</p>
                            <p className="text-muted-foreground">Visitas</p>
                          </div>
                          <div>
                            <p className="font-medium">${client.totalSpent}</p>
                            <p className="text-muted-foreground">Total gastado</p>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Última visita: {client.lastVisit}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Citas Recientes</CardTitle>
                <CardDescription>Últimas citas atendidas</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Mascota</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.client}</TableCell>
                        <TableCell>{appointment.pet}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              appointment.status === "completed"
                                ? "border-green-500 text-green-700 bg-green-50"
                                : "border-yellow-500 text-yellow-700 bg-yellow-50"
                            }
                          >
                            {appointment.status === "completed" ? "Completada" : "Pendiente"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="stats" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{clients.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {clients.filter((c) => c.status === "active").length} activos
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes Nuevos</CardTitle>
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Este mes</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Promedio Visitas</CardTitle>
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(clients.reduce((acc, c) => acc + c.totalVisits, 0) / clients.length)}
                  </div>
                  <p className="text-xs text-muted-foreground">Por cliente</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Gasto Promedio</CardTitle>
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${Math.round(clients.reduce((acc, c) => acc + c.totalSpent, 0) / clients.length)}
                  </div>
                  <p className="text-xs text-muted-foreground">Por cliente</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Clientes Más Frecuentes</CardTitle>
                <CardDescription>Top 5 clientes por número de visitas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {clients
                    .sort((a, b) => b.totalVisits - a.totalVisits)
                    .slice(0, 5)
                    .map((client, i) => (
                      <div key={client.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{i + 1}</span>
                        </div>
                        <Avatar>
                          <AvatarImage src={`/placeholder-user.jpg`} />
                          <AvatarFallback>
                            {client.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {client.pets.length} mascota{client.pets.length !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{client.totalVisits} visitas</p>
                          <p className="text-sm text-muted-foreground">${client.totalSpent}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
