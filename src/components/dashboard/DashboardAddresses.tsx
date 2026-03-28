'use client';

import { MapPin, CheckCircle2, Circle } from "lucide-react";
import AddAddressModal from "@/components/AddAddressModal";
import DeleteAddressButton from "@/components/DeleteAddressButton";
// FIX: Import Address from the main dashboard page to match AddAddressModal
import { Address } from '@/app/dashboard/page';
import toast from "react-hot-toast";

interface DashboardAddressesProps {
  userData: any;
  setUserData: (data: any) => void;
  onAddressAdded: (newAddr: Address) => void;
}

export default function DashboardAddresses({ userData, setUserData, onAddressAdded }: DashboardAddressesProps) {
  
  const handleAddressDeleted = (id: string) => {
    const filtered = userData?.addresses?.filter((a: Address) => a._id !== id);
    setUserData({ ...userData, addresses: filtered });
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      const res = await fetch('/api/user/address/set-default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }),
      });

      if (res.ok) {
        // Update local state: set the selected ID as default, and others to false
        const updatedAddresses = userData.addresses.map((addr: any) => ({
          ...addr,
          isDefault: addr._id === addressId
        }));
        
        setUserData({ ...userData, addresses: updatedAddresses });
        toast.success("DEFAULT ADDRESS UPDATED");
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("FAILED TO UPDATE DEFAULT");
    }
  };

  return (
    <div className="p-10">
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-3xl font-black uppercase tracking-tight">
          Saved <span className="text-[#b32d3a]">Addresses</span>
        </h2>
        <AddAddressModal onAddressAdded={onAddressAdded} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {userData?.addresses && userData.addresses.length > 0 ? (
          userData.addresses.map((addr: any, index: number) => (
            <div 
              key={addr._id || index} 
              className={`p-8 rounded-[2.5rem] border transition-all relative group ${
                addr.isDefault 
                ? 'bg-white border-[#b32d3a] shadow-xl shadow-[#b32d3a]/5' 
                : 'bg-stone-50 border-stone-100'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-black uppercase text-[10px] text-[#b32d3a] tracking-widest">
                      {addr.label}
                    </p>
                    {addr.isDefault && (
                      <span className="bg-[#b32d3a] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-tighter">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-bold text-slate-900">{addr.addressLine1}</p>
                  <p className="text-slate-500 text-sm font-medium">
                    {addr.city}, {addr.postcode}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <DeleteAddressButton 
                    addressId={addr._id || ''} 
                    // FIX: Arrow function with 0 arguments to match component prop signature
                    onDeleted={() => handleAddressDeleted(addr._id || '')} 
                  />
                </div>
              </div>

              {/* DEFAULT TOGGLE BUTTON */}
              <button 
                onClick={() => !addr.isDefault && handleSetDefault(addr._id)}
                className={`mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${
                  addr.isDefault ? 'text-emerald-500 cursor-default' : 'text-stone-400 hover:text-slate-900'
                }`}
              >
                {addr.isDefault ? (
                  <><CheckCircle2 size={14} /> Active Default</>
                ) : (
                  <><Circle size={14} /> Set as Default</>
                )}
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200">
            <MapPin className="mx-auto text-stone-200 mb-4" size={48} />
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">No addresses saved yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}