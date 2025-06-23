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
  Scissors,
  Sparkles,
  Dog,
} from "lucide-react"
import { useUser } from "@/hooks/useUser";
import { Loader2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { AddReviewForm } from "@/components/reviews/AddReviewForm";

export default function Home() {
  const { user, loading } = useUser();
  const { theme, setTheme } = useTheme();
  const { addToCart, getTotalItems } = useCart();
  const { toast } = useToast();

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
      id: 1,
      name: "Alimento Premium Perro",
      price: "$25.990",
      originalPrice: "$35.990",
      discount: "30%",
      image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Arena Sanitaria Gato",
      price: "$8.990",
      originalPrice: "$12.990",
      discount: "25%",
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Juguete Interactivo",
      price: "$15.990",
      originalPrice: "$19.990",
      discount: "20%",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      name: "Correa Retráctil",
      price: "$12.990",
      originalPrice: "$16.990",
      discount: "15%",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop",
    },
  ]

  const featuredServices = [
    {
      name: "Corte y Peinado",
      description: "Estilo y confort para tu mascota, adaptado a su raza y tipo de pelo.",
      icon: Scissors,
      href: "/servicios/corte-peinado",
    },
    {
      name: "Baño y Secado Premium",
      description: "Limpieza profunda con productos hipoalergénicos de alta calidad.",
      icon: Sparkles,
      href: "/servicios/bano-secado",
    },
    {
      name: "Tratamiento Antipulgas",
      description: "Protección completa para mantener a tu amigo libre de parásitos.",
      icon: Dog,
      href: "/servicios/antipulgas",
    },
     {
      name: "Limpieza Dental",
      description: "Cuidado oral para un aliento fresco y una sonrisa saludable.",
      icon: Heart,
      href: "/servicios/limpieza-dental",
    },
  ];

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

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id || product.name,
      name: product.name,
      price: parseInt(product.price.replace(/[^0-9]/g, "")),
      image: product.image,
    });
    toast({
      title: "Producto agregado",
      description: `${product.name} ha sido agregado al carrito`,
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center py-2 text-sm border-b border-purple-400">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-2 sm:mb-0">
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
                  {user.userType === 'admin' && (
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
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
            <Link href="/" className="text-3xl font-bold">
              🐾 PetHelp
            </Link>

            <div className="w-full sm:flex-1 max-w-2xl">
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

            <div className="hidden sm:flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" asChild>
                <Link href="/favoritos">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 relative" asChild>
                <Link href="/carrito">
                  <ShoppingCart className="h-5 w-5" />
                  {getTotalItems() > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs">{getTotalItems()}</Badge>
                  )}
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
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Category Navigation */}
          <nav className="flex items-center justify-center py-2 overflow-x-auto">
            <div className="flex items-center gap-4 sm:gap-6">
              {userCategories.map((category) => (
                <Link key={category.name} href={category.href} className="flex-shrink-0 flex items-center gap-2 text-sm font-medium text-white hover:text-orange-300 transition-colors">
                  <span>{category.icon}</span>
                  <span className="hidden md:inline">{category.name}</span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="bg-yellow-100 dark:bg-yellow-900/50 text-center py-12 px-4 sm:py-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            SEMANA <span className="text-orange-500">NATURAL</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-yellow-200/80">
            Alimentos y snacks saludables para tu mascota.
          </p>
        </section>

        {/* Featured Products Section */}
        <section className="py-12 sm:py-16 bg-gray-50 dark:bg-slate-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">¡Exclusivo web!</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                    <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => handleAddToCart(product)}>
                      Agregar al carrito
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button variant="outline" asChild>
                <Link href="/productos">Ver todos los productos</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="py-12 sm:py-16 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Nuestros Servicios de Grooming</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredServices.map((service, index) => (
                <Card key={index} className="bg-gray-50 dark:bg-slate-800 text-center p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="mx-auto w-16 h-16 mb-4 bg-purple-100 dark:bg-purple-900/50 rounded-full flex items-center justify-center">
                    <service.icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">{service.description}</p>
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
                    <Link href={service.href}>Saber más</Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Review Form Section */}
        <section className="bg-gray-50 dark:bg-slate-800/50 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AddReviewForm />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="bg-gray-100 dark:bg-slate-800">
          <div className="container mx-auto px-4 py-12 sm:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <Truck className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Despacho Gratis</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Por compras mayores a $30.000</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Clock className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Delivery Express</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Tu pedido en menos de 3 horas</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Store className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Retiro en tienda</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">¡Gratis!</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Headphones className="h-10 w-10 text-purple-600 dark:text-purple-400" />
                <h3 className="font-bold text-lg text-gray-800 dark:text-white">Asesoría</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">Especializada</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-slate-900 text-gray-300">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
          <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} PetHelp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
