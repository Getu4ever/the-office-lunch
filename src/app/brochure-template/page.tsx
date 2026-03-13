'use client';

import { Star } from 'lucide-react';

export default function BrochureTemplate() {
  return (
    <div className="bg-white min-h-screen p-12 max-w-[800px] mx-auto border-y-[20px] border-[#f06428] print:p-0 print:border-none">
      {/* HEADER / LOGO SECTION */}
      <div className="flex justify-between items-start mb-20">
        <div className="flex items-center gap-4">
          <div className="bg-[#f06428] p-3 rounded-2xl shadow-lg">
            <div className="flex items-center gap-1">
              <div className="w-[3px] h-6 bg-white rounded-full" />
              <div className="w-5 h-6 border-2 border-white rounded-sm" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[#0f172a] font-black uppercase tracking-tight text-3xl leading-[0.8]">
              The Catering
            </span>
            <span className="text-[#f06428] font-black uppercase tracking-tight text-2xl">
              Company
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Wedding Collection</p>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-orange-600">2026 / 2027 Edition</p>
        </div>
      </div>

      {/* HERO IMAGE FOR BROCHURE */}
      <div className="relative h-[400px] rounded-[3rem] overflow-hidden mb-16 shadow-2xl">
        {/* Update this line in app/brochure-template/page.tsx */}
        <img 
        src="/luxury_fusion_wedding_plating_detail.png" 
        className="w-full h-full object-cover block" 
        alt="Wedding Plating"
        onLoad={() => console.log("Image loaded for print")}
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* THE MENU SECTION */}
      <div className="grid grid-cols-2 gap-16">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0f172a] mb-8 border-b-4 border-orange-500 inline-block">
            The Starters
          </h2>
          <div className="space-y-6">
            <div className="group">
              <h4 className="font-black uppercase text-sm tracking-widest text-slate-900">Smoked Jollof Arancini</h4>
              <p className="text-xs text-slate-500 mt-1 italic">Mozzarella heart, shito dip, yaji dust.</p>
            </div>
            <div className="group">
              <h4 className="font-black uppercase text-sm tracking-widest text-slate-900">Honey Plantain Crostini</h4>
              <p className="text-xs text-slate-500 mt-1 italic">Whipped goat cheese, spicy honey, mint.</p>
            </div>
            <div className="group">
              <h4 className="font-black uppercase text-sm tracking-widest text-slate-900">Suya Wagyu Sliders</h4>
              <p className="text-xs text-slate-500 mt-1 italic">Pickled red onion, brioche, truffle mayo.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-[#0f172a] mb-8 border-b-4 border-orange-500 inline-block">
            The Mains
          </h2>
          <div className="space-y-6">
            <div className="group">
              <h4 className="font-black uppercase text-sm tracking-widest text-slate-900">Signature Smoked Jollof</h4>
              <p className="text-xs text-slate-500 mt-1 italic">Hardwood smoked, herb-crusted chicken or lamb.</p>
            </div>
            <div className="group">
              <h4 className="font-black uppercase text-sm tracking-widest text-slate-900">Pan-Seared Sea Bass</h4>
              <p className="text-xs text-slate-500 mt-1 italic">Ginger lemongrass broth, yam fondant.</p>
            </div>
            <div className="group">
              <h4 className="font-black uppercase text-sm tracking-widest text-slate-900">Egusi Ravioli (V)</h4>
              <p className="text-xs text-slate-500 mt-1 italic">Wild melon seed filling, palm oil emulsion.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER OF BROCHURE */}
      <div className="mt-24 pt-12 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-slate-400">
        <p>Bespoke Event Catering Specialists</p>
        <p>www.thecateringcompany.com</p>
        <p>@thecateringco</p>
      </div>
    </div>
  );
}