'use client';
import { Utensils, Menu, Phone, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100">
      {/* Increased height to h-28 and added py-6 for more top/bottom breathing room */}
      <div className="max-w-7xl mx-auto px-6 h-28 py-6 flex items-center justify-between">
        
       {/* Logo Section & Phone */}
        <div className="flex flex-col justify-center">
          <Link href="/" className="flex items-center gap-2 cursor-pointer relative z-[110]">
            <div className="bg-[#f06428] p-2 rounded-lg shadow-lg shadow-orange-600/20">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter leading-none uppercase text-slate-900">
              THE CATERING <br />
              <span className="text-[#f06428] font-bold text-lg tracking-normal">COMPANY</span>
            </span>
          </Link>
          {/* Phone moved under Logo */}
          <a href="tel:02071234567" className="flex items-center gap-2 text-slate-900 font-bold text-[12px] mt-2 ml-12">
            <Phone className="w-3 h-3 text-[#f06428]" />
            020 7123 4567
          </a>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
          {/* Order Now - Styled as a Button */}
          <Link 
            href="/shop" 
            className="border-2 border-[#f06428] text-[#f06428] px-6 py-2 rounded-full hover:bg-[#f06428] hover:text-white transition-all duration-300 flex items-center gap-2 group/btn"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Order Now
          </Link>

          <Link href="/menus" className="hover:text-[#f06428] transition-colors">Menus</Link>
          <Link href="/experiences" className="hover:text-[#f06428] transition-colors">Experiences</Link>
          <Link href="/gallery" className="hover:text-[#f06428] transition-colors">Gallery</Link>
          <Link href="/about" className="hover:text-[#f06428] transition-colors">About</Link>
          <Link href="/contact" className="hover:text-[#f06428] transition-colors">Contact</Link>
        </div>

        {/* Desktop CTA Button */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/book" 
            className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#f06428] hover:shadow-xl hover:shadow-orange-200 transition-all flex items-center gap-2 group"
          >
            Book Your Event
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {/* Mobile Toggle Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-[110] p-2 transition-transform active:scale-90"
        >
          {isOpen ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <Menu className="w-8 h-8 text-slate-900" />
          )}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300 z-[105] md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute top-32 left-6 right-6 bg-[#1a1625]/90 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl flex flex-col transition-transform duration-500 ${isOpen ? 'translate-y-0' : '-translate-y-10'}`}>
          <nav className="flex flex-col space-y-6 mb-10">
            <Link href="/shop" onClick={() => setIsOpen(false)} className="text-2xl font-black text-[#f06428] uppercase tracking-tighter">Order Now</Link>
            <Link href="/menus" onClick={() => setIsOpen(false)} className="text-2xl font-black text-white uppercase tracking-tighter hover:text-[#f06428] transition-colors">Menus</Link>
            <Link href="/experiences" onClick={() => setIsOpen(false)} className="text-2xl font-black text-white uppercase tracking-tighter hover:text-[#f06428] transition-colors">Experiences</Link>
            <Link href="/gallery" onClick={() => setIsOpen(false)} className="text-2xl font-black text-white uppercase tracking-tighter hover:text-[#f06428] transition-colors">Gallery</Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className="text-2xl font-black text-white uppercase tracking-tighter hover:text-[#f06428] transition-colors">About</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="text-2xl font-black text-white uppercase tracking-tighter hover:text-[#f06428] transition-colors">Contact</Link>
          </nav>

          <div className="pt-8 border-t border-white/10 space-y-6">
            <a href="tel:02071234567" className="flex items-center gap-4 text-white/50 font-bold text-sm">
              <Phone className="w-4 h-4 text-[#f06428]" />
              020 7123 4567
            </a>
            <Link 
              href="/book" 
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-[#f06428] text-white py-5 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl shadow-orange-900/40"
            >
              Get a Quote Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}