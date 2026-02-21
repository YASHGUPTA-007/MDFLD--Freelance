import React from 'react';

interface FooterSectionProps {
  goalSectionRef: React.RefObject<HTMLElement | null>;
}

export default function FooterSection({ goalSectionRef }: FooterSectionProps) {
  return (
    <section
      ref={goalSectionRef}
      className="relative min-h-screen flex flex-col items-center justify-end pb-16 bg-linear-to-b from-[#050505] via-[#0a0a0a] to-[#111] overflow-hidden"
    >
      {/* Background mega text */}
      <div className="absolute top-1/4 w-full text-center z-0 pointer-events-none select-none">
        <h2 className="text-[13vw] font-black uppercase tracking-tighter text-white/2.5 leading-none">
          MDFLD<br/>SYNDICATE
        </h2>
      </div>

      {/* Ambient glow orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#00d4b6]/10 rounded-full blur-[150px] float-element"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px] float-element"></div>

      {/* THE GOALPOST — the ball's final destination */}
      <div className="relative w-[90%] max-w-[580px] h-[240px] md:w-[520px] md:h-[300px] z-40 mt-auto mb-12">

        {/* Ground glow — simulates ball landing */}
        <div className="absolute -bottom-2 w-full h-4 bg-[#00d4b6]/15 blur-xl rounded-full"></div>

        {/* Goal frame */}
        <div className="relative w-full h-full border-t-[14px] border-l-[14px] border-r-[14px] border-white rounded-t-2xl flex items-end justify-center shadow-[0_-20px_80px_rgba(0,212,182,0.15),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden">

          {/* Net pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}></div>

          {/* Diagonal net lines */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.4) 1px, transparent 1px),
                             linear-gradient(-45deg, rgba(255,255,255,0.4) 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}></div>

          {/* Goal inner glow (lights up when ball arrives) */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_30%,rgba(0,212,182,0.06),transparent)] pointer-events-none"></div>

          {/* Post glow accents */}
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-linear-to-r from-[#00d4b6]/10 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-linear-to-l from-[#00d4b6]/10 to-transparent"></div>
          <div className="absolute top-0 left-0 right-0 h-6 bg-linear-to-b from-[#00d4b6]/10 to-transparent"></div>
        </div>

        {/* Footer links below goalpost */}
        <div className="absolute -bottom-32 w-[150%] left-1/2 -translate-x-1/2">
          <div className="flex justify-between items-start text-xs font-bold tracking-widest text-gray-500 uppercase mb-8">
            <div className="flex flex-col gap-3">
              <a href="#" className="hover:text-[#00d4b6] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#00d4b6] transition-colors">Privacy</a>
            </div>
            <div className="text-center">
              <p className="text-[#00d4b6] text-xl font-black tracking-tighter mb-1">MDFLD</p>
              <p className="text-gray-600 text-xs">© 2026 All Rights Reserved</p>
            </div>
            <div className="flex flex-col gap-3 text-right">
              <a href="#" className="hover:text-[#00d4b6] transition-colors">Instagram</a>
              <a href="#" className="hover:text-[#00d4b6] transition-colors">Twitter</a>
            </div>
          </div>
          <div className="text-center text-xs text-gray-700 border-t border-white/5 pt-6">
            <p>Built with passion for the beautiful game</p>
          </div>
        </div>
      </div>
    </section>
  );
}