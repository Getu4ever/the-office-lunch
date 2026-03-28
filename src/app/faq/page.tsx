'use client';

import React from 'react';
import { HelpCircle, Truck, Utensils, CalendarDays, Wallet, MessageSquare, ChevronRight } from 'lucide-react';

export default function FAQPage() {
  const categories = [
    {
      id: "01",
      title: "Logistics",
      icon: <Truck className="w-6 h-6 text-[#b32d3a]" />,
      questions: [
        {
          q: "What is your delivery radius?",
          a: "We primary serve Richmond, Twickenham, Kingston, and the surrounding Southwest London business hubs. If you are further afield, please contact our concierge to discuss a bespoke delivery arrangement."
        },
        {
          q: "Do you have a minimum order value?",
          a: "Yes, to maintain our standard of service and ingredient quality, we have a minimum order value of £100 for all boardroom deliveries."
        }
      ]
    },
    {
      id: "02",
      title: "Catering",
      icon: <Utensils className="w-6 h-6 text-[#b32d3a]" />,
      questions: [
        {
          q: "How is the food presented?",
          a: "Our signature boardroom boxes are designed to be 'table-ready.' We use premium, sustainable packaging that looks professional the moment it is opened, eliminating the need for separate platters."
        },
        {
          q: "Can you accommodate severe allergies?",
          a: "We offer dedicated Vegan, Gluten-Free, and Dairy-Free options. While we follow strict cross-contamination protocols, please note our kitchen handles nuts and gluten. All items are clearly labeled for your guests' safety."
        }
      ]
    },
    {
      id: "03",
      title: "Planning",
      icon: <CalendarDays className="w-6 h-6 text-[#b32d3a]" />,
      questions: [
        {
          q: "What is the ordering cut-off time?",
          a: "For guaranteed next-day delivery, orders must be finalized through our portal by 2:00 PM. This ensures our chefs have time to source the freshest seasonal ingredients for your menu."
        },
        {
          q: "Can I make last-minute changes?",
          a: "You can adjust headcounts up until 24 hours before delivery. Within the 24-hour window, we are unable to reduce costs as produce will have already been secured and prepared."
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-white pt-44 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-20 border-b border-slate-100 pb-16">
          <span className="text-[#b32d3a] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block italic">Knowledge Base</span>
          <h1 className="text-6xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-8">
            Common <br />
            <span className="text-[#b32d3a]">Queries</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium italic text-xl leading-relaxed">
            Everything you need to know about elevating your office lunch. From delivery zones to dietary discretion.
          </p>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* SIDEBAR NAVIGATION */}
          <div className="hidden md:block">
            <div className="sticky top-44 space-y-6">
              <div className="flex items-center gap-3 text-[#b32d3a]">
                <HelpCircle className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Support Hub</span>
              </div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                Need a custom <br />
                quote for 50+ guests?
              </p>
              <div className="pt-8 border-t border-slate-100">
                <a 
                  href="mailto:info@officelunch.co.uk"
                  className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#b32d3a] hover:text-slate-900 transition-colors"
                >
                  Email Concierge <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* MAIN FAQ CONTENT */}
          <div className="md:col-span-2 space-y-24">
            
            {categories.map((category) => (
              <section key={category.id} className="group">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#b32d3a] mb-8 flex items-center gap-2">
                  <div className="w-8 h-[1px] bg-[#b32d3a]"></div> {category.id}. {category.title}
                </h3>
                
                <div className="space-y-12">
                  {category.questions.map((item, index) => (
                    <div key={index} className="space-y-4">
                      <h4 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">
                        {item.q}
                      </h4>
                      <p className="text-slate-500 font-medium leading-relaxed italic">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* FINAL CTA */}
            <div className="bg-slate-900 p-12 rounded-[3rem] text-white overflow-hidden relative group">
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <MessageSquare className="w-6 h-6 text-[#b32d3a]" />
                  <h4 className="text-lg font-black uppercase tracking-tighter">Still Unsure?</h4>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-8 max-w-sm">
                  If your question involves a high-profile event or complex dietary requirements, our team is available for a private consultation.
                </p>
                <a 
                  href="/contact" 
                  className="inline-block bg-[#b32d3a] text-white text-[10px] font-black uppercase tracking-widest px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300"
                >
                  Get in Touch
                </a>
              </div>
              
              {/* Decorative Background Element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#b32d3a] rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}