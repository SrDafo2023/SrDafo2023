"use client"

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
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Estados para los modales y usuario seleccionado
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showRole, setShowRole] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Cargar usuarios desde la API al montar
  useEffect(() => {
    setLoading(true);
    fetch("https://64a6e4e7096b3f0fcc80e6e2.mockapi.io/api/v1/users")
      .then(res => res.json())
      .then(data => { setUsers(data); setLoading(false); })
      .catch(() => { setApiError("No se pudo cargar la lista de usuarios."); setLoading(false); });
  }, []);

  // Handlers para abrir modales
  const handleShowDetails = (user: any) => { setSelectedUser(user); setShowDetails(true); };
  const handleShowEdit = (user: any) => { setSelectedUser(user); setFormError(null); setShowEdit(true); };
  const handleShowRole = (user: any) => { setSelectedUser(user); setShowRole(true); };
  const handleShowDelete = (user: any) => { setSelectedUser(user); setShowDelete(true); };

  // Validación simple de email
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  // Handler para editar usuario
  const handleEditUser = async (updated: any) => {
    setFormError(null);
    if (!updated.name) {
      setFormError("El nombre no puede estar vacío.");
      return;
    }
    if (!validateEmail(updated.email)) {
      setFormError("El email no es válido.");
      return;
    }
    try {
      const res = await fetch(`https://64a6e4e7096b3f0fcc80e6e2.mockapi.io/api/v1/users/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      setUsers(users.map(u => u.id === updated.id ? { ...u, ...updated } : u));
      setShowEdit(false);
    } catch {
      setFormError("No se pudo guardar el usuario. Intenta de nuevo.");
    }
  };

  // Handler para cambiar rol
  const handleChangeRole = async (role: string) => {
    if (selectedUser) {
      try {
        const res = await fetch(`https://64a6e4e7096b3f0fcc80e6e2.mockapi.io/api/v1/users/${selectedUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...selectedUser, role }),
        });
        if (!res.ok) throw new Error();
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, role } : u));
        setShowRole(false);
      } catch {
        setApiError("No se pudo cambiar el rol. Intenta de nuevo.");
      }
    }
  };

  // Handler para eliminar usuario
  const handleDeleteUser = async () => {
    try {
      const res = await fetch(`https://64a6e4e7096b3f0fcc80e6e2.mockapi.io/api/v1/users/${selectedUser.id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error();
      setUsers(users.filter(u => u.id !== selectedUser.id));
      setShowDelete(false);
    } catch {
      setApiError("No se pudo eliminar el usuario. Intenta de nuevo.");
    }
  };

  // Handler para activar/desactivar usuario
  const handleToggleUserStatus = async (id: number) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`https://64a6e4e7096b3f0fcc80e6e2.mockapi.io/api/v1/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch {
      setApiError("No se pudo cambiar el estado del usuario. Intenta de nuevo.");
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex justify-center mb-6">
        <Image src="/images/pethelp_logo.png" alt="PetHelp Logo" width={120} height={120} />
      </div>
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
                          <DropdownMenuItem onClick={() => handleShowDetails(user)}>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShowEdit(user)}>Editar usuario</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShowRole(user)}>Cambiar rol</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleToggleUserStatus(user.id)}
                            className={user.status === "active" ? "text-red-600" : "text-green-600"}
                          >
                            {user.status === "active" ? "Desactivar Usuario" : "Activar Usuario"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShowDelete(user)} className="text-red-600">Eliminar usuario</DropdownMenuItem>
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

      {/* Detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles de Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-2">
              <p><b>Nombre:</b> {selectedUser.name}</p>
              <p><b>Email:</b> {selectedUser.email}</p>
              <p><b>Rol:</b> {selectedUser.role}</p>
              <p><b>Estado:</b> {selectedUser.status}</p>
              <p><b>Fecha de registro:</b> {selectedUser.createdAt}</p>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Editar */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <form onSubmit={e => { e.preventDefault(); handleEditUser({ ...selectedUser, name: e.currentTarget.name.value, email: e.currentTarget.email.value }); }} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" name="name" defaultValue={selectedUser.name} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" defaultValue={selectedUser.email} />
              </div>
              <DialogFooter>
                <Button type="submit">Guardar</Button>
                <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Cancelar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
      {/* Cambiar rol */}
      <Dialog open={showRole} onOpenChange={setShowRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <Select defaultValue={selectedUser.role} onValueChange={handleChangeRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                  <SelectItem value="petshop">PetShop</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowRole(false)} variant="outline">Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Eliminar */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
          <DialogFooter>
            <Button onClick={handleDeleteUser} variant="destructive">Eliminar</Button>
            <Button onClick={() => setShowDelete(false)} variant="outline">Cancelar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
