'use client';

import { X, ArrowRight, Plus, Minus, MapPin, Loader2, Search, Phone, Home } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function Cart() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status: sessionStatus } = useSession();
  const { 
    items, total, deliveryFee, grandTotal, minOrderMet, amountToMin,
    addToCart, decrementQuantity, isOpen, setIsOpen, 
    deliverySlot, selectedDate, selectedAddress, setSelectedAddress
  } = useCart();

  const [addressInput, setAddressInput] = useState('');
  const [streetInput, setStreetInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [isManual, setIsManual] = useState(!selectedAddress);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserAddress = async () => {
      if (sessionStatus === "authenticated" && !selectedAddress) {
        try {
          const res = await fetch('/api/user/address');
          if (res.ok) {
            const userData = await res.json();
            const primary = userData.addresses?.find((addr: any) => addr.isDefault) || userData.addresses?.[0];
            if (primary) {
              setSelectedAddress(primary);
              setIsManual(false);
            }
          }
        } catch (err) { console.error("Sync Error", err); }
      }
    };
    fetchUserAddress();
  }, [sessionStatus, selectedAddress, setSelectedAddress]);

  const handleAddressSearch = (val: string) => {
    const upperVal = val.toUpperCase();
    setAddressInput(upperVal);
    if (upperVal.length >= 2) {
      // Logic for smarter lookup - showing suggestions based on postcode
      setSuggestions([`${upperVal}`, `${upperVal}, London`, `${upperVal}, Surrey`]);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const isAddressReady = selectedAddress || (addressInput.length >= 3 && streetInput.length >= 3 && phoneInput.length > 9);
  const canCheckout = minOrderMet && isAddressReady && !isLoading;

  const handleCheckoutClick = async () => {
    if (!canCheckout) return;
    const finalAddress = selectedAddress ? selectedAddress.addressLine1 : `${streetInput}, ${addressInput}`;
    const finalPhone = selectedAddress ? selectedAddress.telephone : phoneInput;

    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cartItems: items,
          userEmail: session?.user?.email || 'Guest',
          userId: session?.user?.id || 'guest',
          deliverySlot,
          selectedDate,
          address: finalAddress,
          telephone: finalPhone
        }),
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
      else { toast.error(data.error); setIsLoading(false); }
    } catch (error) { toast.error("Network error"); setIsLoading(false); }
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 z-[1001] bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)} 
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[1002] shadow-2xl transition-transform duration-500 ease-in-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full text-slate-900">
          
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f5f0e6]/40 shrink-0">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic leading-none text-left underline decoration-[#b32d3a] decoration-4">Your Selection</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-6 space-y-8">
            {/* Item List */}
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">The basket is empty</p>
                </div>
              ) : (
                items.map((item: any) => (
                  <div key={item.id} className="flex gap-4 items-center bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-white" alt={item.name} />
                    <div className="flex-1 min-w-0 text-left">
                      <h4 className="font-black uppercase text-[10px] leading-tight truncate">{item.name}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                          <button onClick={() => decrementQuantity(item.id)} className="px-1.5 py-0.5 hover:text-[#b32d3a] transition-colors"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-[10px] font-black">{item.quantity}</span>
                          <button onClick={() => addToCart(item)} className="px-1.5 py-0.5 hover:text-[#b32d3a] transition-colors"><Plus className="w-3 h-3" /></button>
                        </div>
                        <p className="font-black text-[11px]">£{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Delivery Inputs - Stabilized with fixed min-height to prevent wobble */}
            <div className="bg-stone-50 p-6 rounded-[2.5rem] border border-stone-100 space-y-4 shadow-inner text-left min-h-[250px] transition-all duration-300">
              <p className="text-[11px] font-black uppercase text-[#b32d3a] tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#b32d3a] rounded-full animate-pulse" /> Delivery Details
              </p>
              
              <div className="relative">
                {isManual ? (
                  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Postcode (e.g. TW9 1AB)" 
                        value={addressInput} 
                        onChange={(e) => handleAddressSearch(e.target.value)} 
                        className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl text-[11px] font-bold outline-none focus:border-[#b32d3a] pr-12 transition-all uppercase" 
                      />
                      <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                      
                      {/* Smart Suggestions Dropdown */}
                      {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-stone-100 shadow-2xl rounded-2xl z-[1100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                          {suggestions.map((sug, i) => (
                            <button
                              key={i}
                              onClick={() => {
                                setStreetInput(sug);
                                setShowSuggestions(false);
                              }}
                              className="w-full text-left px-5 py-4 text-[10px] font-black uppercase hover:bg-stone-50 border-b border-stone-50 last:border-none transition-colors"
                            >
                              {sug}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <input 
                      type="text" 
                      placeholder="House No. & Street" 
                      value={streetInput} 
                      onChange={(e) => setStreetInput(e.target.value)} 
                      className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl text-[11px] font-bold outline-none focus:border-[#b32d3a] transition-all" 
                    />
                    
                    <input 
                      type="tel" 
                      placeholder="Phone Number" 
                      value={phoneInput} 
                      onChange={(e) => setPhoneInput(e.target.value)} 
                      className="w-full px-5 py-4 bg-white border border-stone-200 rounded-2xl text-[11px] font-bold outline-none focus:border-[#b32d3a] transition-all" 
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-300">
                    <div className="bg-[#f5f0e6] p-3 rounded-xl shrink-0">
                      <MapPin className="w-5 h-5 text-[#b32d3a]" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-[12px] font-black uppercase leading-tight truncate">
                        {selectedAddress?.addressLine1 || streetInput}
                      </p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase mt-1 tracking-tight">
                        {selectedAddress?.telephone || phoneInput}
                      </p>
                      <button 
                        onClick={() => setIsManual(true)}
                        className="mt-2 text-[9px] font-black text-[#b32d3a] uppercase hover:underline flex items-center gap-1 transition-opacity"
                      >
                        Change Address <ArrowRight className="w-2 h-2" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer with Calculations */}
          <div className="p-6 pb-12 border-t border-slate-100 bg-white shrink-0 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Min. Order Progress</span>
              <span className={`text-[10px] font-black ${minOrderMet ? 'text-emerald-600' : 'text-[#b32d3a]'}`}>£{total.toFixed(2)} / £50.00</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-700 ${minOrderMet ? 'bg-emerald-500' : 'bg-[#b32d3a]'}`} style={{ width: `${Math.min(100, (total / 50) * 100)}%` }} />
            </div>

            <div className="px-2 pt-2 space-y-1">
              <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                <span>Subtotal</span>
                <span>£{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[11px] font-bold text-[#b32d3a] uppercase tracking-tighter italic">
                <span>Delivery Fee</span>
                <span>+ £{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-100">
                <span className="font-black uppercase text-lg italic tracking-tighter text-slate-900 underline decoration-[#b32d3a] decoration-2">Grand Total</span>
                <span className="text-4xl font-black tracking-tighter text-slate-900">£{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckoutClick} 
              disabled={!canCheckout} 
              className={`w-full py-5 rounded-2xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all ${!canCheckout ? 'bg-slate-100 text-slate-300' : 'bg-[#0f172a] text-white hover:bg-[#b32d3a] active:scale-95'}`}
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : !minOrderMet ? (
                `ADD £${amountToMin.toFixed(2)} MORE`
              ) : (
                <>SECURE CHECKOUT <ArrowRight className="w-5 h-5" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}