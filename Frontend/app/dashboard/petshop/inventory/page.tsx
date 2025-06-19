"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SearchIcon } from "lucide-react"

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const inventory = [
    {
      id: 1,
      name: "Royal Canin Maxi Adult",
      category: "Alimento",
      stock: 45,
      minStock: 20,
      price: 89.99,
      status: "En stock"
    },
    {
      id: 2,
      name: "Collar antipulgas",
      category: "Accesorios",
      stock: 15,
      minStock: 25,
      price: 29.99,
      status: "Bajo stock"
    },
    {
      id: 3,
      name: "Juguete para gatos",
      category: "Juguetes",
      stock: 60,
      minStock: 30,
      price: 12.99,
      status: "En stock"
    },
    {
      id: 4,
      name: "Arena para gatos",
      category: "Higiene",
      stock: 8,
      minStock: 15,
      price: 19.99,
      status: "Bajo stock"
    },
    {
      id: 5,
      name: "Cama para perros L",
      category: "Accesorios",
      stock: 12,
      minStock: 10,
      price: 45.99,
      status: "En stock"
    }
  ]

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Control de Inventario</h1>
        <Button>Agregar Producto</Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Total de Productos</p>
            <p className="text-2xl font-bold">150</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Productos Bajo Stock</p>
            <p className="text-2xl font-bold text-red-600">8</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Valor del Inventario</p>
            <p className="text-2xl font-bold">$25,430</p>
          </div>
        </Card>
        <Card className="p-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Categorías</p>
            <p className="text-2xl font-bold">12</p>
          </div>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar productos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">Filtrar</Button>
        <Button variant="outline">Exportar</Button>
      </div>

      {/* Inventory Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.stock}
                    {item.stock < item.minStock && (
                      <Badge variant="destructive" className="ml-2">Bajo stock</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>${item.price}</TableCell>
                <TableCell>
                  <Badge
                    variant={item.status === "En stock" ? "default" : "destructive"}
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">Editar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
