import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Star, Heart, ShoppingCart } from "lucide-react"

export default function OfertasPage() {
  const products = [
    {
      id: 1,
      name: "Alimento Premium Perro Adulto",
      price: "$25.990",
      originalPrice: "$35.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop",
      rating: 5,
      category: "Alimento",
      pet: "Perros",
    },
    {
      id: 2,
      name: "Arena Sanitaria Aglomerante",
      price: "$8.990",
      originalPrice: "$12.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
      rating: 4,
      category: "Higiene",
      pet: "Gatos",
    },
    {
      id: 3,
      name: "Juguete Kong Classic",
      price: "$8.990",
      originalPrice: "$12.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
      rating: 5,
      category: "Juguetes",
      pet: "Perros",
    },
    {
      id: 4,
      name: "Jaula para Conejo Grande",
      price: "$45.990",
      originalPrice: "$59.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
      rating: 4,
      category: "Hábitat",
      pet: "Pequeñas mascotas",
    },
    {
      id: 5,
      name: "Baño y Secado Completo",
      price: "$15.990",
      originalPrice: "$19.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
      rating: 5,
      category: "Servicios",
      pet: "Grooming",
    },
    {
      id: 6,
      name: "Alimento para Hamster",
      price: "$5.990",
      originalPrice: "$8.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop",
      rating: 4,
      category: "Alimento",
      pet: "Pequeñas mascotas",
    },
  ]

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
            <span className="text-6xl">🏷️</span>
            <div>
              <h1 className="text-4xl font-bold">Ofertas Especiales</h1>
              <p className="text-xl text-purple-100">Los mejores descuentos para tu mascota</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Promotional Banner */}
        <div className="mb-8 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-6">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🚚</span>
              <div>
                <span className="font-bold text-lg">DELIVERY EXPRESS</span>
                <span className="ml-4 text-yellow-200">En compras sobre $60.000</span>
              </div>
            </div>
            <div className="text-sm">
              Válido del 29/05/25 al 01/06/25.
              <br />
              Sujeto a disponibilidad.
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{product.discount}</Badge>
                  <Button variant="ghost" size="sm" className="absolute top-2 left-2 bg-white/80 hover:bg-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 bg-blue-500 text-white">{product.category}</Badge>
                </div>
                <Badge className="mb-2 bg-purple-200 text-purple-800 hover:bg-purple-300">{product.pet}</Badge>
                <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl font-bold text-purple-600">{product.price}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < product.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({product.rating})</span>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Agregar al carrito
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
