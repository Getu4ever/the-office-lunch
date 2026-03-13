'use client';

import MenuSection from '@/components/MenuSection';
import Navbar from '@/components/Navbar';
import EventCalculator from '@/components/EventCalculator';
import { CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* HERO SECTION */}
      <section className="pt-32 lg:pt-40 pb-20">
        <div className="max-w-[1600px] mx-auto px-6">
          
          {/* HORIZONTAL HERO IMAGE (banner03.jpg) */}
          <div className="relative h-[450px] lg:h-[550px] w-full rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100 group mb-16">
            <img 
              src="/banner03.jpg" 
              alt="Chef plating gourmet fusion jollof rice"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 text-white">
              <p className="text-sm font-black uppercase tracking-[0.3em] mb-3 text-[#f06428]">Signature Dining</p>
              <h3 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter uppercase">
                Authentic Flavours,<br/>Modern Presentation.
              </h3>
            </div>
          </div>

          {/* CONTENT GRID (Below Image) */}
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Main Text Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 rounded-full mb-8">
                <ShieldCheck className="w-4 h-4 text-[#f06428]" />
                <span className="text-[10px] font-black text-orange-700 uppercase tracking-widest">
                  The Gold Standard in Event Dining
                </span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8 uppercase">
                Legendary <br />
                <span className="text-[#f06428]">FLAVOUR</span> <br />
                Custom Built.
              </h1>
              
              <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium italic max-w-xl">
                Bespoke Caribbean & African catering. From corporate galas to high-end weddings, we curate memories through food.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {['Bespoke Menu Design', 'Silver Service Staff', 'Hygiene Level 5'].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <div className="bg-[#f06428] rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{item}</span>
                    </div>
                  ))}
                  <div className="pt-6 border-t border-slate-100">
                     <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tighter">
                        <MapPin className="w-4 h-4 text-orange-300"/>
                        <span>Greater London & Home Counties</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Calculator Sidebar */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-32">
                <EventCalculator />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <div className="bg-slate-50 py-10 border-y border-slate-100 mb-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all font-black text-2xl text-slate-400 italic">
           <span>VOGUE</span>
           <span>BRIDES</span>
           <span>NETFLIX</span>
           <span>ROLEX</span>
        </div>
      </div>

      <MenuSection />
    </main>
  );
}