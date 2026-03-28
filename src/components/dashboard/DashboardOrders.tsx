'use client';

import { 
  ShoppingBag, Package, ChevronDown, ChevronUp, MapPin, 
  Phone, Printer, CheckCircle2, RefreshCcw, Loader2, 
  Truck, Utensils, XCircle, User 
} from "lucide-react";
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import OrderTracker from './OrderTracker';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderId: string;
  total: number;
  status: string;
  eventDate: string;
  deliverySlot: string;
  items: OrderItem[];
  userName?: string;
  userPhone?: string;
  userImage?: string; 
  createdAt?: string; 
  updatedAt?: string;
}

interface DashboardOrdersProps {
  orders: Order[];
  role?: string;
  onOrderUpdate?: () => void; // Added to sync with parent dashboard
}

export default function DashboardOrders({ orders, role, onOrderUpdate }: DashboardOrdersProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'Upcoming' | 'Paid' | 'All'>('Upcoming');
  
  const [localOrders, setLocalOrders] = useState<Order[]>(orders);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const isAdmin = role === 'admin';

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    const loadingToast = toast.loading(`Updating to ${newStatus}...`);
    
    try {
      const res = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        // 1. Update local state for instant feedback
        setLocalOrders(prev => prev.map(o => 
          o._id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
        ));

        // 2. Trigger parent refresh to sync database state across the dashboard
        if (onOrderUpdate) {
          onOrderUpdate();
        }

        toast.success(`ORDER ${newStatus.toUpperCase()}`, { id: loadingToast });
      } else {
        throw new Error("Update failed");
      }
    } catch (err) {
      toast.error("SYSTEM ERROR", { id: loadingToast });
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = localOrders.filter(order => {
    const currentStatus = (order.status || '').toLowerCase();
    if (filter === 'All') return true;
    if (filter === 'Upcoming') return currentStatus !== 'delivered' && currentStatus !== 'cancelled';
    if (filter === 'Paid') return currentStatus === 'paid';
    return currentStatus === (filter as string).toLowerCase();
  }).sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  const handlePrint = (order: Order) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    const itemsList = order.items.map(item => `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding: 10px 0;">
        <span>${item.quantity}x ${item.name}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <body onload="window.print(); window.close();" style="font-family: sans-serif; padding: 40px;">
          <h1 style="text-transform: uppercase; color: #b32d3a;">KITCHEN TICKET: ${order.orderId}</h1>
          <p><strong>Date:</strong> ${order.eventDate} | <strong>Slot:</strong> ${order.deliverySlot}</p>
          <p><strong>Customer:</strong> ${order.userName}</p>
          <hr />
          ${itemsList}
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-10 text-left">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">
          {isAdmin ? "Kitchen Command" : "Orders"}
        </h2>
        {isAdmin && (
          <div className="flex bg-stone-100 p-1 rounded-xl">
            {(['Upcoming', 'Paid', 'All'] as const).map((t) => (
              <button 
                key={t} 
                onClick={() => setFilter(t)} 
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${
                  filter === t ? 'bg-white shadow-sm text-[#b32d3a]' : 'text-stone-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-stone-50 border-2 border-dashed border-stone-200 rounded-[2rem] p-20 text-center">
            <ShoppingBag className="mx-auto text-stone-200 mb-4" size={48} />
            <p className="text-stone-400 font-black uppercase text-xs tracking-widest">No live orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isNew = order.createdAt && 
              (new Date().getTime() - new Date(order.createdAt).getTime()) < 24 * 60 * 60 * 1000;

            const itemsSummary = order.items?.map(i => `${i.quantity}x ${i.name}`).join(', ') || 'No items';
            
            const slot = order.deliverySlot || "00:00 - 00:00";
            const slotParts = slot.includes(' - ') ? slot.split(' - ') : [slot, '...'];

            return (
              <div key={order._id} className="bg-white border border-stone-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow text-left">
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center" 
                  onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-stone-900 text-white rounded-3xl flex flex-col items-center justify-center font-black text-[11px] text-center relative leading-tight shrink-0">
                      <span className="opacity-50 text-[7px] mb-1">SLOT</span>
                      {slotParts[0]}<br/>
                      <span className="text-[8px] opacity-70">to</span>
                      {slotParts[1]}
                      {isNew && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#b32d3a] rounded-full border-4 border-white animate-pulse" />
                      )}
                    </div>

                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-stone-100 shrink-0 bg-stone-50 flex items-center justify-center">
                      {order.userImage ? (
                        <img src={order.userImage} alt={order.userName} className="w-full h-full object-cover" />
                      ) : (
                        <User className="text-stone-300" size={20} />
                      )}
                    </div>

                    <div className="max-w-md">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black uppercase tracking-tight text-slate-900 text-lg">{order.eventDate}</h4>
                        {isNew && <span className="text-[8px] bg-red-100 text-[#b32d3a] px-2 py-0.5 rounded-full font-black">NEW</span>}
                      </div>
                      <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mb-2">
                        ID: {order.orderId?.slice(-6) || '...'} • {order.userName || 'Guest'}
                      </p>
                      <p className="text-[11px] font-black text-[#b32d3a] uppercase line-clamp-1 bg-stone-50 px-3 py-1 rounded-lg border border-stone-100">
                        {itemsSummary}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-black text-stone-300 uppercase">Total Paid</p>
                      <p className="text-lg font-black text-slate-900">£{order.total.toFixed(2)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase border-2 ${
                      order.status?.toLowerCase() === 'delivered' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {order.status}
                    </span>
                    {expandedId === order._id ? <ChevronUp size={20} className="text-stone-300" /> : <ChevronDown size={20} className="text-stone-300" />}
                  </div>
                </div>

                {expandedId === order._id && (
                  <div className="p-10 pt-4 bg-stone-50/40 border-t border-stone-50">
                    <div className="mt-4">
                      <OrderTracker status={order.status} updatedAt={order.updatedAt} />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-10 mt-10">
                      <div className="space-y-3">
                        <p className="text-[11px] font-black uppercase text-[#b32d3a] mb-5 tracking-[0.2em]">Detailed Manifest</p>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center bg-white p-5 rounded-2xl border border-stone-100 text-[13px] font-black uppercase">
                            <span className="flex items-center gap-3">
                              <span className="bg-stone-900 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px]">{item.quantity}</span>
                              {item.name}
                            </span>
                            <span className="text-stone-300">£{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      {isAdmin && (
                        <div className="bg-white p-8 rounded-[2.5rem] border border-stone-100 shadow-sm">
                          <div className="flex justify-between items-center mb-8">
                            <p className="text-[11px] font-black uppercase text-[#b32d3a] tracking-[0.2em]">Kitchen Workflow</p>
                            <button onClick={() => handlePrint(order)} className="p-3 bg-stone-50 text-stone-400 hover:text-[#b32d3a] rounded-xl transition-all">
                              <Printer size={20} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { l: 'Start Preparing', v: 'preparing', i: Utensils },
                              { l: 'Out for Delivery', v: 'out-for-delivery', i: Truck },
                              { l: 'Mark Delivered', v: 'delivered', i: CheckCircle2 },
                              { l: 'Cancel Order', v: 'cancelled', i: XCircle }
                            ].map((btn) => (
                              <button
                                key={btn.v}
                                onClick={() => updateStatus(order._id, btn.v)}
                                disabled={updatingId === order._id}
                                className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl text-[10px] font-black uppercase border-2 transition-all ${
                                  order.status?.toLowerCase() === btn.v 
                                    ? 'bg-[#b32d3a] text-white border-[#b32d3a] shadow-lg shadow-red-100' 
                                    : 'bg-stone-50 text-stone-400 border-transparent hover:border-stone-200'
                                }`}
                              >
                                {updatingId === order._id ? (
                                  <Loader2 size={16} className="animate-spin" />
                                ) : (
                                  <btn.i size={18} />
                                )}
                                {btn.l}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}