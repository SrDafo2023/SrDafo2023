"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Star, Heart, ShoppingCart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"

export default function GatosPage() {
  const { toast } = useToast()
  const [activeCategory, setActiveCategory] = useState("Todos")
  const [favorites, setFavorites] = useState<number[]>([])
  const { addToCart } = useCart()

  const products = [
    {
      id: 1,
      name: "Alimento Premium Gato Adulto",
      price: "$22.990",
      originalPrice: "$29.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop",
      rating: 5,
      category: "Alimento",
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
    },
    {
      id: 3,
      name: "Rascador Torre",
      price: "$35.990",
      originalPrice: "$45.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
      rating: 5,
      category: "Accesorios",
    },
    {
      id: 4,
      name: "Juguete Ratón con Hierba Gatera",
      price: "$4.990",
      originalPrice: "$7.990",
      discount: "35%",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
      rating: 4,
      category: "Juguetes",
    },
    {
      id: 5,
      name: "Transportadora Mediana",
      price: "$25.990",
      originalPrice: "$32.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop",
      rating: 5,
      category: "Transporte",
    },
    {
      id: 6,
      name: "Snacks Naturales",
      price: "$5.990",
      originalPrice: "$8.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop",
      rating: 4,
      category: "Snacks",
    },
  ]

  const categories = ["Todos", "Alimento", "Higiene", "Juguetes", "Accesorios", "Transporte", "Snacks"]

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: parseInt(product.price.replace(/[^0-9]/g, "")),
      image: product.image,
    })
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
            <span className="text-6xl">🐱</span>
            <div>
              <h1 className="text-4xl font-bold">Productos para Gatos</h1>
              <p className="text-xl text-purple-100">Todo para el bienestar de tu gato</p>
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
