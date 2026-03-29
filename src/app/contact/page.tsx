'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventNature: 'Boardroom Lunch',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: '', email: '', eventNature: 'Boardroom Lunch', message: '' });
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-44 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="mb-20">
          <span className="text-[#b32d3a] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block italic">Get In Touch</span>
          <h1 className="text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">
            Elevate Your <br />
            <span className="text-[#b32d3a]">Next Boardroom</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium italic text-lg">
            From daily office fuel to high-stakes corporate milestones, we handle every culinary detail with London-based precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* LEFT: CONCIERGE DETAILS & MAP */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                  <MessageSquare className="w-4 h-4 text-[#b32d3a]" /> General Inquiry
                </div>
                <p className="text-slate-500 font-bold">orders@sandwichplatterdelivery.co.uk</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                  <Phone className="w-4 h-4 text-[#b32d3a]" /> Office Line
                </div>
                <p className="text-slate-500 font-bold">020 8123 4567</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                  <MapPin className="w-4 h-4 text-[#b32d3a]" /> Our Kitchen
                </div>
                <p className="text-slate-500 font-bold leading-relaxed">
                  Kew Rd, Richmond,<br />London, TW9 2NA
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                  <Clock className="w-4 h-4 text-[#b32d3a]" /> Response Time
                </div>
                <p className="text-slate-500 font-bold italic text-sm">Within 2 Business Hours</p>
              </div>
            </div>

            {/* LOCATION MAP */}
            <div className="relative h-96 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2485.6723225211833!2d-0.30138379999999996!3d51.4641527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876033722424fa9%3A0x86a7a4a8e495431f!2sSandwich%20platters%20delivery-%20Sandwich%20delivery%20-%20Office%20lunch!5e0!3m2!1sen!2suk!4v1711651400000!5m2!1sen!2suk"
                className="w-full h-full grayscale contrast-[1.1] hover:grayscale-0 transition-all duration-1000"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#b32d3a]" /> Richmond, London
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: ELEGANT FORM */}
          <div className="bg-slate-50 p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
            
            {isSuccess && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-500">
                <div className="bg-red-50 p-4 rounded-full mb-6">
                  <CheckCircle2 className="w-12 h-12 text-[#b32d3a]" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-slate-900">Inquiry Received</h3>
                <p className="text-slate-500 font-medium italic">Our concierge team will reach out to you shortly to discuss your requirements.</p>
              </div>
            )}

            <div className="mb-10 ml-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
                Start a <span className="text-[#b32d3a]">Conversation</span>
              </h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2 leading-relaxed">
                Complete the brief below and our catering team will reach out.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Your Name</label>
                  <input 
                    type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#b32d3a] transition-all shadow-sm"
                    placeholder="E.g. James Sterling"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Work Email</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#b32d3a] transition-all shadow-sm"
                    placeholder="james@company.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Nature of Inquiry</label>
                <select 
                  value={formData.eventNature}
                  onChange={(e) => setFormData({...formData, eventNature: e.target.value})}
                  className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#b32d3a] appearance-none cursor-pointer shadow-sm"
                >
                  <option>Boardroom Lunch</option>
                  <option>Corporate Event (50+)</option>
                  <option>Daily Office Subscriptions</option>
                  <option>Dietary Consulting</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                <textarea 
                  rows={5} required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white border-none rounded-3xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#b32d3a] transition-all shadow-sm resize-none"
                  placeholder="Tell us about your team's requirements..."
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#b32d3a] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-red-100 group disabled:bg-slate-400"
              >
                {isSubmitting ? 'Sending...' : 'Send Inquiry'} 
                {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}