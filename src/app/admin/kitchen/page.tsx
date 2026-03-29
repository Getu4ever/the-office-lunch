'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Clock, CheckCircle2, Utensils, Loader2, PlusCircle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KitchenPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "Just now";
    const now = new Date();
    const created = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / 60000);
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    return `${Math.floor(diffInMinutes / 60)}h ago`;
  };

  const fetchOrders = useCallback(async (isInitial = false) => {
    if (session?.user?.role !== 'admin') return;
    if (isInitial) setLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (res.ok) {
        const activeOrders = data.filter((o: any) => 
          (o.status || '').toLowerCase() !== 'delivered' && 
          (o.status || '').toLowerCase() !== 'cancelled'
        );
        setOrders(activeOrders);
      }
    } catch (err) {
      console.error("Sync failed");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.role]);

  const handleComplete = async (id: string) => {
    setCompletingId(id);
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'delivered' }) 
      });
      if (res.ok) {
        toast.success("ORDER MARKED AS DELIVERED");
        setOrders(prev => prev.filter(order => order._id !== id));
      }
    } catch (err) {
      toast.error("UPDATE FAILED");
    } finally {
      setCompletingId(null);
    }
  };

  const handlePrint = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    const itemsHtml = order.items.map((item: any) => `
      <div style="display: flex; border-bottom: 2px solid #000; padding: 12px 0; align-items: center; font-family: sans-serif;">
        <div style="width: 20px; height: 20px; border: 3px solid black; margin-right: 15px;"></div>
        <span style="font-weight: 900; font-size: 1.5rem;">${item.quantity}x ${item.name}</span>
      </div>
    `).join('');
    printWindow.document.write(`<html><body onload="window.print();" style="padding: 40px; font-family: sans-serif;"><h1>${order.deliverySlot}</h1><h2>${order.userName}</h2><hr/>${itemsHtml}</body></html>`);
    printWindow.document.close();
  };

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.role === 'admin') {
      fetchOrders(true);
      const interval = setInterval(() => fetchOrders(false), 10000);
      return () => clearInterval(interval);
    }
  }, [sessionStatus, session, fetchOrders]);

  if (sessionStatus === 'loading' || loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-100 font-black text-[#b32d3a]">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <span className="uppercase tracking-widest text-xs italic">Syncing Kitchen...</span>
      </div>
    );
  }

  if (sessionStatus === 'unauthenticated' || session?.user?.role !== 'admin') {
    return <div className="h-screen bg-white" />;
  }

  const totals = orders.reduce((acc: any, order: any) => {
    order.items?.forEach((item: any) => {
      acc[item.name] = (acc[item.name] || 0) + (item.quantity || 1);
    });
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-slate-100 p-6 md:p-12 text-slate-900">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Kitchen <span className="text-[#b32d3a]">Command</span></h1>
        <div className="flex items-center gap-4">
            <div className="bg-white px-8 py-4 rounded-3xl border-2 border-slate-200 font-black text-[#b32d3a] text-2xl shadow-sm min-w-[80px] text-center">
              {orders.length}
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 items-start">
        {/* Orders Column with min-height to prevent footer/layout wobble */}
        <div className="xl:col-span-2 space-y-8 min-h-[600px]">
          {orders.length === 0 ? (
            <div className="bg-white p-24 rounded-[3.5rem] text-center border-2 border-dashed border-slate-200 animate-in fade-in duration-700">
               <Utensils className="mx-auto text-slate-100 mb-6" size={64} />
               <p className="font-black text-slate-300 uppercase tracking-widest text-xs">No orders in preparation</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[3.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col md:flex-row border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900 text-white p-8 md:w-48 flex flex-col justify-center items-center shrink-0">
                   <Clock className="w-8 h-8 text-[#b32d3a] mb-2" />
                   <span className="text-2xl font-black italic">{order.deliverySlot}</span>
                </div>
                <div className="flex-1 p-8 md:p-12">
                  <div className="flex justify-between items-start mb-8 gap-4">
                    <div className="text-left">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter">{order.userName}</h3>
                      <p className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1.5 rounded-full inline-block mt-3 border border-emerald-100">
                        Received {getTimeAgo(order.createdAt)}
                      </p>
                    </div>
                    <button onClick={() => handlePrint(order)} className="p-5 bg-slate-50 text-slate-400 rounded-3xl hover:bg-slate-900 hover:text-white transition-all active:scale-90 shadow-sm">
                      <Printer size={22} />
                    </button>
                  </div>
                  
                  {/* Stable Grid for Items */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                    {order.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-5 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="font-black uppercase text-[11px] text-slate-600 truncate pr-4">{item.name}</span>
                        <span className="text-xl font-black text-[#b32d3a] italic">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => handleComplete(order._id)} 
                    disabled={completingId === order._id} 
                    className={`w-full py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-[12px] flex items-center justify-center gap-3 transition-all shadow-xl ${completingId === order._id ? 'bg-slate-100 text-slate-300' : 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95'}`}
                  >
                    {completingId === order._id ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={20} /> Complete Prep</>}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Prep Wall Column - Sticky to prevent side-scrolling wobble */}
        <div className="bg-slate-900 rounded-[3.5rem] p-10 text-white h-fit sticky top-10 shadow-2xl border border-white/5 animate-in fade-in slide-in-from-right-4 duration-700">
          <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#b32d3a] mb-10">Prep Wall</h3>
          <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(totals).map(([name, qty]: any) => (
              <div key={name} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <span className="text-[10px] font-bold text-slate-300 uppercase leading-tight pr-4">{name}</span>
                <span className="text-3xl font-black text-[#b32d3a] italic">x{qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}