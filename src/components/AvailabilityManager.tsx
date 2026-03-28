'use client';

import { useState, useEffect } from 'react';
import { 
  Utensils, CheckCircle2, XCircle, Loader2, AlertCircle, LayoutGrid, ChevronRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AvailabilityManager() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Sandwich Platters', 'Wrap Platters', 'Individual Sandwiches', 
    'Individual Boxes', 'Salad', 'Breakfast Menu', 'Deserts', 
    'Snacks', 'Drinks', 'Plate, cutlery and napkins'
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' });
        if (!res.ok) throw new Error("Product fetch failed");
        const text = await res.text();
        if (!text) { setItems([]); return; }
        const products = JSON.parse(text);
        setItems(Array.isArray(products) ? products : []);
      } catch (err: any) {
        toast.error(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleItem = async (id: string, currentStatus: boolean) => {
    setSyncingId(id);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'toggle_status',
          id: id,
          isAvailable: !currentStatus 
        })
      });
      if (!res.ok) throw new Error("Update failed");
      setItems(prev => prev.map(item => 
        item._id === id ? { ...item, isAvailable: !currentStatus } : item
      ));
      toast.success("Status Updated");
    } catch (err) {
      toast.error("Could not update item");
    } finally {
      setSyncingId(null);
    }
  };

  const filteredItems = items.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  if (loading) return (
    <div className="p-20 text-center flex flex-col items-center gap-4">
      <Loader2 className="animate-spin text-[#b32d3a]" size={40} />
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Factory Status...</p>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[600px]">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 sticky top-8">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-6 tracking-widest px-2">Sector Filter</p>
          <nav className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-black uppercase text-[10px] tracking-wider transition-all ${
                  activeCategory === cat 
                  ? 'bg-[#b32d3a] text-white shadow-lg shadow-[#b32d3a]/20' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="flex items-center gap-3">
                  {cat === 'All' ? <LayoutGrid size={14} /> : <div className={`w-1 h-1 rounded-full ${activeCategory === cat ? 'bg-white' : 'bg-slate-300'}`} />}
                  {cat}
                </span>
                <span className={`text-[8px] opacity-60`}>
                  {items.filter(i => cat === 'All' || i.category === cat).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        <header className="mb-8">
          <div className="flex items-center gap-2 text-slate-400 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest">Inventory</span>
            <ChevronRight size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#b32d3a]">{activeCategory}</span>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
            Current <span className="text-[#b32d3a]">Stock.</span>
          </h2>
        </header>

        <div className="grid gap-3 text-left">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-100 rounded-[2rem]">
              <AlertCircle className="mx-auto text-slate-200 mb-2" size={30} />
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No products in this sector</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item._id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 bg-white hover:border-slate-200 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl transition-colors ${item.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-300'}`}>
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-black uppercase tracking-tight transition-all ${!item.isAvailable ? 'text-slate-300 line-through' : 'text-slate-900'}`}>
                      {item.name}
                    </h4>
                    <p className="text-[8px] font-black text-[#b32d3a] uppercase tracking-widest">{item.category}</p>
                  </div>
                </div>

                <button
                  onClick={() => toggleItem(item._id, item.isAvailable)}
                  disabled={syncingId === item._id}
                  className={`px-5 py-2.5 rounded-full font-black text-[9px] uppercase min-w-[120px] flex items-center justify-center gap-2 transition-all ${
                    item.isAvailable ? 'bg-slate-900 text-white hover:bg-[#b32d3a]' : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {syncingId === item._id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      {item.isAvailable ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {item.isAvailable ? 'Available' : 'Sold Out'}
                    </>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}