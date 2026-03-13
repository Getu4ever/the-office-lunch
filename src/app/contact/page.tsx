'use client';

import React, { useState } from 'react';
import { Mail, MapPin, Phone, MessageSquare, Send, Clock, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    eventNature: 'Corporate Gala',
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
        // Clear the form
        setFormData({ name: '', email: '', eventNature: 'Corporate Gala', message: '' });
        // Hide success message after 5 seconds
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
          <span className="text-[#f06428] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Get In Touch</span>
          <h1 className="text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-6">
            Let’s Create Your <br />
            <span className="text-[#f06428]">Next Masterpiece</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium italic text-lg">
            Whether it's an intimate gala or a corporate milestone, we are here to handle every culinary detail with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* LEFT: CONCIERGE DETAILS & MAP */}
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                  <MessageSquare className="w-4 h-4 text-[#f06428]" /> General Inquiry
                </div>
                <p className="text-slate-500 font-bold">hello@thecateringco.com</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                  <Phone className="w-4 h-4 text-[#f06428]" /> Concierge Line
                </div>
                <p className="text-slate-500 font-bold">020 7123 4567</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                  <MapPin className="w-4 h-4 text-[#f06428]" /> Our Studio
                </div>
                <p className="text-slate-500 font-bold leading-relaxed">
                  12 Knightsbridge Gardens,<br />London, SW1X 7LY
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-slate-900 font-black uppercase tracking-widest text-[10px]">
                  <Clock className="w-4 h-4 text-[#f06428]" /> Response Time
                </div>
                <p className="text-slate-500 font-bold italic text-sm">Within 24 Business Hours</p>
              </div>
            </div>

            {/* LOCATION MAP */}
            <div className="relative h-96 rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.540423056448!2d-0.1658!3d51.5008!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4876053805900001%3A0x868b6b25203a3d!2sKnightsbridge%2C%20London!5e0!3m2!1sen!2suk!4v1647100000000!5m2!1sen!2suk"
                className="w-full h-full grayscale contrast-[1.2] invert-[0.05] group-hover:grayscale-0 transition-all duration-1000"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
              <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                  <MapPin className="w-3 h-3 text-[#f06428]" /> Visit Our Studio
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: ELEGANT FORM */}
          <div className="bg-slate-50 p-12 md:p-16 rounded-[4rem] border border-slate-100 shadow-sm relative overflow-hidden">
            
            {/* SUCCESS OVERLAY */}
            {isSuccess && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-10 flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-500">
                <div className="bg-orange-100 p-4 rounded-full mb-6">
                  <CheckCircle2 className="w-12 h-12 text-[#f06428]" />
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-slate-900">Message Sent</h3>
                <p className="text-slate-500 font-medium italic">Our concierge team has received your request and will be in touch shortly.</p>
              </div>
            )}

            <div className="mb-10 ml-2">
              <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900">
                Start a <span className="text-[#f06428]">Conversation</span>
              </h3>
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2 leading-relaxed">
                Complete the brief below and our concierge team will reach out.
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
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#f06428] transition-all shadow-sm"
                    placeholder="E.g. Alexander Knight"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Email Address</label>
                  <input 
                    type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#f06428] transition-all shadow-sm"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Event Nature</label>
                <select 
                  value={formData.eventNature}
                  onChange={(e) => setFormData({...formData, eventNature: e.target.value})}
                  className="w-full bg-white border-none rounded-2xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#f06428] appearance-none cursor-pointer shadow-sm"
                >
                  <option>Corporate Gala</option>
                  <option>Private Wedding</option>
                  <option>Bespoke Dinner Party</option>
                  <option>Media Launch</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Message</label>
                <textarea 
                  rows={5} required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-white border-none rounded-3xl px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-[#f06428] transition-all shadow-sm resize-none"
                  placeholder="How can we elevate your event?"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-[#f06428] transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-orange-200 group disabled:bg-slate-400"
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