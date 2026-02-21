import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function NewsletterSection() {
  return (
    <section className="h-[90vh] relative flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?q=80&w=2000&auto=format&fit=crop"
             className="w-full h-full object-cover parallax-img opacity-20 scale-110" alt="Stadium" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-black/80 to-[#050505]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,212,182,0.15),transparent_70%)]"></div>
      </div>
      <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rounded-full float-element"></div>
      <div className="absolute bottom-32 right-32 w-48 h-48 border border-[#00d4b6]/20 rounded-full float-element"></div>
      <div className="relative z-10 max-w-4xl px-6 reveal-up">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">
          <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-gray-600">Never Miss</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00d4b6] via-[#00ffdd] to-[#00d4b6] animate-gradient">A Drop.</span>
        </h2>
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">Join 50,000+ enthusiasts for early access to rare kits and exclusive discounts.</p>
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00d4b6] to-[#0066ff] rounded-full opacity-20 group-hover:opacity-50 blur-xl transition-opacity"></div>
          <div className="relative flex bg-white/5 backdrop-blur-xl border border-white/10 p-2 rounded-full focus-within:border-[#00d4b6]/50 transition-colors">
            <input type="email" placeholder="Enter your email address..." className="w-full bg-transparent px-8 py-4 text-white text-lg focus:outline-none placeholder:text-gray-500" />
            <button className="bg-gradient-to-r from-[#00d4b6] to-[#00a896] hover:from-white hover:to-white text-black font-black tracking-widest uppercase px-10 py-4 rounded-full transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap">
              Subscribe <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}