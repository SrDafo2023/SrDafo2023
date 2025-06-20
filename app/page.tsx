"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Search,
  ShoppingCart,
  User,
  Phone,
  MessageCircle,
  Truck,
  Clock,
  Store,
  Headphones,
  Star,
  Heart,
  Sun,
  Moon,
} from "lucide-react"
import { useUser } from "@/hooks/useUser";
import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Home() {
  const { user, loading } = useUser();
  const { theme, setTheme } = useTheme();

  const baseCategories = [
    { name: "Perros", href: "/categoria/perros", icon: "🐕" },
    { name: "Gatos", href: "/categoria/gatos", icon: "🐱" },
    { name: "Pequeñas mascotas", href: "/categoria/pequenas", icon: "🐹" },
    { name: "Peces", href: "/categoria/peces", icon: "🐠" },
    { name: "Grooming", href: "/categoria/grooming", icon: "✂️" },
    { name: "Ofertas", href: "/ofertas", icon: "🏷️" },
    { name: "Servicios", href: "/servicios", icon: "🛠️" },
    { name: "Centros de Adopción", href: "/categoria/centros-de-adopcion", icon: "🐶" },
  ];

  const userCategories = user && !loading ? 
    baseCategories : 
    baseCategories;

  const featuredProducts = [
    {
      name: "Alimento Premium Perro",
      price: "$25.990",
      originalPrice: "$35.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop",
    },
    {
      name: "Arena Sanitaria Gato",
      price: "$8.990",
      originalPrice: "$12.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
    },
    {
      name: "Juguete Interactivo",
      price: "$15.990",
      originalPrice: "$19.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    },
    {
      name: "Correa Retráctil",
      price: "$12.990",
      originalPrice: "$16.990",
      discount: "15%",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    },
  ]

  const getDashboardPath = (user: any) => {
    switch (user?.userType) {
      case 'adoption-center':
        return '/dashboard/adoption-center';
      case 'grooming':
        return '/dashboard/grooming';
      default:
        return '/user/settings';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          {/* Top Bar */}
          <div className="flex justify-between items-center py-2 text-sm border-b border-purple-400">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Atención por teléfono: (+56) 2 2760 7777</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp: (+56) 9 7214 9999</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {loading ? (
                <Loader2Icon className="h-5 w-5 animate-spin" />
              ) : user ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="bg-orange-500 text-black hover:bg-orange-600"
                  >
                    <Link href={getDashboardPath(user)}>Mi Perfil</Link>
                  </Button>
                  {user && user.userType === 'admin' && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="bg-purple-700 text-white hover:bg-purple-800"
                    >
                      <Link href="/dashboard/admin">Panel Admin</Link>
                    </Button>
                  )}
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="text-white border-white hover:bg-white hover:text-purple-600"
                  >
                    <Link href="/login">Iniciar sesión</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-orange-500 hover:bg-orange-600 border-0">
                    <Link href="/register">Regístrate</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Main Header */}
          <div className="flex items-center justify-between py-4">
            <Link href="/" className="text-3xl font-bold">
              🐾 PetHelp
            </Link>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Input
                  placeholder="Busca tus marcas y productos favoritos"
                  className="w-full pl-4 pr-12 py-3 text-gray-800 bg-white rounded-lg"
                />
                <Button size="sm" className="absolute right-1 top-1 bg-orange-500 hover:bg-orange-600">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" asChild>
                <Link href="/favoritos">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 relative" asChild>
                <Link href="/carrito">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">0</Badge>
                </Link>
              </Button>
              {loading ? (
                <Loader2Icon className="h-5 w-5 animate-spin text-white" />
              ) : user ? (
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" asChild>
                  <Link href={user.userType === 'adoption-center' ? '/dashboard/adoption-center' : user.userType === 'grooming' ? '/dashboard/grooming' : '/user/settings'}>
                    <User className="h-5 w-5 text-black" />
                  </Link>
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" asChild>
                  <Link href="/login">
                    <User className="h-5 w-5 text-black" />
                  </Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="pb-4">
            <div className="flex items-center justify-center gap-8 overflow-x-auto">
              {userCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="flex items-center gap-2 text-white hover:text-orange-200 transition-colors whitespace-nowrap"
                >
                  <span className="text-lg">{category.icon}</span>
                  <span className="font-medium">{category.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Promotional Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 py-3">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-2xl">🚚</span>
              <div>
                <span className="font-bold text-lg">DELIVERY EXPRESS</span>
                <span className="ml-4 text-yellow-200">En compras sobre $60.000</span>
              </div>
            </div>
            <Button asChild className="bg-white text-orange-600 hover:bg-gray-100 font-bold">
              <Link href="/ofertas">COMPRAR</Link>
            </Button>
            <div className="text-sm">
              Válido del 29/05/25 al 01/06/25.
              <br />
              Sujeto a disponibilidad.
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-100 to-yellow-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <h1 className="text-6xl font-bold text-gray-800 mb-4">
                  SEMANA
                  <br />
                  <span className="text-orange-600">NATURAL</span>
                </h1>
                <Button asChild size="lg" className="bg-gray-800 hover:bg-gray-900 text-white px-8 py-3 rounded-full">
                  <Link href="/ofertas/semana-natural">COMPRAR</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="text-center">
                <div className="text-gray-600 text-lg mb-2">2da ud.</div>
                <div className="text-8xl font-bold text-gray-800 mb-2">
                  30<span className="text-4xl">%</span>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-2">DTO.</div>
                <div className="text-lg text-gray-600 mb-4">Alimento seco natural</div>
                <div className="text-sm text-gray-500">Productos seleccionados</div>
              </div>

              {/* Dog Image Placeholder */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="w-64 h-64 bg-orange-200 rounded-full flex items-center justify-center">
                  <span className="text-6xl">🐕</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">¡Exclusivo web!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <Link href={`/producto/${index}`} className="block">
                    <div className="relative mb-4">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">-{product.discount}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl font-bold text-purple-600">{product.price}</span>
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </Link>
                  <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                    <Link href={`/carrito/agregar/${index}`}>Agregar al carrito</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              <Link href="/categoria/perros">Ver todos los productos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-4 p-4">
              <Truck className="h-12 w-12 text-purple-600" />
              <div>
                <h3 className="font-bold text-gray-800">Despacho Gratis</h3>
                <p className="text-sm text-gray-600">Por compras mayores a $30.000</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <Clock className="h-12 w-12 text-purple-600" />
              <div>
                <h3 className="font-bold text-gray-800">Delivery Express</h3>
                <p className="text-sm text-gray-600">Tu pedido en menos de 3 horas</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <Store className="h-12 w-12 text-purple-600" />
              <div>
                <h3 className="font-bold text-gray-800">Retiro en tienda</h3>
                <p className="text-sm text-gray-600">¡Gratis!</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <Headphones className="h-12 w-12 text-purple-600" />
              <div>
                <h3 className="font-bold text-gray-800">Asesoría</h3>
                <p className="text-sm text-gray-600">Especializada</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">🐾 PetHelp</h3>
              <p className="text-gray-400">La tienda para mascotas felices</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Categorías</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/categoria/perros" className="hover:text-white">
                    Perros
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/gatos" className="hover:text-white">
                    Gatos
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/aves" className="hover:text-white">
                    Aves
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/peces" className="hover:text-white">
                    Peces
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Servicios</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/grooming" className="hover:text-white">
                    Grooming
                  </Link>
                </li>
                <li>
                  <Link href="/veterinaria" className="hover:text-white">
                    Veterinaria
                  </Link>
                </li>
                <li>
                  <Link href="/delivery" className="hover:text-white">
                    Delivery
                  </Link>
                </li>
                <li>
                  <Link href="/asesorias" className="hover:text-white">
                    Asesorías
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 (+56) 2 2760 7777</li>
                <li>📱 (+56) 9 7214 9999</li>
                <li>📧 contacto@pethelp.cl</li>
                <li>📍 Santiago, Chile</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 PetHelp. Todos los derechos reservados.</p>
            <p className="mt-2 text-xs">
              <Link href="/login?role=admin" className="text-gray-500 hover:text-gray-400">
                Acceso administrativo
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
