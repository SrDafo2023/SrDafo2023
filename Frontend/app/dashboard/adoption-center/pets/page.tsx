"use client"

import { useEffect, useState, type FormEvent } from 'react'
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getPetsByAdoptionCenterId, deletePet, Pet, updatePet } from "@/lib/pet-storage"
import { useUser } from "@/hooks/useUser"
import { Loader2Icon, PawPrintIcon, TrashIcon, PencilIcon } from "lucide-react"
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { toast } from 'sonner'
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"
import Link from "next/link"
import { db, storage } from '@/config/firebase/firebase'
import { collection, getDocs, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { useToast } from '@/components/ui/use-toast'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { PlusCircleIcon, EditIcon, Trash2Icon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export default function AdoptionCenterPetsPage() {
  const { user } = useUser(); // Assuming useUser hook provides the logged-in user
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // State for the edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Pet>>({})
  const [editImageFile, setEditImageFile] = useState<File | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchPets = async () => {
    try {
      setError(null)
      setLoading(true)
      const petsCollection = collection(db, 'pets')
      const querySnapshot = await getDocs(petsCollection)
      const petsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Pet[]
      // TODO: Filtrar por ID del centro de adopción cuando se implemente la autenticación
      setPets(petsData)
    } catch (err) {
      console.error("Error fetching pets:", err)
      setError("No se pudieron cargar las mascotas.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPets()
  }, [])

  const handleDelete = async (petId: string, petName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${petName}? Esta acción no se puede deshacer.`)) {
      try {
        await deleteDoc(doc(db, 'pets', petId))
        toast({
          title: '¡Eliminado!',
          description: `${petName} ha sido eliminado del sistema.`,
          variant: 'destructive',
        })
        fetchPets() // Recargar la lista de mascotas
      } catch (err) {
        console.error("Error deleting pet:", err)
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la mascota.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleEditClick = (pet: Pet) => {
    setSelectedPet(pet)
    setEditFormData(pet)
    setEditImagePreview(pet.imageUrl)
    setIsEditModalOpen(true)
  }
  
  const handleEditFormChange = (field: keyof Pet, value: string | number) => {
    setEditFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setEditImageFile(file)
      setEditImagePreview(URL.createObjectURL(file))
    }
  }

  const handleEditSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedPet) return
    
    setIsSubmitting(true)
    try {
      let imageUrl = selectedPet.imageUrl
      if (editImageFile) {
        const storageRef = ref(storage, `pet_images/${selectedPet.id}/${editImageFile.name}`)
        const snapshot = await uploadBytes(storageRef, editImageFile)
        imageUrl = await getDownloadURL(snapshot.ref)
      }

      const updatedData = { ...editFormData, imageUrl }
      await updatePet(selectedPet.id, updatedData as Partial<Pet>)

      toast({ title: '¡Éxito!', description: `${editFormData.name} ha sido actualizado.` })
      setIsEditModalOpen(false)
      fetchPets() // Refresh data
    } catch (error) {
      console.error("Error updating pet:", error)
      toast({ title: 'Error', description: 'No se pudo actualizar la mascota.', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
      setEditImageFile(null)
    }
  }

  if (!user || user.userType !== 'adoption-center') {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-bold">Acceso Denegado</h2>
            <p className="text-muted-foreground">Debes iniciar sesión como Centro de Adopción para ver esta página.</p>
        </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Gestión de Mascotas</h1>
          <Skeleton className="h-10 w-36" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>
  }

  return (
    <div className="flex flex-col">
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Mascotas en Adopción</h2>
                <p className="text-muted-foreground">Gestiona las mascotas que has puesto en adopción.</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/dashboard/adoption-center/add-pet">Añadir Nueva Mascota</Link>
            </Button>
        </div>

        {pets.length === 0 ? (
          <div className="text-center text-muted-foreground h-40 flex items-center justify-center">
            Aún no has añadido ninguna mascota para adopción.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Especie</TableHead>
                <TableHead>Raza</TableHead>
                <TableHead>Edad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell className="font-medium">{pet.name}</TableCell>
                  <TableCell>{pet.species}</TableCell>
                  <TableCell>{pet.breed}</TableCell>
                  <TableCell>{pet.age} años</TableCell>
                  <TableCell>
                    {pet.status ? (
                        <span className={`px-2 py-1 text-xs rounded-full ${
                            pet.status === 'disponible' ? 'bg-green-200 text-green-800' :
                            pet.status === 'en proceso' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-gray-200 text-gray-800'
                        }`}>
                            {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                        </span>
                    ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-300 text-gray-800">
                            No definido
                        </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(pet)}>
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(pet.id, pet.name)}>
                      <Trash2Icon className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

      </main>

      {/* Edit Pet Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Mascota</DialogTitle>
            <DialogDescription>Actualiza los detalles de {selectedPet?.name}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="grid md:grid-cols-2 gap-8 py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" value={editFormData.name || ''} onChange={e => handleEditFormChange('name', e.target.value)} required />
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="species">Especie</Label>
                      <Select value={editFormData.species || ''} onValueChange={value => handleEditFormChange('species', value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="dog">Perro</SelectItem>
                              <SelectItem value="cat">Gato</SelectItem>
                              <SelectItem value="other">Otro</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div>
                      <Label htmlFor="breed">Raza</Label>
                      <Input id="breed" value={editFormData.breed || ''} onChange={e => handleEditFormChange('breed', e.target.value)} />
                  </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <Label htmlFor="age">Edad (años)</Label>
                      <Input id="age" type="number" value={editFormData.age || ''} onChange={e => handleEditFormChange('age', Number(e.target.value))} required />
                  </div>
                  <div>
                      <Label htmlFor="gender">Género</Label>
                      <Select value={editFormData.gender || ''} onValueChange={value => handleEditFormChange('gender', value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Macho">Macho</SelectItem>
                              <SelectItem value="Hembra">Hembra</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
              </div>
              <div>
                  <Label htmlFor="status">Estado</Label>
                  <Select value={editFormData.status || ''} onValueChange={value => handleEditFormChange('status', value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="disponible">Disponible</SelectItem>
                          <SelectItem value="en proceso">En proceso</SelectItem>
                          <SelectItem value="adoptado">Adoptado</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea id="description" value={editFormData.description || ''} onChange={e => handleEditFormChange('description', e.target.value)} required />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Imagen de la Mascota</Label>
              <div className="w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center relative bg-gray-100 dark:bg-gray-800">
                {editImagePreview ? (
                  <Image src={editImagePreview} alt="Vista previa" layout="fill" objectFit="cover" className="rounded-lg" />
                ) : (
                  <span className="text-sm text-muted-foreground">Vista previa</span>
                )}
              </div>
              <Input type="file" onChange={handleEditFileChange} accept="image/*" />
            </div>
            
            <DialogFooter className="md:col-span-2">
               <DialogClose asChild>
                 <Button type="button" variant="secondary">Cancelar</Button>
               </DialogClose>
               <Button type="submit" disabled={isSubmitting}>
                   {isSubmitting && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
                   Guardar Cambios
               </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 