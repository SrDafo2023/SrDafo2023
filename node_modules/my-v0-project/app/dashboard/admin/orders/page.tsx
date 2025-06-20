"use client"

import { useEffect, useState } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase/firebase';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
  }).format(amount);
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setError(null);
        setLoading(true);
        const ordersCollection = collection(db, 'orders');
        const querySnapshot = await getDocs(ordersCollection);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("No se pudieron cargar los pedidos. Es posible que no tengas los permisos necesarios. Asegúrate de haber publicado las reglas de Firestore.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusVariant = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500';
      case 'processing':
        return 'bg-blue-500';
      case 'shipped':
        return 'bg-purple-500';
      case 'delivered':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (orders.length === 0) {
    return (
        <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
            <p className="text-gray-600">No hay pedidos para mostrar.</p>
        </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Pedidos</h1>
       <Card>
        <CardHeader>
          <CardTitle>Todos los Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>{order.customerName || order.customerId}</TableCell>
                  <TableCell>{order.createdAt.toDate().toLocaleDateString('es-CL')}</TableCell>
                  <TableCell className="font-semibold">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusVariant(order.status)} text-white`}>{order.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>
                      Ver Detalle
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedOrder} onOpenChange={(isOpen) => { if (!isOpen) setSelectedOrder(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle del Pedido</DialogTitle>
            <DialogDescription>
              ID del pedido: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm">Cliente</h3>
                  <p>{selectedOrder.customerName || selectedOrder.customerId}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Fecha del Pedido</h3>
                  <p>{selectedOrder.createdAt.toDate().toLocaleString('es-CL')}</p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2">Artículos</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-right">Precio Unit.</TableHead>
                      <TableHead className="text-right">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell className="text-center">{item.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end items-center mt-4 pt-4 border-t">
                 <div className="text-right">
                    <p className="text-muted-foreground">Total del Pedido</p>
                    <p className="font-bold text-2xl">{formatCurrency(selectedOrder.total)}</p>
                 </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 