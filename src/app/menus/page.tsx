'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MenuPage() {
  const [activeTab, setActiveTab] = useState('canapes');
  const [isFusion, setIsFusion] = useState(false);

  const menuCategories = [
    { id: 'canapes', label: 'Canapés' },
    { id: 'small-plates', label: 'Small Plates' },
    { id: 'grand-platters', label: 'Grand Platters' },
  ];

  const menuItems = {
    canapes: [
      { 
        title: "Classic Jollof Rice Balls", 
        traditional: "The heart of West African celebration. Long-grain parboiled rice steamed in a rich, spiced tomato and red pepper base.", 
        fusion: "Smoked Jollof risotto sphere with a parmesan crust and scotch bonnet jam.",
        price: "£4.50 pp",
        image: "/menu-canapes-0.jpg"
      },
      { 
        title: "Traditional Beef Suya", 
        traditional: "Authentic street-style skewers. Thinly sliced beef coated in 'Kuli-Kuli' (groundnut spice) and flash-grilled over open flames.", 
        fusion: "Wagyu beef marinated in peanut-spiced yaji, served with pickled red onions and micro-greens.",
        price: "£6.00 pp",
        image: "/menu-canapes-1.jpg"
      },
      { 
        title: "Hand-Battered Okra", 
        traditional: "Crispy young okra pods, a staple snack found in bustling local markets, seasoned with sea salt and dry pepper.", 
        fusion: "Lightly battered young okra with a Togarashi-Yaji dust and lime-ginger emulsion.",
        price: "£4.00 pp",
        image: "/menu-canapes-2.jpg"
      }
    ],
    'small-plates': [
      { 
        title: "Sweet Fried Plantain (Dodo)", 
        traditional: "Perfectly ripened yellow plantains, sliced and golden-fried to unlock their natural caramel sweetness.", 
        fusion: "Hand-rolled sweet plantain gnocchi in a brown butter and sage reduction with crumbled feta.",
        price: "£14.00",
        image: "/menu-small-plates-0.jpg"
      },
      { 
        title: "Authentic Egusi & Yam", 
        traditional: "Slow-simmered melon seed soup with spinach and traditional seasonings, paired with smooth, pounded yam.", 
        fusion: "Toasted melon seed tuile, wilted spinach puree, and pan-seared sea bass over yam fondant.",
        price: "£18.00",
        image: "/menu-small-plates-1.jpg"
      },
      { 
        title: "Ofada Rice & Ayamase", 
        traditional: "Unpolished designer rice served with the legendary 'Designer Stew'—a spicy, bleached palm oil and green pepper relish.", 
        fusion: "48-hour braised beef short rib with a green bell pepper reduction and crispy puffed rice.",
        price: "£21.00",
        image: "/menu-small-plates-2.jpg"
      }
    ],
    'grand-platters': [
      { 
        title: "The Sunday Heritage Roast", 
        traditional: "A celebratory spread of oven-roasted chicken, classic Jollof rice, fried plantain, and seasoned steamed vegetables.", 
        fusion: "Spiced spatchcock guinea fowl, truffle-infused Jollof, and honey-glazed heritage carrots.",
        price: "£65.00 (Serves 2)",
        image: "/menu-grand-platters-0.jpg"
      },
      { 
        title: "Fisherman’s Soup Platter", 
        traditional: "A bounty of the coast. Fresh catch of the day, jumbo prawns, and local shellfish in a spicy, aromatic broth.", 
        fusion: "Lobster tail, jumbo prawns, and scallops in a silky okra-infused saffron bisque.",
        price: "£85.00 (Serves 2)",
        image: "/menu-grand-platters-1.jpg"
      },
      { 
        title: "Yaji-Spiced Lamb Chops", 
        traditional: "Tender lamb chops rubbed with a potent blend of northern spices and grilled to succulent perfection.", 
        fusion: "Full rack of lamb with a pistachio-yaji crust, served with smashed yam and red wine jus.",
        price: "£75.00 (Serves 2)",
        image: "/menu-grand-platters-2.jpg"
      }
    ]
  };

  return (
    <main className="bg-white min-h-screen text-[#0f172a]">    

      {/* 2. HEADER SECTION */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center">
        <span className="text-[#f06428] font-black uppercase tracking-[0.4em] text-[10px] block mb-4">The Traditional Archive</span>
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-12">The <span className="text-[#f06428]">Roots.</span></h1>
        
        {/* FUSION TOGGLE */}
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-full mb-16">
          <button 
            onClick={() => setIsFusion(false)}
            className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${!isFusion ? 'bg-[#0f172a] shadow-md text-white' : 'text-slate-400'}`}
          >
            Traditional
          </button>
          <button 
            onClick={() => setIsFusion(true)}
            className={`px-8 py-3 rounded-full font-black uppercase tracking-widest text-[10px] transition-all ${isFusion ? 'bg-[#f06428] shadow-md text-white' : 'text-slate-400'}`}
          >
            The Fusion
          </button>
        </div>

        {/* CLICKABLE CATEGORY TABS */}
        <div className="flex justify-center gap-8 border-b border-slate-100 mb-16 overflow-x-auto whitespace-nowrap">
          {menuCategories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`pb-4 font-black uppercase tracking-widest text-[10px] border-b-2 transition-all ${activeTab === cat.id ? 'border-[#f06428] text-[#f06428]' : 'border-transparent text-slate-400'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. EDITORIAL GALLERY GRID */}
      <section className="px-6 pb-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {(menuItems[activeTab as keyof typeof menuItems] || []).map((item, i) => (
            <div key={i} className="group border-b border-slate-100 pb-12 flex flex-col md:flex-row gap-8 items-start">
              <div className="w-full md:w-48 h-48 bg-slate-100 rounded-3xl overflow-hidden shrink-0">
                 <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight leading-none">{item.title}</h3>
                  <span className="text-[#f06428] font-black text-sm">{item.price}</span>
                </div>
                <p className="text-slate-500 font-medium leading-relaxed italic mb-4">
                  {isFusion ? item.fusion : item.traditional}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${isFusion ? 'bg-orange-50 border-orange-200 text-[#f06428]' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    {isFusion ? 'Modern Interpretation' : 'Original Roots'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}