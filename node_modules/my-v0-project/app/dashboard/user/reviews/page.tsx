"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarIcon, PlusIcon, EditIcon, TrashIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

export default function ReviewsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [formData, setFormData] = useState({
    type: "",
    service: "",
    title: "",
    content: "",
  })

  const reviews = [
    {
      id: 1,
      title: "Excelente servicio de baño",
      content: "El servicio fue excelente, mi perro quedó muy limpio y feliz. El personal es muy profesional.",
      rating: 5,
      service: "Baño y Corte",
      date: "2023-05-10",
      type: "service",
    },
    {
      id: 2,
      title: "Comida de muy buena calidad",
      content: "A mi mascota le encanta esta comida, se nota que es de buena calidad y tiene buenos ingredientes.",
      rating: 5,
      service: "Premium Dog Food",
      date: "2023-06-02",
      type: "product",
    },
    {
      id: 3,
      title: "Juguete muy resistente",
      content: "El juguete es muy resistente, mi perro juega mucho con él y sigue intacto después de semanas.",
      rating: 4,
      service: "Interactive Ball Toy",
      date: "2023-05-25",
      type: "product",
    },
    {
      id: 4,
      title: "Spa relajante para mi gata",
      content: "Mi gata salió muy relajada del spa, el tratamiento fue perfecto y el ambiente muy tranquilo.",
      rating: 5,
      service: "Spa Completo",
      date: "2023-04-15",
      type: "service",
    },
  ]

  const serviceReviews = reviews.filter((review) => review.type === "service")
  const productReviews = reviews.filter((review) => review.type === "product")

  const renderStars = (rating: number, interactive = false, onStarClick?: (star: number) => void) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <StarIcon
        key={i}
        className={`h-5 w-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        } ${interactive ? "cursor-pointer hover:text-yellow-400" : ""}`}
        onClick={() => interactive && onStarClick && onStarClick(i + 1)}
      />
    ))
  }

  const handlePublishReview = () => {
    if (!formData.type || !formData.service || !formData.title || !formData.content || rating === 0) {
      alert("Por favor completa todos los campos")
      return
    }

    // Aquí se agregaría la lógica para enviar la reseña al servidor
    console.log("Nueva reseña:", {
      ...formData,
      rating,
      date: new Date().toISOString().split("T")[0],
    })

    // Resetear formulario
    setFormData({ type: "", service: "", title: "", content: "" })
    setRating(0)
    setIsDialogOpen(false)

    alert("¡Reseña publicada exitosamente!")
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader role="user" title="Mis Reseñas" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Mis Reseñas</h2>
            <p className="text-muted-foreground">Comparte tu experiencia con productos y servicios</p>
          </div>
          <div className="flex items-center gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Nueva Reseña
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Crear Nueva Reseña</DialogTitle>
                  <DialogDescription>Comparte tu experiencia con un producto o servicio</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Tipo</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Servicio</SelectItem>
                        <SelectItem value="product">Producto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="service">Producto/Servicio</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el producto o servicio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bath-cut">Baño y Corte</SelectItem>
                        <SelectItem value="spa">Spa Completo</SelectItem>
                        <SelectItem value="dental">Cuidado Dental</SelectItem>
                        <SelectItem value="dog-food">Premium Dog Food</SelectItem>
                        <SelectItem value="toy">Interactive Ball Toy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="title">Título de la reseña</Label>
                    <Input
                      id="title"
                      placeholder="Escribe un título para tu reseña"
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Calificación</Label>
                    <div className="flex gap-1">{renderStars(rating, true, setRating)}</div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Comentario</Label>
                    <Textarea
                      id="content"
                      placeholder="Comparte tu experiencia..."
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handlePublishReview}>
                    Publicar Reseña
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todas ({reviews.length})</TabsTrigger>
            <TabsTrigger value="services">Servicios ({serviceReviews.length})</TabsTrigger>
            <TabsTrigger value="products">Productos ({productReviews.length})</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-lg">{review.title}</CardTitle>
                          <Badge variant="outline">{review.type === "service" ? "Servicio" : "Producto"}</Badge>
                        </div>
                        <CardDescription>{review.service}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                      <p className="text-sm">{review.content}</p>
                      <p className="text-xs text-muted-foreground">Publicada el {review.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="services" className="space-y-4">
            <div className="space-y-4">
              {serviceReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{review.title}</CardTitle>
                        <CardDescription>{review.service}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                      <p className="text-sm">{review.content}</p>
                      <p className="text-xs text-muted-foreground">Publicada el {review.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="products" className="space-y-4">
            <div className="space-y-4">
              {productReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{review.title}</CardTitle>
                        <CardDescription>{review.service}</CardDescription>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                      <p className="text-sm">{review.content}</p>
                      <p className="text-xs text-muted-foreground">Publicada el {review.date}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
