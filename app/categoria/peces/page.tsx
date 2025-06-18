import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Settings, Clock } from "lucide-react"

export default function PecesPage() {
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
            <span className="text-6xl">🐠</span>
            <div>
              <h1 className="text-4xl font-bold">Productos para Peces</h1>
              <p className="text-xl text-purple-100">Sección en mantenimiento</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="p-8">
            <CardContent className="space-y-6">
              <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                <Settings className="h-12 w-12 text-blue-600" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-gray-800">Sección en Mantenimiento</h2>
                <p className="text-lg text-gray-600">
                  Estamos preparando una experiencia increíble para el cuidado de peces.
                </p>
                <p className="text-gray-500">
                  Muy pronto tendremos disponible acuarios, filtros, alimentos especializados, decoraciones y todo lo
                  necesario para el mundo acuático.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-blue-600">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Disponible próximamente</span>
              </div>

              <div className="pt-4">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/">Volver al inicio</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
