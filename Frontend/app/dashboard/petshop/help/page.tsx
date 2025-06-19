"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function HelpPage() {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Centro de Ayuda</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">¿Cómo agregar un nuevo producto?</h4>
              <p className="text-sm text-gray-600">
                Ve a la sección de Inventario y haz clic en "Agregar Producto". Completa todos los campos requeridos y guarda los cambios.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">¿Cómo gestionar las ofertas?</h4>
              <p className="text-sm text-gray-600">
                En la sección de Ofertas, puedes crear, editar y eliminar ofertas. Asegúrate de establecer las fechas de inicio y fin.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">¿Cómo exportar reportes?</h4>
              <p className="text-sm text-gray-600">
                En la sección de Reportes, selecciona el período deseado y haz clic en "Exportar". Podrás descargar el reporte en formato Excel o PDF.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contacto Soporte</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Asunto</label>
              <Input placeholder="Describe brevemente tu problema" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Mensaje</label>
              <Textarea 
                placeholder="Explica detalladamente tu consulta..."
                rows={4}
              />
            </div>
            <Button className="w-full">Enviar Consulta</Button>
          </div>
        </Card>
      </div>
    </div>
  )
} 