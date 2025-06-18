import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MoreHorizontalIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

export default function UsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan@example.com",
      role: "user",
      status: "active",
      createdAt: "2023-10-15",
    },
    {
      id: 2,
      name: "María López",
      email: "maria@example.com",
      role: "petshop",
      status: "active",
      createdAt: "2023-09-22",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      email: "carlos@example.com",
      role: "grooming",
      status: "active",
      createdAt: "2023-11-05",
    },
    {
      id: 4,
      name: "Ana Martínez",
      email: "ana@example.com",
      role: "user",
      status: "inactive",
      createdAt: "2023-08-30",
    },
    {
      id: 5,
      name: "Pedro Sánchez",
      email: "pedro@example.com",
      role: "admin",
      status: "active",
      createdAt: "2023-07-12",
    },
  ]);

  const handleToggleUserStatus = (id: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === id
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Usuarios</h2>
            <p className="text-muted-foreground">Administra los usuarios y sus roles en el sistema</p>
          </div>
          <div className="flex items-center gap-2">
            <Button className="bg-purple-600 hover:bg-purple-700">
              <PlusIcon className="mr-2 h-4 w-4" />
              Nuevo Usuario
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Lista de Usuarios</CardTitle>
            <CardDescription>Total: {users.length} usuarios registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Input placeholder="Buscar usuarios..." className="max-w-sm" />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha de registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "admin"
                            ? "border-purple-500 text-purple-700 bg-purple-50"
                            : user.role === "petshop"
                              ? "border-blue-500 text-blue-700 bg-blue-50"
                              : user.role === "grooming"
                                ? "border-green-500 text-green-700 bg-green-50"
                                : "border-gray-500 text-gray-700 bg-gray-50"
                        }
                      >
                        {user.role === "admin"
                          ? "Administrador"
                          : user.role === "petshop"
                            ? "PetShop"
                            : user.role === "grooming"
                              ? "Grooming"
                              : "Usuario"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.status === "active"
                            ? "border-green-500 text-green-700 bg-green-50"
                            : "border-red-500 text-red-700 bg-red-50"
                        }
                      >
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell className="text-right">
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
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar rol</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={user.status === "active" ? "text-red-600" : "text-green-600"}
                          >
                            {user.status === "active" ? "Desactivar Usuario" : "Activar Usuario"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Eliminar usuario</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
