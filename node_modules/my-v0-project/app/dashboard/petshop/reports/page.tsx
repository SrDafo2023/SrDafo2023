"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ReportsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reportes</h2>
        <div className="flex gap-2">
          <Button variant="outline">Filtrar</Button>
          <Button variant="outline">Exportar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reporte de Ventas */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Ventas por Categoría</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Alimentos</span>
              <span className="font-medium">45%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{width: "45%"}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span>Accesorios</span>
              <span className="font-medium">30%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{width: "30%"}}></div>
            </div>
            <div className="flex justify-between items-center">
              <span>Juguetes</span>
              <span className="font-medium">25%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full" style={{width: "25%"}}></div>
            </div>
          </div>
        </Card>

        {/* Reporte de Stock */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Estado del Inventario</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Productos en Stock</p>
                <p className="text-sm text-gray-500">150 productos</p>
              </div>
              <span className="text-green-600">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Bajo Stock</p>
                <p className="text-sm text-gray-500">8 productos</p>
              </div>
              <span className="text-red-600">10%</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Sin Stock</p>
                <p className="text-sm text-gray-500">5 productos</p>
              </div>
              <span className="text-gray-600">5%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 