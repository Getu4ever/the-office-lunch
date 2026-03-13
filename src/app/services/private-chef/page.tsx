'use client';

import React from 'react';
import { ChefHat, UtensilsCrossed, Wine, Sparkles, Star, Quote, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PrivateChefPage() {
  return (
    <main className="min-h-screen bg-white pt-44 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-32">
          
          {/* LEFT: CONTENT AREA */}
          <div className="lg:sticky lg:top-44">
            <span className="text-[#f06428] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Exclusive Services</span>
            <h1 className="text-7xl md:text-8xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9] mb-8">
              Private <br />
              <span className="text-[#f06428]">Chef Hire</span>
            </h1>
            <p className="max-w-xl text-slate-500 font-medium italic text-xl leading-relaxed mb-10">
              Transform your residence into London’s most exclusive dining room. Bespoke African & Caribbean menus, prepared with quiet precision.
            </p>
            <Link href="/contact">
              <button className="bg-slate-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-[#f06428] transition-all flex items-center gap-4 group">
                Reserve Your Date <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          
          {/* RIGHT: IMAGE + TESTIMONIAL */}
          <div className="relative">
            {/* The Aspect Ratio Container - Clean Image */}
            <div className="aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl relative z-10 bg-slate-100 mb-10">
               <img 
                 src="/private_chef.jpg" 
                 alt="The Catering Co. Private Chef meticulously plating fusion cuisine" 
                 className="absolute inset-0 w-full h-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
            </div>

            {/* THE TESTIMONIAL BOX - PLACED BELOW THE IMAGE */}
            <div className="relative z-10">
              <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-500">
                <Quote className="text-[#f06428] w-8 h-8 mb-4 opacity-70" />
                <p className="text-slate-950 font-bold italic text-sm mb-4 leading-relaxed">
                  "An absolute masterclass in flavor and discretion. It felt like having a Michelin restaurant in our Mayfair kitchen."
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">— Private Estate Client</p>
              </div>
            </div>

            {/* Decorative Glow Element */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-orange-50 rounded-full blur-3xl z-0 opacity-60"></div>
          </div>
        </div>

        {/* THE EXPERIENCE GRID */}
        <div className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">The Concierge Journey</h2>
            <div className="w-20 h-1 bg-[#f06428] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: <ChefHat className="w-8 h-8" />,
                title: "Bespoke Consultation",
                desc: "We begin with your palate. Our chefs craft a one-of-a-kind menu tailored to your dietary needs and seasonal desires."
              },
              {
                icon: <Star className="w-8 h-8" />,
                title: "Elite Sourcing",
                desc: "From organic plantains to rare spices, we hand-select every ingredient from London's most prestigious artisans."
              },
              {
                icon: <UtensilsCrossed className="w-8 h-8" />,
                title: "Silent Service",
                desc: "Preparation, plating, and a meticulous clean-up. We leave your home exactly as we found it—plus the lingering aroma of excellence."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-10 bg-slate-50 rounded-[3rem] hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all duration-500 border border-slate-100">
                <div className="bg-white p-4 rounded-2xl w-fit shadow-sm text-[#f06428] mb-8 group-hover:bg-[#f06428] group-hover:text-white transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">{feature.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed italic">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* LOGISTICS CALLOUT */}
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white overflow-hidden relative">
          <div className="relative z-10 max-w-2xl">
            <h3 className="text-4xl font-black uppercase tracking-tighter mb-8 leading-none">
              Perfect for <span className="text-[#f06428]">Intimate Occasions</span>
            </h3>
            <ul className="space-y-6 mb-12">
              <li className="flex items-center gap-4 font-bold text-slate-300">
                <div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Private Anniversary Dinners
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-300">
                <div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Estate Weekend Catering
              </li>
              <li className="flex items-center gap-4 font-bold text-slate-300">
                <div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Small Group Masterclasses
              </li>
            </ul>
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-3">
                <Wine className="w-5 h-5 text-[#f06428]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sommelier Options Available</span>
              </div>
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#f06428]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Clean-up Included</span>
              </div>
            </div>
          </div>
          <ChefHat className="absolute -bottom-20 -right-20 w-96 h-96 text-white/5 rotate-12" />
        </div>

      </div>
    </main>
  );
}