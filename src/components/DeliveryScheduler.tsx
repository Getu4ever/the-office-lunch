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
  
  // Logic to get today's date in YYYY-MM-DD format based on local time
  const getTodayStr = () => {
    const now = new Date();
    return now.toLocaleDateString('en-CA'); // Outputs YYYY-MM-DD
  };

  const today = getTodayStr();

  // Initialize with the provided minDate or today's date
  // This ensures a guest never starts with a past date
  const [selectedDate, setSelectedDate] = useState(minDate || today);
  const [timeLeft, setTimeLeft] = useState({ hrs: 0, mins: 41, secs: 0 });

  // Update internal date if prop changes, but safeguard against past dates
  useEffect(() => {
    const validDate = minDate && minDate >= today ? minDate : today;
    setSelectedDate(validDate);
    if (setGlobalDate) setGlobalDate(validDate);
  }, [minDate, today, setGlobalDate]);

  // Ticking Countdown Logic
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

  // Filtered Time Slots Logic
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
    // Only show slots starting at least 2 hours from now
    return allSlots
      .filter(slot => slot.startHour >= currentHour + 2)
      .map(slot => slot.label);
  }, [selectedDate, today]);

  return (
        <div className="sticky top-20 w-full bg-slate-50 border-b border-slate-200 py-6 px-4 z-[110] shadow-sm">      
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left: Branding & Current Selection */}
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100">
            <Calendar className="text-[#b32d3a] w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 text-left">Current Ordering Window</p>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight text-left">
              Order for <span className="text-[#b32d3a]">{selectedDate}</span>
            </h2>
          </div>
        </div>

        {/* Center: Ticking Countdown Visual */}
        <div className="flex items-center gap-6">
          {[
            { val: timeLeft.hrs, label: 'Hrs' },
            { val: timeLeft.mins, label: 'Mins' },
            { val: timeLeft.secs, label: 'Secs' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-[#0f172a] text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shadow-lg">
                {item.val.toString().padStart(2, '0')}
              </div>
              <span className="text-[9px] font-black uppercase mt-2 tracking-widest text-slate-500">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Right: Trigger Button & Dropdown */}
        <div className="relative">
          <button 
            type="button"
            onClick={() => setIsSlotPickerOpen(!isSlotPickerOpen)}
            className="bg-[#b32d3a] hover:bg-[#962631] text-white px-10 py-4 rounded-xl font-black text-lg shadow-xl flex items-center gap-3 active:scale-95 transition-all"
          >
            {deliverySlot ? `Slot: ${deliverySlot}` : 'Book your slot'}
            <ChevronDown className={`w-5 h-5 transition-transform ${isSlotPickerOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSlotPickerOpen && (
            <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 p-6 z-[120] animate-in fade-in slide-in-from-top-4">
               <div className="flex justify-between items-center mb-6 text-left">
                 <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Delivery Setup</span>
                 <button type="button" onClick={() => setIsSlotPickerOpen(false)}><X className="w-5 h-5 text-slate-300" /></button>
               </div>

               <div className="mb-6 text-left">
                 <label className="text-[11px] font-black uppercase text-slate-500 mb-2 block">1. Select Date</label>
                 <input 
                   type="date" 
                   value={selectedDate}
                   // FIX: Ensure 'min' is always today or the provided minDate, never earlier
                   min={minDate && minDate >= today ? minDate : today}
                   onChange={(e) => {
                     setSelectedDate(e.target.value);
                     if (setGlobalDate) setGlobalDate(e.target.value);
                   }}
                   className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none cursor-pointer"
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
                         className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                           deliverySlot === slot ? 'bg-[#b32d3a] text-white' : 'bg-white border border-slate-100 hover:bg-slate-50 text-slate-700'
                         }`}
                      >
                         {slot}
                       </button>
                     ))
                   ) : (
                     <p className="text-[10px] font-bold text-rose-500 uppercase p-2 text-center">No more slots available for today.</p>
                   )}
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}