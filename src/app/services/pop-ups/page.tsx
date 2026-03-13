'use client';

import React from 'react';
import { MapPin, Instagram, Zap, ArrowRight, Share2, Music } from 'lucide-react';
import Link from 'next/link';

export default function PopUpsPage() {
  const locations = [
    { date: 'MAR 15-20', location: 'Spitalfields Market, E1', status: 'Live Now', vibe: 'Lunch & Beats' },
    { date: 'APR 02-05', location: 'Southbank Centre, SE1', status: 'Coming Soon', vibe: 'Riverside Feast' },
    { date: 'APR 12-14', location: 'Hackney Bridge, E15', status: 'Waitlist', vibe: 'Warehouse Party' },
  ];

  return (
    <main className="bg-white min-h-screen">

    
     {/* 1. HERO SECTION - Balanced Responsive Alignment */}
      <section className="relative h-[92vh] w-full overflow-hidden bg-slate-900">
        <img 
          src="/popups.jpg" 
          alt="Street Food Pop Up"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/70" />
        
        {/* pt-32 for mobile (stays as is) | md:pt-48 for desktop (clears header) */}
        <div className="absolute inset-0 flex flex-col items-start justify-start pt-48 md:pt-48 px-8 md:px-24">
          <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 z-10">
            
            {/* The Badge */}
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-[#f06428] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                Current Residency
              </span>
              <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.2em]">
                London, UK
              </span>
            </div>
            
            {/* The Headline */}
            <h1 className="text-white text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] mb-8">
              Street <br /> <span className="text-[#f06428]">Culture.</span>
            </h1>
            
            {/* The Description */}
            <p className="text-white/90 text-xl md:text-2xl font-medium max-w-xl mb-10 leading-relaxed">
              Bringing the heat of Lagos to the heart of London. Bold flavours, 
              heavy bass, and the most authentic Jollof in the city.
            </p>
          </div>
        </div>
      </section>

      {/* 2. THE TOUR DATES / LOCATIONS */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left: Branding */}
          <div className="lg:col-span-5">
            <span className="text-[#f06428] font-black uppercase tracking-[0.3em] text-xs">The Movement</span>
            <h2 className="text-5xl font-black text-slate-900 mt-4 mb-8 tracking-tighter uppercase leading-[0.9]">
              Catch us <br/>if you can.
            </h2>
            <p className="text-slate-500 text-lg mb-8">
              We move fast. Our pop-ups are temporary takeovers of London's most iconic spaces. 
              We bring the vibe, the food, and the community.
            </p>
            
            <div className="flex flex-col gap-4">
               <a href="https://instagram.com" className="group flex items-center justify-between bg-slate-900 text-white p-6 rounded-[2rem] hover:bg-[#f06428] transition-all">
                 <div className="flex items-center gap-4">
                   <Instagram className="w-6 h-6" />
                   <span className="font-black uppercase tracking-widest text-sm">Follow for Drop Alerts</span>
                 </div>
                 <ArrowRight className="group-hover:translate-x-2 transition-transform" />
               </a>
            </div>
          </div>

          {/* Right: The List */}
          <div className="lg:col-span-7 space-y-4">
             {locations.map((loc, i) => (
               <div 
                 key={i} 
                 className="flex flex-col md:flex-row justify-between items-center p-8 bg-slate-50 rounded-[2.5rem] border border-transparent hover:border-[#f06428] hover:bg-white transition-all group"
               >
                 <div className="text-center md:text-left mb-4 md:mb-0">
                   <p className="text-[#f06428] font-black text-xs tracking-[0.2em] mb-1">{loc.date}</p>
                   <h4 className="text-slate-900 font-black uppercase text-2xl tracking-tight">{loc.location}</h4>
                   <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">{loc.vibe}</p>
                 </div>
                 
                 <div className="flex items-center gap-6">
                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border ${
                      loc.status === 'Live Now' ? 'bg-green-50 border-green-200 text-green-600' : 'bg-slate-200 border-slate-300 text-slate-500'
                    }`}>
                      {loc.status}
                    </span>
                    <button className="p-3 bg-white rounded-full shadow-sm group-hover:bg-[#f06428] group-hover:text-white transition-colors">
                      <Share2 size={18} />
                    </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. FLAVOUR BANNER */}
      <section className="px-6 mb-24 max-w-7xl mx-auto">
        <div className="relative h-[400px] rounded-[4rem] overflow-hidden">
          <img src="/banner03.jpg" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#f06428]/80 mix-blend-multiply" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <Music className="text-white w-12 h-12 mb-6" />
            <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter max-w-2xl">
              Spices, Sound systems & Soul.
            </h2>
          </div>
        </div>
      </section>
    </main>
  );
}