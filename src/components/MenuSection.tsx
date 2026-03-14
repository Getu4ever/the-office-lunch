'use client';

import { Plus, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const DISHES = [
  {
    id: 1,
    name: 'Smoked Jollof Box',
    description: 'Long-grain rice infused with scotch bonnet, wood-smoke aroma, and signature spices.',
    price: 18.50,
    image: '/smoked_jollof_box.png',
    tag: 'Bestseller',
    category: 'Mains'
  },
  {
    id: 2,
    name: 'Honey Glazed Plantain',
    description: 'Sweet, ripened plantain rounds caramelized with organic honey and a hint of sea salt.',
    price: 8.00,
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?q=80&w=800', 
    tag: 'Vegan',
    category: 'Sides'
  },
  {
    id: 3,
    name: 'Suya Spiced Wagyu',
    description: 'Premium Wagyu beef strips crusted in nutty kulikuli spice and flame-grilled to perfection.',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
    tag: 'Premium',
    category: 'Mains'
  },
  {
    id: 4,
    name: 'Hibiscus Zobo Spritz',
    description: 'Traditional dried hibiscus flowers brewed with ginger, clove, and sparkling botanicals.',
    price: 6.50,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?q=80&w=800',
    tag: 'New',
    category: 'Drinks'
  },
  {
    id: 5,
    name: 'Sticky Toffee Pudding',
    description: 'Rich date sponge soaked in a warm salted caramel sauce, served with velvet cream.',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800',
    tag: 'Warm',
    category: 'Desserts'
  },
  {
    id: 6,
    name: 'Kachumbari Salad',
    description: 'A refreshing medley of diced tomatoes, onions, cilantro, and lemon-chili dressing.',
    price: 7.00,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800',
    tag: 'Fresh',
    category: 'Sides'
  },
  {
    id: 7,
    name: 'Passionfruit Mojito',
    description: 'Fresh passionfruit pulp muddled with mint, lime, and a splash of cane sugar soda.',
    price: 7.50,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800',
    tag: 'Cooler',
    category: 'Drinks'
  },
  {
    id: 8,
    name: 'Dark Chocolate Fondant',
    description: 'Valrhona chocolate cake with a molten center, paired with seasonal berry compote.',
    price: 11.00,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=800',
    tag: 'Luxury',
    category: 'Desserts'
  }
];

const CATEGORIES = ['All', 'Mains', 'Sides', 'Desserts', 'Drinks'];

export default function MenuSection() {
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [flyingItem, setFlyingItem] = useState<{ x: number; y: number; img: string } | null>(null);

  const filteredDishes = activeCategory === 'All' 
    ? DISHES 
    : DISHES.filter(dish => dish.category === activeCategory);

  const handleAddToCart = (e: React.MouseEvent, dish: any) => {
    const startX = e.clientX;
    const startY = e.clientY;

    setFlyingItem({ x: startX, y: startY, img: dish.image });
    addToCart(dish);

    setTimeout(() => {
      setFlyingItem(null);
    }, 900);
  };

  return (
    <section className="py-12 px-6 bg-white relative">
      <style jsx global>{`
        @keyframes flyToCart {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          20% { transform: translate(-50%, -50%) scale(1.4) rotate(-15deg); }
          100% { left: 100vw; top: 50vh; transform: translate(-100%, -50%) scale(0) rotate(90deg); opacity: 0; }
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {flyingItem && (
        <div
          className="fixed pointer-events-none z-[9999] w-24 h-24 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-4 border-white"
          style={{
            left: flyingItem.x,
            top: flyingItem.y,
            animation: 'flyToCart 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards'
          }}
        >
          <img src={flyingItem.img} className="w-full h-full object-cover" alt="flying" />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Signature Dishes</h2>
            <p className="text-slate-500 font-medium mt-3">Ready for immediate delivery or event booking.</p>
          </div>

          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar max-w-full">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-white text-orange-600 shadow-sm scale-105'
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredDishes.map((dish) => (
            <div key={dish.id} className="group relative animate-in fade-in zoom-in duration-500">
              <div className="relative h-[400px] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-slate-100 bg-slate-50">
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                    {dish.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                    onClick={(e) => handleAddToCart(e, dish)}
                    className="bg-orange-600 text-white p-5 rounded-full shadow-2xl transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-95 flex items-center gap-2"
                   >
                      <Plus className="w-6 h-6 stroke-[3px]" />
                      <span className="font-black uppercase text-xs tracking-widest pr-2">Add to Basket</span>
                   </button>
                </div>
              </div>

              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-xl text-slate-900 tracking-tight leading-tight">{dish.name}</h3>
                  <span className="font-black text-orange-600 text-lg">£{dish.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
                  ))}
                  <span className="text-[10px] font-bold text-slate-400 ml-2 uppercase tracking-tighter">Verified Order</span>
                </div>
                {/* Description added here */}
                <p className="text-slate-500 text-xs leading-relaxed font-medium line-clamp-2">
                  {dish.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}