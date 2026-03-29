'use client';
import { ShoppingBasket } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function StickyBasket() {
  const { setIsOpen, cartCount } = useCart();

  // If the cart is empty, we can choose to hide it or keep it for UX consistency.
  // Assuming we keep it visible as per your original logic.

  return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[120] group animate-in fade-in zoom-in duration-500"
      aria-label="Open Basket"
    >
      {/* Container: Scaled down to w-16 on mobile, w-20 on desktop */}
      <div className="relative bg-white w-16 h-16 md:w-20 md:h-20 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-stone-100">
        
        {/* Icon: Scaled from w-8 to w-10 */}
        <ShoppingBasket className="w-8 h-8 md:w-10 md:h-10 text-[#b32d3a] stroke-[1.5px]" />

        {/* Badge: Adjusted position and size for mobile */}
        <div className="absolute -top-1 -left-1 bg-black text-white text-[10px] md:text-sm font-black w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full border-[2px] md:border-[3px] border-white shadow-md">
          {cartCount}
        </div>

        {/* Subtle Pulse effect for visibility */}
        {cartCount > 0 && (
          <span className="absolute inset-0 rounded-full bg-[#b32d3a]/10 animate-ping -z-10" />
        )}
      </div>
    </button>
  );
}