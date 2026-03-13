'use client';

import { ShoppingBag, X, Trash2, ArrowRight, Plus, Minus, Calendar, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function Cart() {
  const [isOpen, setIsOpen] = useState(false);
  const [isWiggling, setIsWiggling] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [eventDate, setEventDate] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New state to handle loading UI
  
  const { items, removeFromCart, total, addToCart, decrementQuantity } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (itemCount > 0) {
      setIsWiggling(true);
      const timer = setTimeout(() => setIsWiggling(false), 500);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We pass the cart items and the event date to the backend
        body: JSON.stringify({ 
          cartItems: items,
          metadata: { eventDate } 
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe's secure checkout page
        window.location.href = data.url;
      } else {
        console.error('Checkout error:', data.error);
        alert('Something went wrong with the checkout.');
      }
    } catch (error) {
      console.error('Network error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes cartWiggle {
          0% { transform: translateY(-50%) scale(1); }
          25% { transform: translateY(-50%) scale(1.1) rotate(-8deg); }
          50% { transform: translateY(-50%) scale(1.1) rotate(8deg); }
          100% { transform: translateY(-50%) scale(1); }
        }
        .animate-wiggle { animation: cartWiggle 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
      `}</style>

      {/* TRIGGER: Pinned to Right, Centered Vertically */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[110] bg-slate-900 text-white py-8 px-4 rounded-l-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.2)] hover:bg-[#f06428] transition-all flex flex-col items-center gap-4 border-y border-l border-white/10 ${isWiggling ? 'animate-wiggle' : ''}`}
      >
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          {itemCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-[#f06428] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
              {itemCount}
            </div>
          )}
        </div>
        <span className="[writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[0.3em] rotate-180 whitespace-nowrap">
          Your Selection
        </span>
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-[130] shadow-[-20px_0_60px_rgba(0,0,0,0.2)] transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full relative text-[#0f172a]">
          
          {/* SUCCESS OVERLAY (Kept for local fallback/logic) */}
          {isSuccess && (
            <div className="absolute inset-0 bg-white z-[140] flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-[#f06428] rounded-full flex items-center justify-center mb-8 shadow-2xl">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Order Received</h2>
              <p className="text-slate-500 font-medium mb-10 italic">"We're getting the Jollof ready for your event on {eventDate}!"</p>
              <button 
                onClick={() => { setIsSuccess(false); setIsOpen(false); }}
                className="bg-slate-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#f06428] transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          )}

          {/* Header */}
          <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">Your Order</h2>
              <p className="text-[10px] font-bold text-[#f06428] uppercase tracking-[0.3em] mt-1">The Catering Co. Selection</p>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-3 hover:bg-white hover:rotate-90 shadow-sm rounded-full transition-all duration-300">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-10 space-y-10">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                <ShoppingBag className="w-16 h-16 mb-4 text-slate-200" />
                <p className="font-black uppercase tracking-widest text-sm text-slate-400">Your basket is empty</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="group relative flex gap-6 items-center">
                  <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg border border-slate-100 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.name} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-black uppercase text-sm tracking-tight">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100">
                        <button 
                          onClick={() => decrementQuantity(item.id)}
                          className="p-1 hover:text-[#f06428]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-black">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 hover:text-[#f06428]"><Plus className="w-3 h-3" /></button>
                      </div>
                      <p className="font-black text-sm">£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-10 border-t border-slate-100 bg-slate-50/80 backdrop-blur-sm">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-[#f06428]" />
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Event Date</label>
              </div>
              <input 
                type="date" 
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 font-bold focus:outline-none focus:ring-2 focus:ring-[#f06428] appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <span>Logistics & Handling</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-black uppercase tracking-tighter text-lg">Total</span>
                <span className="text-4xl font-black tracking-tighter">£{total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckout}
              disabled={items.length === 0 || !eventDate || isLoading}
              className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-lg hover:bg-[#f06428] disabled:bg-slate-200 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group"
            >
              {isLoading ? 'Processing...' : 'Secure Checkout'} 
              {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}