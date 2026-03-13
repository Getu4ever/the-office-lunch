'use client';

import { useState } from 'react';
import { Calendar, Users, ArrowRight, ChevronLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    eventType: '',
    guestCount: '',
    date: '',
    vision: ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const isStep2Valid = formData.guestCount !== '' && formData.date !== '';

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        nextStep();
      } else {
        alert("Submission failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-[#0f172a] min-h-screen text-white">
      {/* GLOBAL NAVBAR - Standardized across all pages */}
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-[#f06428]' : 'bg-white/10'}`} 
            />
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
          {/* Subtle branding element in background */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#f06428] rounded-full blur-[120px] opacity-10 pointer-events-none" />

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <span className="text-[#f06428] font-black uppercase tracking-[0.4em] text-[10px] block mb-4">Step 01</span>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-8 text-white">Select your <br />Event <span className="text-[#f06428]">Experience.</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Wedding Gala', 'Corporate Excellence', 'Private Dining', 'Public Pop-up'].map((type) => (
                  <button 
                    key={type}
                    onClick={() => { setFormData({...formData, eventType: type}); nextStep(); }}
                    className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-[#f06428] hover:border-[#f06428] transition-all text-left group"
                  >
                    <p className="font-black uppercase tracking-widest text-sm group-hover:text-white">{type}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <button onClick={prevStep} className="flex items-center gap-2 text-white/40 mb-6 hover:text-white transition-colors">
                <ChevronLeft size={16}/> Back
              </button>
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-white">The <span className="text-[#f06428]">Logistics.</span></h2>
              <form onSubmit={handleFinalSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Estimated Guest Count *</label>
                    <div className="relative">
                      <Users className="absolute left-4 top-4 text-[#f06428] w-4 h-4" />
                      <input 
                        required
                        type="number" 
                        placeholder="e.g. 150" 
                        value={formData.guestCount}
                        onChange={(e) => setFormData({...formData, guestCount: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 focus:border-[#f06428] outline-none transition-colors text-white" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Event Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-4 text-[#f06428] w-4 h-4" />
                      <input 
                        required
                        type="date" 
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 focus:border-[#f06428] outline-none transition-colors text-white [color-scheme:dark]" 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tell us your vision (Optional)</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 text-[#f06428] w-4 h-4" />
                    <textarea 
                      placeholder="Share any specific details or culinary preferences..." 
                      value={formData.vision}
                      onChange={(e) => setFormData({...formData, vision: e.target.value})}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 focus:border-[#f06428] outline-none transition-colors text-white resize-none" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={!isStep2Valid || isSubmitting}
                  className={`w-full py-6 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all mt-8 ${
                    isStep2Valid && !isSubmitting 
                    ? 'bg-[#f06428] text-white hover:bg-white hover:text-[#0f172a]' 
                    : 'bg-white/10 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Request Consultation <ArrowRight size={18} /></>
                  )}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="mb-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[16/9] relative bg-slate-900">
                <img 
                  src="/confirmation.jpg" 
                  alt="Booking Confirmed" 
                  className="w-full h-full object-cover" 
                />
              </div>

              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                Request <span className="text-[#f06428]">Received.</span>
              </h2>
              
              <p className="text-white/60 mb-10 max-w-sm mx-auto leading-relaxed text-lg">
                Our lead consultant will review your event logistics and reach out within 12 business hours with a preliminary proposal.
              </p>

              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Link href="/" className="bg-[#f06428] text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-[#0f172a] transition-all text-sm">
                  Return Home
                </Link>
                <Link href="/menus" className="border border-white/20 px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white/10 transition-all text-white text-sm">
                  Explore Menus
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">
            "We don't just cater events; we curate legacies."
          </p>
        </div>
      </section>
    </main>
  );
}