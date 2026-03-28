'use client';

import { useState, useEffect, Suspense } from 'react'; // Added Suspense
import { useSearchParams } from 'next/navigation';
import { 
  Clock, 
  ShieldCheck, 
  Plus, 
  Users, 
  Box, 
  Coffee, 
  Leaf, 
  Utensils, 
  GlassWater, 
  Cookie,
  Flame,
  LayoutGrid,
  ShoppingBag,
  TicketPercent,
  AlertCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import DeliveryScheduler from '@/components/DeliveryScheduler';
import toast from 'react-hot-toast';

// 1. All your original logic moves here
function MenuContent() {
  const { addToCart, deliverySlot } = useCart();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [activeTab, setActiveTab] = useState('Sandwich Platters');
  const [flyingItem, setFlyingItem] = useState<{ id: number; x: number; y: number; img: string } | null>(null);
  
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const menuCategories = [
    { id: 'Sandwich Platters', label: 'Sandwich Platters', icon: <Users className="w-4 h-4" /> },
    { id: 'Wrap Platters', label: 'Wrap Platters', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'Platters', label: 'All Platters', icon: <Users className="w-4 h-4" />, hidden: true },
    { id: 'Individual Sandwiches', label: 'Individual Sandwiches', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'Individual Boxes', label: 'Individual Boxes', icon: <Box className="w-4 h-4" /> },
    { id: 'Lunch Boxes', label: 'Lunch Boxes', icon: <Box className="w-4 h-4" />, hidden: true },
    { id: 'Salad', label: 'Salads & Sides', icon: <Leaf className="w-4 h-4" /> },
    { id: 'Breakfast Menu', label: 'Breakfast Menu', icon: <Coffee className="w-4 h-4" /> },
    { id: 'Deserts', label: 'Desserts', icon: <Cookie className="w-4 h-4" /> },
    { id: 'Snacks', label: 'Snacks', icon: <TicketPercent className="w-4 h-4" /> },
    { id: 'Drinks', label: 'Cold Drinks', icon: <GlassWater className="w-4 h-4" /> },
    { id: 'Plate, cutlery and napkins', label: 'Essentials', icon: <Utensils className="w-4 h-4" /> },
  ];

  useEffect(() => {
    async function fetchLiveMenu() {
      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setDbProducts(data);
        }
      } catch (err) {
        console.error("Error loading live menu items:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveMenu();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      let targetId = categoryParam;
      if (categoryParam === 'Lunch Boxes') targetId = 'Individual Boxes';
      if (categoryParam === 'Platters') targetId = 'Sandwich Platters';
      if (categoryParam === 'Breakfast') targetId = 'Breakfast Menu';

      if (menuCategories.some(c => c.id === targetId)) {
        setActiveTab(targetId);
      }
    }
  }, [categoryParam]);

  const handleAddToBasket = (e: React.MouseEvent, item: any) => {
    e.preventDefault();
    if (item.stock <= 0 || item.isAvailable === false) {
      toast.error("SORRY, THIS ITEM IS SOLD OUT", { icon: '🚫' });
      return;
    }
    if (!deliverySlot) {
      toast.error("PLEASE SELECT A DELIVERY SLOT AT THE TOP FIRST", {
        icon: '📅',
        style: { borderRadius: '10px', background: '#333', color: '#fff' }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setFlyingItem({
      id: Date.now(),
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      img: item.image
    });
      
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      isAvailable: item.isAvailable ?? true 
    });

    setTimeout(() => setFlyingItem(null), 900);
  };

  const getDisplayItems = () => {
    return dbProducts.filter(item => item.category === activeTab);
  };

  return (
    <main className="bg-white min-h-screen text-slate-900 overflow-x-hidden pt-10">
      <style jsx global>{`
        @keyframes flyToCart {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) scale(1.4) rotate(-15deg); }
          100% { left: 95vw; top: 90vh; transform: translate(-100%, -50%) scale(0.1) rotate(90deg); opacity: 0; }
        }
      `}</style>

      <div className="sticky top-[80px] z-[100] transition-all duration-300">
        <DeliveryScheduler />
      </div>

      {flyingItem && (
        <div
          className="fixed pointer-events-none z-[9999] w-20 h-20 rounded-2xl overflow-hidden shadow-2xl border-2 border-white"
          style={{
            left: flyingItem.x,
            top: flyingItem.y,
            animation: 'flyToCart 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        >
          <img src={flyingItem.img} className="w-full h-full object-cover" alt="flying" />
        </div>
      )}

      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="h-[1px] w-8 bg-[#b32d3a]"></div>
          <span className="text-[#b32d3a] font-black uppercase tracking-[0.4em] text-[10px]">The Office Lunch Richmond</span>
          <div className="h-[1px] w-8 bg-[#b32d3a]"></div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-12 leading-none text-balance text-slate-900">
          Catering for <br />
          <span className="text-[#b32d3a]">Every Scale.</span>
        </h1>
        
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-16 max-w-7xl mx-auto px-4">
          {menuCategories.filter(c => !c.hidden).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveTab(cat.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${
                activeTab === cat.id
                  ? 'bg-[#b32d3a] border-[#b32d3a] text-white shadow-lg scale-105'
                  : 'bg-white border-slate-100 text-slate-800 hover:border-slate-300'
              }`}
            >
              <span className={activeTab === cat.id ? 'text-white' : 'text-[#b32d3a]'}>
                {cat.icon}
              </span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {getDisplayItems().map((item) => {
            const isSoldOut = item.stock <= 0 || item.isAvailable === false;
            
            return (
              <div key={item._id} className="group bg-slate-50/50 rounded-[2.5rem] p-6 flex flex-col md:flex-row gap-6 items-center border border-transparent hover:border-slate-200 transition-all shadow-sm">
                
                <div className="relative w-full md:w-48 h-48 shrink-0">
                  <div className="w-full h-full bg-white rounded-3xl overflow-hidden shadow-inner relative">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className={`w-full h-full object-cover transition-transform duration-700 ${isSoldOut ? 'grayscale' : 'group-hover:scale-105'}`} 
                    />
                    {isSoldOut && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="text-white font-black uppercase tracking-widest text-[10px] border-2 border-white px-4 py-2 rounded-full">Sold Out</span>
                      </div>
                    )}
                  </div>

                  {!isSoldOut && (
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/10 rounded-3xl">
                      <button
                        type="button"
                        onClick={(e) => handleAddToBasket(e, item)}
                        className="bg-white text-slate-900 px-4 py-2 rounded-full font-black uppercase text-[9px] tracking-widest flex items-center gap-2 shadow-xl hover:bg-[#b32d3a] hover:text-white transition-all active:scale-90"
                      >
                        Add <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight leading-tight">{item.name}</h3>
                    <span className="text-[#b32d3a] font-black text-sm whitespace-nowrap ml-4">£{(item.price || 0).toFixed(2)}</span>
                  </div>
                  <p className="text-slate-600 font-medium text-xs leading-relaxed mb-4 line-clamp-3 italic">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {item.stock > 0 && item.stock <= 5 && (
                      <span className="flex items-center gap-1 text-[9px] font-black text-[#b32d3a] uppercase tracking-widest px-2 py-1 bg-red-50 rounded-lg animate-pulse">
                        <Flame className="w-3 h-3" /> Low Stock
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-white border border-slate-200 text-slate-400">
                      <ShieldCheck className="w-3 h-3" /> Eco Friendly
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {loading && (
          <div className="flex flex-col items-center mt-20 gap-4">
             <div className="w-8 h-8 border-4 border-[#b32d3a] border-t-transparent rounded-full animate-spin"></div>
             <p className="font-black uppercase text-slate-400 text-xs tracking-widest">Refreshing Kitchen...</p>
          </div>
        )}
        
        {!loading && getDisplayItems().length === 0 && (
          <div className="text-center mt-20 py-20 bg-slate-50 rounded-[3rem]">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="font-black uppercase text-slate-400 text-sm tracking-widest">No items found in this category</p>
          </div>
        )}
      </section>
    </main>
  );
}

// 2. The Exported Page Component (Satisfies Vercel build)
export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#b32d3a] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}