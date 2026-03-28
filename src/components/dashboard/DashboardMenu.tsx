'use client';

import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Loader2, Package } from "lucide-react";
import Image from "next/image";
import toast from 'react-hot-toast';
import { useCart } from '@/context/CartContext';

// CRITICAL: Ensure it is "export default" to match your DashboardPage import
export default function DashboardMenu({ role }: { role?: string }) {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Destructure deliverySlot to check if a booking exists
  const { addToCart, deliverySlot } = useCart();

  useEffect(() => {
    async function getMenu() {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          setMenuItems(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Menu fetch error:", error);
      } finally {
        setLoading(false);
      }
    }
    getMenu();
  }, []);

  // Handle the protected Add to Cart action
  const handleAddToCart = (item: any) => {
    // Check for the slot first!
    if (!deliverySlot) {
      toast.error("PLEASE SELECT A DELIVERY SLOT FIRST", {
        icon: '📅',
        style: { 
          borderRadius: '10px', 
          background: '#333', 
          color: '#fff',
          fontSize: '10px',
          fontWeight: '900',
          letterSpacing: '1px'
        }
      });
      
      // SMART SCROLL: Target the booking section specifically
      const bookingSection = document.getElementById('booking-section');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Fallback for safety if ID isn't found
        window.scrollTo({ top: 100, behavior: 'smooth' });
      }
      return;
    }

    // If slot exists, proceed as normal
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      isAvailable: item.isAvailable ?? true 
    });
    
    toast.success(`${item.name.toUpperCase()} ADDED`, {
      style: { fontSize: '10px', fontWeight: '900' }
    });
  };

  const filtered = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#b32d3a] mb-4" size={32} />
        <p className="text-stone-400 font-black uppercase text-[10px] tracking-widest">Loading Menu...</p>
      </div>
    );
  }

  return (
    <div className="p-10">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Browse <span className="text-[#b32d3a]">Menu</span>
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 w-4 h-4" />
          <input 
            className="w-full bg-stone-50 rounded-2xl py-4 pl-12 pr-4 font-bold outline-none border border-stone-200 text-xs focus:border-[#b32d3a] transition-colors" 
            placeholder="Search our flavors..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      {/* MENU GRID */}
      <div className="grid xl:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map(item => (
            <div key={item._id} className="bg-white border border-stone-100 p-5 rounded-[2.5rem] flex gap-5 items-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-24 h-24 rounded-3xl overflow-hidden relative bg-stone-50 shrink-0 border border-stone-100">
                {item.image ? (
                  <Image src={item.image} alt={item.name} fill className="object-cover" unoptimized />
                ) : (
                  <Package className="m-auto text-stone-200 mt-6" size={32} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-900 uppercase text-xs truncate mb-1">{item.name}</h4>
                <p className="text-[#b32d3a] font-black text-sm">£{Number(item.price).toFixed(2)}</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase mt-1">Available Now</p>
              </div>
              <button 
                onClick={() => handleAddToCart(item)} 
                className="p-5 bg-[#b32d3a] text-white rounded-[1.5rem] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-[#b32d3a]/20"
              >
                <ShoppingCart size={20} />
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No items match your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}