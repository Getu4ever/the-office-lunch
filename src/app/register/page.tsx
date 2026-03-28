'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react'; // CRITICAL: For Google Login
import { 
  Mail, 
  Lock, 
  User, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff 
} from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // STAGE 1: Submit Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setShowVerify(true);
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/register/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        alert("A new code has been sent to your email.");
      } else {
        const data = await res.json();
        setError(data.message || "Failed to resend code");
      }
    } catch (err) {
      setError("Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // STAGE 2: Submit Verification Code
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (res.ok) {
        router.push('/login?success=Email verified! Please login.');
      } else {
        const data = await res.json();
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN HANDLER
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#f5f0e6]">
      {/* LEFT SIDE: VISUAL */}
      <div className="hidden lg:block relative overflow-hidden bg-slate-900">
        <Image 
            src="/home-hero.png" 
            alt="Catering" 
            fill 
            className="object-cover opacity-60 scale-105" 
            priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#b32d3a]/40 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16">
          <h2 className="text-white text-4xl font-black uppercase italic leading-tight">
            "The finest boardroom <br /> fuel in Richmond."
          </h2>
        </div>
      </div>

      {/* RIGHT SIDE: FORM */}
      <div className="flex items-center justify-center p-8 md:p-16 lg:p-24">
        <div className="w-full max-w-md">
          
          {!showVerify ? (
            <>
              <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                Create <span className="text-[#b32d3a]">Account.</span>
              </h1>
              <p className="text-slate-500 font-medium mb-8 tracking-tight">Register your company to start ordering.</p>

              {/* GOOGLE SIGN IN BUTTON */}
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-4 bg-white border border-slate-200 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-stone-50 transition-all mb-6 shadow-sm"
              >
                <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} alt="Google" />
                Continue with Google
              </button>

              <div className="relative flex items-center mb-8">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4 text-[10px] font-black uppercase text-slate-400 tracking-widest">Or use Email</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 text-left">
                {error && <div className="bg-red-50 text-[#b32d3a] p-4 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#b32d3a] text-black" placeholder="John Doe" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#b32d3a] text-black" placeholder="john@company.com" />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-12 outline-none focus:border-[#b32d3a] text-black" 
                      placeholder="••••••••" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className={`w-full bg-white border rounded-2xl py-4 pl-12 pr-12 outline-none transition-all text-black ${
                        confirmPassword && password !== confirmPassword 
                          ? 'border-red-500 bg-red-50/10' 
                          : 'border-slate-200 focus:border-[#b32d3a]'
                      }`} 
                      placeholder="••••••••" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#b32d3a] text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-red-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-red-900/10">
                  {loading ? <Loader2 className="animate-spin" /> : <>Register Now <ArrowRight /></>}
                </button>
              </form>
            </>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
              <h1 className="text-5xl font-black uppercase tracking-tighter text-slate-900 mb-2">
                Verify <span className="text-[#b32d3a]">Email.</span>
              </h1>
              <p className="text-slate-500 font-medium mb-8">We sent a 6-digit code to <span className="text-slate-900 font-bold">{email}</span>.</p>
              
              <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mb-8">
                Don't see it? Please check your <span className="text-[#b32d3a]">Spam</span> or Junk folder.
              </p>

              <form onSubmit={handleVerify} className="space-y-5">
                {error && <div className="bg-red-50 text-[#b32d3a] p-4 rounded-xl text-sm font-bold border border-red-100">{error}</div>}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Security Code</label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required 
                      maxLength={6}
                      value={verificationCode} 
                      onChange={(e) => setVerificationCode(e.target.value)} 
                      className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-[#b32d3a] tracking-[1em] text-lg font-bold text-black" 
                      placeholder="000000" 
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl">
                  {loading ? <Loader2 className="animate-spin" /> : <>Verify Account <ArrowRight /></>}
                </button>

                <p className="text-center text-sm font-bold text-slate-400 mt-6">
                  Didn't get the code? <button type="button" onClick={handleResendCode} className="text-[#b32d3a] hover:underline uppercase tracking-tighter ml-1">Resend</button>
                </p>
              </form>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-slate-200 text-left">
            <p className="text-slate-500 font-medium">
              Already have an account? <Link href="/login" className="text-[#b32d3a] font-bold hover:underline">Login here.</Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}