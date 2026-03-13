'use client';

import React from 'react';
import { ScrollText, Clock, CreditCard, CameraOff, Sparkles, Gavel } from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white pt-44 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-20 border-b border-slate-100 pb-16">
          <span className="text-[#f06428] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Agreement</span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
            Terms of <br />
            <span className="text-[#f06428]">Engagement</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium italic text-xl leading-relaxed">
            Transparent foundations for extraordinary events. By commissioning The Catering Co., you agree to the following standards of service.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="hidden md:block">
            <div className="sticky top-44 space-y-6">
              <div className="flex items-center gap-3 text-[#f06428]">
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
                  <span className="text-[9px] font-black uppercase tracking-[0.2em]">Enforcement 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN TERMS */}
          <div className="md:col-span-2 space-y-20">
            
            {/* 01. BOOKINGS */}
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f06428] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#f06428]"></div> 01. Reservation
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-900">
                  <CreditCard className="w-6 h-6" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Deposits & Confirmation</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  A date is only secured upon receipt of a 50% non-refundable deposit. The remaining balance must be settled in full no later than 14 days prior to the event date. For short-notice commissions (under 21 days), full payment is required immediately to mobilize our culinary team.
                </p>
              </div>
            </section>

            {/* 02. CANCELLATIONS */}
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f06428] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#f06428]"></div> 02. Adjustments
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-900">
                  <Clock className="w-6 h-6" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Cancellation Policy</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Cancellations made within 7 days of the event will incur a 100% charge of the total quote. Guest count reductions must be finalized 10 days before the event; we cannot offer refunds for late-stage reductions in attendance as ingredients are sourced specifically for your headcount.
                </p>
              </div>
            </section>

            {/* 03. CONDUCT */}
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f06428] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#f06428]"></div> 03. Venue
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-900">
                  <Sparkles className="w-6 h-6" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Site Requirements</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  The client is responsible for ensuring the venue provides adequate space and utilities (power/water) as specified in our proposal. Our team reserves the right to withdraw service if the working environment is deemed unsafe, hostile, or significantly differs from the agreed site brief.
                </p>
              </div>
            </section>

            {/* 04. MEDIA */}
            <section className="group">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#f06428] mb-6 flex items-center gap-2">
                <div className="w-8 h-[1px] bg-[#f06428]"></div> 04. Imagery
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-slate-900">
                  <CameraOff className="w-6 h-6" />
                  <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Intellectual Property</h4>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  The Catering Co. retains ownership of all bespoke menu designs and recipe IP. While we encourage guest photography for personal memory, the professional use of our brand imagery or recipe specifications for commercial purposes requires prior written consent.
                </p>
              </div>
            </section>

            {/* FINAL ACKNOWLEDGMENT */}
            <div className="pt-16 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 text-center">
                Ref: TCC-LEGAL-2026-V1
              </p>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}