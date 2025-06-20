"use client";

import { useCart } from "@/contexts/cart-context";
import { useUser } from "@/hooks/useUser";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon, MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

// Función para formatear a CLP
const formatCLP = (value: number) => {
  if (isNaN(value)) return "$0";
  return `$${Math.round(value).toLocaleString('es-CL')}`;
};

export default function CarritoPage() {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice, createOrderFromCart } = useCart();
  const { user, loading } = useUser();
  const { toast } = useToast();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s+/g, '');
    const cleanedValue = rawValue.replace(/\D/g, '').slice(0, 16);
    const formattedValue = cleanedValue.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formattedValue);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
  if (!user) {
    return <div className="flex justify-center items-center h-screen">Por favor, inicia sesión para ver tu carrito.</div>;
  }

  const isFormComplete = customerPhone && customerAddress && cardNumber.replace(/\s/g, '').length >= 15 && cardExpiry.length >= 4 && cardCVC.length >= 3;

  const handleCheckout = async () => {
    const paymentMethod = "Tarjeta de Crédito"; // Simulado
    const shippingMethod = "Envío Estándar"; // Simulado

    if (!customerAddress || !customerPhone) {
      toast({
        title: 'Faltan datos',
        description: 'Por favor, completa tu teléfono y dirección de envío.',
        variant: 'destructive'
      });
      return;
    }

    if (!isFormComplete) {
      toast({
        title: 'Formulario incompleto',
        description: 'Por favor, completa todos los campos de envío y pago.',
        variant: 'destructive'
      });
      return;
    }

    setIsPaying(true);
    try {
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

      setIsCheckoutOpen(false);
      toast({
        title: '¡Compra realizada con éxito!',
        description: `Tu pedido #${orderId} ha sido procesado correctamente.`
      });
      
      // Reset form
      setCustomerAddress('');
      setCustomerPhone('');
      setNotes('');
      setCardNumber('');
      setCardExpiry('');
      setCardCVC('');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: 'Error al procesar el pedido',
        description: 'Hubo un problema al procesar tu compra. Por favor intenta nuevamente.',
        variant: 'destructive'
      });
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de Compras</h1>
      
      {items.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
          <p className="text-gray-500 mt-2">Añade productos para verlos aquí.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ShoppingCartIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-600">{formatCLP(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <MinusIcon className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right font-semibold w-24">
                    {formatCLP(item.price * item.quantity)}
                  </div>
                  <Button variant="ghost" size="icon" className="text-gray-500 hover:text-red-600" onClick={() => removeFromCart(item.id)}>
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardHeader><CardTitle>Resumen del Pedido</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between"><span>Subtotal</span><span>{formatCLP(getTotalPrice())}</span></div>
                <div className="flex justify-between"><span>Envío</span><span>Gratis</span></div>
                <Separator />
                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCLP(getTotalPrice())}</span></div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => setIsCheckoutOpen(true)}>Proceder al Pago</Button>
                <Button variant="outline" className="w-full" onClick={clearCart}>Vaciar Carrito</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Información de Envío y Pago</DialogTitle>
            <DialogDescription>Completa los datos para procesar tu compra.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono de Contacto</Label>
              <Input id="phone" type="tel" placeholder="+56 9 1234 5678" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Dirección de Envío</Label>
              <Input id="address" type="text" placeholder="Av. Siempre Viva 742, Santiago" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
            </div>
            <Separator className="my-2" />
            <div className="space-y-3">
              <Label className="font-semibold">Datos de la Tarjeta</Label>
              <Input 
                placeholder="0000 0000 0000 0000" 
                value={cardNumber} 
                onChange={handleCardNumberChange}
                maxLength={19}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="MM/AA" value={cardExpiry} onChange={(e) => setCardExpiry(e.target.value)} />
                <Input placeholder="CVC" value={cardCVC} onChange={(e) => setCardCVC(e.target.value)} />
              </div>
            </div>
             <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea id="notes" placeholder="Instrucciones especiales para la entrega..." value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)}>Cancelar</Button>
            <Button onClick={handleCheckout} disabled={!isFormComplete || isPaying} className="bg-blue-600 hover:bg-blue-700 data-[disabled]:bg-gray-400 data-[disabled]:cursor-not-allowed">
              {isPaying ? "Procesando..." : `Pagar ${formatCLP(getTotalPrice())}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 