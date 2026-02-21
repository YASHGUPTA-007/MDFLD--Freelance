import React from 'react';
import { Sparkles, Zap } from 'lucide-react';

interface HorizontalScrollSectionProps {
  horizontalSectionRef: React.RefObject<HTMLDivElement | null>;
  horizontalTrackRef: React.RefObject<HTMLDivElement | null>;
}

export default function HorizontalScrollSection({ horizontalSectionRef, horizontalTrackRef }: HorizontalScrollSectionProps) {
  const items = [
    { name: "Mercurial Vapor 15", brand: "Nike", price: 285, size: "US 10", img: "photo-1511886929837-354d827aae26" },
    { name: "Predator Edge", brand: "Adidas", price: 250, size: "US 9.5", img: "photo-1579952363873-27f3bade9f55" },
    { name: "Future Z 1.4", brand: "Puma", price: 220, size: "US 11", img: "photo-1600250395358-154df64188b0" },
    { name: "Phantom GT2", brand: "Nike", price: 275, size: "US 10.5", img: "photo-1560272564-c83b66b1ad12" },
    { name: "Copa Sense+", brand: "Adidas", price: 300, size: "US 9", img: "photo-1579952363873-27f3bade9f55" }
  ];

  return (
    <section ref={horizontalSectionRef} className="h-screen bg-gradient-to-br from-[#0a0a0a] to-[#111] flex items-center overflow-hidden border-y border-white/10 relative">
      <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `linear-gradient(30deg, #00d4b6 12%, transparent 12.5%, transparent 87%, #00d4b6 87.5%), linear-gradient(150deg, #00d4b6 12%, transparent 12.5%, transparent 87%, #00d4b6 87.5%)`, backgroundSize: '80px 140px' }}></div>
      <div className="w-[35vw] flex-shrink-0 px-12 z-10 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a] to-transparent h-full flex flex-col justify-center absolute left-0">
        <p className="text-[#00d4b6] font-bold tracking-[0.3em] text-sm mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 animate-pulse" />HYPE RELEASES</p>
        <h2 className="text-7xl font-black uppercase tracking-tighter mb-6 leading-none">The Latest<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4b6] to-white">Drops.</span></h2>
        <p className="text-gray-400 text-lg leading-relaxed">Swipe through the rarest items added to the marketplace today.</p>
      </div>
      <div ref={horizontalTrackRef} className="flex gap-12 pl-[40vw] pr-[20vw] items-center h-full">
        {items.map((item, i) => (
          <div key={i} className="w-[400px] h-[550px] flex-shrink-0 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#00d4b6] to-[#0066ff] rounded-[32px] opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[#111] rounded-[30px] transform transition-all duration-500 group-hover:-translate-y-6 group-hover:rotate-2 border border-white/10 overflow-hidden">
              <div className="relative h-[70%] overflow-hidden">
                <img src={`https://images.unsplash.com/${item.img}?q=80&w=600&auto=format&fit=crop&sig=${i}`}
                     className="w-full h-full object-cover opacity-90 group-hover:opacity-100 mix-blend-luminosity group-hover:mix-blend-normal transition-all duration-700 group-hover:scale-110" alt={item.name} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent"></div>
                <div className="absolute top-4 left-4 bg-[#00d4b6] text-black px-3 py-1 rounded-full text-xs font-black tracking-wider flex items-center gap-1"><Zap className="w-3 h-3" />NEW</div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-gray-500 text-xs font-bold tracking-widest uppercase mb-1">{item.brand}</p>
                    <h3 className="font-black text-xl uppercase tracking-tight group-hover:text-[#00d4b6] transition-colors">{item.name}</h3>
                  </div>
                  <span className="text-[#00d4b6] font-black text-2xl">${item.price}</span>
                </div>
                <div className="flex gap-2 text-sm text-gray-500">
                  <span className="bg-white/5 px-3 py-1 rounded-full">Brand New</span>
                  <span className="bg-white/5 px-3 py-1 rounded-full">{item.size}</span>
                </div>
                <button className="mt-4 w-full bg-white/5 hover:bg-[#00d4b6] border border-white/10 hover:border-[#00d4b6] text-white hover:text-black font-bold tracking-widest text-sm py-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100">
                  ADD TO BAG
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}