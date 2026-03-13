import Link from 'next/link';
import { ArrowRight, Utensils, Briefcase, Heart, GlassWater } from 'lucide-react';

const experiences = [
  {
    id: 'weddings',
    title: 'Wedding Galas',
    description: 'Bespoke culinary journeys for your most significant milestone. From intimate elopements to grand celebrations.',
    image: '/weddings.jpg', // Replace with your actual image paths
    icon: <Heart className="w-5 h-5" />,
    link: '/services/weddings'
  },
  {
    id: 'corporate',
    title: 'Corporate Excellence',
    description: 'Elevate your brand with sophisticated catering. Product launches, board meetings, and large-scale galas.',
    image: '/corporate.jpg',
    icon: <Briefcase className="w-5 h-5" />,
    link: '/services/corporate'
  },
  {
    id: 'private-dining',
    title: 'Private Dining',
    description: 'An exclusive restaurant experience in the comfort of your home. Curated menus by our executive chefs.',
    image: '/private.jpg',
    icon: <Utensils className="w-5 h-5" />,
    link: '/services/private-dining'
  },
  {
    id: 'pop-ups',
    title: 'Public Pop-Ups',
    description: 'Innovative street food and experimental concepts at London\'s most iconic venues.',
    image: '/popups.jpg',
    icon: <GlassWater className="w-5 h-5" />,
    link: '/services/pop-ups'
  }
];

export default function ExperiencesPage() {
  return (
    <main className="min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-8 max-w-7xl mx-auto">
        <span className="text-[#f06428] font-black uppercase tracking-[0.4em] text-[10px] block mb-4">Our Expertise</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-slate-900 leading-[0.9]">
          Curation <br /> <span className="text-slate-300">without</span> Limits.
        </h1>
        <p className="mt-8 text-slate-500 max-w-xl text-lg leading-relaxed">
          Whether it's an intimate dinner for ten or a gala for a thousand, we bring the same level of culinary precision and artistic flair to every table.
        </p>
      </section>

      {/* Experience Grid */}
<section className="px-8 pb-24 max-w-7xl mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
    {experiences.map((exp) => (
      <Link 
        href={exp.link} 
        key={exp.id}
        className="group relative h-[500px] overflow-hidden rounded-[2.5rem] bg-slate-900 block"
      >
        {/* ACTUAL IMAGE TAG */}
        <img 
          src={exp.image} 
          alt={exp.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Gradient Overlay - Darker at bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-10 w-full z-10">
          <div className="flex items-center gap-3 text-[#f06428] mb-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <div className="bg-[#f06428] text-white p-2 rounded-lg">
              {exp.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Service</span>
          </div>
          
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter mb-4">{exp.title}</h3>
          
          <p className="text-white/80 max-w-sm text-sm mb-6 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 transition-all duration-500 overflow-hidden">
            {exp.description}
          </p>
          
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest border-b border-white/40 pb-2 w-fit">
            Explore Experience <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Link>
    ))}
  </div>
</section>

      {/* Final CTA */}
      <section className="bg-slate-900 py-24 px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-8">
          Ready to design your <span className="text-[#f06428]">Experience?</span>
        </h2>
        <Link 
          href="/book" 
          className="inline-flex items-center gap-3 bg-[#f06428] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-xl shadow-orange-900/20"
        >
          Begin the Journey <ArrowRight size={20} />
        </Link>
      </section>
    </main>
  );
}