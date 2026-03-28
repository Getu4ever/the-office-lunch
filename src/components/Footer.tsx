'use client';
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0f172a] text-white pt-24 pb-12 px-6">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24 items-start">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-8">
            <div className="flex flex-col">
              <Link href="/">
                <h2 className="text-[22px] font-black uppercase tracking-tighter italic cursor-pointer leading-none">
                  The Office Lunch
                </h2>
              </Link>
              <img 
                src="/logo.png" 
                alt="Logo" 
                className="h-16 w-auto mt-10 mb-6 object-contain self-start" 
              />
              <p className="text-slate-400 text-sm leading-relaxed font-medium max-w-[280px]">
                Premium corporate catering and sandwich platters delivered fresh across London and Surrey.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-4 bg-white/5 rounded-full hover:bg-[#b32d3a] transition-all group">
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="lg:ml-10"> 
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-[#b32d3a]">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li>
                <Link href="/menus" className="hover:text-[#b32d3a] transition-colors flex items-center gap-2 group">
                  Our Menu <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#b32d3a] transition-colors flex items-center gap-2 group">
                  About Us <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#b32d3a] transition-colors flex items-center gap-2 group">
                  Contact <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#b32d3a] transition-colors flex items-center gap-2 group">
                  Log In <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Opening Hours (Newly Positioned) */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-[#b32d3a]">Opening Hours</h4>
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">
                  Everyday
                </span>
                <span className="text-2xl font-black text-white tracking-tighter">
                  6:00am — 8:00pm
                </span>
              </div>

              <div className="pt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-[#b32d3a]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#b32d3a] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#b32d3a]"></span>
                </span>
                Early Boardroom Delivery
              </div>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed max-w-[200px]">
                Serving fresh office breakfasts and boardroom lunches across London & Richmond.
              </p>
            </div>
          </div>

          {/* Column 4: Contact Us (Final Endpoint) */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-[#b32d3a]">Contact Us</h4>
            <ul className="space-y-6 text-sm font-bold text-slate-300">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-[#b32d3a] shrink-0" />
                <span className="font-medium text-xs leading-relaxed group-hover:text-white transition-colors">Kew Rd, London TW9 2NA</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-[#b32d3a] shrink-0" />
                <span className="font-medium text-xs group-hover:text-white transition-colors">+44 20 8243 8814</span>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-[#b32d3a] shrink-0" />
                <span className="font-medium text-[10px] break-all uppercase tracking-tight group-hover:text-white transition-colors">orders@sandwichplatterdelivery.co.uk</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 bg-black py-8 px-6 -mx-6 -mb-12">
          {/* Using a 3-column grid with custom alignment to avoid the right-side basket overlap */}
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 items-center gap-6 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
            
            {/* LEFT: Copyright (Forced to one line) */}
            <div className="text-center md:text-left whitespace-nowrap">
              <p>© 2026 The Office Lunch Delivery. All Rights Reserved.</p>
            </div>

            {/* CENTER: Karol Digital */}
            <div className="text-center">
              <p>
                Crafted by <Link href="https://karoldigital.co.uk" target="_blank" className="hover:text-[#b32d3a] transition-colors">Karol Digital</Link>
              </p>
            </div>

            {/* RIGHT-CENTERED: Privacy & Terms (Shifted left to avoid the Basket overlap) */}
            <div className="flex justify-center md:justify-start md:pl-20 gap-6 text-slate-600">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}