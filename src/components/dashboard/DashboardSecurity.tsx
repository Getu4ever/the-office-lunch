'use client';

import { useState } from 'react';
import { Lock, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardSecurity() {
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords do not match");
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password updated successfully");
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(data.error || "Update failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10">
      <h2 className="text-3xl font-black uppercase mb-8">Account <span className="text-[#b32d3a]">Security</span></h2>
      
      <div className="grid lg:grid-cols-2 gap-10">
        {/* INFO COLUMN */}
        <div className="bg-stone-50 p-10 rounded-[3rem] border border-stone-100">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6">
            <ShieldCheck className="text-emerald-500" size={32} />
          </div>
          <h3 className="font-black uppercase text-lg mb-4 text-slate-900">Security Status</h3>
          <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6">
            Keep your account secure by using a strong password. We recommend a mix of letters, numbers, and symbols.
          </p>
          <ul className="space-y-3">
            {['Minimum 6 characters', 'Case sensitive', 'Changed regularly'].map((hint, i) => (
              <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b32d3a]" /> {hint}
              </li>
            ))}
          </ul>
        </div>

        {/* FORM COLUMN */}
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Current Password</label>
            <div className="relative">
              <input 
                type={showPasswords ? "text" : "password"}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 px-6 pr-12 mt-1 outline-none focus:border-[#b32d3a] font-bold"
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-900 transition-colors pt-1"
              >
                {showPasswords ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">New Password</label>
            <div className="relative">
              <input 
                type={showPasswords ? "text" : "password"}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 px-6 pr-12 mt-1 outline-none focus:border-[#b32d3a] font-bold"
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-900 transition-colors pt-1"
              >
                {showPasswords ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <div className="relative">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showPasswords ? "text" : "password"}
                required
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-4 px-6 pr-12 mt-1 outline-none focus:border-[#b32d3a] font-bold"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
              <button 
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-slate-900 transition-colors pt-1"
              >
                {showPasswords ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-xl hover:bg-[#b32d3a] transition-all flex items-center justify-center gap-3 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <><Lock size={16} /> Update Password</>}
          </button>
        </form>
      </div>
    </div>
  );
}