import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Search, ArrowRight, ShieldCheck, Globe, Zap, Activity, Star, TrendingUp, Package, ChevronRight } from 'lucide-react';

// ─── accent synced to your Navbar's #00d4b6 ───────────────────────────────────
const ACCENT = '#00d4b6';
const ACCENT_DIM = 'rgba(0,212,182,0.55)';
const ACCENT_FAINT = 'rgba(0,212,182,0.07)';
const ACCENT_BORDER = 'rgba(0,212,182,0.18)';
const ACCENT_GLOW = 'rgba(0,212,182,0.28)';

const PRODUCTS = [
  {
    id: 0,
    tag: 'JUST DROPPED',
    brand: 'Nike',
    name: 'Mercurial Superfly 10 Elite',
    price: '£289',
    originalPrice: '£349',
    rating: 4.9,
    reviews: 2841,
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90&auto=format&fit=crop',
    badge: 'Best Seller',
  },
  {
    id: 1,
    tag: 'LIMITED EDITION',
    brand: 'Adidas',
    name: 'Predator Elite ControlSkin',
    price: '£259',
    originalPrice: '£319',
    rating: 4.8,
    reviews: 1923,
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=90&auto=format&fit=crop',
    badge: 'Fan Fave',
  },
  {
    id: 2,
    tag: 'PRO EXCLUSIVE',
    brand: 'Puma',
    name: 'Future 7 Ultimate MxSG',
    price: '£219',
    originalPrice: '£269',
    rating: 4.7,
    reviews: 1102,
    img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=90&auto=format&fit=crop',
    badge: 'Pro Pick',
  },
];

const TICKER_ITEMS = [
  'Blockchain Verified Authentic', '✦',
  'Free Global Shipping Over £100', '✦',
  'New Drops Every Friday', '✦',
  '150+ Countries Shipped', '✦',
  'Worn By The Pros', '✦',
  '30-Day Returns', '✦',
  '5,000+ Products', '✦',
];

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const heroRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 25 });

  useEffect(() => {
    const move = (e) => {
      if (!heroRef.current) return;
      const r = heroRef.current.getBoundingClientRect();
      mouseX.set(e.clientX - r.left - r.width / 2);
      mouseY.set(e.clientY - r.top - r.height / 2);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % PRODUCTS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const product = PRODUCTS[active];

  return (
    <div
      ref={heroRef}
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        background: '#020606',
        // pushes content below your fixed navbar (matches py-6 ≈ 80px + logo height ≈ 88px total)
        paddingTop: 88,
        minHeight: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,800&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .grid-bg {
          position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,212,182,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,182,0.032) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .grid-bg::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 75% 65% at 50% 50%, transparent 25%, #020606 100%);
        }

        @keyframes ticker-anim { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ticker-inner { animation: ticker-anim 26s linear infinite; display: flex; white-space: nowrap; }

        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.7 } 100% { transform: scale(2.4); opacity: 0 } }
        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }

        .tag-chip {
          cursor: pointer;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.45);
          font-family: 'Barlow', sans-serif;
          font-size: 10px; letter-spacing: 0.1em;
          padding: 4px 13px; transition: all 0.22s;
        }
        .tag-chip:hover { border-color: rgba(0,212,182,0.4); color: ${ACCENT}; }

        .prod-row { cursor: pointer; transition: border-color 0.25s, background 0.25s, transform 0.25s; }
        .prod-row:hover { border-color: rgba(0,212,182,0.3) !important; transform: translateX(5px); }

        @keyframes shine { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(350%) skewX(-15deg); } }
        .btn-shine { animation: shine 3s ease-in-out infinite; }

        @keyframes scrolldot {
          0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; }
          55% { transform: translateX(-50%) translateY(8px); opacity: 0.3; }
        }
        .scroll-dot { animation: scrolldot 2s ease-in-out infinite; }

        .search-wrap { transition: border-color 0.3s, box-shadow 0.3s; }
        .search-wrap.focused {
          border-color: rgba(0,212,182,0.45) !important;
          box-shadow: 0 0 0 1px rgba(0,212,182,0.12), 0 8px 40px rgba(0,212,182,0.07);
        }

        input::placeholder { color: rgba(255,255,255,0.25); }
        input { caret-color: ${ACCENT}; }

        .glass-panel-l {
          background: rgba(5,10,9,0.72); backdrop-filter: blur(18px);
          border-left: 2px solid ${ACCENT};
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        .glass-panel-r {
          background: rgba(5,10,9,0.72); backdrop-filter: blur(18px);
          border-right: 2px solid rgba(255,255,255,0.14);
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          border-left: 1px solid rgba(255,255,255,0.06);
        }
      `}</style>

      {/* GRID BACKGROUND */}
      <div className="grid-bg" />

      {/* MOUSE-TRACKED AMBIENT GLOW */}
      <motion.div
        style={{
          position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
          background: `radial-gradient(700px circle at 50% 50%, rgba(0,212,182,0.04), transparent 65%)`,
          x: springX, y: springY,
        }}
      />

      {/* TOP-RIGHT ENERGY BLOB */}
      <div style={{
        position: 'absolute', top: '-8%', right: '8%',
        width: 500, height: 400,
        background: `radial-gradient(ellipse at top right, rgba(0,212,182,0.1) 0%, transparent 70%)`,
        filter: 'blur(40px)', zIndex: 0, pointerEvents: 'none',
      }} />

      {/* GHOST BG TEXT */}
      <div style={{
        position: 'absolute', bottom: '3%', left: '50%', transform: 'translateX(-50%)',
        zIndex: 1, pointerEvents: 'none', whiteSpace: 'nowrap',
        fontSize: 'clamp(90px, 16vw, 240px)', fontWeight: 900, letterSpacing: '-0.04em',
        color: 'transparent', WebkitTextStroke: '1px rgba(0,212,182,0.035)',
        textTransform: 'uppercase', lineHeight: 1, userSelect: 'none',
      }}>MIDFIELD</div>

      {/* ─── TICKER ─── */}
      <div style={{ position: 'relative', zIndex: 20, background: ACCENT, overflow: 'hidden', padding: '9px 0' }}>
        <div className="ticker-inner">
          {[...Array(2)].map((_, g) =>
            TICKER_ITEMS.map((t, i) => (
              <span key={`${g}-${i}`} style={{
                fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 800,
                letterSpacing: '0.3em', textTransform: 'uppercase',
                color: t === '✦' ? 'rgba(2,6,6,0.3)' : '#020606',
                padding: '0 22px',
              }}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* ─── HERO BODY ─── */}
      {/* minHeight = 100vh minus navbar (~88px) minus ticker (~38px) */}
      <div style={{
        position: 'relative', zIndex: 10,
        display: 'grid', gridTemplateColumns: '1fr 500px',
        minHeight: 'calc(100vh - 126px)',
        padding: '0 52px 52px',
      }}>

        {/* ── LEFT COL ── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingRight: 64, paddingTop: 16, paddingBottom: 16 }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.18, duration: 0.7 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', backdropFilter: 'blur(12px)', padding: '8px 18px 8px 10px', marginBottom: 36, alignSelf: 'flex-start' }}
          >
            <div style={{ position: 'relative', width: 8, height: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: ACCENT, opacity: 0.5 }} />
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, position: 'relative', zIndex: 1 }} />
            </div>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT }}>The Apex of Football Culture</span>
          </motion.div>

          {/* HEADLINE — stagger reveal */}
          {[
            { text: 'Rule The', colored: false },
            { text: 'Midfield.', colored: true },
          ].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.h1
                initial={{ y: '110%' }} animate={{ y: 0 }}
                transition={{ delay: 0.28 + i * 0.13, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontSize: 'clamp(68px, 8.5vw, 122px)', fontWeight: 900, lineHeight: 0.86,
                  textTransform: 'uppercase', letterSpacing: '-0.03em', margin: 0,
                  ...(line.colored ? {
                    background: `linear-gradient(135deg, ${ACCENT} 0%, #00bba4 50%, #009e8c 100%)`,
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                    filter: `drop-shadow(0 0 30px ${ACCENT_GLOW})`,
                    paddingBottom: 8,
                  } : { color: '#fff' }),
                }}
              >
                {line.text}
              </motion.h1>
            </div>
          ))}

          {/* Laser underline */}
          <motion.div
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.85, duration: 1.1, ease: 'easeInOut' }}
            style={{
              height: 2,
              background: `linear-gradient(90deg, transparent, ${ACCENT}, transparent)`,
              transformOrigin: 'center',
              boxShadow: `0 0 12px ${ACCENT}`,
              marginTop: 4, marginBottom: 36, maxWidth: 520,
            }}
          />

          {/* Sub copy */}
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.62, duration: 0.7 }}
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.78, color: 'rgba(255,255,255,0.42)', maxWidth: 400, marginBottom: 44 }}
          >
            Authenticate, collect and dominate. Premium boots, kits & gear — curated, verified on-chain, and shipped worldwide to 150+ countries.
          </motion.p>

          {/* SEARCH */}
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.72, duration: 0.7 }} style={{ marginBottom: 48 }}>
            <div
              className={`search-wrap${searchFocused ? ' focused' : ''}`}
              style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.09)', padding: '5px 5px 5px 18px', maxWidth: 500 }}
            >
              <Search style={{ width: 17, height: 17, color: searchFocused ? ACCENT : 'rgba(255,255,255,0.28)', flexShrink: 0, transition: 'color 0.3s' }} />
              <input
                type="text" value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search boots, kits, brands, sizes..."
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#fff', padding: '11px 14px', letterSpacing: '0.02em' }}
              />
              <button style={{
                position: 'relative', overflow: 'hidden', background: ACCENT, border: 'none',
                color: '#020606', fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 12, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase',
                padding: '12px 22px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0,
              }}>
                <span style={{ position: 'relative', zIndex: 2 }}>Explore</span>
                <ArrowRight style={{ width: 15, height: 15, position: 'relative', zIndex: 2 }} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)' }}>Trending:</span>
              {['Mercurial', 'Copa Pure', 'X Speedportal', 'Phantom GX'].map(tag => (
                <button key={tag} className="tag-chip" onClick={() => setSearchVal(tag)}>{tag}</button>
              ))}
            </div>
          </motion.div>

          {/* STATS ROW */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.7 }}
            style={{ display: 'flex', gap: 0, borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 32 }}
          >
            {[
              { n: '12K+', l: 'Products',     icon: <Package   style={{ width: 13, height: 13, color: ACCENT }} /> },
              { n: '98%',  l: 'Verified Auth', icon: <ShieldCheck style={{ width: 13, height: 13, color: ACCENT }} /> },
              { n: '5K+',  l: 'Active Drops', icon: <TrendingUp style={{ width: 13, height: 13, color: ACCENT }} /> },
              { n: '150+', l: 'Countries',    icon: <Globe     style={{ width: 13, height: 13, color: ACCENT }} /> },
            ].map((s, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ marginBottom: 7 }}>{s.icon}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginTop: 5 }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT COL — PRODUCT SHOWCASE ── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 16, paddingBottom: 16, gap: 14 }}>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.28, duration: 0.7 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Featured Drops</span>
            <a href="#" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ChevronRight style={{ width: 11, height: 11 }} />
            </a>
          </motion.div>

          {/* MAIN FEATURE CARD */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -16 }}
              transition={{ duration: 0.42, ease: [0.4, 0, 0.2, 1] }}
              style={{ background: ACCENT_FAINT, border: `1px solid ${ACCENT_BORDER}`, overflow: 'hidden' }}
            >
              <div style={{ position: 'relative', height: 248, overflow: 'hidden' }}>
                <img
                  src={product.img} alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.72) saturate(1.05)', display: 'block' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(2,6,6,0.95) 0%, rgba(2,6,6,0.15) 55%, transparent 100%)' }} />

                {/* Tag */}
                <div style={{ position: 'absolute', top: 14, left: 14, background: ACCENT, color: '#020606', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '5px 12px' }}>
                  {product.tag}
                </div>

                {/* Badge */}
                <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(2,6,6,0.75)', backdropFilter: 'blur(10px)', border: `1px solid ${ACCENT_BORDER}`, color: ACCENT, fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Star style={{ width: 9, height: 9, fill: ACCENT, color: 'transparent' }} /> {product.badge}
                </div>

                {/* Info overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '18px 22px' }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 4 }}>{product.brand}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 8 }}>{product.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[...Array(5)].map((_, idx) => (
                        <Star key={idx} style={{ width: 10, height: 10, fill: idx < Math.floor(product.rating) ? ACCENT : `rgba(0,212,182,0.18)`, color: 'transparent' }} />
                      ))}
                    </div>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.38)' }}>{product.rating} · {product.reviews.toLocaleString()} reviews</span>
                  </div>
                </div>
              </div>

              {/* Price + CTA */}
              <div style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,212,182,0.07)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, color: ACCENT, letterSpacing: '-0.02em' }}>{product.price}</span>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.28)', textDecoration: 'line-through' }}>{product.originalPrice}</span>
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: ACCENT_DIM, fontWeight: 500, letterSpacing: '0.12em', marginTop: 2 }}>Free delivery · In stock</div>
                </div>
                <button style={{
                  position: 'relative', overflow: 'hidden', background: ACCENT, border: 'none',
                  color: '#020606', fontFamily: "'Barlow Condensed', sans-serif",
                  fontSize: 12, fontWeight: 800, letterSpacing: '0.22em', textTransform: 'uppercase',
                  padding: '13px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 9,
                }}>
                  <span style={{ position: 'relative', zIndex: 2 }}>Add to Bag</span>
                  <ArrowRight style={{ width: 15, height: 15, position: 'relative', zIndex: 2 }} />
                  <div className="btn-shine" style={{ position: 'absolute', top: 0, left: 0, width: '32%', height: '100%', background: 'rgba(255,255,255,0.28)' }} />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* PRODUCT LIST */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PRODUCTS.map((p, i) => (
              <motion.div
                key={p.id}
                className="prod-row"
                onClick={() => setActive(i)}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.38 + i * 0.1, duration: 0.55 }}
                style={{
                  display: 'grid', gridTemplateColumns: '68px 1fr auto', gap: 14,
                  alignItems: 'center', padding: '11px 14px',
                  background: active === i ? 'rgba(0,212,182,0.05)' : 'rgba(255,255,255,0.022)',
                  border: `1px solid ${active === i ? 'rgba(0,212,182,0.22)' : 'rgba(255,255,255,0.057)'}`,
                  position: 'relative',
                }}
              >
                {active === i && (
                  <motion.div layoutId="active-bar" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: ACCENT }} />
                )}
                <div style={{ width: 68, height: 50, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: active === i ? 'brightness(0.88)' : 'brightness(0.45) saturate(0.6)', transition: 'filter 0.3s' }} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: active === i ? ACCENT : 'rgba(255,255,255,0.28)', marginBottom: 3 }}>{p.brand}</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, textTransform: 'uppercase', color: active === i ? '#fff' : 'rgba(255,255,255,0.45)', letterSpacing: '0.01em', lineHeight: 1.15 }}>{p.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 900, letterSpacing: '-0.02em', color: active === i ? ACCENT : 'rgba(255,255,255,0.42)' }}>{p.price}</div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.22)', textDecoration: 'line-through', marginTop: 2 }}>{p.originalPrice}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {PRODUCTS.map((_, i) => (
              <button
                key={i} onClick={() => setActive(i)}
                style={{ padding: 0, border: 'none', cursor: 'pointer', height: 2, width: active === i ? 34 : 16, background: active === i ? ACCENT : 'rgba(255,255,255,0.14)', transition: 'all 0.35s ease' }}
              />
            ))}
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.15em', marginLeft: 8 }}>
              {String(active + 1).padStart(2, '0')} / {String(PRODUCTS.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>



      {/* ─── RIGHT FLOATING GLASS PANELS ─── */}
      <motion.div
        initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 0.8 }}
        style={{ position: 'absolute', right: 0, top: '38%', zIndex: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end' }}
      >
        {[
          { icon: <Zap style={{ width: 13, height: 13, color: ACCENT }} />, number: '5K+', label: 'Active Drops', delay: 0.5 },
          { icon: <Activity style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.55)' }} />, number: '98%', label: 'Trust Score', delay: 1.8 },
        ].map((p, i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5 + i, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
            className="glass-panel-r"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', padding: '15px 16px 15px 26px', minWidth: 180 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              {p.icon}
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>{p.number}</span>
            </div>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT }}>{p.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ─── SCROLL INDICATOR ─── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 1 }}
        style={{ position: 'absolute', bottom: 24, left: '50%', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}
      >
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: '0.4em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>Scroll</span>
        <div style={{ width: 1, height: 38, background: `linear-gradient(to bottom, ${ACCENT_GLOW}, transparent)`, position: 'relative' }}>
          <div className="scroll-dot" style={{ position: 'absolute', top: 0, left: '50%', width: 4, height: 4, borderRadius: '50%', background: ACCENT }} />
        </div>
      </motion.div>
    </div>
  );
}