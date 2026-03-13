'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pt-44 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-20 border-b border-slate-100 pb-16">
          <span className="text-[#f06428] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Trust & Discretion</span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
            Privacy <br />
            <span className="text-[#f06428]">Protocol</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium italic text-xl leading-relaxed">
            Your event details are as exclusive as our menus. We handle your data with the same precision we apply to a Michelin-starred service.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* SIDEBAR NAVIGATION (Visual Only) */}
          <div className="hidden md:block">
            <div className="sticky top-44 space-y-6">
              <div className="flex items-center gap-3 text-[#f06428]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Data Integrity</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                Last Updated:<br />
                March 2026
              </p>
            </div>
          </div>

          {/* MAIN LEGAL TEXT */}
          <div className="md:col-span-2 space-y-16">
            
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f06428] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#f06428]"></div> 01. The Ingredients
              </h3>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Information We Collect</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  To curate your masterpiece, we require certain details: Concierge Data (name, email, and private line), Event Logistics (locations, guest counts, and dates), and your specific Culinary Vision (dietary requirements and preferences).
                </p>
              </div>
            </section>

            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f06428] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#f06428]"></div> 02. Non-Disclosure
              </h3>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Absolute Discretion</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  We often work in private estates and high-profile corporate environments. We will never publish photos of your bespoke event or mention guest names on our social media or "Journal" without your explicit, written consent.
                </p>
              </div>
            </section>

            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f06428] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#f06428]"></div> 03. Digital Security
              </h3>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Our Digital Cellar</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Our digital infrastructure is fortified. We use industry-standard encryption to ensure that your inquiries, payment details, and event briefs remain for our eyes only. We do not sell data; we only savor the opportunity to serve you.
                </p>
              </div>
            </section>

            {/* CONTACT CALLOUT */}
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 mt-20">
              <div className="flex items-center gap-4 mb-4">
                <Lock className="w-6 h-6 text-[#f06428]" />
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Privacy Inquiries</h4>
              </div>
              <p className="text-slate-500 text-sm font-medium italic mb-6">
                If you wish to exercise your "Right to Forget" or request a record of your data, please contact our Cellar Master.
              </p>
              <a 
                href="mailto:info@karoldigital.co.uk" 
                className="text-xs font-black uppercase tracking-[0.2em] text-[#f06428] hover:text-slate-900 transition-colors"
              >
                info@karoldigital.co.uk →
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}