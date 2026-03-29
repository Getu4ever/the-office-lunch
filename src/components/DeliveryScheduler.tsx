'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface DeliverySchedulerProps {
  minDate?: string;
}

export default function DeliveryScheduler({ minDate }: DeliverySchedulerProps) {
  const { setDeliverySlot, deliverySlot, setSelectedDate: setGlobalDate } = useCart();
  const [isSlotPickerOpen, setIsSlotPickerOpen] = useState(false);
  
  const getTodayStr = () => {
    const now = new Date();
    return now.toLocaleDateString('en-CA'); 
  };

  const today = getTodayStr();
  const [selectedDate, setSelectedDate] = useState(minDate || today);
  const [timeLeft, setTimeLeft] = useState({ hrs: 0, mins: 41, secs: 0 });

  useEffect(() => {
    const validDate = minDate && minDate >= today ? minDate : today;
    setSelectedDate(validDate);
    if (setGlobalDate) setGlobalDate(validDate);
  }, [minDate, today, setGlobalDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hrs > 0) return { hrs: prev.hrs - 1, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const availableSlots = useMemo(() => {
    const allSlots = [
      { label: "6:00 AM - 8:00 AM", startHour: 6 },
      { label: "7:00 AM - 9:00 AM", startHour: 7 },
      { label: "8:00 AM - 10:00 AM", startHour: 8 },
      { label: "9:00 AM - 11:00 AM", startHour: 9 },
      { label: "10:00 AM - 12:00 PM", startHour: 10 },
      { label: "11:00 AM - 1:00 PM", startHour: 11 },
      { label: "12:00 PM - 2:00 PM", startHour: 12 },
      { label: "1:00 PM - 3:00 PM", startHour: 13 },
      { label: "2:00 PM - 4:00 PM", startHour: 14 },
      { label: "5:00 PM - 7:00 PM", startHour: 17 }
    ];

    const now = new Date();
    const isToday = selectedDate === today;

    if (!isToday) return allSlots.map(s => s.label);

    const currentHour = now.getHours();
    return allSlots
      .filter(slot => slot.startHour >= currentHour + 2)
      .map(slot => slot.label);
  }, [selectedDate, today]);

  return (
    <div className="sticky top-16 md:top-20 w-full bg-slate-50 border-b border-slate-200 py-4 md:py-6 px-4 z-[110] shadow-sm">      
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
        
        {/* Left: Branding */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="bg-white p-2 md:p-3 rounded-xl shadow-sm border border-slate-100 shrink-0">
            <Calendar className="text-[#b32d3a] w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5 md:mb-1 text-left">Current Ordering Window</p>
            <h2 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight text-left truncate">
              Order for <span className="text-[#b32d3a]">{selectedDate}</span>
            </h2>
          </div>
        </div>

        {/* Center: Countdown - Scaled for mobile */}
        <div className="flex items-center gap-4 md:gap-6 justify-center">
          {[
            { val: timeLeft.hrs, label: 'Hrs' },
            { val: timeLeft.mins, label: 'Mins' },
            { val: timeLeft.secs, label: 'Secs' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-[#0f172a] text-white w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-sm md:text-xl font-black shadow-lg">
                {item.val.toString().padStart(2, '0')}
              </div>
              <span className="text-[7px] md:text-[9px] font-black uppercase mt-1 md:mt-2 tracking-widest text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right: Trigger Button & Dropdown */}
        <div className="relative w-full md:w-auto">
          <button 
            type="button"
            onClick={() => setIsSlotPickerOpen(!isSlotPickerOpen)}
            className="w-full md:w-auto bg-[#b32d3a] hover:bg-[#962631] text-white px-6 md:px-10 py-3 md:py-4 rounded-xl font-black text-sm md:text-lg shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
          >
            <span className="truncate">{deliverySlot ? `Slot: ${deliverySlot}` : 'Book your slot'}</span>
            <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 shrink-0 transition-transform ${isSlotPickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSlotPickerOpen && (
            /* FIXED: absolute positioning for mobile vs desktop */
            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:absolute md:inset-auto md:top-full md:right-0 md:translate-y-0 mt-4 w-auto md:w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 p-6 z-[120] animate-in fade-in zoom-in-95 duration-200">
               <div className="flex justify-between items-center mb-6 text-left">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Delivery Setup</span>
                 <button type="button" onClick={() => setIsSlotPickerOpen(false)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
                   <X className="w-5 h-5 text-slate-300" />
                 </button>
               </div>

               <div className="mb-6 text-left">
                 <label className="text-[11px] font-black uppercase text-slate-500 mb-2 block">1. Select Date</label>
                 <input 
                   type="date" 
                   value={selectedDate}
                   min={minDate && minDate >= today ? minDate : today}
                   onChange={(e) => {
                     setSelectedDate(e.target.value);
                     if (setGlobalDate) setGlobalDate(e.target.value);
                   }}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none cursor-pointer focus:border-[#b32d3a] transition-colors"
                 />
               </div>
               
               <div className="text-left">
                 <label className="text-[11px] font-black uppercase text-slate-500 mb-2 block">2. Select Time</label>
                 <div className="grid gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                   {availableSlots.length > 0 ? (
                     availableSlots.map(slot => (
                       <button 
                         key={slot}
                         type="button"
                         onClick={() => { setDeliverySlot(slot); setIsSlotPickerOpen(false); }}
                         className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                           deliverySlot === slot 
                             ? 'bg-[#b32d3a] border-[#b32d3a] text-white shadow-md' 
                             : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-700'
                         }`}
                      >
                         {slot}
                       </button>
                     ))
                   ) : (
                     <div className="py-4 px-2 bg-rose-50 rounded-xl border border-rose-100">
                       <p className="text-[10px] font-bold text-rose-500 uppercase text-center">No more slots available for today.</p>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          )}
          
          {/* Mobile Overlay to close picker when clicking outside */}
          {isSlotPickerOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[-1] md:hidden" 
              onClick={() => setIsSlotPickerOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}