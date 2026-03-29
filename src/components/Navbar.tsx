'use client';
import { Phone, ShoppingCart, Menu, X, ShoppingBag, LayoutDashboard, ChevronRight, Utensils } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession, signOut } from 'next-auth/react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setIsOpen: setOpenCart, cartCount } = useCart();
  
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const isStaff = session?.user?.role === 'admin' || session?.user?.role === 'chef';
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <section className={`relative w-full overflow-hidden transition-all duration-700 ${isHome ? 'h-[90vh] min-h-[700px]' : 'h-[60vh] min-h-[450px]'}`}>
        <Image src={isHome ? "/home-hero.png" : "/page-hero.png"} alt="Hero" fill className="object-cover" priority />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent z-10" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-28">
          <h1 className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter">
            {isHome ? <>The Office <br /> <span className="text-[#b32d3a]">Lunch</span></> : pathname.replace('/', '').replace(/-/g, ' ')}
          </h1>
        </div>
      </section>

      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-[#f5f0e6] shadow-md border-b border-stone-200' : 'bg-transparent border-b border-white/10'}`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 w-full flex items-center justify-between py-4">
          
          {/* LOGO AREA */}
          <div className="flex flex-col items-center gap-1">
            <Link href="/" className="relative w-32 h-8 md:w-64 md:h-16"> 
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </Link>
            <div className={`flex items-center gap-2 text-[10px] md:text-[12px] font-black uppercase ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              <Phone className="w-3 h-3 text-[#b32d3a]" />
              <a href="tel:02082438814">020 8243 8814</a>
            </div>
          </div>
          
          {/* DESKTOP NAV - Forced xl:flex */}
          <div className={`hidden xl:flex items-center gap-8 text-[12px] font-black uppercase tracking-[0.2em] ${scrolled ? 'text-slate-900' : 'text-white'}`}>
            <Link href="/" className="hover:text-[#b32d3a]">Home</Link>
            <Link href="/menus" className="hover:text-[#b32d3a]">Menus</Link>
            <Link href="/about" className="hover:text-[#b32d3a]">About Us</Link>
            <Link href="/contact" className="hover:text-[#b32d3a]">Contact Us</Link>
            {session ? (
              <button onClick={() => signOut()} className="hover:text-[#b32d3a]">Sign Out</button>
            ) : (
              <Link href="/login" className="hover:text-[#b32d3a]">Login/register</Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            {isStaff && (
              <Link href="/admin/kitchen" className="hidden sm:flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-full font-black text-[10px] uppercase">
                <Utensils className="w-4 h-4" /> Kitchen
              </Link>
            )}

            <div onClick={() => setOpenCart(true)} className={`cursor-pointer ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              <ShoppingCart className="w-7 h-7" />
            </div>

            {/* DESKTOP BUTTONS - Forced lg:flex */}
            <div className="hidden lg:flex items-center gap-3">
              {isAdmin ? (
                <Link href="/dashboard" className="bg-slate-900 text-white px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4 text-indigo-400" /> Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/menus" className="bg-[#b32d3a] text-white px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> Order Now
                  </Link>
                  {session && (
                    <Link href="/dashboard" className="bg-slate-800 text-white px-6 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest flex items-center gap-2">
                      <LayoutDashboard className="w-4 h-4 text-indigo-400" /> My Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* MOBILE TRIGGER - Forced xl:hidden */}
            <button onClick={() => setIsOpen(!isOpen)} className={`xl:hidden p-2 rounded-lg ${scrolled ? 'bg-slate-900 text-white' : 'bg-white/20 text-white'}`}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU - Forced xl:hidden */}
      <div className={`fixed inset-0 bg-[#0f172a] z-[110] transition-transform duration-500 xl:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-10 pt-32">
          <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white uppercase text-[10px] font-black flex items-center gap-2">
            Close <X className="w-6 h-6 text-[#b32d3a]" />
          </button>
          <div className="flex flex-col gap-8">
            <Link onClick={() => setIsOpen(false)} href="/" className="text-white text-4xl font-black uppercase">Home</Link>
            <Link onClick={() => setIsOpen(false)} href="/menus" className="text-white text-4xl font-black uppercase">Menus</Link>
            <Link onClick={() => setIsOpen(false)} href="/dashboard" className="text-white text-4xl font-black uppercase">{isAdmin ? 'Admin Dashboard' : 'My Dashboard'}</Link>
          </div>
        </div>
      </div>
    </>
  );
}