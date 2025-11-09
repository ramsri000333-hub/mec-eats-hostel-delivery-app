import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

export type OrderStatus = 'ordered' | 'accepted' | 'preparing' | 'on-the-way' | 'delivered';

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  deliveryAddress: {
    hostelBlock: string;
    roomNumber: string;
  };
  paymentMethod: 'cash' | 'upi' | 'card';
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (
    items: CartItem[],
    totalAmount: number,
    deliveryAddress: { hostelBlock: string; roomNumber: string },
    paymentMethod: 'cash' | 'upi' | 'card'
  ) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getUserOrders: () => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      
      createOrder: (items, totalAmount, deliveryAddress, paymentMethod) => {
        const newOrder: Order = {
          id: Date.now().toString(),
          items,
          totalAmount,
          deliveryAddress,
          paymentMethod,
          status: 'ordered',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set({ 
          orders: [newOrder, ...get().orders],
          currentOrder: newOrder,
        });
        
        return newOrder;
      },
      
      updateOrderStatus: (orderId, status) => {
        set({
          orders: get().orders.map((order) =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date() }
              : order
          ),
        });
        
        if (get().currentOrder?.id === orderId) {
          set({
            currentOrder: {
              ...get().currentOrder!,
              status,
              updatedAt: new Date(),
            },
          });
        }
      },
      
      getOrderById: (orderId) => {
        return get().orders.find((order) => order.id === orderId);
      },
      
      getUserOrders: () => {
        return get().orders;
      },
    }),
    {
      name: 'order-storage',
    }
  )
);