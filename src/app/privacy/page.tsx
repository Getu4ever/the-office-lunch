'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, ChevronRight } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white pt-44 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-20 border-b border-slate-100 pb-16">
          <span className="text-[#b32d3a] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block italic">Discretion & Integrity</span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
            Privacy <br />
            <span className="text-[#b32d3a]">Protocol</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium italic text-xl leading-relaxed">
            Your boardroom details are handled with the same precision we apply to our food. We protect your data as if it were our own secret recipe.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="hidden md:block">
            <div className="sticky top-44 space-y-6">
              <div className="flex items-center gap-3 text-[#b32d3a]">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Secure Service</span>
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
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#b32d3a] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#b32d3a]"></div> 01. The Ingredients
              </h3>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Information We Collect</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  To coordinate your office catering, we collect essential data: Contact Details (name, corporate email, and direct line), Delivery Logistics (office address and access instructions), and dietary requirements for your team.
                </p>
              </div>
            </section>

            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#b32d3a] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#b32d3a]"></div> 02. Boardroom Discretion
              </h3>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Data Usage</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  We use your data strictly for order fulfillment and logistics. We do not store full payment details on our servers; all transactions are handled via Stripe’s encrypted infrastructure. We never sell your data to third-party marketing firms.
                </p>
              </div>
            </section>

            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#b32d3a] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#b32d3a]"></div> 03. Digital Security
              </h3>
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Your Rights</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  You have the right to access, update, or request the deletion of your personal information at any time. Our systems are fortified with industry-standard encryption to ensure your order history remains confidential.
                </p>
              </div>
            </section>

            {/* CONTACT CALLOUT */}
            <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 mt-20">
              <div className="flex items-center gap-4 mb-4">
                <Lock className="w-6 h-6 text-[#b32d3a]" />
                <h4 className="text-lg font-black text-slate-900 uppercase tracking-tighter">Privacy Inquiries</h4>
              </div>
              <p className="text-slate-500 text-sm font-medium italic mb-6">
                For any questions regarding your data or to exercise your "Right to Forget," please reach out to our administration team.
              </p>
              <a 
                href="mailto:info@officelunch.co.uk" 
                className="group inline-flex items-center text-xs font-black uppercase tracking-[0.2em] text-[#b32d3a] hover:text-slate-900 transition-colors"
              >
                Contact Administration <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}