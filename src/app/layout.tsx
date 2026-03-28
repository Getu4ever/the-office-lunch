import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import AuthProvider from "@/components/AuthProvider";
import Cart from "@/components/Cart";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import StickyBasket from "@/components/StickyBasket";
import PageTransition from '@/components/PageTransition';
import LiveChat from "@/components/LiveChat";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The Office Lunch | Premium Office Catering Richmond",
  description: "Fresh, chef-prepared corporate catering delivered from our Richmond kitchen straight to your boardroom.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ 
          //@ts-ignore
          "--brand-red": "#b32d3a", 
          "--brand-cream": "#f5f0e6" 
        }}
        suppressHydrationWarning={true}
      >
        {/* Place LiveChat first so it loads independently of transitions */}
        <LiveChat />

        <AuthProvider>
          <CartProvider>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#0f172a',
                  color: '#fff',
                  borderRadius: '1rem',
                  fontSize: '11px',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  padding: '16px 24px',
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                },
                success: {
                  iconTheme: {
                    primary: '#b32d3a',
                    secondary: '#fff',
                  },
                },
              }}
            />
            
            <Navbar />
            
            <main className="min-h-screen">
              <PageTransition>
                {children} 
              </PageTransition>
            </main>

            <Footer />
            
            <Cart />
            <StickyBasket />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}