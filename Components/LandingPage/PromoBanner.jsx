import React, { useEffect, useRef } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const ACCENT = '#00d4b6';

export default function PromoBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const bgX = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', minHeight: 440, display: 'flex', alignItems: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&family=Barlow:wght@300;400;500;700&display=swap');
        @keyframes promo-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .promo-ticker-inner { animation: promo-ticker 14s linear infinite; display: flex; }
        .promo-cta-btn {
          background: #fff; color: #020606;
          font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 900;
          letter-spacing: 0.25em; text-transform: uppercase;
          padding: 16px 40px; border: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.3s; position: relative; overflow: hidden;
        }
        .promo-cta-btn:hover { background: ${ACCENT}; color: #020606; }
        .promo-cta-btn-outline {
          background: transparent; color: rgba(255,255,255,0.65);
          font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 800;
          letter-spacing: 0.25em; text-transform: uppercase;
          padding: 16px 40px; border: 1px solid rgba(255,255,255,0.2); cursor: pointer;
          display: inline-flex; align-items: center; gap: 10px;
          transition: all 0.3s;
        }
        .promo-cta-btn-outline:hover { border-color: rgba(0,212,182,0.5); color: ${ACCENT}; }
      `}</style>

      {/* Parallax BG */}
      <motion.div
        style={{
          position: 'absolute', inset: '-4%', zIndex: 0,
          x: bgX,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80&auto=format&fit=crop"
          alt="promo"
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.28) saturate(0.7)' }}
        />
      </motion.div>

      {/* Overlays */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(2,6,6,0.97) 0%, rgba(2,6,6,0.72) 45%, rgba(0,212,182,0.08) 100%)', zIndex: 1 }} />
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 55% 80% at 80% 50%, rgba(0,212,182,0.08) 0%, transparent 70%)`, zIndex: 1 }} />

      {/* Accent vertical stripe */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 4, background: ACCENT,
        boxShadow: `0 0 24px rgba(0,212,182,0.6)`,
        zIndex: 2,
      }} />

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 3,
        padding: 'clamp(48px, 7vw, 80px) clamp(24px, 5vw, 80px)',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 48, alignItems: 'center',
      }}>
        <div>
          {/* Eyebrow */}
          <div style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700,
            letterSpacing: '0.4em', textTransform: 'uppercase',
            color: ACCENT, marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{ width: 28, height: 1, background: ACCENT }} />
            Flash Sale — Ends Midnight
          </div>

          {/* Headline */}
          <div style={{ overflow: 'hidden', marginBottom: 4 }}>
            <motion.h2
              initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(56px, 7vw, 108px)', fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '-0.03em',
                color: '#fff', lineHeight: 0.85, margin: 0,
              }}
            >Up to 40%</motion.h2>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 24 }}>
            <motion.h2
              initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(56px, 7vw, 108px)', fontWeight: 900,
                fontStyle: 'italic',
                textTransform: 'uppercase', letterSpacing: '-0.03em',
                color: ACCENT, lineHeight: 0.85, margin: 0,
              }}
            >Off Pro Boots</motion.h2>
          </div>

          <p style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 300,
            color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 440, marginBottom: 36,
          }}>
            Clearance on last season's elite-level boots — all blockchain-verified, all authentic.
            Sizes going fast. Free shipping included.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <button className="promo-cta-btn">
              Shop the Sale <ArrowRight style={{ width: 16, height: 16 }} />
            </button>
            <button className="promo-cta-btn-outline">
              View All Deals
            </button>
          </div>
        </div>

        {/* Right — countdown-style deal stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 200 }}>
          {[
            { label: 'Discount', value: '40%', sub: 'Max saving' },
            { label: 'Items on sale', value: '820+', sub: 'Across all brands' },
            { label: 'Ends in', value: '08:42', sub: 'Hours remaining' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '22px 28px',
              background: i === 2 ? 'rgba(0,212,182,0.07)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${i === 2 ? 'rgba(0,212,182,0.22)' : 'rgba(255,255,255,0.06)'}`,
              borderLeft: i === 2 ? `2px solid ${ACCENT}` : '2px solid transparent',
            }}>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, letterSpacing: '-0.03em', color: i === 2 ? ACCENT : '#fff', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom ticker */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4, overflow: 'hidden', background: 'rgba(0,0,0,0.5)', padding: '9px 0', borderTop: `1px solid rgba(0,212,182,0.12)` }}>
        <div className="promo-ticker-inner">
          {[...Array(2)].map((_, g) =>
            ['FREE SHIPPING', '✦', '30-DAY RETURNS', '✦', 'BLOCKCHAIN VERIFIED', '✦', 'FLASH SALE LIVE NOW', '✦', 'UP TO 40% OFF', '✦'].map((t, i) => (
              <span key={`${g}-${i}`} style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 800,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: t === '✦' ? 'rgba(0,212,182,0.3)' : 'rgba(255,255,255,0.3)',
                padding: '0 20px',
              }}>{t}</span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}