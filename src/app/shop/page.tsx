'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Plus, Star } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Heritage Jollof Rice",
    price: 12.50,
    image: "https://i.ibb.co/4g9yVJys/heritage-jollof-rice.png",
    description: "Our signature long-grain rice infused with scotch bonnet, plum tomatoes, and hardwood smoke."
  },
  {
    id: 2,
    name: "Honey Glazed Jerk Wings",
    price: 8.50,
    image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&q=80&w=800",
    description: "24-hour marinated house jerk spice wings, glazed with organic honey and charred to perfection."
  },
  {
    id: 3,
    name: "Slow-Cooked Goat Curry",
    price: 15.50,
    image: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&q=80&w=800",
    description: "Tender chunks of goat meat simmered in a rich, aromatic Caribbean curry sauce with thyme."
  },
  {
    id: 4,
    name: "Saffron Spiced Seabass",
    price: 19.50,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=800",
    description: "Pan-seared Chilean seabass over a bed of crushed saffron potatoes and heritage greens."
  },
  {
    id: 5,
    name: "Plantain Tostones",
    price: 6.00,
    image: "https://i.ibb.co/QFpkFR6C/plantain-tostones.png",
    description: "Twice-fried green plantains served with a side of zesty avocado crema and sea salt."
  },
  {
    id: 6,
    name: "Gourmet Suya Skewers",
    price: 9.50,
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
    description: "Thinly sliced beef marinated in a potent Kuli-Kuli peanut spice blend, seared until tender."
  }
];

export default function ShopPage() {
  const { addToCart } = useCart();
  const [flyingItem, setFlyingItem] = useState<{ x: number; y: number; img: string } | null>(null);

  const handleAddToCart = (e: React.MouseEvent, product: any) => {
    // Exact same coordinate capture as MenuSection
    const startX = e.clientX;
    const startY = e.clientY;

    setFlyingItem({ x: startX, y: startY, img: product.image });
    addToCart(product);

    setTimeout(() => {
      setFlyingItem(null);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-white pt-44 pb-20 px-6">
      {/* Global Style Injector to match MenuSection's specific physics */}
      <style jsx global>{`
        @keyframes flyToCartShop {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) scale(1.4) rotate(-15deg); }
          100% { left: 100vw; top: 50vh; transform: translate(-100%, -50%) scale(0) rotate(90deg); opacity: 0; }
        }
      `}</style>

      {/* Identical Flying Overlay */}
      {flyingItem && (
        <div
          className="fixed pointer-events-none z-[9999] w-24 h-24 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white"
          style={{
            left: flyingItem.x,
            top: flyingItem.y,
            animation: 'flyToCartShop 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        >
          <img src={flyingItem.img} className="w-full h-full object-cover" alt="flying" />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <span className="text-orange-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">A La Carte</span>
          <h1 className="text-7xl font-black text-slate-900 uppercase tracking-tighter">
            Our <span className="text-orange-600">Kitchen</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col">
              
              {/* Image Container - Square logic like MenuSection */}
              <div className="relative aspect-square rounded-[3rem] overflow-hidden bg-slate-100 mb-6 shadow-xl shadow-slate-100 group">
                <img 
                  src={product.image} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  alt={product.name}
                />
                
                {/* Centered Button Overlay - Label corrected to "Add to Basket" */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-orange-600 text-white p-5 rounded-full shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-95 flex items-center gap-2"
                   >
                      <Plus className="w-6 h-6 stroke-[3px]" />
                      <span className="font-black uppercase text-xs tracking-widest pr-2">Add to Basket</span>
                   </button>
                </div>
              </div>

              {/* Text Content - Added Stars for consistency */}
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-2xl text-slate-900 tracking-tighter uppercase leading-tight">
                    {product.name}
                  </h3>
                  <span className="font-black text-orange-600 text-xl ml-4">
                    £{product.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
                  ))}
                  <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-tighter">Verified Order</span>
                </div>

                <p className="text-slate-500 font-medium text-sm leading-relaxed italic line-clamp-2">
                  {product.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}