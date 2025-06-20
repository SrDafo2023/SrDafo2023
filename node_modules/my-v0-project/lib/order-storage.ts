import { db } from '@/config/firebase/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id?: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingMethod: string;
  notes: string;
  createdAt: any;
  updatedAt: any;
}

export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log('Order created successfully with ID:', orderRef.id);
    return orderRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrdersByCustomer = async (customerId: string): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const orders: Order[] = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({
        id: doc.id,
        ...doc.data()
      } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}; 