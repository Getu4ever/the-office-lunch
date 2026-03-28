'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Package, 
  Loader2,
  Search,
  Zap,
  ChevronRight,
  LayoutGrid,
  Settings2
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);

  const categories = [
    'All',
    'Sandwich Platters', 'Wrap Platters', 'Individual Sandwiches', 
    'Individual Boxes', 'Salad', 'Breakfast Menu', 'Deserts', 
    'Snacks', 'Drinks', 'Plate, cutlery and napkins'
  ];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Sandwich Platters',
    image: '',
    stock: 50
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleBulkSync = async () => {
    const confirmSync = confirm("Update inventory with all items from the menu seed?");
    if (!confirmSync) return;

    setIsSyncing(true);
    try {
      const response = await fetch('/data/menu-seed.json');
      const menuData = await response.json();
      
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuData)
      });

      if (res.ok) {
        toast.success("Factory Sync Complete!");
        fetchProducts();
      }
    } catch (err) {
      toast.error("Sync Failed");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, price: parseFloat(formData.price) })
      });
      if (res.ok) {
        toast.success("Product Added");
        setFormData({ name: '', description: '', price: '', category: 'Sandwich Platters', image: '', stock: 50 });
        setShowAddForm(false);
        fetchProducts();
      }
    } catch (err) {
      toast.error("Error saving");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(products.filter(p => p._id !== id));
        toast.success("Deleted");
      }
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (activeCategory === 'All' || p.category === activeCategory)
  );

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-[#b32d3a] bg-slate-100 uppercase tracking-widest animate-pulse">Initialising Factory...</div>;

  return (
    <main className="min-h-screen bg-slate-100 flex text-slate-900">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-80 bg-white border-r border-slate-200 hidden xl:flex flex-col sticky top-0 h-screen p-8">
        <div className="mb-10">
          <h1 className="text-3xl font-black uppercase tracking-tighter">Menu <span className="text-[#b32d3a]">Factory</span></h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-1">Admin Control Center</p>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Navigation</p>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl font-black uppercase text-[11px] tracking-wider transition-all ${
                activeCategory === cat 
                ? 'bg-[#b32d3a] text-white shadow-lg shadow-[#b32d3a]/20' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-3">
                {cat === 'All' ? <LayoutGrid size={16} /> : <div className={`w-1.5 h-1.5 rounded-full ${activeCategory === cat ? 'bg-white' : 'bg-slate-300'}`} />}
                {cat}
              </span>
              <span className={`text-[9px] ${activeCategory === cat ? 'opacity-60' : 'text-slate-300'}`}>
                {products.filter(p => cat === 'All' || p.category === cat).length}
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-8 border-t border-slate-100 space-y-3">
          <button 
            onClick={() => setShowAddForm(true)}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-[#b32d3a] transition-all"
          >
            <Plus size={14} /> New Entry
          </button>
          <button 
            onClick={handleBulkSync}
            disabled={isSyncing}
            className="w-full border-2 border-slate-100 text-slate-400 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:border-[#b32d3a] hover:text-[#b32d3a] transition-all disabled:opacity-50"
          >
            {isSyncing ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
            Factory Reset
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 p-8 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-slate-400 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest">Inventory</span>
              <ChevronRight size={12} />
              <span className="text-[10px] font-black uppercase tracking-widest text-[#b32d3a]">{activeCategory}</span>
            </div>
            <h2 className="text-4xl font-black uppercase tracking-tight">{activeCategory}</h2>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 font-bold outline-none border border-slate-200 shadow-sm focus:border-[#b32d3a]" 
                placeholder="Find item..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
            </div>
          </div>
        </header>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div key={p._id} className="group bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-200 flex flex-col hover:shadow-xl hover:border-[#b32d3a]/20 transition-all">
                <div className="flex gap-6 mb-6">
                  <div className="w-24 h-24 bg-slate-50 rounded-[2rem] overflow-hidden shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                    <img src={p.image} className="w-full h-full object-cover" alt={p.name} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="font-black uppercase text-sm leading-tight mb-2">{p.name}</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{p.category}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price</span>
                    <span className="text-xl font-black text-[#b32d3a]">£{p.price?.toFixed(2)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all"><Settings2 size={16} /></button>
                    <button onClick={() => handleDelete(p._id)} className="p-3 bg-rose-50 text-rose-400 rounded-xl hover:bg-[#b32d3a] hover:text-white transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <Package className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="font-black uppercase text-slate-400 text-sm tracking-widest">No products found in this sector</p>
            </div>
          )}
        </div>
      </div>

      {/* ADD NEW PRODUCT MODAL (Overlay) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <section className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-200 w-full max-w-xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black uppercase flex items-center gap-3"><Plus className="text-[#b32d3a]" /> New Entry</h2>
              <button onClick={() => setShowAddForm(false)} className="text-slate-300 hover:text-black font-black uppercase text-[10px]">Close</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#b32d3a]" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" step="0.01" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#b32d3a]" placeholder="Price £" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input type="number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#b32d3a]" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})} />
              </div>
              <select className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#b32d3a]" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <input required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#b32d3a]" placeholder="Image URL" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
              <textarea required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold outline-none focus:border-[#b32d3a]" placeholder="Description" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              <button disabled={isSaving} className="w-full py-5 bg-[#b32d3a] text-white rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all">
                {isSaving ? <Loader2 className="animate-spin" /> : 'Deploy Item to Menu'}
              </button>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}