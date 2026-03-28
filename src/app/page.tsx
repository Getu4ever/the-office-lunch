'use client';

// Updated import to match your renamed file
import SignatureCollections from '@/components/SignatureCollections';
import { CheckCircle2, UtensilsCrossed, Clock, ShieldCheck, MapPin, Award, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. KEY FEATURES SECTION */}
      <section className="py-24 bg-[#f5f0e6]">
        <div className="max-w-7xl mx-auto px-12">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#b32d3a] rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6 shadow-xl shadow-red-900/10">
                <UtensilsCrossed className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-3">Chef-Prepared Platters</h3>
              <p className="text-slate-600 leading-relaxed font-medium italic">
                Gourmet sandwiches, hot buffet selections, and artisan salads crafted fresh daily in our Richmond kitchen.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#b32d3a] rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6 shadow-xl shadow-red-900/10">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-3">Reliable Boardroom Delivery</h3>
              <p className="text-slate-600 leading-relaxed font-medium italic">
                On-time delivery you can count on. We understand the importance of your schedule and boardroom meetings.
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#b32d3a] rounded-2xl flex items-center justify-center mb-6 transform transition-transform group-hover:rotate-6 shadow-xl shadow-red-900/10">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-3">Hygiene Level 5</h3>
              <p className="text-slate-600 leading-relaxed font-medium italic">
                Operating with the highest standards of food safety and quality, so you can host with complete confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STRATEGY 1: CORPORATE GUARANTEES BAR */}
      <div className="bg-white py-10 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-12">
          <div className="flex flex-wrap justify-center md:justify-between gap-8">
            {[
              { label: "On-Time Guarantee", desc: "Delivered by 12 PM or Free", icon: <Clock className="w-5 h-5 text-[#b32d3a]"/> },
              { label: "Dietary Precision", desc: "Individual Allergen Labeling", icon: <ShieldCheck className="w-5 h-5 text-[#b32d3a]"/> },
              { label: "Office-Ready", desc: "Easy-Dispose Packaging", icon: <CheckCircle2 className="w-5 h-5 text-[#b32d3a]"/> }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="bg-red-50 p-3 rounded-xl">{item.icon}</div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-900">{item.label}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT GRID */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-12">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-red-50 border border-red-100 rounded-full mb-8">
                <MapPin className="w-4 h-4 text-[#b32d3a]" />
                <span className="text-[10px] font-black text-red-800 uppercase tracking-widest">
                  Serving Kew Road & Surrounding Boroughs
                </span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-black text-slate-900 leading-[0.95] tracking-tighter mb-8 uppercase">
                Premium <br />
                <span className="text-[#b32d3a]">Corporate</span> <br />
                Catering.
              </h2>
              
              <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium italic max-w-xl">
                From morning pastries to executive lunch boxes, we provide the fuel for London's most productive businesses.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {['Daily Office Rotations', 'Boardroom Buffets', 'Individual Lunch Boxes', 'Client Networking Events'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="bg-[#b32d3a] rounded-full p-1">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-slate-800 text-xs uppercase tracking-wider">{item}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/menus" 
                className="inline-block bg-slate-900 text-white px-10 py-5 rounded-full font-black text-lg uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
              >
                Explore the Menus
              </Link>
            </div>

            <div className="relative">
              <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
                <img src="/banner03.jpg" alt="Corporate lunch spread" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-10 left-10">
                  <span className="bg-[#b32d3a] text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">Richmond Kitchen</span>
                  <p className="text-white text-2xl font-black uppercase mt-4 leading-tight">Prepared Fresh <br/> Delivered Hot.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPDATED: OCCASION-BASED NAVIGATION */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-12 text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-slate-900 mb-4">Select Your Occasion</h2>
          <p className="text-slate-500 italic font-medium">Tailored catering solutions for every office requirement.</p>
        </div>
        
        <div className="max-w-7xl mx-auto px-12 grid md:grid-cols-3 gap-8">
          {[
  { 
    title: "Executive Lunch", 
    desc: "Premium individual meal boxes for boardroom meetings.", 
    img: "/boardroom.jpg", 
    // Maps to 'Individual Boxes' in your MenuPage logic
    href: "/menus?category=Lunch Boxes" 
  },
  { 
    title: "Team Gatherings", 
    desc: "Hand-crafted artisan platters for collaborative sessions.", 
    img: "/team.jpg", 
    // Maps to 'Sandwich Platters' in your MenuPage logic
    href: "/menus?category=Platters" 
  },
  { 
    title: "Morning Meetings", 
    desc: "Fresh pastries, fruit skewers, and breakfast rolls.", 
    img: "/buffet.jpg", 
    // Maps to 'Breakfast Menu' in your MenuPage logic
    href: "/menus?category=Breakfast" 
  }
].map((occ, i) => (
  <Link key={i} href={occ.href} className="group cursor-pointer">
    <div className="relative h-80 rounded-[2.5rem] overflow-hidden mb-6 shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2 border border-transparent group-hover:border-red-100">
      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10" />
      <img src={occ.img} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" alt={occ.title} />
      <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="bg-white text-slate-900 px-6 py-3 rounded-full font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-xl">
          View Selection <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
    <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">{occ.title}</h3>
    <p className="text-sm text-slate-500 font-medium italic">{occ.desc}</p>
  </Link>
))}
        </div>
      </section>

      {/* 3. TRUST BAR */}
      <div className="bg-white py-12 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-12 flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all font-black text-2xl text-slate-500 italic">
           <span>CORPORATE LUNCHES</span>
           <span>BOARDROOM DINING</span>
           <span>OFFICE EVENTS</span>
           <span>TEAM PLATTERS</span>
        </div>
      </div>

      {/* 4. SIGNATURE COLLECTIONS SECTION */}
      <SignatureCollections />

     {/* 5. REFINED LIGHT TRUST & HYGIENE SECTION */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-12">
          <div className="bg-white rounded-[3rem] p-12 md:p-16 shadow-sm border border-slate-200 relative overflow-hidden">
            <ShieldCheck className="absolute -right-12 -top-12 w-64 h-64 text-slate-100 -rotate-12" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-[2px] w-10 bg-[#b32d3a]"></div>
                  <span className="text-[#b32d3a] font-black uppercase tracking-[0.3em] text-[10px]">Quality Assurance</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight mb-6">
                  Highest Standards <br />
                  <span className="text-slate-400">In Every Platter.</span>
                </h2>
                <p className="text-slate-600 text-lg font-medium italic mb-8 leading-relaxed max-w-xl">
                  Food safety isn't just a requirement; it's our promise. Our Richmond kitchen operates under the strictest hygiene protocols to ensure your team enjoys a safe, premium dining experience.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                    <Award className="text-[#b32d3a] w-5 h-5" />
                    <span className="text-slate-700 font-bold text-[10px] uppercase tracking-widest">Fully Licensed</span>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                    <Star className="text-[#b32d3a] w-5 h-5" />
                    <span className="text-slate-700 font-bold text-[10px] uppercase tracking-widest">5-Star Standards</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center lg:items-end">
                <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 transform hover:-translate-y-1 transition-transform duration-300 border border-slate-100">
                  <img src="/food-hygiene-Rating-5.jpg" alt="Food Hygiene Rating 5" className="w-full max-w-[380px] h-auto rounded-lg block" />
                </div>
                <div className="mt-6 text-right">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Verified by Food Standards Agency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}