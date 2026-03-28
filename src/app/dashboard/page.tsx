'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image";
import { User as UserIcon, Shield, Camera } from "lucide-react";
import { CldUploadWidget } from 'next-cloudinary';
import toast from 'react-hot-toast';

import DashboardSkeleton from "@/components/DashboardSkeleton";
import AdminDashboardView from "@/components/dashboard/AdminDashboardView";
import CustomerDashboardView from "@/components/dashboard/CustomerDashboardView";

/**
 * DASHBOARD PAGE
 * Priority Header with dynamic "ADMINISTRATOR" text and editable profile image.
 */

export default function DashboardPage() {
  const { data: session, status, update } = useSession();
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

  // Handle Profile Image Update via Cloudinary
  const handleImageUpload = async (result: any) => {
    if (result.event === "success") {
      const newImageUrl = result.info.secure_url;
      
      try {
        // This matches the PATCH route logic you provided
        const res = await fetch('/api/user/update-profile', { 
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: newImageUrl })
        });

        if (res.ok) {
          setUserData((prev: any) => ({ ...prev, image: newImageUrl }));
          // Update the NextAuth session so the UI stays in sync globally
          await update({ image: newImageUrl });
          toast.success("PROFILE IMAGE UPDATED");
        } else {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update");
        }
      } catch (err: any) {
        toast.error(err.message || "FAILED TO SAVE IMAGE");
      }
    }
  };

  if (status === 'loading' || loading) return <DashboardSkeleton />;

  return (
    <div className="min-h-screen bg-[#f5f0e6] pt-32 pb-20 px-4 md:px-12">
      <div className="max-w-[1440px] mx-auto">
        
        {/* PRIORITY HEADER */}
        <div className="bg-white rounded-[3rem] p-8 md:p-10 shadow-sm border border-stone-200 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          {/* Decorative background shield */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
            <Shield size={200} />
          </div>

          {/* EDITABLE IMAGE CIRCLE */}
          <CldUploadWidget 
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} 
            onSuccess={handleImageUpload}
          >
            {({ open }) => (
              <button 
                onClick={() => open()}
                className="group relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-[#b32d3a]/10 shadow-md shrink-0 transition-transform hover:scale-105 active:scale-95 bg-stone-100"
              >
                {userData?.image ? (
                  <Image src={userData.image} alt="Profile" fill className="object-cover" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <UserIcon className="text-stone-300" size={40} />
                  </div>
                )}
                {/* Hover Camera Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </button>
            )}
          </CldUploadWidget>

          <div className="text-center md:text-left flex-1">
            <p className="text-[#b32d3a] font-black uppercase text-[10px] tracking-[0.3em] mb-1">Welcome Back,</p>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-3">
              {session?.user?.name}
            </h1>
            
            {/* UPDATED ROLE BADGE */}
            <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest">
              <Shield size={12} className="text-[#b32d3a]" />
              {session?.user?.role === 'admin' ? 'ADMINISTRATOR' : 'CUSTOMER'}
            </div>
          </div>
        </div>

        {/* View Selection */}
        {session?.user?.role === 'admin' ? (
          <AdminDashboardView userData={userData} orders={orders} />
        ) : (
          <CustomerDashboardView userData={userData} orders={orders} />
        )}
      </div>
    </div>
  );
}