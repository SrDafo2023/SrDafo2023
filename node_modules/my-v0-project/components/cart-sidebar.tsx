"use client"

import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCartIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/hooks/useUser"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export function CartSidebar() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart()
  const { user, loading } = useUser()
  const { toast } = useToast()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const [cardData, setCardData] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  });
  const [cardErrors, setCardErrors] = useState({
    name: false,
    number: false,
    expiry: false,
    cvv: false,
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [finalPaying, setFinalPaying] = useState(false);

  if (loading || !user || user.userType !== 'user') {
    return null
  }

  const validateCard = () => {
    const errors = {
      name: cardData.name.trim() === '',
      number: !/^\d{16}$/.test(cardData.number),
      expiry: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardData.expiry),
      cvv: !/^\d{3,4}$/.test(cardData.cvv),
    };
    setCardErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleCheckout = async () => {
    if (paymentMethod === 'tarjeta' && !validateCard()) return;
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setIsCheckoutOpen(false);
      clearCart();
      toast({
        title: '¡Compra realizada con éxito!',
        description: 'Tu pedido ha sido procesado correctamente.'
      });
      setPaymentMethod('');
      setCardData({ name: '', number: '', expiry: '', cvv: '' });
    }, 1500);
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

  const handleFinalPayment = () => {
    if (paymentMethod === 'tarjeta' && !validateCard()) return;
    setFinalPaying(true);
    setTimeout(() => {
      setFinalPaying(false);
      setShowPaymentModal(false);
      setIsCheckoutOpen(false);
      clearCart();
      toast({
        title: '¡Compra realizada con éxito!',
        description: 'Tu pedido ha sido procesado correctamente.'
      });
      setPaymentMethod('');
      setCardData({ name: '', number: '', expiry: '', cvv: '' });
    }, 1500);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCartIcon className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Carrito de Compras</SheetTitle>
          <SheetDescription>
            {getTotalItems() === 0 ? "Tu carrito está vacío" : `${getTotalItems()} productos en tu carrito`}
          </SheetDescription>
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

        {/* Modal de pago */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selecciona el método de pago</DialogTitle>
              <DialogDescription>Elige cómo deseas pagar tu compra.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
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
              {paymentMethod === 'tarjeta' && (
                <div className="space-y-2 mt-4">
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
            </div>
            <DialogFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!paymentMethod}
                onClick={() => setShowPaymentModal(true)}
              >
                Confirmar y Pagar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Mueve este modal aquí, fuera del Dialog anterior */}
        <Dialog open={showPaymentModal} onOpenChange={closePaymentModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ingresa los datos de pago</DialogTitle>
              <DialogDescription>Completa los datos para procesar tu compra.</DialogDescription>
            </DialogHeader>
            {paymentMethod === 'tarjeta' && (
              <div className="space-y-2 mt-2">
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
                {/* Puedes agregar más campos según el método */}
              </div>
            )}
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
