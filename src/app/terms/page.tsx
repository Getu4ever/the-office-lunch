'use client';

import React from 'react';
import { ScrollText, Clock, CreditCard, CameraOff, Sparkles, Gavel, ChevronRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-44 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-20 border-b border-slate-100 pb-16">
          <span className="text-[#b32d3a] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block italic">Client Agreement</span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
            Terms of <br />
            <span className="text-[#b32d3a]">Engagement</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium italic text-xl leading-relaxed">
            Transparent foundations for premium office catering. By placing an order with The Office Lunch, you agree to these standards of service and logistics.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="hidden md:block">
            <div className="sticky top-44 space-y-6">
              <div className="flex items-center gap-3 text-[#b32d3a]">
                <ScrollText className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Legal Framework</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                Governed by the <br />
                Laws of England & Wales
              </p>
              <div className="pt-8 border-t border-slate-100">
                <div className="flex items-center gap-3 text-slate-300">
                  <Gavel className="w-4 h-4" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Updated March 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN TERMS */}
          <div className="md:col-span-2 space-y-20">
            
            {/* 01. BOOKINGS */}
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#b32d3a] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#b32d3a]"></div> 01. Ordering
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-900">
                  <CreditCard className="w-6 h-6 text-[#b32d3a]" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter">Payments & Deadlines</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  To ensure ingredient freshness, orders must be placed and paid in full by 2:00 PM for next-day delivery. For larger corporate events (50+ guests), we require a 48-hour lead time to secure specialist seasonal produce.
                </p>
              </div>
            </section>

            {/* 02. CANCELLATIONS */}
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#b32d3a] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#b32d3a]"></div> 02. Adjustments
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-900">
                  <Clock className="w-6 h-6 text-[#b32d3a]" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter">Cancellation Policy</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Cancellations made within 24 hours of the scheduled delivery time will incur a 100% charge. Because our menus are prepared fresh each morning, we cannot offer refunds for late-stage cancellations or reduced headcounts once prep has commenced.
                </p>
              </div>
            </section>

            {/* 03. LOGISTICS */}
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#b32d3a] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#b32d3a]"></div> 03. Delivery
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-900">
                  <Sparkles className="w-6 h-6 text-[#b32d3a]" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter">Access & Arrival</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  The client is responsible for providing accurate loading bay or reception access instructions. Our drivers operate within a 30-minute delivery window. We are not liable for delays caused by restricted office access or security protocols not disclosed at the time of booking.
                </p>
              </div>
            </section>

            {/* 04. DIETARY */}
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#b32d3a] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#b32d3a]"></div> 04. Safety
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-900">
                  <CameraOff className="w-6 h-6 text-[#b32d3a]" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter">Allergens & Liability</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  While we offer gluten-free, vegan, and nut-free options, our kitchen handles all 14 major allergens. We take cross-contamination seriously, but we cannot guarantee a 100% allergen-free environment. It is the client's responsibility to communicate these risks to their guests.
                </p>
              </div>
            </section>

            {/* FINAL ACKNOWLEDGMENT */}
            <div className="pt-16 border-t border-slate-100 flex flex-col items-center">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 mb-8">
                Ref: TOL-LEGAL-2026-V1
              </p>
              <a 
                href="mailto:orders@officelunch.co.uk"
                className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-900 hover:text-[#b32d3a] transition-colors"
              >
                Questions regarding our terms? Contact Us <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}