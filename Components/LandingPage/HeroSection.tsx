"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

const ACCENT = '#00d4b6';

interface Product {
  id: number;
  brand: string;
  name: string;
  tag: string;
  price: string;
  img: string;
}

const PRODUCTS: Product[] = [
  {
    id: 0,
    brand: 'Nike',
    name: 'Mercurial\nSuperfly 10',
    tag: 'Just Dropped',
    price: '£289',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1400&q=95&auto=format&fit=crop',
  },
  {
    id: 1,
    brand: 'Adidas',
    name: 'Predator\nElite',
    tag: 'Limited Edition',
    price: '£259',
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1400&q=95&auto=format&fit=crop',
  },
  {
    id: 2,
    brand: 'Puma',
    name: 'Future 7\nUltimate',
    tag: 'Pro Exclusive',
    price: '£219',
    img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=1400&q=95&auto=format&fit=crop',
  },
];

export default function HeroSection() {
  const [active, setActive] = useState(0);

  const go = (i: number) => setActive(i);

  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % PRODUCTS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const product = PRODUCTS[active];

  return (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      background: '#020606',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      paddingTop: 88,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;800;900&family=Barlow:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .ticker-track { animation: ticker 22s linear infinite; display: flex; white-space: nowrap; }

        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .live-dot { animation: pulse-dot 1.6s ease-in-out infinite; }

        .shop-btn {
          display: inline-flex; align-items: center; gap: 12px; cursor: pointer; border: none;
          background: ${ACCENT}; color: #020606;
          font-family: 'Barlow Condensed', sans-serif; font-size: 13px; font-weight: 800;
          letter-spacing: 0.3em; text-transform: uppercase; padding: 16px 34px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .shop-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,212,182,0.3); }

        .ghost-btn {
          display: inline-flex; align-items: center; gap: 10px; cursor: pointer; border: none;
          background: transparent; color: rgba(255,255,255,0.45);
          font-family: 'Barlow', sans-serif; font-size: 12px; font-weight: 500;
          letter-spacing: 0.18em; text-transform: uppercase; padding: 0;
          transition: color 0.2s;
        }
        .ghost-btn:hover { color: ${ACCENT}; }

        .num-btn {
          cursor: pointer; background: none; border: none;
          font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; padding: 6px 0; transition: color 0.25s;
        }
        .num-btn:hover { color: #fff !important; }

        .dot-btn { cursor: pointer; border: none; padding: 0; transition: all 0.4s ease; }
      `}</style>

      {/* FULL-BLEED IMAGE */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <AnimatePresence>
          <motion.img
            key={active}
            src={product.img}
            alt={product.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: 'brightness(0.38) saturate(0.9)',
            }}
          />
        </AnimatePresence>

        {/* Gradient vignette */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(2,6,6,0.92) 0%, rgba(2,6,6,0.5) 45%, rgba(2,6,6,0.15) 100%)' }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', background: 'linear-gradient(to top, #020606, transparent)' }} />
        {/* Teal left edge */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, transparent, ${ACCENT}, transparent)`, opacity: 0.7 }} />
      </div>

      {/* TICKER */}
      <div style={{ position: 'absolute', top: 88, left: 0, right: 0, zIndex: 20, background: ACCENT, overflow: 'hidden', padding: '8px 0' }}>
        <div className="ticker-track">
          {[...Array(2)].map((_, g) =>
            ['Blockchain Verified', '✦', 'Free Global Shipping £100+', '✦', 'New Drops Every Friday', '✦', '150+ Countries', '✦', '30-Day Returns', '✦'].map((t, i) => (
              <span key={`${g}-${i}`} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: t === '✦' ? 'rgba(2,6,6,0.3)' : '#020606', padding: '0 24px' }}>{t}</span>
            ))
          )}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{
        position: 'relative', zIndex: 10,
        height: 'calc(100% - 34px)',
        marginTop: 34,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(28px, 5vw, 72px)',
        paddingBottom: 'clamp(36px, 6vw, 80px)',
      }}>

        {/* BRAND + TAG */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`tag-${active}`}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45 }}
            style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="live-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT }} />
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.38em', textTransform: 'uppercase', color: ACCENT }}>{product.tag}</span>
            </div>
            <div style={{ width: 1, height: 14, background: 'rgba(255,255,255,0.15)' }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>{product.brand}</span>
          </motion.div>
        </AnimatePresence>

        {/* HEADLINE */}
        <div style={{ overflow: 'hidden', marginBottom: 28 }}>
          <AnimatePresence mode="wait">
            <motion.h1
              key={`name-${active}`}
              initial={{ y: '105%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-105%', opacity: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 'clamp(68px, 9vw, 136px)', fontWeight: 900, lineHeight: 0.86, textTransform: 'uppercase', letterSpacing: '-0.04em', color: '#fff', whiteSpace: 'pre-line' }}
            >
              {product.name.split('\n').map((line, i) => (
                <span key={i} style={{ display: 'block', ...(i === 1 ? { WebkitTextStroke: '1.5px rgba(255,255,255,0.5)', color: 'transparent' } : {}) }}>{line}</span>
              ))}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* PRICE + ACTIONS + NAV */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`price-${active}`}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}
              >
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 52, fontWeight: 900, color: ACCENT, letterSpacing: '-0.04em', lineHeight: 1 }}>{product.price}</span>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>Free delivery</span>
              </motion.div>
            </AnimatePresence>

            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <button className="shop-btn">
                Shop Now
                <ArrowRight size={16} />
              </button>
              <button className="ghost-btn">
                View All Drops
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {/* SLIDE NAV */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 14 }}>
            <div style={{ display: 'flex', gap: 20 }}>
              {PRODUCTS.map((_, i) => (
                <button key={i} className="num-btn" onClick={() => go(i)} style={{ color: active === i ? '#fff' : 'rgba(255,255,255,0.22)' }}>
                  {String(i + 1).padStart(2, '0')}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {PRODUCTS.map((_, i) => (
                <button key={i} className="dot-btn" onClick={() => go(i)} style={{ height: 2, width: active === i ? 48 : 18, background: active === i ? ACCENT : 'rgba(255,255,255,0.2)' }} />
              ))}
            </div>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)' }}>Scroll to explore</span>
          </div>
        </div>
      </div>
    </div>
  );
}