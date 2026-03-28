'use client';

import { X, ArrowRight, Plus, Minus, MapPin, Loader2, Search, Phone, Home, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
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

  // Guest Input & Suggestions State
  const [addressInput, setAddressInput] = useState(''); // Area / Postcode
  const [streetInput, setStreetInput] = useState('');   // House & Street
  const [phoneInput, setPhoneInput] = useState('');
  const [isManual, setIsManual] = useState(!selectedAddress);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // PILLAR 2: LOGGED CUSTOMER SYNC
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

  // SMART LOOKUP LOGIC - Now supports any input
  const handleAddressSearch = (val: string) => {
    const upperVal = val.toUpperCase();
    setAddressInput(upperVal);
    
    if (upperVal.length >= 2) {
      // This logic now creates suggestions based on WHATEVER the user types
      // allowing for a "Smart" feel in any UK area.
      const dynamicSuggestions = [
        `${upperVal}`,
        `${upperVal}, London`,
        `${upperVal}, Surrey`,
      ];
      setSuggestions(dynamicSuggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (s: string) => {
    setAddressInput(s);
    setShowSuggestions(false);
  };

  // PILLAR 1 & 2 CHECK: FORM VALIDATION
  const isAddressReady = selectedAddress || (addressInput.length >= 3 && streetInput.length >= 3 && phoneInput.length > 9);
  const canCheckout = minOrderMet && isAddressReady && !isLoading;

  const handleCheckoutClick = async () => {
    if (!canCheckout) return;
    const finalAddress = selectedAddress 
      ? selectedAddress.addressLine1 
      : `${streetInput}, ${addressInput}`;
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
      {isOpen && <div className="fixed inset-0 z-[120] bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />}

      <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white z-[200] shadow-2xl transition-transform duration-700 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full text-slate-900 overflow-hidden">
          
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f5f0e6]/30 flex-shrink-0">
            <h2 className="text-2xl font-black uppercase tracking-tighter italic text-left">Your Selection</h2>
            <button onClick={() => setIsOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left">
            {/* Cart Items List */}
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-slate-100" alt={item.name} />
                  <div className="flex-1">
                    <h4 className="font-black uppercase text-[10px] leading-tight">{item.name}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 p-0.5">
                        <button onClick={() => decrementQuantity(item.id)} className="px-1"><Minus className="w-3 h-3" /></button>
                        <span className="px-2 text-[10px] font-black">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="px-1"><Plus className="w-3 h-3" /></button>
                      </div>
                      <p className="font-black text-[11px]">£{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* DELIVERY DETAILS BOX */}
            <div className="bg-stone-50 p-6 rounded-[2.5rem] border border-stone-100 space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-black uppercase text-[#b32d3a] tracking-widest">Delivery Details</p>
                {!isManual && (
                  <button onClick={() => { setSelectedAddress(null); setIsManual(true); }} className="text-[9px] font-bold text-stone-400 underline uppercase italic">Change</button>
                )}
              </div>

              {isManual ? (
                /* SMART GUEST LOOKUP */
                <div className="space-y-3 relative">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b32d3a]" />
                    <input 
                      type="text" 
                      placeholder="Postcode or Area..." 
                      value={addressInput} 
                      onChange={(e) => handleAddressSearch(e.target.value)} 
                      className="w-full pl-11 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-[11px] font-bold outline-none shadow-sm" 
                    />
                    
                    {/* AUTOCOMPLETE DROPDOWN */}
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 w-full mt-2 bg-white border border-stone-100 rounded-2xl shadow-2xl z-[300] overflow-hidden">
                        {suggestions.map((s, idx) => (
                          <button key={idx} onClick={() => selectSuggestion(s)} className="w-full px-5 py-3 text-left text-[10px] font-bold hover:bg-stone-50 border-b border-stone-50 last:border-none flex items-center gap-2">
                            <MapPin size={12} className="text-stone-300" /> {s}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* HOUSE NO & STREET */}
                  <div className="relative">
                    <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                    <input 
                      type="text" 
                      placeholder="House No. & Street Name" 
                      value={streetInput} 
                      onChange={(e) => setStreetInput(e.target.value)} 
                      className="w-full pl-11 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-[11px] font-bold outline-none shadow-sm" 
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                    <input 
                      type="tel" 
                      placeholder="Telephone Number" 
                      value={phoneInput} 
                      onChange={(e) => setPhoneInput(e.target.value)} 
                      className="w-full pl-11 pr-4 py-4 bg-white border border-stone-200 rounded-2xl text-[11px] font-bold outline-none shadow-sm" 
                    />
                  </div>
                </div>
              ) : (
                /* LOGGED CUSTOMER SAVED INFO */
                <div className="flex items-start gap-4 p-2">
                  <div className="w-10 h-10 bg-[#b32d3a]/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#b32d3a]" />
                  </div>
                  <div>
                    <p className="text-[12px] font-black uppercase leading-tight">{selectedAddress?.addressLine1}</p>
                    <p className="text-[10px] font-bold text-stone-400 uppercase mt-1 tracking-tight">{selectedAddress?.telephone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer - Progress & Checkout */}
          <div className="p-6 pb-16 border-t border-slate-100 bg-[#f5f0e6]/50 space-y-4 flex-shrink-0">
            <div className="p-5 bg-white rounded-[2rem] border border-white shadow-sm text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Min. Order Progress</span>
                <span className="text-[10px] font-black text-[#b32d3a]">£{total.toFixed(2)} / £50.00</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${minOrderMet ? 'bg-emerald-500' : 'bg-[#b32d3a]'}`} style={{ width: `${Math.min(100, (total / 50) * 100)}%` }} />
              </div>
            </div>

            <div className="px-2 space-y-1 text-left">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Subtotal</span><span>£{total.toFixed(2)}</span></div>
              <div className="flex justify-between text-[10px] font-bold text-[#b32d3a] uppercase italic"><span>Delivery Fee</span><span>+ £{deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between items-center pt-3 mt-2 border-t border-slate-200/50">
                <span className="font-black uppercase text-sm italic tracking-tighter underline decoration-[#b32d3a] decoration-2 text-left">Grand Total</span>
                <span className="text-4xl font-black tracking-tighter text-slate-900">£{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handleCheckoutClick}
              disabled={!canCheckout}
              className={`w-full py-6 rounded-3xl font-black text-[12px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 ${
                !canCheckout ? 'bg-slate-200 text-slate-400 cursor-not-allowed scale-[0.98]' : 'bg-[#0f172a] text-white hover:bg-[#b32d3a] shadow-2xl active:scale-95'
              }`}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : !minOrderMet ? `ADD £${amountToMin.toFixed(2)} MORE` : !isAddressReady ? "ADDRESS REQUIRED" : <>SECURE CHECKOUT <ArrowRight className="w-5 h-5" /></>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}