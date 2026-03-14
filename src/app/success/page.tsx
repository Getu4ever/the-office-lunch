'use client';

import Link from 'next/link';
import { CheckCircle2, Home, ShoppingBag, Mail } from 'lucide-react';
import { useEffect, Suspense } from 'react';
import { useCart } from '@/context/CartContext';

function SuccessContent() {
  const { clearCart } = useCart();

  useEffect(() => {
    // We only clear the cart here. 
    // The Stripe Webhook handles sending all confirmation emails automatically.
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
      <div className="p-12 md:p-20 text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[#f06428]/20 rounded-full animate-ping" />
            <div className="relative bg-[#f06428] p-6 rounded-full shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-6">
          Thank You!
        </h1>
        
        <p className="text-lg text-slate-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
          Your payment was successful. We&apos;ve sent a detailed receipt to your email address.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          <div className="space-y-3">
            <a 
              href="mailto:" 
              className="flex items-center justify-center gap-3 bg-[#f06428] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#f06428]/20 w-full"
            >
              <Mail className="w-4 h-4" /> Open Mail App
            </a>
            
            <div className="flex justify-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
              <a href="https://mail.google.com" target="_blank" className="hover:text-[#f06428] transition-colors">Gmail</a>
              <span>•</span>
              <a href="https://outlook.live.com" target="_blank" className="hover:text-[#f06428] transition-colors">Outlook</a>
              <span>•</span>
              <a href="https://mail.yahoo.com" target="_blank" className="hover:text-[#f06428] transition-colors">Yahoo</a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <Link 
              href="/"
              className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex-1"
            >
              <Home className="w-4 h-4" /> Home
            </Link>
            
            <Link 
              href="/shop"
              className="flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:border-[#f06428] hover:text-[#f06428] transition-all flex-1"
            >
              <ShoppingBag className="w-4 h-4" /> Shop
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-8 border-t border-slate-100">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em] text-center">
          The Catering Co. Selection
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-slate-400 font-black uppercase tracking-widest animate-pulse">Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}