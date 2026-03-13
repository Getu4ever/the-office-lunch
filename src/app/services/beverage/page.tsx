'use client';

import React from 'react';
import { Wine, Flame, MoveRight, Layers, Sparkles, Quote } from 'lucide-react';
import Link from 'next/link';

// Named as a standard functional component for better Turbopack recognition
const BeveragePage = () => {
  return (
    <main className="min-h-screen bg-[#0a0a0a] pt-48 pb-24 px-6 text-white leading-tight">
      <div className="max-w-7xl mx-auto">
        
        {/* 1. HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
          <div className="lg:col-span-7 lg:sticky lg:top-48">
            <span className="text-[#f06428] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Liquid Artistry</span>
            <h1 className="text-7xl md:text-[9rem] font-black uppercase tracking-tighter leading-[0.8] mb-8">
              The <br />
              <span className="text-[#f06428]">Curation.</span>
            </h1>
            <p className="max-w-xl text-slate-400 font-medium italic text-xl leading-relaxed mb-10">
              Beyond the glass. We craft sensory liquid experiences that bridge the gap between West African heritage and modern global mixology.
            </p>
            <Link href="/contact">
              <button className="bg-[#f06428] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-slate-900 transition-all flex items-center gap-4 group">
                Request Bar Proposal <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          <div className="lg:col-span-5 relative">
            <div className="aspect-[3/4] rounded-[4rem] overflow-hidden border border-white/10 shadow-2xl relative z-10 bg-slate-900 mb-10">
              <img 
                src="/beverage_hero.jpg" 
                alt="Bespoke cocktail curation" 
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10">
              <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-3xl">
                <Quote className="text-[#f06428] w-8 h-8 mb-4 opacity-70" />
                <p className="text-slate-200 font-bold italic text-sm mb-4 leading-relaxed">
                  "The hibiscus-infused gin bar was the highlight of our gala. Sophisticated, bold, and unlike anything our guests had ever tasted."
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">— Luxury Event Planner, London</p>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-900/20 rounded-full blur-3xl z-0 opacity-60"></div>
          </div>
        </div>

        {/* 2. THE THREE PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: <Flame className="w-6 h-6" />,
              title: "Bespoke Mixology",
              desc: "Custom cocktail menus inspired by the flavors of Lagos, Accra, and Kingston."
            },
            {
              icon: <Wine className="w-6 h-6" />,
              title: "Sommelier Selection",
              desc: "Expertly curated wine lists designed to balance bold, smoked African spices."
            },
            {
              icon: <Layers className="w-6 h-6" />,
              title: "The Mobile Atelier",
              desc: "Sleek, backlit bar structures and elite mixologists for any high-end venue."
            }
          ].map((pillar, i) => (
            <div key={i} className="p-10 rounded-[3rem] border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all group">
              <div className="text-[#f06428] mb-6 group-hover:scale-110 transition-transform duration-500">{pillar.icon}</div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-4">{pillar.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium italic">{pillar.desc}</p>
            </div>
          ))}
        </div>

        {/* 3. BOTANICAL PROFILE BANNER */}
        <div className="relative rounded-[4rem] overflow-hidden bg-[#111] p-12 md:p-24 mb-32 border border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#f06428] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">The Alchemist's Table</span>
              <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
                Botanicals <br />
                <span className="text-slate-600">& Reductions.</span>
              </h2>
              <div className="space-y-4">
                {[
                  "Hibiscus & Ginger Reductions",
                  "Smoked Scotch Bonnet Syrups",
                  "Aged Palm Wine Bases",
                  "Traditional Zobo Spritzers"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 py-4 border-b border-white/5 last:border-0">
                    <Sparkles className="text-[#f06428] w-4 h-4" />
                    <span className="font-bold uppercase tracking-widest text-[10px] text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="h-72 rounded-3xl bg-slate-800 overflow-hidden relative">
                 <img src="/beverage_detail_1.jpg" className="w-full h-full object-cover opacity-50" />
               </div>
               <div className="h-72 rounded-3xl bg-slate-800 overflow-hidden mt-12 relative">
                 <img src="/beverage_detail_2.jpg" className="w-full h-full object-cover opacity-50" />
               </div>
            </div>
          </div>
        </div>

        {/* 4. FINAL CTA */}
        <div className="text-center py-24 bg-gradient-to-b from-white/[0.03] to-transparent rounded-[4rem] border border-white/5">
          <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 italic">Elevate your glass.</h3>
          <Link href="/contact" className="inline-block bg-white text-slate-900 px-12 py-6 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#f06428] hover:text-white transition-all shadow-2xl">
            Request Beverage Proposal
          </Link>
        </div>

      </div>
    </main>
  );
};

export default BeveragePage;