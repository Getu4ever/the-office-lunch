'use client';

import React from 'react';
import { AlertCircle, ShieldCheck, Soup, Biohazard, ChefHat, Info } from 'lucide-react';

export default function AllergensPage() {
  return (
    <main className="min-h-screen bg-white pt-44 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-20 border-b border-slate-100 pb-16">
          <span className="text-[#f06428] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Culinary Care</span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
            Safety & <br />
            <span className="text-[#f06428]">Allergens</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium italic text-xl leading-relaxed">
            Excellence is nothing without safety. We manage dietary complexities with the same rigor we apply to our flavor profiles.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* SIDEBAR */}
          <div className="hidden md:block">
            <div className="sticky top-44 space-y-8">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <AlertCircle className="w-6 h-6 text-[#f06428] mb-4" />
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900 mb-2">Notice</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-loose leading-relaxed">
                  Please inform our concierge team of any life-threatening allergies at least 14 days prior to your event.
                </p>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="md:col-span-2 space-y-20">
            
            {/* OUR PHILOSOPHY */}
            <section>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f06428] mb-8 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#f06428]"></div> The Protocol
              </h3>
              <div className="grid grid-cols-1 gap-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-900">
                    <ChefHat className="w-6 h-6" />
                    <h4 className="text-2xl font-black uppercase tracking-tighter">Kitchen Discipline</h4>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Our chefs are trained in the separation of the 14 major allergens. While our kitchen handles diverse ingredients (including nuts, gluten, and shellfish), we utilize dedicated prep stations and sanitization cycles for "Zero-Contact" dietary orders.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-slate-900">
                    <Soup className="w-6 h-6" />
                    <h4 className="text-2xl font-black uppercase tracking-tighter">Ingredient Sourcing</h4>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    We source from trusted suppliers who provide detailed technical specifications for every product. From our West African spices to locally sourced cream, every ingredient is vetted for hidden allergens.
                  </p>
                </div>
              </div>
            </section>

            {/* ALLERGEN TABLE/LIST */}
            <section className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl">
              <h4 className="text-xl font-black uppercase tracking-tighter mb-8 text-[#f06428]">The 14 Major Allergens</h4>
              <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Celery</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Cereals (Gluten)</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Crustaceans</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Eggs</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Fish</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Lupin</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Milk</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Molluscs</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Mustard</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Peanuts</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Sesame</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Soybeans</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Sulphites</div>
                <div className="flex items-center gap-2 italic"><div className="w-1.5 h-1.5 bg-[#f06428] rounded-full"></div> Tree Nuts</div>
              </div>
            </section>

            {/* FOOTNOTE */}
            <div className="border-t border-slate-100 pt-10">
              <div className="flex items-start gap-4 text-slate-400 italic text-sm leading-relaxed">
                <Info className="w-5 h-5 shrink-0 text-[#f06428]" />
                <p>
                  Note: While we take every precaution to accommodate dietary requirements, our kitchen is an environment where all 14 allergens are present. We cannot guarantee a 100% allergen-free environment.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}