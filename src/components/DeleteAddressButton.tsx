'use client';

import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface DeleteAddressButtonProps {
  addressId: string;
  onDeleted: () => void; // Expects zero arguments
}

export default function DeleteAddressButton({ addressId, onDeleted }: DeleteAddressButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    
    setIsDeleting(true);
    try {
      // Note: Ensure your API route matches this path exactly
      const res = await fetch('/api/user/address/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }),
      });

      if (res.ok) {
        toast.success("ADDRESS DELETED");
        onDeleted(); // Triggers the parent refresh
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("DELETE FAILED");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={isDeleting} 
      className="p-3 text-stone-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50"
    >
      <Trash2 size={18} />
    </button>
  );
}