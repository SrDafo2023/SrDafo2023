"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Star, Heart, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PerrosPage() {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [favorites, setFavorites] = useState<number[]>([])

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
    },
    {
      id: 2,
      name: "Correa Retráctil 5m",
      price: "$12.990",
      originalPrice: "$16.990",
      discount: "15%",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
      rating: 4,
      category: "Accesorios",
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
    },
    {
      id: 4,
      name: "Cama Ortopédica Grande",
      price: "$45.990",
      originalPrice: "$59.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
      rating: 4,
      category: "Camas",
    },
    {
      id: 5,
      name: "Snacks Dentales",
      price: "$6.990",
      originalPrice: "$9.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop",
      rating: 5,
      category: "Snacks",
    },
    {
      id: 6,
      name: "Collar Antipulgas",
      price: "$15.990",
      originalPrice: "$19.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=300&fit=crop",
      rating: 4,
      category: "Salud",
    },
  ]

  const categories = ["Todos", "Alimento", "Juguetes", "Accesorios", "Camas", "Snacks", "Salud"]

  const handleAddToCart = (product: any) => {
    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado al carrito`,
    })
  }

  const toggleFavorite = (id: number) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
      toast({
        title: "Eliminado de favoritos",
        description: "El producto ha sido eliminado de tus favoritos",
      })
    } else {
      setFavorites([...favorites, id])
      toast({
        title: "Agregado a favoritos",
        description: "El producto ha sido agregado a tus favoritos",
      })
    }
  }

  const filteredProducts =
    activeCategory === "Todos" ? products : products.filter((product) => product.category === activeCategory)

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
            <span className="text-6xl">🐕</span>
            <div>
              <h1 className="text-4xl font-bold">Productos para Perros</h1>
              <p className="text-xl text-purple-100">Todo lo que tu perro necesita</p>
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
                variant={category === activeCategory ? "default" : "outline"}
                size="sm"
                className={category === activeCategory ? "bg-purple-600 hover:bg-purple-700" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{product.discount}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`absolute top-2 left-2 bg-white/80 hover:bg-white ${favorites.includes(product.id) ? "text-red-500" : ""}`}
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-red-500" : ""}`} />
                  </Button>
                  <Badge className="absolute bottom-2 left-2 bg-blue-500 text-white">{product.category}</Badge>
                </div>
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
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleAddToCart(product)}>
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
