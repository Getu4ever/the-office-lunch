'use client';

import { Briefcase, Clock, ShieldCheck, ArrowRight, Menu, Globe, Building2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CorporatePage() {
  return (
    <main className="bg-white min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative h-[80vh] w-full overflow-hidden bg-slate-900">
        <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-8 md:px-12">
          <Link href="/" className="group flex items-center gap-4">
            <div className="bg-[#f06428] p-2.5 rounded-2xl group-hover:rotate-12 transition-transform">
              <div className="flex items-center gap-1">
                <div className="w-[3px] h-5 bg-white rounded-full opacity-90" />
                <div className="w-4 h-5 border-2 border-white rounded-sm opacity-90" />
              </div>
            </div>
            
            <span className="font-black text-2xl tracking-tighter leading-none uppercase text-white">
              THE CATERING <br />
              <span className="text-[#f06428] font-bold text-lg tracking-normal">COMPANY</span>
            </span>
          </Link>
          
          <div className="hidden md:flex gap-8 items-center bg-white/5 backdrop-blur-md px-8 py-3 rounded-full border border-white/10">
            {['Menus', 'Weddings', 'Corporate', 'About'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`} 
                className="text-white text-xs font-black uppercase tracking-[0.2em] hover:text-[#f06428] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <button className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 md:hidden">
            <Menu className="text-white w-6 h-6" />
          </button>
        </nav>

        <div className="absolute inset-0 opacity-60">
           <img 
            src="/corporate_hero.jpg" 
            alt="Corporate Event Excellence"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="absolute inset-0 flex items-center px-8 md:px-24">
          <div className="max-w-3xl">
            <span className="text-[#f06428] font-black uppercase tracking-[0.4em] text-xs mb-4 block">B2B Excellence</span>
            <h1 className="text-white text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              Precision Plating <br /> For <span className="text-[#f06428]">Industry Leaders.</span>
            </h1>
            <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed">
              From high-stakes boardroom lunches to 1,000-guest annual galas. 
              We deliver West African fusion with corporate punctuality.
            </p>
            <div className="flex gap-4">
              <button className="bg-[#f06428] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all">
                Request a Quote
              </button>
              <button className="border border-white/30 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                Corporate Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE LOGISTICS GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: Clock, title: 'Punctuality First', desc: 'We operate on a "15-minute early" policy for all office deliveries and event setups.' },
            { icon: ShieldCheck, title: 'Full Compliance', desc: 'Comprehensive insurance, health safety certifications, and seamless vendor onboarding.' },
            { icon: Globe, title: 'Global Palate', desc: 'Fusion menus designed to satisfy diverse international teams and VIP clients.' }
          ].map((item, i) => (
            <div key={i} className="group p-8 rounded-[2.5rem] bg-slate-50 hover:bg-white hover:shadow-2xl transition-all duration-500">
              <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-[#f06428] transition-colors">
                <item.icon className="w-6 h-6 text-[#f06428] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 mb-4">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CORPORATE SECTORS */}
      <section className="pb-24 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[4rem] overflow-hidden grid grid-cols-1 lg:grid-cols-2">
          <div className="p-12 md:p-20 flex flex-col justify-center">
            <h2 className="text-white text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8">
              Daily Office <br /><span className="text-[#f06428]">Nourishment.</span>
            </h2>
            <p className="text-white/60 mb-10 text-lg leading-relaxed">
              Boost team morale with our rotating weekly "Fusion Lunch" programs. 
              Healthy, smoked, and vibrant meals delivered in eco-friendly packaging.
            </p>
            <ul className="space-y-4 mb-10">
              {['Recurring Weekly Subs', 'Executive Lunch Boxes', 'Pop-up Live Stations'].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-white font-bold uppercase tracking-widest text-xs">
                  <div className="w-1.5 h-1.5 bg-[#f06428] rounded-full" /> {point}
                </li>
              ))}
            </ul>
            <button className="flex items-center gap-3 text-[#f06428] font-black uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">
              Explore Subscriptions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="h-[400px] lg:h-auto">
            <img 
              src="/corporate_office.jpg" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              alt="Office Catering"
            />
          </div>
        </div>
      </section>

      {/* 4. CAPACITY & TRUST SECTION */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-slate-900 text-4xl font-black uppercase tracking-tighter mb-16">The Capacity for <span className="text-[#f06428]">Scale.</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '1,500+', label: 'Daily Meals' },
            { number: '12h', label: 'Response Time' },
            { number: '5-Star', label: 'Health Rating' },
            { number: '100%', label: 'Punctuality' }
          ].map((stat, i) => (
            <div key={i} className="border-l-2 border-[#f06428]/20 pl-6 text-left">
              <p className="text-4xl font-black text-[#f06428]">{stat.number}</p>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FINAL CTA SECTION (Mirroring Wedding Page Consistency) */}
      <section className="relative py-24 px-6 rounded-t-[4rem] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/banner04.jpg" 
            alt="Corporate Booking Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Upgrade your <span className="text-[#f06428]">Event Standard.</span>
          </h2>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Secure your date for your next gala, boardroom lunch, or office pop-up.
          </p>
          <button className="bg-[#f06428] text-white px-12 py-6 rounded-full font-black uppercase tracking-widest mx-auto hover:bg-white hover:text-slate-900 transition-all">
            Open Corporate Account
          </button>
        </div>
      </section>
    </main>
  );
}