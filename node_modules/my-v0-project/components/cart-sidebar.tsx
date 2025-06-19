"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCartIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/contexts/cart-context"
import { useUser } from "@/hooks/useUser"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function CartSidebar() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice, createOrderFromCart } = useCart()
  const { user } = useUser()
  const { toast } = useToast()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [shippingMethod, setShippingMethod] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [finalPaying, setFinalPaying] = useState(false)
  const [customerAddress, setCustomerAddress] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: ''
  })
  const [cardErrors, setCardErrors] = useState({
    name: false,
    number: false,
    expiry: false,
    cvv: false
  })

  const validateCard = () => {
    const errors = {
      name: cardData.name.length < 3,
      number: cardData.number.length !== 16,
      expiry: !/^\d{2}\/\d{2}$/.test(cardData.expiry),
      cvv: cardData.cvv.length < 3 || cardData.cvv.length > 4
    }
    setCardErrors(errors)
    return !Object.values(errors).some(Boolean)
  }

  const handleCheckout = async () => {
    if (!paymentMethod || !shippingMethod || !customerAddress || !customerPhone) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos.',
        variant: 'destructive'
      });
      return;
    }

    if (paymentMethod === 'tarjeta' && !validateCard()) return;
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsCheckoutOpen(false);
      setShowPaymentModal(true);
    }, 1500);
  };

  const handleFinalPayment = async () => {
    if (paymentMethod === 'tarjeta' && !validateCard()) return;
    setFinalPaying(true);
    
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const orderId = await createOrderFromCart({
        customerId: user.id,
        customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName,
        customerEmail: user.email || '',
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        paymentMethod: paymentMethod,
        shippingMethod: shippingMethod,
        notes: notes,
      });

      setFinalPaying(false);
      setShowPaymentModal(false);
      setIsCheckoutOpen(false);
      
      toast({
        title: '¡Compra realizada con éxito!',
        description: `Tu pedido #${orderId} ha sido procesado correctamente.`
      });
      
      // Reset form
      setPaymentMethod('');
      setShippingMethod('');
      setCustomerAddress('');
      setCustomerPhone('');
      setNotes('');
      setCardData({ name: '', number: '', expiry: '', cvv: '' });
    } catch (error) {
      console.error('Error creating order:', error);
      setFinalPaying(false);
      toast({
        title: 'Error al procesar el pedido',
        description: 'Hubo un problema al procesar tu compra. Por favor intenta nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const openPaymentModal = () => {
    setIsCheckoutOpen(false);
    setTimeout(() => setShowPaymentModal(true), 200);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setFinalPaying(false);
    setCardData({ name: '', number: '', expiry: '', cvv: '' });
    setCardErrors({ name: false, number: false, expiry: false, cvv: false });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCartIcon className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCartIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No hay productos en tu carrito</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 bg-blue-100 rounded-md flex items-center justify-center">
                      <ShoppingCartIcon className="h-6 w-6 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <MinusIcon className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <PlusIcon className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <TrashIcon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold text-lg">${getTotalPrice().toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsCheckoutOpen(true)}>
                    Proceder al Pago
                  </Button>
                  <Button variant="outline" className="w-full" onClick={clearCart}>
                    Vaciar Carrito
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal de checkout */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Información de Envío y Pago</DialogTitle>
              <DialogDescription>Completa los datos para procesar tu compra.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Información de contacto */}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+51 987 654 321"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Dirección de envío *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Av. Principal 123, Lima"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                />
              </div>

              {/* Método de envío */}
              <div className="space-y-2">
                <Label>Método de envío *</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="estandar"
                      checked={shippingMethod === 'estandar'}
                      onChange={() => setShippingMethod('estandar')}
                    />
                    Envío estándar (3-5 días)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="express"
                      checked={shippingMethod === 'express'}
                      onChange={() => setShippingMethod('express')}
                    />
                    Envío express (1-2 días)
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="shippingMethod"
                      value="tienda"
                      checked={shippingMethod === 'tienda'}
                      onChange={() => setShippingMethod('tienda')}
                    />
                    Recojo en tienda
                  </label>
                </div>
              </div>

              {/* Método de pago */}
              <div className="space-y-2">
                <Label>Método de pago *</Label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="tarjeta"
                      checked={paymentMethod === 'tarjeta'}
                      onChange={() => setPaymentMethod('tarjeta')}
                    />
                    Tarjeta Débito/Crédito
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mercadopago"
                      checked={paymentMethod === 'mercadopago'}
                      onChange={() => setPaymentMethod('mercadopago')}
                    />
                    MercadoPago
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="webpay"
                      checked={paymentMethod === 'webpay'}
                      onChange={() => setPaymentMethod('webpay')}
                    />
                    WebPay
                  </label>
                </div>
              </div>

              {/* Notas adicionales */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notas adicionales (opcional)</Label>
                <Input
                  id="notes"
                  type="text"
                  placeholder="Instrucciones especiales para la entrega"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!paymentMethod || !shippingMethod || !customerAddress || !customerPhone || isPaying}
                onClick={handleCheckout}
              >
                {isPaying ? 'Procesando...' : 'Confirmar y Pagar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Modal de pago final */}
        <Dialog open={showPaymentModal} onOpenChange={closePaymentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ingresa los datos de pago</DialogTitle>
              <DialogDescription>Completa los datos para procesar tu compra.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {paymentMethod === 'tarjeta' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nombre en la tarjeta"
                    className={`w-full border rounded px-3 py-2 ${cardErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                    value={cardData.name}
                    onChange={e => setCardData({ ...cardData, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Número de tarjeta (16 dígitos)"
                    maxLength={16}
                    className={`w-full border rounded px-3 py-2 ${cardErrors.number ? 'border-red-500' : 'border-gray-300'}`}
                    value={cardData.number}
                    onChange={e => setCardData({ ...cardData, number: e.target.value.replace(/[^0-9]/g, '') })}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      className={`w-1/2 border rounded px-3 py-2 ${cardErrors.expiry ? 'border-red-500' : 'border-gray-300'}`}
                      value={cardData.expiry}
                      onChange={e => setCardData({ ...cardData, expiry: e.target.value.replace(/[^0-9\/]/g, '') })}
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      maxLength={4}
                      className={`w-1/2 border rounded px-3 py-2 ${cardErrors.cvv ? 'border-red-500' : 'border-gray-300'}`}
                      value={cardData.cvv}
                      onChange={e => setCardData({ ...cardData, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                    />
                  </div>
                  {Object.values(cardErrors).some(Boolean) && (
                    <div className="text-red-500 text-xs">Por favor, completa los datos bancarios correctamente.</div>
                  )}
                </div>
              )}
              {(paymentMethod === 'mercadopago' || paymentMethod === 'webpay') && (
                <div className="space-y-2 mt-2">
                  <input
                    type="text"
                    placeholder="Correo electrónico"
                    className="w-full border rounded px-3 py-2 border-gray-300"
                  />
                  <input
                    type="text"
                    placeholder="Nombre completo"
                    className="w-full border rounded px-3 py-2 border-gray-300"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={finalPaying || (paymentMethod === 'tarjeta' && !validateCard())}
                onClick={handleFinalPayment}
              >
                {finalPaying ? 'Procesando...' : 'Pagar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SheetContent>
    </Sheet>
  )
}
