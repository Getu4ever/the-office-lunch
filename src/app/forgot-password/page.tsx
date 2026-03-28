'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        toast.success("Code sent! Please check your inbox.");
      } else {
        toast.error("Could not send code. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100">
        <div className="mb-8 text-center text-left">
          <div className="w-16 h-16 bg-red-50 text-[#b32d3a] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Forgot Password?</h1>
          <p className="text-stone-400 text-sm font-medium mt-2">Enter your email for a 6-digit reset code.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-4">Email Address</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-5 bg-stone-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-[#b32d3a] transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#b32d3a] text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Send Reset Code"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-[#b32d3a] transition-colors">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}