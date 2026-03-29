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
  const [mounted, setMounted] = useState(false); 
  const { setIsOpen: setOpenCart, cartCount } = useCart();
  
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === '/';

  const isStaff = session?.user?.role === 'admin' || session?.user?.role === 'chef';
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Prevent background scrolling when mobile menu is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!mounted) return <div className="h-20 bg-transparent fixed top-0 w-full z-[100]" />;

  return (
    <>
      {/* 1. HERO SECTION - Added overflow-x-hidden to prevent shimmy */}
      <section className={`relative w-full overflow-hidden transition-all duration-700 ${
        isHome ? 'h-[90vh] min-h-[600px] md:min-h-[700px]' : 'h-[50vh] md:h-[60vh] min-h-[350px] md:min-h-[450px]'
      }`}>
        <Image 
          src={isHome ? "/home-hero.png" : "/page-hero.png"}
          alt="Office Lunch Catering London" 
          fill 
          className="object-cover" 
          priority 
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 md:bg-black/10" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6 pt-20 md:pt-28">
          <h1 className="text-white text-4xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-2xl leading-[0.9]">
            {isHome ? (
              <>The Office <br /> <span className="text-[#b32d3a]">Lunch</span></>
            ) : (
              pathname.replace('/', '').replace(/-/g, ' ') || 'The Office Lunch'
            )}
          </h1>
        </div>
      </section>

      {/* 2. NAVIGATION BAR */}
      <nav className={`fixed top-0 inset-x-0 z-[100] transition-all duration-300 flex items-center h-20 md:h-24 ${
          scrolled ? 'bg-[#f5f0e6] shadow-lg border-b border-stone-200' : 'bg-transparent'
        }`}>
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 w-full flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex flex-col items-start gap-1 flex-shrink-0">
            <Link href="/" className="relative w-28 h-8 md:w-56 md:h-14 transition-transform hover:scale-105 active:scale-95"> 
              <Image src="/logo.png" alt="Logo" fill className="object-contain object-left" priority />
            </Link>
            
            <div className={`flex items-center gap-2 transition-colors ${scrolled ? 'text-slate-900' : 'text-white'}`}>
              <Phone className="w-3 h-3 text-[#b32d3a]" />
              <div className="flex items-center gap-1.5 text-[9px] md:text-[11px] font-black uppercase tracking-widest leading-none">
                <a href="tel:02082438814" className="hover:text-[#b32d3a] transition-colors">
                  020 8243 8814
                </a>
              </div>
            </div>
          </div>
          
          {/* Desktop Menu */}
          <div className={`hidden xl:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] ${
            scrolled ? 'text-slate-900' : 'text-white'
          }`}>
            <Link href="/" className="hover:text-[#b32d3a] transition-colors">Home</Link>
            <Link href="/menus" className="hover:text-[#b32d3a] transition-colors">Menus</Link>
            <Link href="/about" className="hover:text-[#b32d3a] transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-[#b32d3a] transition-colors">Contact Us</Link>
            
            {session ? (
              <button onClick={() => signOut()} className="hover:text-[#b32d3a] font-black uppercase whitespace-nowrap">
                Sign Out ({session.user?.name?.split(' ')[0]})
              </button>
            ) : (
              <Link href="/login" className="hover:text-[#b32d3a] whitespace-nowrap">Login</Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
            <button 
              onClick={() => setOpenCart(true)} 
              className={`relative group p-2 transition-transform active:scale-90 ${scrolled ? 'text-slate-900' : 'text-white'}`}
            >
              <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
              <span className="absolute top-1 right-1 bg-[#b32d3a] text-white text-[8px] md:text-[9px] font-black w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border-2 border-[#f5f0e6]">
                {cartCount}
              </span>
            </button>

            {/* Admin/User Buttons: Vertical Stack on Desktop */}
            <div className="hidden sm:flex flex-col items-stretch gap-1.5 min-w-[140px]">
              {isAdmin ? (
                <>
                  <Link href="/dashboard" className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all text-center justify-center shadow-sm">
                    <LayoutDashboard size={12} className="text-indigo-400" /> Dashboard
                  </Link>
                  <Link href="/admin/kitchen" className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all text-center justify-center shadow-sm">
                    <Utensils size={12} /> Kitchen
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/menus" className="flex items-center gap-2 bg-[#b32d3a] text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-red-800 transition-all text-center justify-center shadow-md">
                    <ShoppingBag size={12} /> Order Now
                  </Link>
                  {session && (
                    <Link href="/dashboard" className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg font-black text-[9px] uppercase tracking-widest transition-all text-center justify-center shadow-sm">
                      <LayoutDashboard size={12} className="text-indigo-400" /> Dashboard
                    </Link>
                  )}
                </>
              )}
            </div>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className={`xl:hidden p-2.5 rounded-xl transition-all active:scale-95 ${scrolled ? 'bg-slate-900 text-white' : 'bg-white/20 text-white backdrop-blur-sm'}`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* 3. MOBILE MENU OVERLAY */}
      <div className={`fixed inset-0 bg-[#0f172a] transition-all duration-500 z-[120] xl:hidden ${
        isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-full'
      }`}>
        <div className="relative h-full flex flex-col px-8 pt-28 pb-12 text-white overflow-y-auto overflow-x-hidden">
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-8 right-8 text-white/50 flex items-center gap-2 uppercase text-[10px] font-black tracking-[0.3em] hover:text-white"
          >
            Close <X className="w-5 h-5 text-[#b32d3a]" />
          </button>

          <div className="flex flex-col gap-6 mb-12">
            <span className="text-[#b32d3a] text-[10px] font-black uppercase tracking-[0.5em]">Navigation</span>
            <Link onClick={() => setIsOpen(false)} href="/" className="text-white text-5xl font-black uppercase tracking-tighter hover:text-[#b32d3a]">Home</Link>
            <Link onClick={() => setIsOpen(false)} href="/menus" className="text-white text-5xl font-black uppercase tracking-tighter hover:text-[#b32d3a]">Menus</Link>
            <Link onClick={() => setIsOpen(false)} href="/about" className="text-white text-5xl font-black uppercase tracking-tighter hover:text-[#b32d3a]">About Us</Link>
            <Link onClick={() => setIsOpen(false)} href="/contact" className="text-white text-5xl font-black uppercase tracking-tighter hover:text-[#b32d3a]">Contact Us</Link>
          </div>

          <div className="mt-auto space-y-4">
            {isStaff && (
              <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                <span className="text-amber-500 text-[9px] font-black uppercase tracking-[0.4em]">Staff Controls</span>
                <Link onClick={() => setIsOpen(false)} href="/dashboard" className="w-full bg-indigo-600 text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs">
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
                <Link onClick={() => setIsOpen(false)} href="/admin/kitchen" className="w-full bg-amber-500 text-black py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs">
                  <Utensils size={18} /> Kitchen Command
                </Link>
              </div>
            )}

            {!isAdmin && (
              <div className="flex flex-col gap-3">
                <Link onClick={() => setIsOpen(false)} href="/menus" className="w-full bg-[#b32d3a] text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs shadow-lg">
                  <ShoppingBag size={18} /> Order Now
                </Link>
                {session && (
                  <Link onClick={() => setIsOpen(false)} href="/dashboard" className="w-full bg-slate-800 text-white py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-[0.2em] text-xs">
                    <LayoutDashboard size={18} className="text-indigo-400" /> My Dashboard
                  </Link>
                )}
              </div>
            )}

            <div className="text-center pt-4">
              {session ? (
                <button onClick={() => { signOut(); setIsOpen(false); }} className="text-[#b32d3a] font-black uppercase tracking-[0.3em] text-[10px]">
                  Sign Out
                </button>
              ) : (
                <Link onClick={() => setIsOpen(false)} href="/login" className="text-white/60 font-black uppercase tracking-[0.3em] text-[10px] hover:text-white">
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}