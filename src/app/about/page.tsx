'use client';

import { Users, ShieldCheck, Trophy, Heart, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen text-[#0f172a]">
      {/* GLOBAL NAVBAR - Replaced the previous inline nav for total consistency */}

      {/* 2. HERO STORY */}
      <section className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[#f06428] font-black uppercase tracking-[0.4em] text-[10px] block mb-4">Our DNA</span>
            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              Heritage <br /> <span className="text-[#f06428]">Refined.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8">
              We started with a simple observation: West African cuisine is world-class, but it lacked a dedicated home in the luxury catering space. 
            </p>
            <p className="text-lg text-slate-500 leading-relaxed mb-10">
              The Catering Company was born to bridge that gap. We take the soulful, complex spice profiles of the continent and present them with the precision of Michelin-standard plating.
            </p>
            <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-10">
              <div>
                <p className="text-4xl font-black text-[#0f172a]">2018</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#f06428]">Established</p>
              </div>
              <div>
                <p className="text-4xl font-black text-[#0f172a]">50k+</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#f06428]">Plates Served</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[4rem] overflow-hidden bg-slate-100">
              <img src="/about-hero.jpg" alt="Our Kitchen Process" className="w-full h-full object-cover" />
            </div>
            {/* Design Element: Overlapping Image */}
            <div className="absolute -bottom-10 -left-10 w-64 h-64 border-8 border-white rounded-[2rem] overflow-hidden shadow-2xl hidden md:block bg-slate-200">
              <img src="/about-detail.jpg" alt="Plating Detail" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES (ICON GRID) */}
      <section className="bg-slate-50 py-24 px-6 rounded-[4rem]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter">The Pillars of <span className="text-[#f06428]">Excellence.</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { icon: Heart, title: "Soul", desc: "We never compromise on the authentic heat and depth of our traditional spices." },
              { icon: ShieldCheck, title: "Precision", desc: "Corporate-grade reliability. 15 minutes early, every single time." },
              { icon: Trophy, title: "Aesthetics", desc: "Every plate is a canvas. We eat with our eyes first." },
              { icon: Users, title: "Community", desc: "Sourcing ingredients directly from local West African farmers and producers." }
            ].map((value, i) => (
              <div key={i} className="text-center">
                <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                  <value.icon className="w-8 h-8 text-[#f06428]" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tighter mb-4">{value.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. THE PROMISE BANNER */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/banner04.jpg" alt="The Promise" className="w-full h-full object-cover grayscale opacity-20" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 italic">
            "Authenticity is not about staying in the past; it’s about carrying the <span className="text-[#f06428]">Truth</span> into the future."
          </h2>
          <span className="font-black uppercase tracking-widest text-[10px]">— The Founding Chef</span>
        </div>
      </section>
    </main>
  );
}