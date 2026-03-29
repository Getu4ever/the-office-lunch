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

  // Role Logic
  const isStaff = session?.user?.role === 'admin' || session?.user?.role === 'chef';
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      {/* 1. DYNAMIC HERO SECTION */}
      <section className={`relative w-full overflow-hidden transition-all duration-700 ${
        isHome ? 'h-[90vh] min-h-[700px]' : 'h-[60vh] min-h-[450px]'
      }`}>
        <Image 
          src={isHome ? "/home-hero.png" : "/page-hero.png"}
          alt="Office Lunch Catering London" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 pt-28">
          <h1 className="text-white text-5xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-2xl">
            {isHome ? (
              <>The Office <br /> <span className="text-[#b32d3a]">Lunch</span></>
            ) : (
              pathname.replace('/', '').replace(/-/g, ' ') || 'The Office Lunch'
            )}
          </h1>
        </div>
      </section>

      {/* 2. STICKY NAVIGATION */}
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 flex items-center ${
          scrolled ? 'bg-[#f5f0e6] shadow-md border-b border-stone-200' : 'bg-transparent border-b border-white/10'
        }`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 w-full flex items-center justify-between py-2 md:py-4">
          
          <div className="flex flex-col items-center gap-1 flex-shrink-0">
            <Link href="/" className="relative w-32 h-8 md:w-64 md:h-16 transition-transform hover:scale-105"> 
              <Image src="/logo.png" alt="Logo" fill className="object-contain" priority />
            </Link>
            
            <div className={`flex items-center gap-2 md:gap-3 transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#b32d3a]" />
              <div className="flex items-center gap-1.5 text-[10px] md:text-[12px] font-black uppercase tracking-widest leading-none">
                <span className={`hidden xs:inline ${scrolled ? 'text-slate-400' : 'text-white/60'}`}>Call:</span>
                <a href="tel:02082438814" className="font-black tracking-tight leading-none hover:text-[#b32d3a]">
                  020 8243 8814
                </a>
              </div>
            </div>
          </div>
          
          {/* DESKTOP LINKS - Reverted to xl:flex to prevent two-line wrapping */}
          <div className={`hidden xl:flex items-center gap-6 xl:gap-8 text-[11px] xl:text-[12px] font-black uppercase tracking-[0.2em] transition-colors duration-300 ${
            scrolled ? 'text-slate-900' : 'text-white'
          }`}>
            <Link href="/" className="hover:text-[#b32d3a]">Home</Link>
            <Link href="/menus" className="hover:text-[#b32d3a]">Menus</Link>
            <Link href="/about" className="hover:text-[#b32d3a]">About Us</Link>
            <Link href="/contact" className="hover:text-[#b32d3a]">Contact Us</Link>
            
            {session ? (
              <button onClick={() => signOut()} className="hover:text-[#b32d3a] font-black uppercase">
                Sign Out ({session.user?.name?.split(' ')[0]})
              </button>
            ) : (
              <Link href="/login" className="hover:text-[#b32d3a]">Login/Register</Link>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
            {isStaff && (
              <Link 
                href="/admin/kitchen" 
                className="hidden sm:flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shadow-lg hover:scale-105"
              >
                <Utensils className="w-3 h-3 md:w-3.5 md:h-3.5" />
                Kitchen
              </Link>
            )}
            <div 
              onClick={() => setOpenCart(true)} 
              className={`relative cursor-pointer group px-1 md:px-2 transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}
            >
              <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
              <span className="absolute -top-1 -right-0 bg-[#b32d3a] text-white text-[8px] md:text-[9px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border-2 border-[#f5f0e6]">
                {cartCount}
              </span>
            </div>

            {/* ACTION BUTTONS - Restored to lg:flex */}
            <div className="hidden lg:flex items-center gap-3">
              {isAdmin ? (
                <Link href="/dashboard" className="group flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all hover:bg-slate-800 shadow-lg active:scale-95">
                  <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/menus" className="group flex items-center gap-2 bg-[#b32d3a] text-white px-5 py-2.5 rounded-full font-black text-[11px] uppercase tracking-widest transition-all hover:bg-red-800 shadow-lg active:scale-95">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Order Now
                  </Link>
                  {session && (
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-full font-black text-[9px] uppercase tracking-widest transition-all shadow-md hover:scale-105"
                    >
                      <LayoutDashboard className="w-3 h-3 text-indigo-400" />
                      Account
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* MOBILE TRIGGER - Adjusted to lg:hidden */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`lg:hidden p-2 rounded-xl transition-all ${scrolled ? 'bg-slate-900 text-white' : 'bg-white/20 text-white'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 3. MOBILE MENU */}
      <div className={`fixed inset-0 bg-[#0f172a] transition-all duration-500 z-[110] lg:hidden ${
        isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
      }`}>
        <div className="relative h-full flex flex-col px-10 pt-32 pb-12">
          <button onClick={() => setIsOpen(false)} className="absolute top-8 right-8 text-white/50 flex items-center gap-2 uppercase text-[10px] font-black tracking-[0.3em]">
            Close <X className="w-5 h-5 text-[#b32d3a]" />
          </button>

          <div className="flex flex-col gap-6">
            <span className="text-[#b32d3a] text-[10px] font-black uppercase tracking-[0.5em]">Navigation</span>
            {[
              { label: 'Home', path: '/' },
              { label: 'Menus', path: '/menus' },
              { label: 'About Us', path: '/about' },
              { label: 'Contact Us', path: '/contact' }
            ].map((link) => (
              <Link key={link.path} onClick={() => setIsOpen(false)} href={link.path} className="text-white text-4xl font-black uppercase tracking-tighter flex items-center justify-between">
                {link.label}
                <ChevronRight className="w-6 h-6 text-[#b32d3a]" />
              </Link>
            ))}

            {isStaff && (
              <Link 
                onClick={() => setIsOpen(false)} 
                href="/admin/kitchen"
                className="bg-amber-500 text-black p-5 rounded-2xl flex items-center justify-between font-black uppercase text-2xl mt-4"
              >
                Kitchen Command <Utensils className="w-8 h-8" />
              </Link>
            )}
          </div>

          <div className="mt-auto space-y-4">
            {isAdmin ? (
               <Link onClick={() => setIsOpen(false)} href="/dashboard" className="w-full bg-indigo-600 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-sm">
               <LayoutDashboard className="w-5 h-5" /> Admin Dashboard
             </Link>
            ) : (
              <>
                {session && (
                  <Link onClick={() => setIsOpen(false)} href="/dashboard" className="w-full bg-slate-800 text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-sm">
                    <LayoutDashboard className="w-5 h-5 text-indigo-400" /> My Dashboard
                  </Link>
                )}
                <Link onClick={() => setIsOpen(false)} href="/menus" className="w-full bg-[#b32d3a] text-white py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-sm">
                  <ShoppingBag className="w-5 h-5" /> Order Now
                </Link>
              </>
            )}
            
            {session ? (
              <button onClick={() => { signOut(); setIsOpen(false); }} className="w-full py-4 text-[#b32d3a] font-black uppercase tracking-widest text-[10px]">Sign Out</button>
            ) : (
              <Link onClick={() => setIsOpen(false)} href="/login" className="w-full block text-center py-4 text-white font-black uppercase tracking-widest text-[10px]">Login / Register</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}