"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { createOrder, type Order } from "@/lib/order-storage"
import { useToast } from "@/components/ui/use-toast"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartContextType {
  items: CartItem[]
  addToCart: (product: { id: number; name: string; price: number; image?: string }) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  createOrderFromCart: (orderData: {
    customerId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerAddress: string
    paymentMethod: string
    shippingMethod: string
    notes: string
  }) => Promise<string>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  const addToCart = (product: { id: number; name: string; price: number; image?: string }) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    toast({
      title: "¡Agregado!",
      description: `"${product.name}" se ha agregado a tu carrito.`,
      duration: 10000,
      className: "bg-green-100 border-green-300 text-green-800",
    })
  }

  const removeFromCart = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const createOrderFromCart = async (orderData: {
    customerId: string
    customerName: string
    customerEmail: string
    customerPhone: string
    customerAddress: string
    paymentMethod: string
    shippingMethod: string
    notes: string
  }): Promise<string> => {
    if (items.length === 0) {
      throw new Error("No hay items en el carrito")
    }

    const order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      ...orderData,
      items: items.map(item => ({
        productId: String(item.id),
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      total: getTotalPrice(),
      status: 'pending',
    }

    const orderId = await createOrder(order as Omit<Order, 'id'>)
    
    // Limpiar el carrito después de crear el pedido
    clearCart()
    
    return orderId
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
        createOrderFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
