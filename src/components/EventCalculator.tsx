'use client';
import { useState, useEffect } from 'react';
import { Calculator, Calendar, Users } from 'lucide-react';

export default function EventCalculator() {
  const [guests, setGuests] = useState(50);
  const [type, setType] = useState('Wedding');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const pricePerHead = type === 'Wedding' ? 35 : 22;
    setTotal(guests * pricePerHead);
  }, [guests, type]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10" />
      <div className="relative z-10 text-slate-900">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-orange-600 rounded-2xl text-white">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">Instant Estimator</h3>
        </div>
        <div className="space-y-8">
          <div className="space-y-3 text-left">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-orange-600" /> Event Type
            </label>
            <select 
              className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-orange-600 focus:bg-white transition-all font-bold text-lg cursor-pointer"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option>Wedding</option>
              <option>Corporate Event</option>
              <option>Private Party</option>
            </select>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider text-left">
                <Users className="w-4 h-4 text-orange-600" /> Guest Count
              </label>
              <span className="text-3xl font-black text-orange-600">{guests}</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-orange-600"
            />
          </div>
          <div className="pt-8 border-t border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div className="text-left">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Est. Total</p>
                <p className="text-5xl font-black text-slate-900">£{total.toLocaleString()}</p>
              </div>
            </div>
            <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg hover:bg-orange-600 transition-all">
              Lock this Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}