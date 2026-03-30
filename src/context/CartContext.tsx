'use client';
import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const MIN_ORDER_VALUE = 50.00;
const STANDARD_DELIVERY_FEE = 15.00;

type CartItem = {
  id: number | string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  isAvailable?: boolean;
};

type Address = {
  _id?: string;
  addressLine1: string;
  telephone: string;
  label?: string;
  isDefault?: boolean;
};

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  isPulsing: boolean;
  deliverySlot: string | null;
  selectedDate: string;
  selectedAddress: Address | null;
  setIsOpen: (open: boolean) => void;
  setDeliverySlot: (slot: string | null) => void;
  setSelectedDate: (date: string) => void;
  setSelectedAddress: (address: Address | null) => void;
  // UPDATED: addToCart now accepts optional coordinates for the animation
  addToCart: (product: any, coords?: { x: number; y: number }) => void;
  removeFromCart: (id: number | string) => void;
  decrementQuantity: (id: number | string) => void;
  clearCart: () => void;
  placeOrder: (userId?: string) => Promise<{ success: boolean; orderId?: string; error?: string }>;
  total: number;
  grandTotal: number;
  cartCount: number;
  minOrderMet: boolean;
  deliveryFee: number;
  amountToMin: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession(); 
  const today = new Date().toISOString().split('T')[0];

  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const [deliverySlot, setDeliverySlot] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  // NEW: Global State for Flying Animation
  const [flyingItem, setFlyingItem] = useState<{ id: number; x: number; y: number; img: string } | null>(null);

  useEffect(() => {
    const savedCart = localStorage.getItem('office_lunch_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse saved cart");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('office_lunch_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (status === "authenticated" && !selectedAddress) {
        try {
          const res = await fetch('/api/user/address'); 
          if (res.ok) {
            const userData = await res.json();
            const primary = userData.addresses?.find((addr: any) => addr.isDefault);
            if (primary) setSelectedAddress(primary);
          }
        } catch (err) {
          console.error("CartContext: Address Sync Error", err);
        }
      }
    };
    fetchUserAddress();
  }, [status, selectedAddress]);

  useEffect(() => {
    if (status === "unauthenticated") {
      setSelectedAddress(null);
    }
  }, [status]);

  // UPDATED: addToCart logic with global animation trigger
  const addToCart = (product: any, coords?: { x: number; y: number }) => {
    const productId = product.id || product._id || product.productId;
    
    // If coordinates are provided, trigger the flying animation
    if (coords) {
      setFlyingItem({
        id: Date.now(),
        x: coords.x,
        y: coords.y,
        img: product.image
      });
      setTimeout(() => setFlyingItem(null), 900);
    }

    setItems((prev) => {
      const existing = prev.find((i) => i.id === productId);
      const qtyToAdd = product.quantity || 1;

      if (existing) {
        return prev.map((i) => 
          i.id === productId ? { ...i, quantity: i.quantity + qtyToAdd } : i
        );
      }
      return [...prev, { 
        id: productId, 
        name: product.name, 
        price: product.price, 
        image: product.image, 
        quantity: qtyToAdd, 
        isAvailable: product.isAvailable ?? true 
      }];
    });
    
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 600);
  };

  const decrementQuantity = (id: number | string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target?.quantity === 1) return prev.filter((i) => i.id !== id);
      return prev.map((i) => i.id === id ? { ...i, quantity: i.quantity - 1 } : i);
    });
  };

  const removeFromCart = (id: number | string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = useCallback(() => {
    setItems([]);
    setDeliverySlot(null);
    setSelectedDate(today);
    setSelectedAddress(null);
    localStorage.removeItem('office_lunch_cart');
  }, [today]);

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFee = total > 0 ? STANDARD_DELIVERY_FEE : 0;
  const grandTotal = total + deliveryFee; 
  const minOrderMet = total >= MIN_ORDER_VALUE;
  const amountToMin = Math.max(0, MIN_ORDER_VALUE - total);

  const placeOrder = async (userId?: string) => {
    return { success: true };
  };

  return (
    <CartContext.Provider value={{ 
      items, isOpen, isPulsing, deliverySlot, selectedDate, selectedAddress,
      setIsOpen, setDeliverySlot, setSelectedDate, setSelectedAddress,
      addToCart, removeFromCart, decrementQuantity, clearCart, placeOrder, 
      total, grandTotal, cartCount, minOrderMet, deliveryFee, amountToMin
    }}>
      {children}

      {/* GLOBAL FLYING ANIMATION OVERLAY */}
      <style jsx global>{`
        @keyframes globalFlyToCart {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          /* Targets bottom right specifically for mobile/dashboard consistency */
          100% { left: 90%; top: 90%; transform: translate(-50%, -50%) scale(0.1); opacity: 0; }
        }
      `}</style>

      {flyingItem && (
        <div
          className="fixed pointer-events-none z-[9999] w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white bg-white"
          style={{
            left: flyingItem.x,
            top: flyingItem.y,
            animation: 'globalFlyToCart 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        >
          <img src={flyingItem.img} className="w-full h-full object-cover" alt="flying" />
        </div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};