import { Sparkles, Zap, ArrowRight, ArrowUpRight } from 'lucide-react';

export default function BentoGridSection() {
  return (
    <section className="py-32 px-6 md:px-12 max-w-400 mx-auto z-10 relative">
      <div className="flex justify-between items-end mb-16 reveal-up">
        <div>
          <p className="text-[#00d4b6] text-sm font-bold tracking-[0.2em] mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> FEATURED
          </p>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">Curated<br/>Collections.</h2>
        </div>
        <a href="/shop" className="group text-[#00d4b6] font-bold tracking-widest text-sm hover:text-white transition-colors flex items-center gap-2 border border-[#00d4b6]/20 px-6 py-3 rounded-full hover:bg-[#00d4b6]/10">
          VIEW ALL <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-200">
        <div className="reveal-up md:col-span-2 md:row-span-2 relative group rounded-[30px] overflow-hidden cursor-pointer">
          <div className="absolute inset-0 bg-linear-to-br from-[#00d4b6]/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <img src="https://images.unsplash.com/photo-1600250395358-154df64188b0?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2" alt="Elite Boots" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent"></div>
          <div className="absolute top-6 left-6 bg-[#00d4b6] text-black px-4 py-2 rounded-full text-xs font-black tracking-widest flex items-center gap-2"><Zap className="w-3 h-3" />NEW DROPS</div>
          <div className="absolute bottom-8 left-8 right-8 z-20">
            <h3 className="text-5xl font-black uppercase tracking-tighter mb-2 group-hover:text-[#00d4b6] transition-colors">Elite Boots</h3>
            <p className="text-gray-400 text-lg">Firm Ground & Artificial Grass</p>
            <div className="mt-4 flex gap-2">
              <span className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">230+ Items</span>
              <span className="text-xs bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">Premium</span>
            </div>
          </div>
          <div className="absolute top-8 right-8 bg-black/50 backdrop-blur-md p-4 rounded-full opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500">
            <ArrowUpRight className="text-[#00d4b6] w-6 h-6" />
          </div>
        </div>
        <div className="reveal-up md:col-span-2 relative group rounded-[30px] overflow-hidden cursor-pointer">
          <img src="https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Retro Kits" />
          <div className="absolute inset-0 bg-linear-to-br from-purple-900/60 to-black/60 group-hover:from-purple-900/40 transition-colors"></div>
          <h3 className="absolute bottom-6 left-6 text-4xl font-black uppercase tracking-tighter group-hover:scale-105 transition-transform origin-left">Retro Kits</h3>
          <div className="absolute top-6 right-6 bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-bold">TRENDING</div>
        </div>
        <div className="reveal-up relative group rounded-[30px] overflow-hidden cursor-pointer bg-linear-to-br from-[#111] to-[#1a1a1a]">
          <img src="https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-overlay transition-all duration-700 group-hover:opacity-70 group-hover:scale-110" alt="Training" />
          <div className="absolute inset-0 bg-linear-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <h3 className="absolute bottom-6 left-6 text-3xl font-black uppercase tracking-tighter">Training</h3>
          <div className="absolute top-6 left-6 w-12 h-12 border-2 border-white/20 rounded-full flex items-center justify-center group-hover:border-orange-500 transition-colors">
            <Zap className="w-6 h-6" />
          </div>
        </div>
        <div className="reveal-up relative group rounded-[30px] overflow-hidden cursor-pointer bg-linear-to-br from-[#00d4b6] to-[#00a896] p-8 flex flex-col justify-between">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          <h3 className="relative text-3xl font-black uppercase tracking-tighter leading-none text-black">Accessories<br/>& Gear</h3>
          <div className="relative self-end bg-black text-[#00d4b6] p-5 rounded-full group-hover:rotate-45 transition-transform duration-500 group-hover:scale-110">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}