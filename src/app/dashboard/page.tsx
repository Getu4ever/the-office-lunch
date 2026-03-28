'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import toast from 'react-hot-toast';

import DashboardSkeleton from "@/components/DashboardSkeleton";
import AdminDashboardView from "@/components/dashboard/AdminDashboardView";
import CustomerDashboardView from "@/components/dashboard/CustomerDashboardView";

export interface Address {
  _id?: string;
  label: string;
  addressLine1: string;
  city: string;
  postcode: string;
  isDefault?: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (status === 'authenticated') {
        try {
          const res = await fetch('/api/user/dashboard-data');
          if (res.ok) {
            const data = await res.json();
            setUserData(data.user);
            setOrders(data.orders);
          }
        } catch (err) {
          toast.error("COULD NOT LOAD PROFILE DATA");
        } finally {
          setLoading(false);
        }
      }
    }
    fetchData();
  }, [status]);

  if (status === 'loading' || loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#f5f0e6] pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        
        {/* HEADER - KEPT EXACTLY THE SAME */}
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row items-center gap-10">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-stone-100 border-4 border-[#b32d3a]/10 relative shadow-inner">
            {userData?.image ? (
              <Image src={userData.image} alt="Profile" fill className="object-cover" unoptimized />
            ) : (
              <UserIcon className="m-auto text-stone-300" size={64} />
            )}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-2">
              {session?.user?.name}
            </h1>
            <span className="bg-[#b32d3a]/5 text-[#b32d3a] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#b32d3a]/10">
              {session?.user?.role}
            </span>
          </div>
        </div>

        {session?.user?.role === 'admin' ? (
          <AdminDashboardView userData={userData} orders={orders} />
        ) : (
          <CustomerDashboardView userData={userData} orders={orders} />
        )}
      </div>
    </div>
  );
}