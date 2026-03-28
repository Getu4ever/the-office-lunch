'use client';

import AvailabilityManager from '@/components/AvailabilityManager';
import { Database } from 'lucide-react';

export default function AdminInventoryPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* SIMPLE HEADER */}
        <div className="mb-8 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex items-center gap-5">
          <div className="bg-white/10 p-4 rounded-2xl">
            <Database className="w-8 h-8 text-[#b32d3a]" />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Inventory Manager</h1>
            <p className="text-white/50 text-[10px] font-bold uppercase tracking-widest text-balance">
              Manage availability for your 88 menu items
            </p>
          </div>
        </div>

        {/* THE MANAGER COMPONENT - This is the important part! */}
        <AvailabilityManager />
        
      </div>
    </div>
  );
}