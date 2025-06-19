"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function OffersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Ofertas</h2>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Nueva Oferta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Oferta Activa 1 */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">2x1 en Alimentos</h3>
                <p className="text-sm text-gray-500">Válido hasta: 31/03/2024</p>
              </div>
              <Button variant="outline" size="sm">Editar</Button>
            </div>
            <p className="text-sm">Lleva 2 bolsas de alimento y paga 1</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Activa</span>
              <span className="text-xs text-gray-500">10 productos</span>
            </div>
          </div>
        </Card>

        {/* Oferta Activa 2 */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">30% en Accesorios</h3>
                <p className="text-sm text-gray-500">Válido hasta: 15/03/2024</p>
              </div>
              <Button variant="outline" size="sm">Editar</Button>
            </div>
            <p className="text-sm">Descuento en toda la línea de accesorios</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">Activa</span>
              <span className="text-xs text-gray-500">25 productos</span>
            </div>
          </div>
        </Card>

        {/* Oferta Próxima */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">Descuento Primavera</h3>
                <p className="text-sm text-gray-500">Inicia: 01/04/2024</p>
              </div>
              <Button variant="outline" size="sm">Editar</Button>
            </div>
            <p className="text-sm">25% en productos seleccionados</p>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full">Próxima</span>
              <span className="text-xs text-gray-500">15 productos</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 