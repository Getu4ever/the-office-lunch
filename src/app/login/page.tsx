'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Lock, Loader2, HelpCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Restored state
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const successMsg = searchParams.get('success');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
      setLoading(false);
    } else {
      router.push('/dashboard'); 
      router.refresh();
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5f0e6]">
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md">
          <div className="mb-10 text-left">
            <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-2">
              Welcome <span className="text-[#b32d3a]">Back.</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Log in to manage your corporate catering orders.</p>
          </div>

          {successMsg && !error && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-4 rounded-2xl text-sm font-bold mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              {successMsg}
            </div>
          )}

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-4 bg-white border border-slate-200 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-stone-50 transition-all mb-6 shadow-sm text-black"
          >
            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} alt="Google" />
            Sign in with Google
          </button>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Or credentials</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            {error && (
              <div className="bg-red-50 border border-red-100 text-[#b32d3a] px-4 py-3 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#b32d3a] transition-all font-medium text-slate-900"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link 
                  href="/forgot-password" 
                  className="text-[10px] font-black uppercase tracking-widest text-[#b32d3a] hover:text-red-800 transition-colors flex items-center gap-1"
                >
                  <HelpCircle className="w-3 h-3" /> Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-[#b32d3a] transition-all font-medium text-slate-900"
                  placeholder="••••••••"
                />
                {/* RESTORED EYE ICON BUTTON */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#b32d3a] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-800 transition-all shadow-lg shadow-red-900/10 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 font-medium text-left">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#b32d3a] font-black hover:underline">
              Create one here.
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:block relative overflow-hidden bg-slate-900">
        <Image 
          src="/page-hero.png" 
          alt="Luxury Corporate Catering" 
          fill 
          className="object-cover opacity-60 grayscale-[20%]" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#b32d3a]/40 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16 text-left">
          <h2 className="text-white text-4xl font-black uppercase leading-tight italic">
            "The finest boardroom <br /> fuel in Richmond."
          </h2>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f0e6] flex items-center justify-center"><Loader2 className="animate-spin text-[#b32d3a]" /></div>}>
      <LoginContent />
    </Suspense>
  );
}