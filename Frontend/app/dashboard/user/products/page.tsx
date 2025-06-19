"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ShoppingBagIcon, SearchIcon, ShoppingCartIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context"

export default function ProductsPage() {
  const { addToCart } = useCart()

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const products = [
    {
      id: 1,
      name: "Premium Dog Food",
      description: "Comida premium para perros con ingredientes naturales",
      price: 45.99,
      category: "Comida",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.8,
      inStock: true,
    },
    {
      id: 2,
      name: "Interactive Ball Toy",
      description: "Pelota interactiva que mantiene entretenida a tu mascota",
      price: 12.99,
      category: "Juguetes",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      inStock: true,
    },
    {
      id: 3,
      name: "Dental Chew Treats",
      description: "Snacks que ayudan a mantener la salud dental",
      price: 8.99,
      category: "Snacks",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.7,
      inStock: true,
    },
    {
      id: 4,
      name: "Cat Premium Food",
      description: "Alimento premium para gatos de todas las edades",
      price: 39.99,
      category: "Comida",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.6,
      inStock: true,
    },
    {
      id: 5,
      name: "Pet Bed - Medium",
      description: "Cama cómoda y suave para mascotas medianas",
      price: 29.99,
      category: "Accesorios",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.4,
      inStock: true,
    },
    {
      id: 6,
      name: "Pet Shampoo",
      description: "Champú suave y natural para el cuidado del pelaje",
      price: 14.99,
      category: "Higiene",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.3,
      inStock: true,
    },
    {
      id: 7,
      name: "Cat Toy Mouse",
      description: "Ratón de juguete con sonido para gatos",
      price: 5.99,
      category: "Juguetes",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.2,
      inStock: true,
    },
    {
      id: 8,
      name: "Dog Leash",
      description: "Correa resistente y cómoda para paseos",
      price: 18.99,
      category: "Accesorios",
      image: "/placeholder.svg?height=200&width=200",
      rating: 4.5,
      inStock: false,
    },
  ]

  return (
    <div className="flex flex-col">
      <DashboardHeader role="user" title="Productos" />
      <main className="flex-1 space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
            <p className="text-muted-foreground">Explora nuestra variedad de productos para mascotas</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="w-[200px] pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="comida">Comida</TabsTrigger>
            <TabsTrigger value="juguetes">Juguetes</TabsTrigger>
            <TabsTrigger value="snacks">Snacks</TabsTrigger>
            <TabsTrigger value="accesorios">Accesorios</TabsTrigger>
            <TabsTrigger value="higiene">Higiene</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="aspect-square bg-blue-100 flex items-center justify-center">
                    <ShoppingBagIcon className="h-16 w-16 text-blue-500" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                      <Badge variant={product.inStock ? "default" : "secondary"}>
                        {product.inStock ? "En stock" : "Agotado"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold">${product.price}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-sm text-yellow-500">★</span>
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!product.inStock}
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCartIcon className="mr-2 h-4 w-4" />
                      {product.inStock ? "Agregar al carrito" : "No disponible"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          {["comida", "juguetes", "snacks", "accesorios", "higiene"].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products
                  .filter((product) => product.category.toLowerCase() === category)
                  .map((product) => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="aspect-square bg-blue-100 flex items-center justify-center">
                        <ShoppingBagIcon className="h-16 w-16 text-blue-500" />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                          <Badge variant={product.inStock ? "default" : "secondary"}>
                            {product.inStock ? "En stock" : "Agotado"}
                          </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-2xl font-bold">${product.price}</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-yellow-500">★</span>
                            <span className="text-sm">{product.rating}</span>
                          </div>
                        </div>
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          disabled={!product.inStock}
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCartIcon className="mr-2 h-4 w-4" />
                          {product.inStock ? "Agregar al carrito" : "No disponible"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}
