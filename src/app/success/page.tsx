'use client';

import Link from 'next/link';
import { CheckCircle2, Home, LayoutDashboard, ShoppingBag } from 'lucide-react';
import { useEffect, Suspense } from 'react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

function SuccessContent() {
  const { clearCart } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100">
      <div className="p-12 md:p-20 text-center">
        <div className="flex justify-center mb-10">
          <div className="relative">
            <div className="absolute inset-0 bg-[#b32d3a]/20 rounded-full animate-ping" />
            <div className="relative bg-[#b32d3a] p-6 rounded-full shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-6">
          Order <span className="text-[#b32d3a]">Confirmed.</span>
        </h1>
        
        <p className="text-lg text-slate-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
          {session 
            ? "Your payment was successful. You can now track your catering order details in your dashboard."
            : "Your payment was successful. We've sent a confirmation receipt to your email address."
          }
        </p>

        <div className="flex flex-col gap-6 max-w-sm mx-auto">
          {session ? (
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-3 bg-[#b32d3a] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl shadow-[#b32d3a]/20 w-full"
            >
              <LayoutDashboard className="w-4 h-4" /> View My Dashboard
            </Link>
          ) : (
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-[2rem]">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 text-center">Check Your Inbox</p>
              <div className="flex justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-[#b32d3a]">
                <a href="https://mail.google.com" target="_blank" rel="noreferrer" className="hover:underline">Gmail</a>
                <span>•</span>
                <a href="https://outlook.live.com" target="_blank" rel="noreferrer" className="hover:underline">Outlook</a>
                <span>•</span>
                <a href="https://mail.yahoo.com" target="_blank" rel="noreferrer" className="hover:underline">Yahoo</a>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
            <Link href="/" className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-slate-800 transition-all flex-1">
              <Home className="w-4 h-4" /> Home
            </Link>
            <Link href="/menu" className="flex items-center justify-center gap-3 bg-white border-2 border-slate-100 text-slate-900 px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] hover:border-[#b32d3a] hover:text-[#b32d3a] transition-all flex-1">
              <ShoppingBag className="w-4 h-4" /> Shop More
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-8 border-t border-slate-100 text-center">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.6em]">
          The Office Lunch Richmond
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    /* This main tag is what forces the card to the absolute center of the page */
    <main className="min-h-screen bg-[#f5f0e6] flex items-center justify-center p-6 w-full">
      <div className="flex justify-center w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}