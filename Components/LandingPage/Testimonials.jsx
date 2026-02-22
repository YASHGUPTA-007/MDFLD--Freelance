import React, { useState, useEffect, useRef } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#00d4b6';

const TESTIMONIALS = [
  {
    id: 0,
    name: 'Marcus T.',
    role: 'Semi-Pro, West Ham Academy',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80&auto=format&fit=crop&crop=face',
    rating: 5,
    product: 'Nike Mercurial Superfly 10',
    text: "I've bought from a dozen sites and Midfield is the only one where I felt 100% confident about authenticity. The blockchain cert is a genuine game-changer. Boots arrived in 2 days, perfect condition.",
    verified: true,
    date: '3 days ago',
    country: '🇬🇧',
  },
  {
    id: 1,
    name: 'Sofia R.',
    role: 'Club Captain, Barcelona FC Women',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&q=80&auto=format&fit=crop&crop=face',
    rating: 5,
    product: 'Adidas Predator Elite',
    text: "The curation here is exceptional — not just boots but complete kits and training gear for elite female players. Finally a platform that takes women's football seriously. Customer service is elite.",
    verified: true,
    date: '1 week ago',
    country: '🇪🇸',
  },
  {
    id: 2,
    name: 'Jordan K.',
    role: 'Goalkeeper Coach, MLS',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80&auto=format&fit=crop&crop=face',
    rating: 5,
    product: 'Puma Future 7 Ultimate',
    text: "Ordered custom sizes for my squad — 14 pairs shipped to the US, all verified, all perfect. The bulk order process was seamless and the savings vs retail were significant. Midfield is now our team's go-to.",
    verified: true,
    date: '2 weeks ago',
    country: '🇺🇸',
  },
  {
    id: 3,
    name: 'Amara D.',
    role: 'Youth Player, Grassroots Level',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=120&q=80&auto=format&fit=crop&crop=face',
    rating: 5,
    product: 'New Balance Furon v7',
    text: "Got my first proper boots from here at a massive discount on the sale. Even as a regular player, not a pro — the experience felt premium. Returns were easy when I needed a half size up.",
    verified: true,
    date: '3 weeks ago',
    country: '🇳🇬',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (direction) => {
    setDir(direction);
    setActive(prev => (prev + direction + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const t = TESTIMONIALS[active];

  return (
    <section style={{
      background: '#030909',
      padding: 'clamp(64px, 8vw, 108px) clamp(20px, 4vw, 52px)',
      fontFamily: "'Barlow Condensed', sans-serif",
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
      `}</style>

      {/* BG text */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: 'clamp(100px, 20vw, 280px)', fontWeight: 900,
        color: 'transparent', WebkitTextStroke: '1px rgba(0,212,182,0.025)',
        textTransform: 'uppercase', letterSpacing: '-0.05em',
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none',
        zIndex: 0,
      }}>VERIFIED</div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.4em', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>
            <ShieldCheck style={{ width: 10, height: 10, display: 'inline', marginRight: 6 }} />
            Verified Reviews
          </div>
          <h2 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(40px, 5.5vw, 64px)', fontWeight: 900,
            textTransform: 'uppercase', letterSpacing: '-0.03em',
            color: '#fff', lineHeight: 0.9, margin: 0,
          }}>
            Trusted By<br /><span style={{ color: ACCENT }}>The Game's Best.</span>
          </h2>
        </div>

        {/* Main testimonial */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: 2,
          alignItems: 'stretch',
          marginBottom: 40,
        }}>
          {/* Quote card */}
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={active}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              style={{
                background: 'rgba(5,12,11,0.9)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderLeft: `2px solid ${ACCENT}`,
                padding: 'clamp(32px, 5vw, 52px)',
                position: 'relative',
              }}
            >
              {/* Quote mark */}
              <Quote style={{ width: 48, height: 48, color: 'rgba(0,212,182,0.12)', position: 'absolute', top: 28, right: 32 }} />

              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 24 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} style={{ width: 14, height: 14, fill: ACCENT, color: 'transparent' }} />
                ))}
              </div>

              <p style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 'clamp(15px, 1.6vw, 19px)',
                fontWeight: 300, lineHeight: 1.75,
                color: 'rgba(255,255,255,0.72)',
                marginBottom: 36,
              }}>"{t.text}"</p>

              <div style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 500,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 18,
              }}>
                Purchased: {t.product}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <img src={t.avatar} alt={t.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${ACCENT}` }} />
                <div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.02em' }}>
                    {t.name} {t.country}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.32)', letterSpacing: '0.15em' }}>{t.role}</div>
                </div>
                {t.verified && (
                  <div style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(0,212,182,0.08)', border: `1px solid rgba(0,212,182,0.2)`,
                    padding: '5px 10px',
                  }}>
                    <ShieldCheck style={{ width: 10, height: 10, color: ACCENT }} />
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 7, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT }}>Verified</span>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Sidebar — all reviews list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {TESTIMONIALS.map((item, i) => (
              <div
                key={item.id}
                onClick={() => { setDir(i > active ? 1 : -1); setActive(i); }}
                style={{
                  flex: 1, padding: '18px 22px', cursor: 'pointer',
                  background: active === i ? 'rgba(0,212,182,0.06)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${active === i ? 'rgba(0,212,182,0.22)' : 'rgba(255,255,255,0.05)'}`,
                  borderLeft: active === i ? `2px solid ${ACCENT}` : '2px solid transparent',
                  transition: 'all 0.25s',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
              >
                <img src={item.avatar} alt={item.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', filter: active === i ? 'none' : 'brightness(0.5) saturate(0.5)', transition: 'filter 0.3s' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: active === i ? '#fff' : 'rgba(255,255,255,0.35)', letterSpacing: '0.02em' }}>{item.name}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.role}</div>
                </div>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 7, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>{item.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Nav + aggregate stats */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => go(-1)} style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.background = 'rgba(0,212,182,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              <ChevronLeft style={{ width: 18, height: 18, color: 'rgba(255,255,255,0.6)' }} />
            </button>
            <button onClick={() => go(1)} style={{ width: 44, height: 44, background: ACCENT, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
              <ChevronRight style={{ width: 18, height: 18, color: '#020606' }} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 40 }}>
            {[
              { n: '4.9/5', l: 'Average Rating' },
              { n: '28K+', l: 'Verified Reviews' },
              { n: '99%', l: 'Would Recommend' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, color: ACCENT, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: 5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}