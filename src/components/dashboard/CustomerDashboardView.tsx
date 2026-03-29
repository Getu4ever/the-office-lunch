'use client';

import { useState, useEffect, useMemo } from 'react';
import { signOut } from 'next-auth/react';
import { 
  ShoppingBag, 
  MapPin, 
  Lock, 
  ChevronRight, 
  LogOut,
  Plus,
  Users, 
  LayoutGrid,
  ShoppingCart,
  Eye,
  EyeOff,
  Box,
  Coffee,
  Leaf,
  Utensils,
  GlassWater,
  Cookie,
  TicketPercent,
  Phone,
  Pencil,
  UserCircle
} from "lucide-react";
import toast from 'react-hot-toast';

import { useCart } from '@/context/CartContext';
import DeliveryScheduler from '@/components/DeliveryScheduler';
import AddAddressModal from "@/components/AddAddressModal";
import DeleteAddressButton from "@/components/DeleteAddressButton";
import OrderRow from "@/components/OrderRow";

export default function CustomerDashboardView({ userData: initialUserData, orders }: any) {
  const { addToCart, deliverySlot, selectedDate, setSelectedAddress } = useCart();
  const [activeTab, setActiveTab] = useState('menu'); 
  const [menuTab, setMenuTab] = useState('Sandwich Platters'); 
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(initialUserData);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const isGuest = !userData || userData.isGuest;

  const minDateString = useMemo(() => {
    return new Date().toLocaleDateString('en-CA');
  }, []);

  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });

  const menuCategories = [
    { id: 'Sandwich Platters', label: 'Sandwich Platters', icon: <Users className="w-4 h-4" /> },
    { id: 'Wrap Platters', label: 'Wrap Platters', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'Individual Sandwiches', label: 'Individual Sandwiches', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'Individual Boxes', label: 'Individual Boxes', icon: <Box className="w-4 h-4" /> },
    { id: 'Salad', label: 'Salads & Sides', icon: <Leaf className="w-4 h-4" /> },
    { id: 'Breakfast Menu', label: 'Breakfast Menu', icon: <Coffee className="w-4 h-4" /> },
    { id: 'Deserts', label: 'Desserts', icon: <Cookie className="w-4 h-4" /> },
    { id: 'Snacks', label: 'Snacks', icon: <TicketPercent className="w-4 h-4" /> },
    { id: 'Drinks', label: 'Cold Drinks', icon: <GlassWater className="w-4 h-4" /> },
    { id: 'Plate, cutlery and napkins', label: 'Essentials', icon: <Utensils className="w-4 h-4" /> },
  ];

  useEffect(() => {
    if (userData?.addresses && setSelectedAddress) {
      const primary = userData.addresses.find((addr: any) => addr.isDefault);
      if (primary) setSelectedAddress(primary);
    }
  }, [userData?.addresses, setSelectedAddress]);

  useEffect(() => {
    async function fetchLiveMenu() {
      try {
        const res = await fetch('/api/admin/products', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setDbProducts(data);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    }
    fetchLiveMenu();
  }, []);

  const handleAddressUpdate = (updatedAddr: any) => {
    if (updatedAddr.isDefault && setSelectedAddress) setSelectedAddress(updatedAddr);
    setUserData((prev: any) => {
      const existingIndex = prev.addresses.findIndex((a: any) => String(a._id) === String(updatedAddr._id));
      if (existingIndex !== -1) {
        const newAddresses = [...prev.addresses];
        newAddresses[existingIndex] = updatedAddr;
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
    const updatedAddresses = userData.addresses.map((addr: any) => ({ ...addr, isDefault: addr._id === addressId }));
    setUserData({ ...userData, addresses: updatedAddresses });
    try {
      const res = await fetch('/api/user/address', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ addressId }) });
      if (!res.ok) throw new Error();
      toast.success("PRIMARY ADDRESS UPDATED");
    } catch (err) {
      setUserData({ ...userData, addresses: originalAddresses });
    }
  };

  const handleAddToBasket = (item: any) => {
    if (item.stock <= 0 || item.isAvailable === false) return toast.error("SOLD OUT");
    if (!deliverySlot || !selectedDate) return toast.error("SELECT DATE/SLOT FIRST");
    addToCart({ id: item._id, name: item.name, price: item.price, image: item.image, isAvailable: item.isAvailable ?? true });
    toast.success(`${item.name} added!`);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) return toast.error("NO MATCH");
    const res = await fetch('/api/user/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(passwordData) });
    if (res.ok) { toast.success("UPDATED"); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
  };

  const tabs = [
    { id: 'menu', label: 'Browse Menu', icon: ShoppingBag },
    { id: 'orders', label: 'My Orders', icon: ShoppingCart, hideGuest: true },
    { id: 'addresses', label: 'Addresses', icon: MapPin, hideGuest: true },
    { id: 'settings', label: 'Security', icon: Lock, hideGuest: true },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-6 md:py-10">
      <div id="delivery-section" className="sticky top-[80px] md:top-[110px] z-[40] transition-all duration-300 rounded-[2rem] scroll-mt-32 shadow-xl">
        <DeliveryScheduler minDate={minDateString} />
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        {/* SIDEBAR - Desktop Only */}
        <aside className="hidden lg:block space-y-3">
          <div className="flex flex-col items-center mb-8 pt-4 text-center">
            <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-stone-100 flex items-center justify-center mb-3">
              {userData?.image ? ( <img src={userData.image} alt="Profile" className="w-full h-full object-cover" /> ) : ( <div className="text-[#b32d3a] font-black text-2xl">{userData?.name?.charAt(0) || 'U'}</div> )}
            </div>
            <p className="font-black uppercase text-[10px] tracking-widest text-slate-400">{isGuest ? 'Guest Access' : 'Customer Account'}</p>
          </div>

          {tabs.map((tab) => {
            if (isGuest && tab.hideGuest) return null;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center justify-between px-8 py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] transition-all ${activeTab === tab.id ? 'bg-[#b32d3a] text-white shadow-xl' : 'bg-white text-slate-500 border border-stone-200 hover:border-[#b32d3a]/30'}`}>
                <div className="flex items-center gap-4"><tab.icon size={18} />{tab.label}</div>
                <ChevronRight size={14} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
              </button>
            )
          })}
        </aside>

        {/* MOBILE DASHBOARD TABS - FIXED: Vertical Stack */}
        <div className="lg:hidden flex flex-col gap-2 mb-2">
          {tabs.map((tab) => {
            if (isGuest && tab.hideGuest) return null;
            return (
              <button 
                key={tab.id} 
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full flex items-center justify-center gap-3 px-5 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all border ${
                  activeTab === tab.id 
                    ? 'bg-[#b32d3a] text-white border-[#b32d3a] shadow-lg' 
                    : 'bg-white text-slate-500 border-stone-200'
                }`}
              >
                <tab.icon size={16} /> {tab.label}
              </button>
            )
          })}
        </div>

        <main className="bg-white rounded-[2.5rem] md:rounded-[4rem] shadow-sm border border-stone-200 min-h-[500px] relative overflow-hidden">
          {isGuest && activeTab === 'menu' && (
            <div className="bg-amber-50 border-b border-amber-100 p-6 text-center">
              <p className="text-amber-900 font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                <UserCircle className="w-4 h-4" /> You are browsing as a guest
              </p>
            </div>
          )}

          {/* MENU TAB */}
          {activeTab === 'menu' && (
            <div className="p-6 md:p-10 text-center">
              <div className="flex justify-center items-center gap-2 mb-6">
                <div className="h-[1px] w-8 bg-[#b32d3a]"></div>
                <span className="text-[#b32d3a] font-black uppercase tracking-[0.4em] text-[10px]">The Office Lunch Menu</span>
                <div className="h-[1px] w-8 bg-[#b32d3a]"></div>
              </div>
              
              {/* MENU CATEGORY TABS - FIXED: Vertical Stack on Mobile */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 mb-10">
                {menuCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setMenuTab(cat.id)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all border-2 ${
                      menuTab === cat.id 
                        ? 'bg-[#b32d3a] border-[#b32d3a] text-white shadow-lg' 
                        : 'bg-white border-slate-100 text-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <span className={menuTab === cat.id ? 'text-white' : 'text-[#b32d3a]'}>{cat.icon}</span> {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {dbProducts.filter(item => item.category === menuTab).map((item) => {
                  const isSoldOut = item.stock <= 0 || item.isAvailable === false;
                  return (
                    <div key={item._id} className="group bg-slate-50/50 rounded-3xl md:rounded-[2.5rem] p-4 md:p-6 flex gap-4 md:gap-6 items-center border border-transparent hover:border-slate-200 transition-all shadow-sm">
                      <div className="relative w-20 h-20 md:w-32 md:h-32 shrink-0">
                        <div className="w-full h-full bg-white rounded-2xl overflow-hidden relative">
                          <img src={item.image} className={`w-full h-full object-cover ${isSoldOut ? 'grayscale' : ''}`} />
                        </div>
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-[12px] md:text-sm font-black uppercase text-slate-900 leading-tight">{item.name}</h3>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-[#b32d3a] font-black text-sm">£{(item.price || 0).toFixed(2)}</span>
                          <button onClick={() => handleAddToBasket(item)} className="bg-white p-2 rounded-full shadow-md hover:bg-[#b32d3a] hover:text-white transition-all">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'addresses' && !isGuest && (
            <div className="p-6 md:p-10 text-left">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Saved <span className="text-[#b32d3a]">Addresses</span></h2>
                <AddAddressModal onAddressAdded={handleAddressUpdate} editData={editingAddress} onClose={() => setEditingAddress(null)} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {userData?.addresses?.map((addr: any) => (
                  <div key={addr._id} onClick={() => handleSetDefault(addr._id)} className={`group cursor-pointer p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border flex flex-col transition-all ${addr.isDefault ? 'bg-white border-[#b32d3a] shadow-xl ring-1 ring-[#b32d3a]/10' : 'bg-slate-50 border-stone-100 hover:border-slate-300'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <p className="font-black uppercase text-[9px] text-[#b32d3a] tracking-widest">{addr.label}</p>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => { e.stopPropagation(); setEditingAddress(addr); }} className="p-2 text-slate-400 hover:text-blue-600"><Pencil size={14} /></button>
                        <DeleteAddressButton addressId={addr._id} onDeleted={() => handleAddressDeleted(addr._id)} />
                      </div>
                    </div>
                    <div className="flex-1 space-y-2 mb-6 text-sm font-bold text-slate-900">{addr.addressLine1}</div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className={`font-black uppercase text-[8px] tracking-[0.2em] ${addr.isDefault ? 'text-slate-900' : 'text-slate-400'}`}>{addr.isDefault ? 'Primary' : 'Set Primary'}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${addr.isDefault ? 'border-[#b32d3a] bg-[#b32d3a]' : 'border-slate-200'}`}>
                        {addr.isDefault && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'orders' && !isGuest && (
            <div className="p-6 md:p-10 text-left">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-10">Order <span className="text-[#b32d3a]">History</span></h2>
              <div className="space-y-4">
                {orders?.map((o: any) => <OrderRow key={o._id} order={o} />)}
              </div>
            </div>
          )}

          {activeTab === 'settings' && !isGuest && (
             <div className="p-6 md:p-10 text-left">
               <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8">Security <span className="text-[#b32d3a]">Settings</span></h2>
               <form onSubmit={handlePasswordChange} className="max-w-xl space-y-6">
                 <input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full bg-slate-50 border border-stone-100 px-6 py-4 rounded-[1.5rem] md:rounded-[2rem] text-sm focus:border-[#b32d3a]/30 outline-none" required />
                 <input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full bg-slate-50 border border-stone-100 px-6 py-4 rounded-[1.5rem] md:rounded-[2rem] text-sm focus:border-[#b32d3a]/30 outline-none" required />
                 <button type="submit" className="w-full bg-slate-900 text-white py-6 rounded-[1.5rem] md:rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#b32d3a] transition-all shadow-xl">Update Credentials</button>
               </form>
             </div>
          )}
        </main>
      </div>
    </div>
  );
}