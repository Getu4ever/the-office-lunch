'use client';

import { useState, useEffect } from 'react';
import { X, Home, Briefcase, Phone, MapPin, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddAddressModalProps {
  onAddressAdded: (address: any) => void;
  editData?: any;
  onClose?: () => void;
}

export default function AddAddressModal({ onAddressAdded, editData, onClose }: AddAddressModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form States
  const [label, setLabel] = useState('HOME');
  const [addressLine1, setAddressLine1] = useState('');
  const [postcode, setPostcode] = useState('');
  const [telephone, setTelephone] = useState('');

  // Sync state when editData changes
  useEffect(() => {
    if (editData) {
      setLabel(editData.label || 'HOME');
      setAddressLine1(editData.addressLine1 || '');
      setPostcode(editData.postcode || '');
      setTelephone(editData.telephone || '');
      setIsOpen(true);
    }
  }, [editData]);

  const handleClose = () => {
    setIsOpen(false);
    // Important: Clear state so next "Add New" starts fresh
    setAddressLine1('');
    setPostcode('');
    setTelephone('');
    setLabel('HOME');
    if (onClose) onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!addressLine1.trim() || !postcode.trim() || !telephone.trim()) {
      return toast.error("PLEASE FILL ALL REQUIRED FIELDS");
    }

    setIsLoading(true);

    const payload = {
      addressId: editData?._id, // Renamed to addressId for better API compatibility
      label,
      addressLine1,
      postcode: postcode.toUpperCase().trim(),
      telephone: telephone.trim(),
      isDefault: editData ? editData.isDefault : false
    };

    try {
      // Logic: If we have editData, we use PATCH, otherwise POST
      const method = editData?._id ? 'PATCH' : 'POST';
      const response = await fetch('/api/user/address', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save");
      }

      // Success logic
      onAddressAdded(data); 
      toast.success(editData ? "ADDRESS UPDATED" : "ADDRESS ADDED");
      handleClose();
    } catch (error: any) {
      console.error("Save Error:", error);
      toast.error(error.message || "COULD NOT SAVE ADDRESS");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Only show "Add New" button if we aren't currently editing */}
      {!editData && (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#b32d3a] transition-all shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[3rem] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-2xl font-black uppercase tracking-tighter">
                {editData ? 'Edit' : 'Add'} <span className="text-[#b32d3a]">Address</span>
              </h3>
              <button 
                onClick={handleClose} 
                className="text-slate-400 hover:text-slate-600 hover:rotate-90 transition-all p-2"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Type Selector */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'HOME', icon: Home },
                  { id: 'OFFICE', icon: Briefcase }
                ].map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setLabel(type.id)}
                    className={`flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-[10px] tracking-widest border-2 transition-all ${
                      label === type.id 
                        ? 'border-[#b32d3a] bg-[#b32d3a]/5 text-[#b32d3a]' 
                        : 'border-slate-100 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <type.icon size={16} /> {type.id}
                  </button>
                ))}
              </div>

              <div className="space-y-4">
                {/* Street Address */}
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="text"
                    placeholder="STREET ADDRESS"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus:outline-none focus:border-[#b32d3a]/30 transition-colors"
                  />
                </div>

                {/* Postcode */}
                <input
                  type="text"
                  placeholder="POSTCODE"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 text-sm font-bold focus:outline-none focus:border-[#b32d3a]/30 transition-colors"
                />

                {/* Telephone */}
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input
                    type="tel"
                    placeholder="TELEPHONE NUMBER"
                    value={telephone}
                    onChange={(e) => setTelephone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-14 pr-6 py-5 text-sm font-bold focus:outline-none focus:border-[#b32d3a]/30 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] hover:bg-[#b32d3a] disabled:bg-slate-400 transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} /> SAVING...
                  </>
                ) : (
                  'SAVE ADDRESS'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
    </svg>
  );
}