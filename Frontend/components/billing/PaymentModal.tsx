"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAuth } from "firebase/auth";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreditCard, Loader2 } from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  planPrice: string;
  planType: 'monthly' | 'yearly';
}

// 1. Definir el esquema de validación con Zod
const paymentSchema = z.object({
  cardHolder: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres." }),
  cardNumber: z.string().regex(/^\d{4} \d{4} \d{4} \d{4}$/, { message: "El número de tarjeta debe tener 16 dígitos." }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, { message: "El formato debe ser MM/AA." }).refine(val => {
      const [month, year] = val.split('/');
      const expiry = new Date(Number(`20${year}`), Number(month));
      return expiry > new Date();
  }, { message: "La tarjeta está vencida." }),
  cvc: z.string().regex(/^\d{3,4}$/, { message: "El CVC debe tener 3 o 4 dígitos." }),
});

export function PaymentModal({ isOpen, onClose, planName, planPrice, planType }: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // 2. Configurar react-hook-form
  const form = useForm<z.infer<typeof paymentSchema>>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      cardHolder: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  const handlePayment = async (values: z.infer<typeof paymentSchema>) => {
    setIsProcessing(true);

    // --- SIMULACIÓN DE PAGO ---
    // Se ha vuelto a una simulación temporal mientras se resuelve el despliegue del backend.
    // El siguiente código NO actualiza la base de datos.
    console.log("Simulando pago con los siguientes datos válidos:", values);
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert(`¡Pago simulado exitoso para el plan ${planName}! Por favor, actualiza la base de datos manualmente.`);
    onClose();
    setIsProcessing(false);
    
    /*
    // --- CÓDIGO DE CONEXIÓN REAL AL BACKEND (TEMPORALMENTE DESACTIVADO) ---
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Debes iniciar sesión para suscribirte.");
      }
      const token = await currentUser.getIdToken();
      // ¡IMPORTANTE! Esta URL debe ser la de la nube, no la del emulador, una vez desplegado.
      const apiUrl = 'http://127.0.0.1:5001/pethelp-a4e95/us-central1/api'; 

      const response = await fetch(`${apiUrl}/subscriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planId: planType }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Fallo al procesar la suscripción en el servidor.');
      }
      
      alert(`¡Suscripción al ${planName} exitosa! Tu plan ha sido activado.`);
      onClose();

    } catch (error) {
      console.error("Error durante el proceso de suscripción:", error);
      const errorMessage = error instanceof Error ? error.message : "Ocurrió un error desconocido.";
      alert(`Error en la suscripción: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
    */
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Suscripción al Plan {planName}</DialogTitle>
          <DialogDescription>
            Estás a un paso de acceder a todos los beneficios. Total a pagar: ${planPrice}.
          </DialogDescription>
        </DialogHeader>
        {/* 3. Envolver el formulario con el Form provider */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handlePayment)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="cardHolder"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Titular</FormLabel>
                    <FormControl>
                      <Input placeholder="Juan Pérez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Tarjeta</FormLabel>
                    <FormControl>
                       <div className="relative">
                        <Input
                          placeholder="0000 0000 0000 0000"
                          {...field}
                          onChange={(e) => {
                            const inputVal = e.target.value.replace(/\D/g, '');
                            const formattedVal = inputVal.match(/.{1,4}/g)?.join(' ').slice(0, 19) || '';
                            field.onChange(formattedVal);
                          }}
                        />
                        <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vencimiento (MM/AA)</FormLabel>
                      <FormControl>
                        <Input placeholder="MM/AA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="cvc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVC</FormLabel>
                      <FormControl>
                        <Input placeholder="CVC" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  `Pagar $${planPrice}`
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 