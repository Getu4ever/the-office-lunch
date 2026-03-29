'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-16 md:pt-24 pb-0 px-6 overflow-hidden">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 md:mb-24 items-start">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6 md:space-y-8">
            <div className="flex flex-col">
              <Link href="/" className="inline-block">
                <h2 className="text-[20px] md:text-[22px] font-black uppercase tracking-tighter italic cursor-pointer leading-none">
                  The Office Lunch
                </h2>
              </Link>
              <div className="relative h-12 w-40 mt-6 mb-6">
                <Image 
                  src="/logo.png" 
                  alt="Logo" 
                  fill
                  className="object-contain object-left" 
                />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-[280px]">
                Premium corporate catering and sandwich platters delivered fresh across London and Surrey.
              </p>
            </div>
            
            <div className="flex gap-3 md:gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-3 md:p-4 bg-white/5 rounded-full hover:bg-[#b32d3a] transition-all group">
                  <Icon className="w-4 h-4 md:w-5 md:h-5 text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:ml-10"> 
            <h4 className="font-black uppercase text-[10px] md:text-xs tracking-[0.2em] mb-6 md:mb-8 text-[#b32d3a]">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              {['Menus', 'About', 'Contact', 'Login'].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '')}`} className="hover:text-[#b32d3a] transition-colors flex items-center gap-2 group w-fit">
                    {item === 'Login' ? 'Log In/Register' : item === 'Menus' ? 'Our Menu' : item === 'About' ? 'About Us' : item} 
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Opening Hours */}
          <div>
            <h4 className="font-black uppercase text-[10px] md:text-xs tracking-[0.2em] mb-6 md:mb-8 text-[#b32d3a]">Opening Hours</h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Everyday
                </span>
                <span className="text-xl md:text-2xl font-black text-white tracking-tighter">
                  6:00am — 8:00pm
                </span>
              </div>

              <div className="pt-2 flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] text-[#b32d3a]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b32d3a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b32d3a]"></span>
                </span>
                Early Boardroom Delivery
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[220px]">
                Serving fresh office breakfasts and boardroom lunches across London & Richmond.
              </p>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="font-black uppercase text-[10px] md:text-xs tracking-[0.2em] mb-6 md:mb-8 text-[#b32d3a]">Contact Us</h4>
            <ul className="space-y-5 md:space-y-6 text-sm font-bold text-slate-300">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#b32d3a] shrink-0 mt-0.5" />
                <span className="font-medium text-xs leading-relaxed group-hover:text-white transition-colors">Kew Rd, London TW9 2NA</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-[#b32d3a] shrink-0" />
                <span className="font-medium text-xs group-hover:text-white transition-colors">+44 20 8243 8814</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-4 h-4 md:w-5 md:h-5 text-[#b32d3a] shrink-0" />
                <span className="font-medium text-[10px] break-all uppercase tracking-tight group-hover:text-white transition-colors">orders@sandwichplatterdelivery.co.uk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Optimized for Mobile & Basket Spacing */}
        <div className="mt-12 bg-black py-10 md:py-8 px-6 -mx-6">
          <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-bold text-[9px] md:text-[10px] text-slate-500 uppercase tracking-[0.2em]">
            
            <div className="text-center md:text-left order-2 md:order-1">
              <p>© 2026 The Office Lunch Delivery. <span className="hidden sm:inline">All Rights Reserved.</span></p>
            </div>

            <div className="text-center order-1 md:order-2">
              <p className="flex items-center gap-1.5">
                Crafted by <Link href="https://karoldigital.co.uk" target="_blank" className="text-gray-400 hover:text-[#b32d3a] transition-colors">Karol Digital</Link>
              </p>
            </div>

            {/* Shifted right-side links to avoid overlapping the StickyBasket on mobile */}
            <div className="flex items-center justify-center gap-6 order-3 md:pr-20">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}