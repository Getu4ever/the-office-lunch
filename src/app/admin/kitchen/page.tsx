'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Clock, CheckCircle2, Utensils, Loader2, PlusCircle, Printer } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KitchenDashboard() {
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

  const fetchOrders = async () => {
    if (session?.user?.role !== 'admin') return;
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
  };

  const createTestOrder = async () => {
    const loadingToast = toast.loading("Creating Test Order...");
    
    // FIX: Added 'image' property to items to satisfy Schema validation
    const testOrder = {
      type: "TEST_ORDER_CREATE",
      userEmail: "admin@test.com",
      userName: "TEST SYSTEM ORDER",
      addressLine1: "Kitchen Test Lab, SW19",
      telephone: "07700 000000",
      eventDate: new Date().toISOString().split('T')[0],
      deliverySlot: "12:00 - 12:30",
      status: "Paid",
      total: 57.00,
      items: [
        { 
          name: "Executive Platter", 
          quantity: 2, 
          price: 45, 
          image: "https://placehold.co/100x100?text=Platter" 
        },
        { 
          name: "Fruit Box", 
          quantity: 1, 
          price: 12, 
          image: "https://placehold.co/100x100?text=Fruit" 
        }
      ]
    };

    try {
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testOrder)
      });
      
      const data = await res.json();

      if (res.ok) {
        toast.success("TEST ORDER CREATED", { id: loadingToast });
        fetchOrders();
      } else {
        console.error("Server Error Detail:", data.details);
        toast.error(`FAILED: ${data.error || 'Validation Error'}`, { id: loadingToast });
      }
    } catch (err) {
      toast.error("NETWORK ERROR", { id: loadingToast });
    }
  };

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
      <div style="display: flex; border-bottom: 2px solid #000; padding: 12px 0;">
        <div style="width: 25px; height: 25px; border: 3px solid black; margin-right: 20px;"></div>
        <span style="font-weight: 900; font-size: 1.8rem;">${item.quantity}x ${item.name}</span>
      </div>
    `).join('');
    printWindow.document.write(`<html><body onload="window.print();"><h1>${order.deliverySlot}</h1>${itemsHtml}</body></html>`);
    printWindow.document.close();
  };

  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user?.role === 'admin') {
      fetchOrders();
      const interval = setInterval(fetchOrders, 10000);
      return () => clearInterval(interval);
    }
  }, [sessionStatus, session]);

  if (sessionStatus === 'loading') {
    return <div className="h-screen flex items-center justify-center font-black text-[#b32d3a]">SYNCING...</div>;
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
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">Kitchen <span className="text-[#b32d3a]">Command</span></h1>
        <div className="flex gap-4">
            <button onClick={createTestOrder} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase flex items-center gap-2 shadow-lg hover:bg-blue-700 transition-all">
                <PlusCircle size={16} /> Create a New Test
            </button>
            <div className="bg-white px-8 py-3 rounded-2xl border-2 border-slate-200 font-black text-[#b32d3a] text-2xl shadow-sm">{orders.length}</div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 text-left">
        <div className="xl:col-span-2 space-y-6">
          {orders.length === 0 && (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
               <Utensils className="mx-auto text-slate-200 mb-4" size={48} />
               <p className="font-black text-slate-300 uppercase tracking-widest text-xs">No active orders in prep</p>
            </div>
          )}
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[3rem] shadow-xl overflow-hidden flex border border-slate-100">
              <div className="bg-slate-900 text-white p-8 w-40 flex flex-col justify-center items-center shrink-0">
                 <Clock className="w-8 h-8 text-[#b32d3a] mb-2" />
                 <span className="text-xl font-black">{order.deliverySlot}</span>
              </div>
              <div className="flex-1 p-10">
                <div className="flex justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black uppercase">{order.userName}</h3>
                    <p className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-50 px-3 py-1 rounded-full inline-block mt-2">
                      Received {getTimeAgo(order.createdAt)}
                    </p>
                  </div>
                  <button onClick={() => handlePrint(order)} className="p-4 bg-slate-50 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><Printer size={20} /></button>
                </div>
                <div className="space-y-3 mb-8">
                  {order.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 font-bold uppercase text-sm">
                      <span>{item.name}</span>
                      <span className="text-[#b32d3a]">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => handleComplete(order._id)} disabled={completingId === order._id} className="w-full py-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3">
                  {completingId === order._id ? <Loader2 className="animate-spin" /> : <><CheckCircle2 /> Complete Prep</>}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white h-fit sticky top-10">
          <h3 className="text-2xl font-black uppercase mb-8 text-[#b32d3a] flex items-center gap-3">Prep Wall</h3>
          <div className="space-y-4">
            {Object.entries(totals).map(([name, qty]: any) => (
              <div key={name} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="text-[10px] font-bold text-slate-400 uppercase leading-tight pr-4">{name}</span>
                <span className="text-2xl font-black text-[#b32d3a]">x{qty}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}