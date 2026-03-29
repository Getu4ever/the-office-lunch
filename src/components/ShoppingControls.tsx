'use client';

import { useSession } from 'next-auth/react';
import Cart from "./Cart";
import StickyBasket from "./StickyBasket";

export default function ShoppingControls() {
  const { data: session } = useSession();

  // If the user is an admin, we don't render the Cart or the StickyBasket
  if (session?.user?.role === 'admin') return null;

  return (
    <>
      <Cart />
      <StickyBasket />
    </>
  );
}