'use client';
import { useState } from 'react'; // Added for logic
import Link from 'next/link';
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <footer className="bg-black text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <div>
              <Link href="/">
                <h2 className="text-2xl font-black uppercase tracking-tighter italic cursor-pointer">The Catering Co.</h2>
              </Link>
              <p className="text-slate-400 mt-4 text-sm leading-relaxed max-w-xs">
                Bespoke African & Caribbean culinary experiences for weddings, corporate galas, and private estates.
              </p>
            </div>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="p-3 bg-white/5 rounded-full hover:bg-orange-600 transition-colors group">
                  <Icon className="w-5 h-5 text-slate-400 group-hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Service Menu */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-[#f06428]">Service Menu</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-300">
              <li><Link href="/services/weddings" className="hover:text-white transition-colors">Wedding Packages</Link></li>
              <li><Link href="/services/corporate" className="hover:text-white transition-colors">Corporate Platters</Link></li>
              <li><Link href="/services/private-chef" className="hover:text-white transition-colors">Private Chef Hire</Link></li>
              <li><Link href="/services/beverage" className="hover:text-white transition-colors">Beverage Curation</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-[#f06428]">Office</h4>
            <ul className="space-y-6 text-sm font-bold text-slate-300">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                <span>12 Knightsbridge Gardens,<br />London, SW1X 7LY</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-slate-500 shrink-0" />
                <span>+44 20 7123 4567</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Guestlist */}
          <div>
            <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-[#f06428]">Guestlist</h4>
            
            {status === 'success' ? (
              <div className="flex items-center gap-2 text-[#f06428] py-2">
                <CheckCircle2 className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">Thank you for subscribing!</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Join our mailing list for seasonal menus and event styling tips.
                </p>
                <form onSubmit={handleSubmit} className="relative">
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    disabled={status === 'loading'}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-2 focus:ring-[#f06428] transition-all disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="absolute right-2 top-2 p-2 bg-[#f06428] rounded-xl hover:bg-orange-500 transition-colors disabled:bg-slate-700"
                  >
                    {status === 'loading' ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-white" />
                    )}
                  </button>
                </form>
                {status === 'error' && (
                  <p className="text-[10px] text-red-500 mt-2 font-bold uppercase tracking-tighter">Please try again.</p>
                )}
              </>
            )}
          </div>

        </div>

       {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              © 2026 The Catering Co. London. All Rights Reserved.
            </p>
            <span className="hidden md:block text-slate-800">|</span>
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              Crafted by <Link href="https://karoldigital.co.uk" target="_blank" className="hover:text-[#f06428] transition-colors">Karol Digital</Link>
            </p>
          </div>
          
          <div className="flex gap-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <Link href="/privacy" className="hover:text-slate-400">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-400">Terms</Link>
            <Link href="/allergens" className="hover:text-slate-400">Allergens</Link>
          </div>
        </div>
        </div>
    </footer>
  );
}