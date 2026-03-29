'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { 
  Package, 
  MapPin, 
  Lock, 
  LayoutDashboard, 
  LogOut, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Edit2, 
  Search, 
  Star, 
  ShieldCheck,
  Eye,
  EyeOff,
  Phone,
  Layers,
  ShoppingBag,
  Pencil
} from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from 'next-cloudinary';
import toast from 'react-hot-toast';

import AddAddressModal from "@/components/AddAddressModal";
import DeleteAddressButton from "@/components/DeleteAddressButton";
import AvailabilityManager from "@/components/AvailabilityManager";
import DashboardOrders from "@/components/dashboard/DashboardOrders"; 

export default function AdminDashboardView({ userData: initialUserData }: any) {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState(initialUserData);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]); 
  const [activeMenuCategory, setActiveMenuCategory] = useState('All');
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingAddress, setEditingAddress] = useState<any>(null);
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  const categories = [
    'All', 'Sandwich Platters', 'Wrap Platters', 'Individual Sandwiches', 
    'Individual Boxes', 'Salad', 'Breakfast Menu', 'Deserts', 
    'Snacks', 'Drinks', 'Plate, cutlery and napkins'
  ];

  const homeTabOptions = [
    { label: 'Not on Homepage', value: '' },
    { label: 'Platters Row', value: 'Platters' },
    { label: 'Lunch Boxes Row', value: 'Lunch Boxes' },
    { label: 'Salads Row', value: 'Salads' },
    { label: 'Breakfast & Desserts Row', value: 'Breakfast & Desserts' },
  ];

  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    stock: '99', 
    category: 'Sandwich Platters', 
    homeTab: '', 
    image: '', 
    allergens: [] as string[] 
  });

  useEffect(() => {
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => setMenuItems(Array.isArray(data) ? data : []));

    fetch('/api/admin/orders')
      .then(res => res.json())
      .then(data => setOrders(Array.isArray(data) ? data : []))
      .catch(() => console.log("Waiting for Orders API..."));
  }, []);

  const handleAddressUpdate = (updatedAddr: any) => {
    setUserData((prev: any) => {
      const existingIdx = prev.addresses.findIndex(
        (a: any) => String(a._id) === String(updatedAddr._id)
      );
      if (existingIdx !== -1) {
        const newAddresses = [...prev.addresses];
        newAddresses[existingIdx] = updatedAddr;
        return { ...prev, addresses: newAddresses };
      }
      return { ...prev, addresses: [...(prev.addresses || []), updatedAddr] };
    });
    setEditingAddress(null);
  };

  const handleAddressDeleted = (id: string) => {
    setUserData({ ...userData, addresses: userData.addresses.filter((a: any) => a._id !== id) });
    toast.success("ADDRESS REMOVED");
  };

  const handleSetDefault = async (addressId: string) => {
    const originalAddresses = [...userData.addresses];
    const updatedAddresses = userData.addresses.map((addr: any) => ({
      ...addr,
      isDefault: addr._id === addressId
    }));
    setUserData({ ...userData, addresses: updatedAddresses });
    try {
      const res = await fetch('/api/user/address', { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }) 
      });
      if (!res.ok) throw new Error();
      toast.success("PRIMARY ADDRESS UPDATED", { duration: 1000 });
    } catch (err) {
      setUserData({ ...userData, addresses: originalAddresses });
      toast.error("COULD NOT UPDATE DEFAULT");
    }
  };

  const handleProductImageUpload = (result: any) => {
    if (result.event === "success") {
      setNewProduct({ ...newProduct, image: result.info.secure_url });
      toast.success("IMAGE READY");
    }
  };

  const handleEditInit = (item: any) => {
    setIsEditing(true); 
    setIsAddingProduct(true); 
    setEditingId(item._id);
    setNewProduct({ 
      name: item.name, 
      description: item.description, 
      price: item.price.toString(), 
      stock: (item.stock || 0).toString(),
      category: item.category || 'Sandwich Platters', 
      homeTab: item.homeTab || '', 
      image: item.image, 
      allergens: item.allergens || [] 
    });
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.image) return toast.error("UPLOAD IMAGE");
    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `/api/admin/products/${editingId}` : '/api/admin/products';
    const res = await fetch(url, { 
      method, 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify({ 
        ...newProduct, 
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock) 
      }) 
    });
    if (res.ok) {
      toast.success(isEditing ? "UPDATED" : "ADDED");
      fetch('/api/admin/products').then(r => r.json()).then(setMenuItems);
      setIsAddingProduct(false); 
      setIsEditing(false);
      setNewProduct({ name: '', description: '', price: '', stock: '99', category: 'Sandwich Platters', homeTab: '', image: '', allergens: [] });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMenuItems(prev => prev.filter(item => item._id !== id));
      toast.success("REMOVED");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("PASSWORDS DO NOT MATCH");
    }
    const res = await fetch('/api/user/change-password', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' }, 
      body: JSON.stringify(passwordData) 
    });
    if (res.ok) { 
      toast.success("UPDATED"); 
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); 
    }
  };

  const filteredMenuItems = menuItems.filter(item => 
    (activeMenuCategory === 'All' || item.category === activeMenuCategory) &&
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'orders', label: 'Live Orders', icon: ShoppingBag }, 
    { id: 'menu', label: 'Manage Menu', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Security', icon: Lock },
  ];

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8">
      {/* MOBILE HEADER / DESKTOP SIDEBAR */}
      <aside className="lg:space-y-3">
        <div className="flex flex-col items-center mb-8 pt-4 text-center px-4">
          <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-stone-100 flex items-center justify-center mb-3 mx-auto">
            {userData?.image ? (
              <img src={userData.image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="text-[#b32d3a] font-black text-2xl">{userData?.name?.charAt(0) || 'A'}</div>
            )}
          </div>
          <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">Admin Account</p>
          <p className="font-black text-slate-900 text-xs uppercase mt-1 truncate w-full">{userData?.name}</p>
        </div>

        {/* TAB NAVIGATION - FIXED: Vertical Stack on Mobile */}
        <div className="flex flex-col gap-3 px-2 lg:px-0">
          {tabs.map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => { setActiveTab(tab.id); setIsAddingProduct(false); }} 
              className={`w-full flex items-center justify-between px-6 lg:px-8 py-4 lg:py-5 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase text-[10px] lg:text-[11px] tracking-[0.1em] lg:tracking-[0.2em] transition-all ${
                activeTab === tab.id 
                  ? 'bg-[#b32d3a] text-white shadow-xl lg:translate-x-3 border-[#b32d3a]' 
                  : 'bg-white text-slate-500 border border-stone-200 hover:border-[#b32d3a]/30'
              }`}
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <tab.icon size={16} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </div>
              <ChevronRight size={14} className={`hidden lg:block ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          ))}
          <button onClick={() => signOut()} className="w-full flex items-center gap-4 px-6 lg:px-8 py-4 lg:py-5 text-slate-400 font-black uppercase text-[10px] lg:text-[11px] hover:text-rose-500 transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-sm border border-stone-200 min-h-[500px] lg:min-h-[700px] overflow-hidden relative">
        {activeTab === 'overview' && (
          <div className="p-6 md:p-10 text-left">
            <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 uppercase text-slate-900 tracking-tight">Store <span className="text-[#b32d3a]">Availability</span></h2>
            <AvailabilityManager />
          </div>
        )}

        {activeTab === 'orders' && (
          <DashboardOrders orders={orders} role="admin" />
        )}

        {activeTab === 'menu' && (
          <div className="p-5 md:p-10 text-left">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight leading-none">Manage <span className="text-[#b32d3a]">Menu</span></h2>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                  <input className="w-full bg-stone-50 rounded-2xl py-3 pl-12 pr-4 font-bold outline-none border border-transparent focus:border-[#b32d3a]/20 text-xs" placeholder="Search items..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <button onClick={() => { setIsAddingProduct(!isAddingProduct); if(isAddingProduct) setIsEditing(false); }} className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2">
                  {isAddingProduct ? 'Close Form' : <><Plus size={16} /> Add Dish</>}
                </button>
              </div>
            </div>

            {/* FIXED: Categories Vertical Stack on Mobile */}
            <div className="mb-8 flex flex-col sm:flex-row flex-wrap gap-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setActiveMenuCategory(cat)} className={`px-4 py-2.5 rounded-xl font-black uppercase text-[8px] tracking-wider transition-all border ${activeMenuCategory === cat ? 'bg-[#b32d3a] text-white border-transparent shadow-lg' : 'bg-white text-slate-500 border-stone-200'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {isAddingProduct && (
              <form onSubmit={handleAddProduct} className="bg-stone-50 p-6 md:p-8 rounded-[2rem] mb-10 border border-stone-100 space-y-6">
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-4">
                    <input type="text" placeholder="Dish Name" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white border font-bold outline-none focus:border-[#b32d3a]/30 text-sm" />
                    <textarea placeholder="Description" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white border font-medium h-28 outline-none focus:border-[#b32d3a]/30 text-sm" />
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white border font-black uppercase text-[9px]">
                        {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <select value={newProduct.homeTab} onChange={e => setNewProduct({...newProduct, homeTab: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white border font-black uppercase text-[9px]">
                        {homeTabOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="number" step="0.01" placeholder="Price (£)" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-5 py-3.5 rounded-xl bg-white border font-bold outline-none focus:border-[#b32d3a]/30 text-sm" />
                      <div className="relative">
                         <Layers size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                         <input type="number" placeholder="Stock" required value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white border font-bold outline-none focus:border-[#b32d3a]/30 text-sm" />
                      </div>
                    </div>
                    <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={handleProductImageUpload}>
                      {({ open }) => <button type="button" onClick={() => open()} className="w-full py-3.5 border-2 border-dashed border-stone-300 rounded-xl text-stone-500 font-bold bg-white text-[10px] uppercase">Upload Image</button>}
                    </CldUploadWidget>
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#b32d3a] text-white py-4 rounded-full font-black uppercase tracking-widest shadow-xl text-[10px]">
                  {isEditing ? 'Update Dish Details' : 'Deploy To Live Menu'}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredMenuItems.map(item => {
                const stockLevel = item.stock ?? 0;
                return (
                  <div key={item._id} className="group bg-white border border-stone-100 p-4 rounded-[1.5rem] flex gap-4 items-center hover:shadow-md transition-all">
                    <div className="w-16 h-16 rounded-xl overflow-hidden relative bg-stone-50 shrink-0 border border-stone-50">
                      {item.image && <Image src={item.image} alt={item.name} fill className={`object-cover ${stockLevel <= 0 ? 'grayscale' : ''}`} unoptimized />}
                      {stockLevel <= 0 && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white font-black text-[7px] uppercase tracking-tighter text-center">Sold Out</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-slate-900 uppercase text-[11px] tracking-tight truncate text-left">{item.name} {item.homeTab && <Star size={10} className="inline ml-1 text-[#b32d3a] fill-[#b32d3a]" />}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-[#b32d3a] font-black text-xs">£{Number(item.price).toFixed(2)}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest ${stockLevel <= 5 ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          Stock: {stockLevel}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEditInit(item)} className="p-2 bg-stone-50 text-slate-400 hover:bg-[#b32d3a] hover:text-white rounded-lg transition-colors"><Edit2 size={12} /></button>
                      <button onClick={() => handleDeleteProduct(item._id)} className="p-2 bg-stone-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-lg transition-colors"><Trash2 size={12} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'addresses' && (
          <div className="p-6 md:p-10 text-left">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Saved <span className="text-[#b32d3a]">Addresses</span></h2>
              <AddAddressModal onAddressAdded={handleAddressUpdate} editData={editingAddress} onClose={() => setEditingAddress(null)} />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {userData?.addresses?.map((addr: any, i: number) => (
                <div 
                  key={addr._id || i} 
                  onClick={() => handleSetDefault(addr._id)}
                  className={`group cursor-pointer p-6 rounded-[2rem] border flex flex-col transition-all ${addr.isDefault ? 'bg-white border-[#b32d3a] shadow-lg' : 'bg-slate-50 border-stone-100'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <p className="font-black uppercase text-[8px] text-[#b32d3a] tracking-widest">{addr.label}</p>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setEditingAddress(addr)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors"><Pencil size={12} /></button>
                      <DeleteAddressButton addressId={addr._id} onDeleted={() => handleAddressDeleted(addr._id)} />
                    </div>
                  </div>
                  <p className="font-bold text-slate-900 text-xs mb-4">{addr.addressLine1}</p>
                  <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="font-black uppercase text-[7px] tracking-[0.2em] text-slate-400">
                      {addr.isDefault ? 'Primary' : 'Set Primary'}
                    </span>
                    <div className={`w-4 h-4 rounded-full border-2 ${addr.isDefault ? 'border-[#b32d3a] bg-[#b32d3a]' : 'border-slate-200'}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="p-6 md:p-10 text-left">
            <h2 className="text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight mb-8">Security <span className="text-[#b32d3a]">Settings</span></h2>
            <div className="grid grid-cols-1 gap-8">
              <form onSubmit={handlePasswordChange} className="bg-stone-50 p-6 md:p-10 rounded-[2rem] border border-stone-100 space-y-5">
                {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
                  <div key={field} className="relative">
                    <label className="block ml-4 mb-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input 
                      type={showPasswords[field as keyof typeof showPasswords] ? "text" : "password"} 
                      required 
                      className="w-full px-6 py-4 rounded-xl bg-white border border-stone-200 font-bold outline-none focus:border-[#b32d3a] text-sm pr-12"
                      value={(passwordData as any)[field]} 
                      onChange={e => setPasswordData({...passwordData, [field]: e.target.value})} 
                    />
                  </div>
                ))}
                <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-full font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-[#b32d3a] transition-all">Update Security</button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}