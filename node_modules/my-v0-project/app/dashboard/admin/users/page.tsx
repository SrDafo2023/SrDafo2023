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
import { MoreHorizontalIcon, PlusIcon, Loader2Icon } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { getUsers, updateUser, deleteUser, createUser, type User, updateUserRole } from "@/lib/user-storage"
import { type AppUser } from '@/hooks/useUser'
import { useToast } from '@/components/ui/use-toast'
import { DashboardHeader } from '@/components/dashboard-header'

export default function UsersPage() {
  const [users, setUsers] = useState<AppUser[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para los modales y usuario seleccionado
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showRole, setShowRole] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<AppUser['userType'] | ''>('')
  const [isUpdating, setIsUpdating] = useState(false)
  const { toast } = useToast()

  // Cargar usuarios desde Firebase al montar
  useEffect(() => {
    loadUsers()
  }, [toast])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const fetchedUsers = await getUsers()
      setUsers(fetchedUsers)
      setApiError(null)
    } catch (error) {
      setApiError("No se pudo cargar la lista de usuarios.")
      toast({ title: 'Error', description: 'No se pudieron cargar los usuarios.', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  // Handlers para abrir modales
  const handleShowDetails = (user: AppUser) => {
    setSelectedUser(user)
    setShowDetails(true)
  }

  const handleShowEdit = (user: AppUser) => {
    setSelectedUser(user)
    setFormError(null)
    setShowEdit(true)
  }

  const handleShowRole = (user: AppUser) => {
    setSelectedUser(user)
    setSelectedRole(user.userType)
    setShowRole(true)
  }

  const handleShowDelete = (user: AppUser) => {
    setSelectedUser(user)
    setShowDelete(true)
  }

  // Validación simple de email
  const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email)

  // Handler para editar usuario
  const handleEditUser = async (updated: Partial<AppUser>) => {
    if (!selectedUser) return

    setFormError(null)
    if (!updated.displayName) {
      setFormError("El nombre no puede estar vacío.")
      return
    }
    if (updated.email && !validateEmail(updated.email)) {
      setFormError("El email no es válido.")
      return
    }

    try {
      await updateUser(selectedUser.id, updated)
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...updated } : u))
      setShowEdit(false)
    } catch (error) {
      setFormError("No se pudo guardar el usuario. Intenta de nuevo.")
    }
  }

  // Handler para cambiar rol
  const handleRoleChange = async () => {
    if (!selectedUser || !selectedRole) return

    setIsUpdating(true)
    try {
      await updateUserRole(selectedUser.id, selectedRole)
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, userType: selectedRole } : u))
      toast({ title: 'Éxito', description: `El rol de ${selectedUser.displayName} ha sido actualizado a ${selectedRole}.` })
      setShowRole(false)
    } catch (error) {
      setApiError("No se pudo cambiar el rol. Intenta de nuevo.")
      toast({ title: 'Error', description: 'No se pudo cambiar el rol. Intenta de nuevo.', variant: 'destructive' })
    } finally {
      setIsUpdating(false)
    }
  }

  // Handler para eliminar usuario
  const handleDeleteUser = async () => {
    if (!selectedUser) return

    try {
      await deleteUser(selectedUser.id)
      setUsers(users.filter(u => u.id !== selectedUser.id))
      setShowDelete(false)
    } catch (error) {
      setApiError("No se pudo eliminar el usuario. Intenta de nuevo.")
    }
  }

  // Handler para activar/desactivar usuario
  const handleToggleUserStatus = async (user: AppUser) => {
    const newStatus = user.status === "active" ? "inactive" : "active"
    try {
      await updateUser(user.id, { status: newStatus })
      setUsers(users.map(u => u.id === user.id ? { ...u, status: newStatus } : u))
    } catch (error) {
      setApiError("No se pudo cambiar el estado del usuario. Intenta de nuevo.")
    }
  }

  // Filtrar usuarios según término de búsqueda
  const filteredUsers = users.filter(user =>
    (user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="relative w-full h-[200px] rounded-lg overflow-hidden bg-gray-100">
        <Image
          src="/images/dog-cat.jpg"
          alt="Banner de Usuarios - Perro y Gato"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los usuarios y sus roles en el sistema
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <PlusIcon className="mr-2 h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>
            Total: {filteredUsers.length} usuarios registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input 
              placeholder="Buscar usuarios..." 
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {apiError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              {apiError}
            </div>
          )}
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
              {loading ? (
                <TableRow><TableCell colSpan={4} className="text-center h-24"><Loader2Icon className="mx-auto h-8 w-8 animate-spin" /></TableCell></TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.displayName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.userType === "admin"
                            ? "border-purple-500 text-purple-700 bg-purple-50"
                            : user.userType === "petshop"
                              ? "border-blue-500 text-blue-700 bg-blue-50"
                              : user.userType === "grooming"
                                ? "border-green-500 text-green-700 bg-green-50"
                                : "border-gray-500 text-gray-700 bg-gray-50"
                        }
                      >
                        {user.userType === "admin"
                          ? "Administrador"
                          : user.userType === "petshop"
                            ? "PetShop"
                            : user.userType === "grooming"
                              ? "Estilista"
                              : user.userType === "adoption-center"
                                ? "Centro de Adopción"
                                : "Usuario"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/D"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontalIcon className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleShowDetails(user)}>
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShowEdit(user)}>
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleShowRole(user)}>
                            Cambiar rol
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleShowDelete(user)}
                          >
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal de detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <p>{selectedUser.displayName}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p>{selectedUser.email}</p>
              </div>
              <div>
                <Label>Rol</Label>
                <p className="capitalize">{selectedUser.userType}</p>
              </div>
              <div>
                <Label>Estado</Label>
                <p className="capitalize">{selectedUser.status}</p>
              </div>
              <div>
                <Label>Fecha de registro</Label>
                <p>{selectedUser.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de edición */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  defaultValue={selectedUser.displayName}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, displayName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={selectedUser.email}
                  onChange={(e) =>
                    setSelectedUser({ ...selectedUser, email: e.target.value })
                  }
                />
              </div>
              {formError && (
                <p className="text-red-500 text-sm">{formError}</p>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowEdit(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleEditUser(selectedUser)}
                >
                  Guardar
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de cambio de rol */}
      <Dialog open={showRole} onOpenChange={setShowRole}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Rol</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as AppUser['userType'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="petshop">PetShop</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="adoption-center">Centro de Adopción</SelectItem>
                  <SelectItem value="user">Usuario</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRoleChange} disabled={!selectedRole || isUpdating} className="mt-4 w-full">
                {isUpdating && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de eliminación */}
      <Dialog open={showDelete} onOpenChange={setShowDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Usuario</DialogTitle>
          </DialogHeader>
          <p>¿Estás seguro de que quieres eliminar este usuario?</p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDelete(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteUser}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
