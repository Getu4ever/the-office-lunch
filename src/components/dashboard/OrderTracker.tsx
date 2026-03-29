'use client';

import { CheckCircle2, Utensils, Truck, Package, Clock } from 'lucide-react';

interface OrderTrackerProps {
  status: string;
  updatedAt?: string | Date;
}

export default function OrderTracker({ status, updatedAt }: OrderTrackerProps) {
  const currentStatus = status?.toLowerCase() || 'pending';
  
  const steps = [
    { id: 'paid', label: 'Confirmed', icon: CheckCircle2 },
    { id: 'preparing', label: 'Preparing', icon: Utensils },
    { id: 'out-for-delivery', label: 'En Route', icon: Truck },
    { id: 'delivered', label: 'Delivered', icon: Package },
  ];

  const currentIndex = steps.findIndex(step => {
    if (currentStatus === 'completed' || currentStatus === 'delivered') return step.id === 'delivered';
    if (currentStatus === 'paid' || currentStatus === 'pending') return step.id === 'paid';
    return currentStatus === step.id;
  });

  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-6 px-4 md:py-10 md:px-8 bg-white rounded-[2rem] md:rounded-[3rem] border border-stone-100 shadow-sm overflow-hidden">
      {/* MOBILE VIEW: Vertical Stack */}
      <div className="flex flex-col gap-6 md:hidden relative">
        {/* Vertical Progress Line */}
        <div className="absolute left-[23px] top-6 bottom-6 w-[2px] bg-stone-100 z-0" />
        <div 
          className="absolute left-[23px] top-6 w-[2px] bg-[#b32d3a] transition-all duration-1000 ease-in-out z-0"
          style={{ 
            height: `${(activeIndex / (steps.length - 1)) * 100}%` 
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex items-center gap-4 text-left">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 border-[4px] shrink-0 ${
                isCompleted || isCurrent 
                  ? 'bg-[#b32d3a] border-white text-white shadow-lg' 
                  : 'bg-stone-50 border-white text-stone-300'
              }`}>
                <Icon size={16} className={isCurrent ? 'animate-pulse' : ''} />
              </div>
              <div className="flex flex-col">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                  isCurrent ? 'text-[#b32d3a]' : isCompleted ? 'text-slate-900' : 'text-stone-300'
                }`}>
                  {step.label}
                </span>
                {isCurrent && <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">In Progress</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* DESKTOP VIEW: Horizontal Progress (Hidden on mobile) */}
      <div className="hidden md:flex relative justify-between items-center mb-6">
        <div className="absolute top-6 left-0 w-full h-[3px] bg-stone-100 z-0 rounded-full" />
        <div 
          className="absolute top-6 left-0 h-[3px] bg-[#b32d3a] transition-all duration-1000 ease-in-out z-0 rounded-full shadow-[0_0_10px_rgba(179,45,58,0.3)]"
          style={{ 
            width: `${(activeIndex / (steps.length - 1)) * 100}%` 
          }}
        />

        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-700 border-[6px] ${
                isCompleted || isCurrent 
                  ? 'bg-[#b32d3a] border-white text-white shadow-xl scale-110' 
                  : 'bg-stone-50 border-white text-stone-300'
              }`}>
                <Icon size={18} className={isCurrent ? 'animate-pulse' : ''} />
              </div>

              <span className={`text-[9px] font-black uppercase tracking-[0.25em] transition-colors duration-500 ${
                isCurrent ? 'text-[#b32d3a]' : isCompleted ? 'text-slate-900' : 'text-stone-300'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Activity Timestamp */}
      {updatedAt && (
        <div className="flex items-center justify-center gap-2 mt-4 md:mt-0 pt-4 border-t border-stone-50">
          <Clock size={12} className="text-stone-300" />
          <p className="text-[9px] font-bold uppercase tracking-widest text-stone-400">
            Last Activity: {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      )}
    </div>
  );
}