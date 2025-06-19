import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Star, Calendar, MapPin, Clock } from "lucide-react"

export default function ServiciosPage() {
  const services = [
    {
      id: 1,
      name: "Baño y Secado Completo",
      price: "$15.990",
      originalPrice: "$19.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
      rating: 5,
      duration: "1-2 horas",
      description: "Baño con shampoo especializado, secado y cepillado",
      category: "grooming",
    },
    {
      id: 2,
      name: "Corte de Pelo Profesional",
      price: "$25.990",
      originalPrice: "$32.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
      rating: 5,
      duration: "2-3 horas",
      description: "Corte según raza y preferencias del cliente",
      category: "grooming",
    },
    {
      id: 3,
      name: "Corte de Uñas",
      price: "$5.990",
      originalPrice: "$8.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300&fit=crop",
      rating: 4,
      duration: "30 min",
      description: "Corte profesional de uñas con lima",
      category: "grooming",
    },
    {
      id: 4,
      name: "Consulta Veterinaria",
      price: "$25.990",
      originalPrice: "$32.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop",
      rating: 5,
      duration: "45 min",
      description: "Consulta general con veterinario especializado",
      category: "salud",
    },
    {
      id: 5,
      name: "Adiestramiento Básico",
      price: "$39.990",
      originalPrice: "$49.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
      rating: 5,
      duration: "1 hora",
      description: "Sesión de entrenamiento para comandos básicos",
      category: "entrenamiento",
    },
    {
      id: 6,
      name: "Hospedaje Premium",
      price: "$18.990",
      originalPrice: "$24.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop",
      rating: 4,
      duration: "Por día",
      description: "Alojamiento con cuidados especiales y atención personalizada",
      category: "hospedaje",
    },
  ]

  const categories = ["Todos", "Grooming", "Salud", "Entrenamiento", "Hospedaje"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/20">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-6xl">🛠️</span>
            <div>
              <h1 className="text-4xl font-bold">Servicios para Mascotas</h1>
              <p className="text-xl text-purple-100">Cuidado profesional para tu mejor amigo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Categorías</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Todos" ? "default" : "outline"}
                size="sm"
                className={category === "Todos" ? "bg-purple-600 hover:bg-purple-700" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Info` : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-4">
            <MapPin className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Servicio a domicilio disponible</h3>
              <p className="text-blue-600">Agenda tu cita y nuestros profesionales irán a tu hogar</p>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{service.discount}</Badge>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{service.duration}</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-purple-600">{service.price}</span>
                  <span className="text-sm text-gray-500 line-through">{service.originalPrice}</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < service.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({service.rating})</span>
                </div>

                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href={`/agendar/${service.id}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Cita
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 bg-white rounded-lg p-8 shadow-md">
          <h2 className="text-2xl font-bold text-center mb-6">¿Necesitas más información?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📞</div>
              <h3 className="font-semibold">Llámanos</h3>
              <p className="text-gray-600">(+56) 2 2760 7777</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💬</div>
              <h3 className="font-semibold">WhatsApp</h3>
              <p className="text-gray-600">(+56) 9 7214 9999</p>
            </div>
            <div>
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600">servicios@pethelp.cl</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
