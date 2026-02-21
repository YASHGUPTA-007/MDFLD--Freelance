import React from 'react';
import { Trophy } from 'lucide-react';

export default function MarqueeSection() {
  return (
    <section className="py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#00d4b6] -rotate-1 scale-110"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -rotate-1 scale-110"></div>
      <div className="relative flex whitespace-nowrap text-black">
        <div className="animate-[marquee_25s_linear_infinite] flex items-center text-4xl font-black uppercase tracking-tighter">
          {['100% Authentic', 'Nike', 'Adidas', 'Puma', 'Curated Drops', 'Global Shipping', '100% Authentic', 'Nike', 'Adidas', 'Puma', 'Curated Drops', 'Global Shipping'].map((text, i) => (
            <React.Fragment key={i}>
              <span className="mx-8">{text}</span>
              {i % 3 === 2 ? <Trophy className="mx-4 w-8 h-8" /> : <span className="mx-4">•</span>}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}