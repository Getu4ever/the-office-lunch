'use client';

import { Plus, Star, Loader2, Zap, Leaf, Crown, Flame } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import DeliveryScheduler from './DeliveryScheduler';

const CATEGORIES = [
  { label: 'All', value: 'All' },
  { label: 'Platters', value: 'Platters' },
  { label: 'Lunch Boxes', value: 'Lunch Boxes' },
  { label: 'Salads', value: 'Salads' },
  { label: 'Breakfast & Desserts', value: 'Breakfast & Desserts' }
];

export default function SignatureCollections() {
  const { addToCart, deliverySlot } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [flyingItem, setFlyingItem] = useState<{ x: number; y: number; img: string } | null>(null);
  const [isKitchenOpen, setIsKitchenOpen] = useState(true);
  
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const schedulerRef = useRef<HTMLDivElement>(null);

  const renderBadge = (dish: any) => {
    const name = dish.name.toLowerCase();
    if (name.includes('mixture') || name.includes('executive')) {
      return (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <Crown size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-[10px] font-black uppercase tracking-wider">Bestseller</span>
        </div>
      );
    }
    if (name.includes('vegan') || name.includes('vegetarian') || name.includes('veggie')) {
      return (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <Leaf size={12} className="fill-white" />
          <span className="text-[10px] font-black uppercase tracking-wider">Plant Based</span>
        </div>
      );
    }
    if (dish.price > 40 || name.includes('premium')) {
      return (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#b32d3a]/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
          <Zap size={12} className="fill-white" />
          <span className="text-[10px] font-black uppercase tracking-wider">Premium</span>
        </div>
      );
    }
    return (
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md text-slate-900 px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
        <Flame size={12} className="text-[#b32d3a] fill-[#b32d3a]" />
        <span className="text-[10px] font-black uppercase tracking-wider">Trending</span>
      </div>
    );
  };

  useEffect(() => {
    fetch('/api/admin/kitchen-status')
      .then(res => res.json())
      .then(data => setIsKitchenOpen(data.isOpen))
      .catch(() => setIsKitchenOpen(true));

    async function fetchSignatures() {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          const signatureItems = data.filter((p: any) => p.homeTab && p.homeTab !== '');
          setDishes(signatureItems);
        }
      } catch (err) {
        console.error("Failed to load signatures:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSignatures();
  }, []);

  const filteredDishes = activeCategory === 'All' 
    ? dishes 
    : dishes.filter(dish => dish.homeTab === activeCategory);

  const handleAddToCart = (e: React.MouseEvent, dish: any) => {
    e.preventDefault(); 
    if (!isKitchenOpen) return;

    if (!deliverySlot) {
      schedulerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Capture the click coordinates
    setFlyingItem({ x: e.clientX, y: e.clientY, img: dish.image });
    
    addToCart({
      id: dish._id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      isAvailable: dish.isAvailable ?? true
    });

    setTimeout(() => setFlyingItem(null), 900);
  };

  if (loading) return (
    <div className="py-24 flex justify-center items-center bg-white">
      <Loader2 className="animate-spin text-[#b32d3a]" size={40} />
    </div>
  );

  return (
    <>
      <div ref={schedulerRef}>
        <DeliveryScheduler />
      </div>

      <section className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
        <style jsx global>{`
          @keyframes flyToStickyBasket {
            0% { 
              transform: translate(-50%, -50%) scale(1); 
              opacity: 1; 
            }
            100% { 
              /* Targeting the Bottom Right Sticky Basket position */
              left: 92vw; 
              top: 92vh; 
              transform: translate(-50%, -50%) scale(0.1); 
              opacity: 0; 
            }
          }
          .no-scrollbar::-webkit-scrollbar { display: none; }
        `}</style>

        {flyingItem && (
          <div
            className="fixed pointer-events-none z-[9999] w-24 h-24 rounded-3xl overflow-hidden shadow-2xl border-4 border-white"
            style={{
              left: flyingItem.x,
              top: flyingItem.y,
              animation: 'flyToStickyBasket 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards'
            }}
          >
            <img src={flyingItem.img} className="w-full h-full object-cover" alt="" />
          </div>
        )}

        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                Signature <br/><span className="text-[#b32d3a]">Collections</span>
              </h2>
              <p className="text-slate-500 font-medium mt-6 italic max-w-md">
                A curated selection of our most popular catering menus, ready for your next event.
              </p>
            </div>

            <div className="flex gap-2 p-2 bg-stone-100 rounded-2xl overflow-x-auto no-scrollbar">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeCategory === cat.value ? 'bg-white text-[#b32d3a] shadow-sm' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-20">
            {filteredDishes.map((dish) => {
              const isSoldOut = !dish.isAvailable;
              return (
                <div key={dish._id} className={`group ${(!isKitchenOpen || isSoldOut) ? 'grayscale opacity-60' : ''}`}>
                  <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl bg-stone-100 border border-slate-100">
                    {!isSoldOut && isKitchenOpen && renderBadge(dish)}
                    <img 
                      src={dish.image} 
                      alt={dish.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-6 z-30">
                       <button 
                        disabled={isSoldOut || !isKitchenOpen}
                        onClick={(e) => handleAddToCart(e, dish)}
                        className="bg-white text-slate-900 w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#b32d3a] hover:text-white transition-colors shadow-2xl"
                       >
                          <Plus size={16} />
                          {!isKitchenOpen ? "Kitchen Closed" : isSoldOut ? "Sold Out" : "Add to Order"}
                       </button>
                    </div>
                  </div>
                  <div className="px-2">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h3 className="font-black text-xl text-slate-900 tracking-tight leading-tight uppercase">{dish.name}</h3>
                      <span className="font-black text-[#b32d3a] text-lg">£{Number(dish.price).toFixed(2)}</span>
                    </div>
                    <p className="text-slate-400 text-xs font-medium line-clamp-2 italic mb-3">{dish.description}</p>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} className="fill-[#b32d3a] text-[#b32d3a]" />)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}