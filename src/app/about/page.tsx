'use client';

import { useState } from 'react';
import { 
  ShieldCheck, Trophy, Heart, Timer, Truck, LayoutDashboard, 
  UtensilsCrossed, Zap, Users, MessageSquare, HelpCircle, 
  Star, ChevronDown, ArrowRight 
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState('story');

  const aboutTabs = [
    { id: 'story', label: 'Our Story', icon: <Truck className="w-4 h-4" /> },
    { id: 'team', label: 'Meet the Team', icon: <Users className="w-4 h-4" /> },
    { id: 'testimonials', label: 'Testimonials', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'faq', label: 'FAQ', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  return (
    <main className="bg-white min-h-screen text-[#0f172a] pt-10">
      
      {/* 1. HEADER & TAB NAVIGATION */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <div className="flex justify-center items-center gap-2 mb-6">
          <div className="h-[1px] w-8 bg-[#b32d3a]"></div>
          <span className="text-[#b32d3a] font-black uppercase tracking-[0.4em] text-[10px]">The Office Lunch Richmond</span>
          <div className="h-[1px] w-8 bg-[#b32d3a]"></div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tighter mb-12 leading-none">
          Everything <br />
          <span className="text-[#b32d3a]">About Us.</span>
        </h1>
        
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16 max-w-6xl mx-auto px-4">
          {aboutTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all border-2 ${
                activeTab === tab.id
                  ? 'bg-[#b32d3a] border-[#b32d3a] text-white shadow-lg scale-105'
                  : 'bg-white border-slate-100 text-slate-800 hover:border-slate-300'
              }`}
            >
              <span className={activeTab === tab.id ? 'text-white' : 'text-[#b32d3a]'}>
                {tab.icon}
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. DYNAMIC CONTENT AREA - FIXED pt-4 and removed premature closing tag */}
      <section className="px-6 pt-4 pb-24 max-w-7xl mx-auto">
        
        {/* --- OUR STORY TAB --- */}
        {activeTab === 'story' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
              <div>
                <span className="text-[#b32d3a] font-black uppercase tracking-[0.4em] text-[10px] block mb-4 italic">Corporate Catering Intelligence</span>
                <h2 className="text-5xl font-black uppercase tracking-tighter leading-tight mb-8">
                  Catering <span className="text-[#b32d3a]">Redefined.</span>
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8">
                  We cover all of London and Surrey, delivering premium sandwich platters, seasonal salads, and executive meal boxes designed specifically for the high-stakes corporate environment.
                </p>
                <p className="text-lg text-slate-500 leading-relaxed mb-10 italic border-l-4 border-[#b32d3a] pl-6">
                  "The office lunch shouldn't be an afterthought. It is the coordinated provision of fuel that drives workplace productivity and employee wellbeing."
                </p>
                <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-10">
                  <div>
                    <p className="text-4xl font-black text-[#0f172a]">London</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#b32d3a]">Full Coverage</p>
                  </div>
                  <div>
                    <p className="text-4xl font-black text-[#0f172a]">Last-Mile</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#b32d3a]">Dedicated Logistics</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-[4rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-inner">
                  <img src="/about-hero.jpg" alt="Our Kitchen Process" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 text-[#0f172a] py-24 px-10 rounded-[4rem] border border-slate-100 mb-24">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Our <span className="text-[#b32d3a]">Logistics</span> Engine.</h2>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Modern catering is more than just great food; it’s a sophisticated operation of <span className="text-[#0f172a] font-bold">menu planning, packaging design, and route optimization.</span>
                  </p>
                  <div className="space-y-4 pt-4">
                    {[
                      { icon: LayoutDashboard, text: "Platform-based ordering for seamless procurement." },
                      { icon: Zap, text: "Optimized routes to reduce downtime." },
                      { icon: ShieldCheck, text: "Clear labeling for all dietary requirements." }
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#b32d3a]/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-[#b32d3a]" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-sm text-left">
                   <h4 className="text-[#b32d3a] font-black uppercase tracking-widest text-xs mb-6">For Procurement Teams</h4>
                   <p className="text-slate-600 text-sm leading-loose mb-8 font-medium">
                     We help office managers balance convenience, cost, and complexity. Our model is designed to integrate effortlessly with your internal systems.
                   </p>
                   <Link href="/menus" className="inline-flex items-center gap-3 bg-[#b32d3a] text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-transform">
                     View Our Models <Truck className="w-4 h-4" />
                   </Link>
                </div>
              </div>
            </div>

            <div className="text-center mb-20">
              <h2 className="text-4xl font-black uppercase tracking-tighter">The Pillars of <span className="text-[#b32d3a]">Precision.</span></h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { icon: Heart, title: "Curated Menus", desc: "Thoughtfully balanced platters that prioritize variety." },
                { icon: Timer, title: "Strict Windows", desc: "Arrival within your 30-minute boardroom window." },
                { icon: UtensilsCrossed, title: "Zero Plating", desc: "Professional packaging designed to go straight to the table." },
                { icon: ShieldCheck, title: "Dietary Safety", desc: "Individual labeling for every employee." }
              ].map((value, i) => (
                <div key={i} className="text-center group">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100 group-hover:bg-[#b32d3a]/10 transition-colors">
                    <value.icon className="w-8 h-8 text-[#b32d3a]" />
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tighter mb-4">{value.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MEET THE TEAM TAB --- */}
        {activeTab === 'team' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 text-center">
            {[
              { name: "Efe", role: "Director", image: "/team/efe.jpg", bio: "20+ years in hospitality leadership" },
              { name: "Onur (Ekrem)", role: "Sales & Marketing", image: "/team/onur.jpg", bio: "Driving growth since 2011" },
              { name: "Clazyer", role: "Manager", image: "/team/clazyer.jpg", bio: "Leading daily operations since 2019" },
              { name: "David", role: "Assistant Manager & Chef", image: "/team/david.jpg", bio: "MSc in Computer Science & Culinary Expert" },
              { name: "Rahul", role: "Professional Chef", image: "/team/rahul.jpg", bio: "Executive Kitchen Team" },
              { name: "Isaiah", role: "Chef", image: "/team/isaiah.jpg", bio: "Culinary Team & Academic Scholar" }
            ].map((member, i) => (
              <div key={i} className="group">
                <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 bg-slate-100 relative shadow-sm border border-slate-100">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=" + member.name + "&background=f1f5f9&color=b32d3a&size=512"; }}
                  />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">{member.name}</h3>
                <p className="text-[#b32d3a] text-[10px] font-black uppercase tracking-[0.2em] mb-3">{member.role}</p>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[200px] mx-auto">{member.bio}</p>
              </div>
            ))}
          </div>
        )}

        {/* --- TESTIMONIALS TAB --- */}
        {activeTab === 'testimonials' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
            {[
              { name: "Tony", company: "TfL", text: "The food was absolutely delicious and enjoyed by all. They are professional, quick and very friendly.", role: "Transport for London" },
              { name: "Andrea", company: "Yoobic", text: "Timely delivery and the food was lovely. My staff are smiling. Great online ordering experience.", role: "IT Director" },
              { name: "Alex", company: "UK Power Networks", text: "Thank you again for great platters. All managed nicely and delivered exactly as promised.", role: "Corporate Operations" },
              { name: "Gabriella", company: "Smart Pension", text: "Great platters and service as always. It is always a pleasure working with the Richmond team.", role: "Office Manager" },
              { name: "Charles", company: "Ves London", text: "We have used them happily for many years. Excellent meat sandwich platters. Highly recommended.", role: "Manager" },
              { name: "Emily", company: "Jack Jones", text: "Everything was great. Thank you so much for your excellent sandwiches and professional service.", role: "Executive PA" }
            ].map((t, i) => (
              <div key={i} className="bg-white p-12 rounded-[3rem] border border-slate-100 relative shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center">
                <div className="flex flex-col items-center gap-6 mb-8 w-full">
                  <div className="w-20 h-20 rounded-full bg-[#0f172a] flex items-center justify-center shadow-lg border border-slate-100">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h4 className="text-[#0f172a] font-black uppercase tracking-tighter text-sm mb-1.5">{t.company}</h4>
                    <div className="flex gap-0.5 justify-center">
                      {[...Array(5)].map((_, i) => ( <Star key={i} className="w-3.5 h-3.5 fill-[#b32d3a] text-[#b32d3a]" /> ))}
                    </div>
                  </div>
                </div>
                <p className="text-slate-600 text-[13px] leading-relaxed mb-10 italic font-medium max-w-[320px]">"{t.text}"</p>
                <div className="pt-6 border-t border-slate-50 w-full">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#0f172a]">— {t.name}.</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- FAQ TAB --- */}
        {activeTab === 'faq' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto space-y-4">
            <div className="text-center mb-12">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-[#0f172a]">
                Frequently Asked <span className="text-[#b32d3a]">Questions.</span>
              </h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Everything you need to know</p>
            </div>
            {[
              { q: "Where do you cover?", a: "We cover all postcodes of London, Surrey, and Buckinghamshire." },
              { q: "When can I order and how can I pay?", a: "For next-day delivery, the cut-off time is 1 PM. We accept cards, PayPal, and bank transfers." },
              { q: "Will my order come on time?", a: "We provide guaranteed 2-hour delivery windows and pride ourselves on punctuality." },
              { q: "Do you provide Halal meat?", a: "Yes, we do. Please specify your request in the note section on the checkout page." },
              { q: "What is your allergen advice?", a: "We operate an artisan kitchen. While we take precautions, we cannot guarantee 100% allergen-free items." },
              { q: "Do you cater for non-office events?", a: "Absolutely. We are open 7 days a week for birthdays, parties, and private events." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm transition-all hover:border-slate-200 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-8 cursor-pointer select-none">
                  <h3 className="text-sm font-black uppercase tracking-tight text-[#0f172a] group-open:text-[#b32d3a] transition-colors">{faq.q}</h3>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-open:rotate-180 transition-transform">
                    <ChevronDown className="w-4 h-4 text-[#b32d3a]" />
                  </div>
                </summary>
                <div className="px-8 pb-8 text-slate-600 text-[13px] leading-relaxed font-medium animate-in fade-in duration-300">{faq.a}</div>
              </details>
            ))}
          </div>
        )}

      </section> {/* THIS TAG NOW CLOSES ALL TABS CORRECTLY */}

      {/* 4. THE PROMISE BANNER */}
      <section className="relative py-32 px-6 overflow-hidden bg-slate-50 mx-4 md:mx-12 rounded-[4rem] mb-12">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 italic text-slate-900 leading-tight">
            "We provide the <span className="text-[#b32d3a]">infrastructure</span> for your team's success."
          </h2>
          <span className="font-black uppercase tracking-widest text-[10px] text-slate-400">— The Office Lunch Founding Team</span>
        </div>
      </section>
    </main>
  );
}