'use client';

import React, { useState } from 'react';
import { Expand, Instagram, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');

  const photos = [
    { id: 1, src: '/weddings.jpg', category: 'weddings', size: 'large', title: 'Grand Gala' },
    { id: 2, src: '/menu-canapes-0.jpg', category: 'food', size: 'small', title: 'Jollof Spheres' },
    { id: 3, src: '/corporate.jpg', category: 'corporate', size: 'medium', title: 'City Awards' },
    { id: 4, src: '/private.jpg', category: 'private', size: 'large', title: 'Chef’s Table' },
    { id: 5, src: '/menu-small-plates-1.jpg', category: 'food', size: 'medium', title: 'Egusi Fusion' },
    { id: 6, src: '/popups.jpg', category: 'events', size: 'small', title: 'Market Vibes' },
    { id: 7, src: '/banner03.jpg', category: 'food', size: 'large', title: 'Heritage Plating' },
    { id: 8, src: '/banner04.jpg', category: 'weddings', size: 'medium', title: 'Tablescapes' },
  ];

  const filteredPhotos = filter === 'all' ? photos : photos.filter(p => p.category === filter);

  return (
    <main className="bg-white min-h-screen">
      {/* Header Section */}
      <section className="pt-24 pb-12 px-8 max-w-7xl mx-auto text-center">
        <span className="text-[#f06428] font-black uppercase tracking-[0.4em] text-[10px] block mb-4">Visual Storytelling</span>
        <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] mb-12">
          The <br /> <span className="text-slate-200">Portfolio.</span>
        </h1>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16">
          {['all', 'food', 'weddings', 'corporate', 'private'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] pb-2 border-b-2 transition-all ${
                filter === cat ? 'border-[#f06428] text-[#f06428]' : 'border-transparent text-slate-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry-ish Grid */}
      <section className="px-4 md:px-8 pb-24 max-w-[1600px] mx-auto">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredPhotos.map((photo) => (
            <div 
              key={photo.id} 
              className="relative group overflow-hidden rounded-[2rem] bg-slate-100 break-inside-avoid"
            >
              <img 
                src={photo.src} 
                alt={photo.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-[#f06428]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-2">{photo.category}</span>
                <h3 className="text-white text-3xl font-black uppercase tracking-tighter leading-none mb-4">{photo.title}</h3>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#f06428]">
                  <Expand size={18} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social CTA */}
      <section className="bg-slate-900 py-24 px-8 rounded-t-[4rem] text-center">
        <h2 className="text-white text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
          Follow the <span className="text-[#f06428]">Flavour.</span>
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <a 
            href="https://instagram.com" 
            className="flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-[#f06428] hover:text-white transition-all"
          >
            <Instagram size={20} /> Instagram
          </a>
          <Link 
            href="/book" 
            className="flex items-center gap-3 border border-white/20 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all"
          >
            Work with us <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  );
}