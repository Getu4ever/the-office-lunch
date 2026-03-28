'use client';
import { ShoppingBasket } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function StickyBasket() {
  // Pulling properties from context
  // Note: if 'isPulsing' still shows a red line here, proceed to Step 2
  const { setIsOpen, cartCount } = useCart();

  return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-8 right-8 z-[120] group animate-in fade-in zoom-in duration-500"
      aria-label="Open Basket"
    >
      <div className="relative bg-white w-20 h-20 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all hover:scale-110 active:scale-95">
        
        {/* The Basket Icon in your Brand Color */}
        <ShoppingBasket className="w-10 h-10 text-[#b32d3a] stroke-[1.5px]" />

        {/* The Black Badge positioned Top-Left */}
        <div className="absolute -top-1 -left-1 bg-black text-white text-sm font-black w-8 h-8 flex items-center justify-center rounded-full border-[3px] border-white shadow-md">
          {cartCount}
        </div>
      </div>
    </button>
  );
}