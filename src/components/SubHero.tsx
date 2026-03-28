'use client';

import Image from 'next/image';

interface SubHeroProps {
  title: string;
  subtitle?: string;
}

export default function SubHero({ title, subtitle }: SubHeroProps) {
  // Logic to handle single-word vs multi-word titles gracefully
  const titleParts = title.split(' ');
  const firstWord = titleParts[0];
  const restOfTitle = titleParts.slice(1).join(' ');

  return (
    <section className="relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-slate-900">
      {/* Background Image with Priority Loading */}
      <Image 
        src="/page-hero.png" 
        alt={title} 
        fill 
        className="object-cover opacity-60 scale-105" // Subtle scale for depth
        priority 
      />
      
      {/* Overlays for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/20 z-10" />
      
      {/* Content Container */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-6 pt-32">
        <div className="flex flex-col items-center">
          <h1 className="text-white text-6xl md:text-8xl font-black uppercase tracking-tighter drop-shadow-2xl leading-[0.9]">
            {firstWord} 
            {restOfTitle && (
              <> <span className="text-[#b32d3a]">{restOfTitle}</span></>
            )}
          </h1>
          
          {/* Decorative Underline */}
          <div className="w-24 h-1.5 bg-[#b32d3a] mt-6 rounded-full" />
        </div>

        {subtitle && (
          <p className="mt-8 text-white/90 text-lg md:text-xl font-medium italic drop-shadow-md max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}