'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated! Redirecting...");
        setTimeout(() => router.push('/login'), 2000);
      } else {
        toast.error(data.message || "Invalid or expired code.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-sm border border-stone-100">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-slate-900 leading-tight">New Password</h1>
          <p className="text-stone-400 text-sm font-medium mt-2">Enter your email, code, and new password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" placeholder="Email Address" required
            className="w-full p-5 bg-stone-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#b32d3a]"
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="text" placeholder="6-Digit Code" required maxLength={6}
            className="w-full p-5 bg-stone-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#b32d3a]"
            value={code} onChange={(e) => setCode(e.target.value)}
          />
          <input 
            type="password" placeholder="New Password" required
            className="w-full p-5 bg-stone-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#b32d3a]"
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <button 
            disabled={loading}
            className="w-full bg-[#b32d3a] text-white p-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-slate-900 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Update Password"}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>
      </div>
    </div>
  );
}