'use client';

import AvailabilityManager from "@/components/AvailabilityManager";

export default function DashboardOverview({ orders, userData, role }: any) {
  return (
    <div className="p-10">
      <h2 className="text-3xl font-black uppercase mb-8">Account <span className="text-[#b32d3a]">Overview</span></h2>
      
      {role === 'admin' ? (
        <AvailabilityManager />
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-[#b32d3a] text-white p-8 rounded-[2.5rem] shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Recent Orders</p>
            <h3 className="text-4xl font-black">{orders?.length || 0}</h3>
          </div>
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-xl">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Saved Addresses</p>
            {/* Updated to .addresses to match your data structure */}
            <h3 className="text-4xl font-black">{userData?.addresses?.length || 0}</h3>
          </div>
          <div className="bg-white border border-stone-100 p-8 rounded-[2.5rem] shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Member Status</p>
            <h3 className="text-xl font-black text-slate-900 uppercase italic">Preferred</h3>
          </div>
        </div>
      )}
    </div>
  );
}