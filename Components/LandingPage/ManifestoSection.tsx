import React from 'react';
import { Trophy } from 'lucide-react';

export default function ManifestoSection() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d4b6]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="relative h-[80vh] rounded-[40px] overflow-hidden sticky top-20 group">
        <img src="https://images.unsplash.com/photo-1518605368461-1e1252281cb5?q=80&w=1000&auto=format&fit=crop"
             className="absolute inset-0 w-full h-full object-cover parallax-img group-hover:scale-105 transition-transform duration-700" alt="Manifesto" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#00d4b6]/40 to-transparent mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute inset-4 border-2 border-white/10 rounded-[36px] pointer-events-none"></div>
      </div>
      <div className="flex flex-col justify-center py-20 relative">
        <div className="absolute -left-8 top-20 w-1 h-32 bg-gradient-to-b from-transparent via-[#00d4b6] to-transparent"></div>
        <p className="reveal-up text-[#00d4b6] text-sm font-bold tracking-[0.3em] mb-4 flex items-center gap-2"><Trophy className="w-4 h-4" />OUR PHILOSOPHY</p>
        <h2 className="reveal-up text-5xl md:text-7xl font-black uppercase tracking-tighter mb-10 leading-none">Built for<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4b6] to-white">The Culture.</span></h2>
        <div className="reveal-up text-xl md:text-2xl text-gray-300 font-medium leading-relaxed space-y-8">
          <p className="relative pl-6"><span className="absolute left-0 top-2 w-2 h-2 bg-[#00d4b6] rounded-full"></span>MDFLD is not just a marketplace. It is an ecosystem built for the true enthusiasts, the collectors, and those who live for the beautiful game.</p>
          <p className="relative pl-6"><span className="absolute left-0 top-2 w-2 h-2 bg-[#00d4b6] rounded-full"></span>We verify every stitch, every stud, and every signature. Because on the pitch, authenticity is everything.</p>
        </div>
        <div className="reveal-up mt-16 grid grid-cols-3 gap-8">
          {[['5K+', 'Products'], ['98%', 'Satisfaction'], ['150+', 'Countries']].map(([val, label]) => (
            <div key={label}>
              <div className="text-4xl font-black text-[#00d4b6] mb-2">{val}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}