"use client";

import { useCart } from "@/contexts/cart-context";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCartIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { CartProvider } from "@/contexts/cart-context";

export default function CarritoPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalItems, getTotalPrice } = useCart();
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  if (loading) {
    return <div className="flex justify-center items-center h-40">Cargando...</div>;
  }
  if (!user || user.userType !== 'user') {
    return <div className="flex justify-center items-center h-40">Acceso solo para usuarios.</div>;
  }

  const handleCheckout = async () => {
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
    }, 1500);
  };

  return (
    <CartProvider>
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <ShoppingCartIcon className="h-6 w-6" /> Carrito de Compras
        </h1>
        {items.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingCartIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No hay productos en tu carrito</p>
          </div>
        ) : (
          <>
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-6">
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

            <div className="space-y-4 mt-6">
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
            </div>
            <DialogFooter>
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!paymentMethod || isPaying}
                onClick={handleCheckout}
              >
                {isPaying ? 'Procesando...' : 'Confirmar y Pagar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </CartProvider>
  );
} 