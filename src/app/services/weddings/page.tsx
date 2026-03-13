'use client';

import { Calendar, Users, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function WeddingsPage() {
  // Brochure Download Logic
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/The_Catering_Company_Wedding_Brochure.pdf'; 
    link.download = 'The_Catering_Company_Wedding_Brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="bg-white min-h-screen">
     

      {/* 1. HERO SECTION - Unified Alignment */}
      <section className="relative h-[92vh] w-full overflow-hidden bg-slate-900">
        <img 
          src="/luxury_fusion_wedding_plating_detail.png" 
          alt="Luxury Wedding Catering Detail"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        {/* Added the same padding logic as your Pop-Ups page */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70 flex flex-col items-center justify-start pt-48 px-6">
          <div className="max-w-4xl text-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="text-white text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-6">
              Your Forever, <br /> <span className="text-[#f06428]">Flavoured.</span>
            </h1>
            <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
              Bespoke West African fusion catering for the most ambitious celebrations. 
              Where tradition meets contemporary luxury.
            </p>
            <button 
              onClick={handleDownload}
              className="bg-white text-slate-900 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-[#f06428] hover:text-white transition-all shadow-2xl active:scale-95"
            >
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE EXPERIENCE GRID */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-[#f06428] font-black uppercase tracking-[0.3em] text-xs">The Culinary Journey</span>
            <h2 className="text-5xl font-black text-slate-900 mt-4 mb-8 tracking-tighter uppercase leading-[0.9]">More than a menu,<br/> it’s a memory.</h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Every wedding has a heartbeat, and we believe it’s found at the table. Our chefs blend the bold, 
              smoked aromatics of West Africa with refined European plating techniques to create a dining 
              experience your guests will talk about for decades.
            </p>
            <div className="space-y-6">
              {[
                { title: 'Bespoke Tastings', desc: 'Private sessions to perfect your signature menu.' },
                { title: 'Full Service Staff', desc: 'Elite waitstaff and mixologists at your command.' },
                { title: 'Cultural Fusion', desc: 'Expertly balancing diverse heritage palettes.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="bg-orange-50 p-2 rounded-lg">
                    <Star className="w-5 h-5 text-[#f06428] fill-[#f06428]" />
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-orange-50 rounded-[3rem] -rotate-3 group-hover:rotate-0 transition-transform duration-700"></div>
            <img 
              src="/banner03.jpg" 
              alt="Plating perfection"
              className="relative rounded-[2.5rem] shadow-2xl z-10 w-full h-[600px] object-cover"
            />
          </div>
        </div>
      </section>

      {/* 3. CALL TO ACTION: THE CONCIERGE */}
      <section className="relative py-24 px-6 rounded-t-[4rem] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/banner04.jpg" 
            alt="Consultation Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
            Let's start the <span className="text-[#f06428]">Consultation.</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
              <Users className="w-8 h-8 text-[#f06428] mx-auto mb-4" />
              <p className="text-white font-bold uppercase tracking-widest text-sm">50 - 500 Guests</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
              <Calendar className="w-8 h-8 text-[#f06428] mx-auto mb-4" />
              <p className="text-white font-bold uppercase tracking-widest text-sm">Available 2026/27</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 backdrop-blur-md p-8 rounded-[2rem] hover:bg-white/10 transition-colors">
              <Star className="w-8 h-8 text-[#f06428] mx-auto mb-4" />
              <p className="text-white font-bold uppercase tracking-widest text-sm">Award Winning</p>
            </div>
          </div>

          <Link 
            href="/book"
            className="group inline-flex items-center gap-3 bg-[#f06428] text-white px-12 py-6 rounded-full font-black uppercase tracking-widest mx-auto hover:bg-white hover:text-[#f06428] transition-all active:scale-95 shadow-2xl"
          >
            Inquire Now <ArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </main>
  );
}