'use client';

import { Star, Clock, ChefHat, ArrowRight, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivateDiningPage() {
  return (
    <main className="bg-white min-h-screen">

      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        <img 
          src="/private.jpg" 
          alt="Luxury Private Dining"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <span className="text-[#f06428] font-black uppercase tracking-[0.4em] text-[10px] block mb-4">The Intimate Table</span>
            <h1 className="text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Michelin <br /> <span className="text-[#f06428]">at Home.</span>
            </h1>
            <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto mb-10">
              Transform your residence into London’s most exclusive restaurant. 
              Personalized tasting menus served with effortless grace.
            </p>
          </div>
        </div>
      </section>

      {/* The Experience Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative order-2 lg:order-1">
             <div className="absolute -inset-4 bg-slate-100 rounded-[3rem] rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
            <img 
              src="/menu-grand-platters-2.jpg" 
              alt="Private Chef Plating"
              className="relative rounded-[2.5rem] shadow-2xl z-10 w-full h-[500px] object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-[#f06428] font-black uppercase tracking-[0.3em] text-xs">Exclusivity Redefined</span>
            <h2 className="text-5xl font-black text-slate-900 mt-4 mb-8 tracking-tighter uppercase leading-[0.9]">Your Kitchen, <br/>Our Canvas.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Skip the reservations and the crowds. Our private dining service brings our executive chefs 
              and elite service staff directly to you. From table styling to the final pour, we handle 
              every detail so you can be a guest in your own home.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: <ChefHat className="text-[#f06428]" />, title: 'Custom Menus', desc: 'Designed around your preferences.' },
                { icon: <ShieldCheck className="text-[#f06428]" />, title: 'Discreet Service', desc: 'Professional, seamless execution.' }
              ].map((item, i) => (
                <div key={i} className="bg-slate-50 p-6 rounded-3xl">
                  {item.icon}
                  <h4 className="font-black text-slate-900 uppercase text-sm mt-4 tracking-widest">{item.title}</h4>
                  <p className="text-slate-500 text-xs mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-24 px-6 text-center">
        <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">Ready for an <span className="text-[#f06428]">Intimate Feast?</span></h2>
        <Link 
          href="/book"
          className="inline-flex items-center gap-3 bg-[#f06428] text-white px-12 py-6 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-[#f06428] transition-all shadow-2xl"
        >
          Book Your Chef <ArrowRight />
        </Link>
      </section>
    </main>
  );
}