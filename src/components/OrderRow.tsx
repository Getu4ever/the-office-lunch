'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  Package, 
  Calendar, 
  RefreshCw, 
  Loader2, 
  MapPin, 
  Download, 
  Share2 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import OrderTracker from '@/components/dashboard/OrderTracker';
import toast from 'react-hot-toast';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function OrderRow({ order }: { order: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToCart, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemsSummary = order.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') || 'Processing items...';

  const handleReorder = async () => {
    setIsReordering(true);
    try {
      if (clearCart) clearCart();

      order.items.forEach((item: any) => {
        addToCart({
          id: item.productId || item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
        });
      });

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: order.items,
          userEmail: order.userEmail || 'Guest',
          userId: order.userId || 'guest',
          deliverySlot: order.deliverySlot,
          selectedDate: order.eventDate,
          address: order.address,
          telephone: order.telephone
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "REORDER FAILED");
        setIsReordering(false);
      }
    } catch (err) {
      toast.error("NETWORK ERROR");
      setIsReordering(false);
    }
  };

  const handleDownloadReceipt = () => {
    try {
      const doc = new jsPDF();
      const orderNum = (order.orderId || order._id).slice(-6).toUpperCase();

      doc.setFontSize(22);
      doc.setTextColor(179, 45, 58); 
      doc.text("LUNCH SELECTION", 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text("OFFICIAL EXPENSE RECEIPT", 14, 30);

      doc.setTextColor(0);
      doc.setFont("helvetica", "bold");
      doc.text(`Order: #${orderNum}`, 14, 45);
      doc.setFont("helvetica", "normal");
      doc.text(`Date: ${order.eventDate || new Date(order.createdAt).toLocaleDateString()}`, 14, 52);

      const tableBody = order.items.map((i: any) => [
        i.name,
        i.quantity.toString(),
        `£${i.price.toFixed(2)}`,
        `£${(i.quantity * i.price).toFixed(2)}`
      ]);

      autoTable(doc, {
        startY: 65,
        head: [['Item', 'Qty', 'Price', 'Total']],
        body: tableBody,
        headStyles: { fillColor: [15, 23, 42] },
        theme: 'striped'
      });

      const finalY = (doc as any).lastAutoTable.finalY + 10;
      doc.setFont("helvetica", "bold");
      doc.text(`Grand Total: £${order.total.toFixed(2)}`, 140, finalY);

      doc.save(`Receipt-${orderNum}.pdf`);
      toast.success("RECEIPT GENERATED");
    } catch (err) {
      toast.error("PDF GENERATION FAILED");
    }
  };

  const handleShareExpense = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const orderNum = (order.orderId || order._id).slice(-6).toUpperCase();
    const shareText = `Expense Claim for Order #${orderNum}\nTotal: £${order.total.toFixed(2)}\nDate: ${order.eventDate}\nItems: ${itemsSummary}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `Receipt #${orderNum}`, text: shareText });
      } catch (err) { console.log("Cancelled"); }
    } else {
      const mailtoUrl = `mailto:?subject=Expense Claim: Order #${orderNum}&body=${encodeURIComponent(shareText)}`;
      window.location.href = mailtoUrl;
      toast.success("OPENING EMAIL CLIENT");
    }
  };

  const slideOverContent = (
    <div className="fixed inset-0 z-[200] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 text-left">
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <button onClick={() => setIsOpen(false)} className="mb-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
            ← Close Summary
          </button>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black uppercase text-slate-900 leading-none">Order Details</h2>
              <p className="text-[#b32d3a] font-bold text-[10px] break-all uppercase mt-3 tracking-tighter">ID: {order.orderId || order._id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-10">
            <button onClick={handleDownloadReceipt} className="flex items-center justify-center gap-2 py-4 bg-stone-50 hover:bg-stone-100 rounded-2xl text-[9px] font-black uppercase border border-stone-200 transition-all active:scale-95">
              <Download className="w-3 h-3 text-[#b32d3a]" /> Download Receipt
            </button>
            <button onClick={handleShareExpense} className="flex items-center justify-center gap-2 py-4 bg-[#b32d3a] hover:bg-slate-900 text-white rounded-2xl text-[9px] font-black uppercase transition-all shadow-md active:scale-95">
              <Share2 className="w-3 h-3" /> Share Expense
            </button>
          </div>

          <div className="mb-10">
            <OrderTracker status={order.status || 'pending'} updatedAt={order.updatedAt} />
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-4 md:p-5 bg-stone-50 rounded-3xl border border-stone-100">
                  <Calendar className="text-[#b32d3a] w-4 h-4 mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Delivery Date</p>
                  <p className="font-bold text-slate-900 text-xs">{order.eventDate}</p>
                </div>
                <div className="p-4 md:p-5 bg-stone-50 rounded-3xl border border-stone-100">
                  <MapPin className="text-[#b32d3a] w-4 h-4 mb-2" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Time Slot</p>
                  <p className="font-bold text-slate-900 text-xs">{order.deliverySlot}</p>
                </div>
            </div>

            <div>
              <h3 className="text-[11px] font-black uppercase text-slate-900 tracking-widest mb-6 flex items-center gap-2">
                <Package className="w-4 h-4 text-[#b32d3a]" /> Items In This Order
              </h3>
              <div className="space-y-5">
                {order.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center text-left">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden border border-stone-100 bg-stone-50 flex-shrink-0">
                        <img src={item.image || 'https://placehold.co/400x400'} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs leading-tight truncate">{item.name}</p>
                        <p className="text-[9px] font-black text-[#b32d3a] uppercase mt-1">Qty: {item.quantity} × £{item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <p className="font-black text-slate-900 text-sm shrink-0">£{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 bg-white border-t border-stone-100 text-left">
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Paid</p>
              <span className="text-2xl md:text-3xl font-black text-slate-900">£{order.total.toFixed(2)}</span>
            </div>
          </div>
          
          <button 
            onClick={handleReorder}
            disabled={isReordering}
            className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${
              isReordering ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-900 text-white hover:bg-[#b32d3a]'
            }`}
          >
            {isReordering ? <Loader2 className="animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            {isReordering ? 'Setting up order...' : 'Repeat This Order'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* FIXED: Removed horizontal grid on mobile, using a flex-column stack that expands to grid on desktop */}
      <div 
        onClick={() => setIsOpen(true)} 
        className="flex flex-col md:grid md:grid-cols-[0.8fr_1fr_2fr_0.8fr_0.8fr_auto] gap-3 md:gap-0 md:items-center p-5 md:p-6 border-b border-stone-100 hover:bg-stone-50 transition-all cursor-pointer bg-white group"
      >
        <div className="flex justify-between items-center md:block">
           <div className="font-bold text-slate-900 text-[10px] uppercase tracking-tight text-left">
            <span className="text-slate-300 mr-1">#</span>
            {(order.orderId || order._id).slice(-6).toUpperCase()}
          </div>
          <div className="md:hidden">
             <span className={`px-3 py-1 rounded-full font-black uppercase text-[8px] tracking-widest ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
              {order.status || 'pending'}
             </span>
          </div>
        </div>

        <div className="text-slate-400 font-bold text-[10px] uppercase text-left">
          {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Today'}
        </div>

        <div className="text-left md:px-4">
           <p className="text-[10px] font-black text-[#b32d3a] uppercase truncate bg-stone-100/50 px-3 py-1 rounded-full border border-stone-100 w-fit max-w-full md:max-w-[200px]">
             {itemsSummary}
           </p>
        </div>

        <div className="hidden md:block text-left">
           <span className={`px-3 py-1 rounded-full font-black uppercase text-[8px] tracking-widest ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {order.status || 'pending'}
           </span>
        </div>

        <div className="flex justify-between items-center md:block">
          <div className="font-black text-slate-900 text-sm md:text-right md:pr-4">£{order.total.toFixed(2)}</div>
          <div className="md:block"><ChevronRight className="w-5 h-4 text-slate-300 group-hover:text-[#b32d3a] transition-all" /></div>
        </div>
      </div>
      {isOpen && mounted && createPortal(slideOverContent, document.body)}
    </>
  );
}