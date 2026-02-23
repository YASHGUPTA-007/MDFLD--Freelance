'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Zap, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const FEATURED_BRANDS = [
  {
    id: 'f1',
    name: 'AERO KITS',
    tagline: 'Precision Engineered Matchwear',
    image: 'https://images.unsplash.com/photo-1518605368461-1ee7e16110f0?q=80&w=2000&auto=format&fit=crop',
    link: '/shop?brand=aero-kits'
  },
  {
    id: 'f2',
    name: 'STRIKE SYNDICATE',
    tagline: 'Elite Footwear & Turf Control',
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=2000&auto=format&fit=crop',
    link: '/shop?brand=strike-syndicate'
  },
  {
    id: 'f3',
    name: 'TERRACE ARCHIVES',
    tagline: 'Post-Match Outerwear',
    image: 'https://images.unsplash.com/photo-1518605368461-1ee7e16110f0?q=80&w=2000&auto=format&fit=crop',
    link: '/shop?brand=terrace-archives'
  }
];

const DIRECTORY = [
  { letter: 'A', brands: [{ name: 'Aero Kits', count: 42 }, { name: 'Aura Athletics', count: 18 }, { name: 'Apex Firm Ground', count: 9 }] },
  { letter: 'C', brands: [{ name: 'Carbon Shin', count: 5 }, { name: 'Clubhouse Vintage', count: 112 }] },
  { letter: 'H', brands: [{ name: 'Heritage FC', count: 88 }, { name: 'Hooligan Scarves', count: 14 }] },
  { letter: 'N', brands: [{ name: 'Nova Athletica', count: 56 }, { name: 'Nylon 90s', count: 23 }] },
  { letter: 'S', brands: [{ name: 'Strike Syndicate', count: 15 }, { name: 'Sunday League', count: 34 }] },
  { letter: 'T', brands: [{ name: 'Terrace Archives', count: 56 }, { name: 'Turf Masters', count: 8 }] },
];

export default function BrandsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!containerRef.current) return;
    
    const elements = containerRef.current.querySelectorAll('.reveal-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.1
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
      gsap.set(el, { y: 40, opacity: 0 }); // Initial state
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="brands-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap');

        :root {
          --bg: #050505;
          --bg-panel: #0f0f0f;
          --border: rgba(255,255,255,0.08);
          --accent: #00f0ff;
          --text-primary: #ffffff;
          --text-secondary: #a0a0a0;
          --font-sans: 'Inter', sans-serif;
          --font-display: 'Oswald', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .brands-root {
          background: var(--bg); min-height: 100vh; color: var(--text-primary);
          font-family: var(--font-sans); overflow-x: hidden;
        }

        /* ─── 1. HERO SECTION ─── */
        .hero-section {
          height: 70vh; min-height: 500px; display: flex; flex-direction: column;
          justify-content: flex-end; padding: clamp(24px, 5vw, 64px);
          position: relative; border-bottom: 1px solid var(--border);
        }
        .hero-bg {
          position: absolute; inset: 0; z-index: 0; overflow: hidden;
        }
        .hero-bg img { object-fit: cover; opacity: 0.4; filter: grayscale(100%); }
        .hero-bg::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to top, #050505 0%, transparent 100%);
        }
        .hero-content { position: relative; z-index: 10; max-width: 1000px; }
        .hero-eyebrow {
          color: var(--accent); font-family: var(--font-sans); font-size: 12px;
          font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 16px;
        }
        .hero-title {
          font-family: var(--font-display); font-size: clamp(48px, 8vw, 120px);
          font-weight: 700; line-height: 0.9; text-transform: uppercase; margin-bottom: 24px;
        }

        /* ─── 2. MARQUEE ─── */
        .marquee-section {
          background: var(--bg-panel); border-bottom: 1px solid var(--border);
          padding: 20px 0; overflow: hidden; white-space: nowrap; display: flex;
        }
        .marquee-track {
          display: inline-flex; animation: marquee 30s linear infinite;
        }
        .marquee-item {
          font-family: var(--font-display); font-size: 24px; font-weight: 600;
          color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.05em;
          padding: 0 40px; display: flex; align-items: center; gap: 40px;
        }
        .marquee-item span { color: var(--border); }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

        /* ─── 3. FEATURED BRANDS (EDITORIAL CARDS) ─── */
        .section-padding { padding: clamp(64px, 10vw, 120px) clamp(24px, 5vw, 64px); }
        .section-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-bottom: 48px; border-bottom: 1px solid var(--border); padding-bottom: 24px;
        }
        .section-title {
          font-family: var(--font-display); font-size: clamp(32px, 4vw, 48px);
          font-weight: 700; text-transform: uppercase;
        }
        
        .featured-grid {
          display: grid; grid-template-columns: 1fr; gap: 24px;
        }
        @media (min-width: 1024px) { .featured-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
        
        .featured-card {
          position: relative; aspect-ratio: 3/4; border-radius: 8px; overflow: hidden;
          display: block; text-decoration: none; group;
        }
        .f-card-img { transition: transform 0.7s ease; object-fit: cover; }
        .featured-card:hover .f-card-img { transform: scale(1.05); }
        .f-card-overlay {
          position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
          display: flex; flex-direction: column; justify-content: flex-end; padding: 32px;
        }
        .f-card-title {
          font-family: var(--font-display); font-size: 32px; font-weight: 700;
          color: #fff; text-transform: uppercase; margin-bottom: 8px;
        }
        .f-card-sub { color: var(--text-secondary); font-size: 14px; margin-bottom: 24px; }
        .f-card-btn {
          display: inline-flex; align-items: center; justify-content: space-between;
          background: #fff; color: #000; padding: 12px 20px; border-radius: 4px;
          font-weight: 600; font-size: 13px; text-transform: uppercase; transition: background 0.2s;
        }
        .featured-card:hover .f-card-btn { background: var(--accent); }

        /* ─── 4. HYPE DROP BANNER ─── */
        .hype-banner {
          background: var(--accent); padding: clamp(40px, 8vw, 80px) clamp(24px, 5vw, 64px);
          display: flex; flex-direction: column; align-items: center; text-align: center;
        }
        .hype-label {
          font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
          color: #000; background: rgba(0,0,0,0.1); padding: 6px 12px; border-radius: 4px; margin-bottom: 24px;
        }
        .hype-title {
          font-family: var(--font-display); font-size: clamp(40px, 6vw, 80px);
          font-weight: 700; color: #000; text-transform: uppercase; line-height: 1; margin-bottom: 24px;
        }
        .hype-btn {
          background: #000; color: #fff; padding: 16px 32px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.05em; transition: transform 0.2s;
        }
        .hype-btn:hover { transform: translateY(-4px); }

        /* ─── 5. CATEGORY BENTO ─── */
        .bento-grid {
          display: grid; grid-template-columns: 1fr; gap: 24px;
        }
        @media (min-width: 768px) {
          .bento-grid { grid-template-columns: repeat(2, 1fr); grid-template-rows: repeat(2, 300px); }
          .bento-large { grid-column: 1 / -1; }
        }
        .bento-item {
          background: var(--bg-panel); border: 1px solid var(--border); border-radius: 8px;
          padding: 40px; display: flex; flex-direction: column; justify-content: space-between;
          text-decoration: none; transition: border-color 0.2s; position: relative; overflow: hidden;
        }
        .bento-item:hover { border-color: rgba(255,255,255,0.3); }
        .bento-icon {
          width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center; color: var(--accent);
        }
        .bento-content h3 { font-family: var(--font-display); font-size: 32px; font-weight: 700; color: #fff; text-transform: uppercase; }
        .bento-content p { color: var(--text-secondary); font-size: 14px; margin-top: 8px; }

        /* ─── 6. A-Z DIRECTORY ─── */
        .directory-grid {
          display: grid; grid-template-columns: 1fr; gap: 64px;
        }
        @media (min-width: 768px) { .directory-grid { grid-template-columns: repeat(2, 1fr); gap: x; } }
        @media (min-width: 1024px) { .directory-grid { grid-template-columns: repeat(3, 1fr); } }
        
        .dir-group { display: flex; flex-direction: column; gap: 24px; }
        .dir-letter {
          font-family: var(--font-display); font-size: 48px; font-weight: 700;
          color: var(--accent); line-height: 1; border-bottom: 2px solid var(--border); padding-bottom: 16px;
        }
        .dir-list { display: flex; flex-direction: column; gap: 16px; }
        .dir-link {
          display: flex; justify-content: space-between; align-items: center;
          color: var(--text-primary); text-decoration: none; font-size: 15px; transition: color 0.2s;
        }
        .dir-link:hover { color: var(--accent); }
        .dir-count { color: var(--text-secondary); font-size: 12px; font-family: monospace; }

        /* ─── 7. FOOTER / NEWSLETTER ─── */
        .cta-section {
          border-top: 1px solid var(--border); padding: clamp(64px, 10vw, 120px) clamp(24px, 5vw, 64px);
          display: grid; grid-template-columns: 1fr; gap: 40px;
        }
        @media (min-width: 768px) { .cta-section { grid-template-columns: 1fr 1fr; align-items: center; } }
        .cta-input-group { display: flex; gap: 12px; }
        .cta-input {
          flex: 1; background: var(--bg-panel); border: 1px solid var(--border);
          padding: 16px 24px; color: #fff; outline: none; transition: border-color 0.2s;
        }
        .cta-input:focus { border-color: var(--accent); }
        .cta-btn {
          background: #fff; color: #000; padding: 0 32px; font-weight: 600;
          text-transform: uppercase; cursor: pointer; transition: background 0.2s;
        }
        .cta-btn:hover { background: var(--accent); }
      `}</style>

      {/* ─── 1. HERO ─── */}
      <section className="hero-section">
        <div className="hero-bg">
          <Image src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000&auto=format&fit=crop" alt="Vault Background" fill priority />
        </div>
        <div className="hero-content reveal-on-scroll">
          <p className="hero-eyebrow"><Zap size={14} className="inline mr-2 pb-1" /> Official Partners</p>
          <h1 className="hero-title">The<br/>Brand Vault</h1>
          <p className="text-white/60 text-lg max-w-xl">
            Explore our meticulously curated roster of performance gear, terrace archives, and technical streetwear divisions.
          </p>
        </div>
      </section>

      {/* ─── 2. MARQUEE ─── */}
      <section className="marquee-section">
        <div className="marquee-track">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="marquee-item">
              AERO KITS <span>//</span> STRIKE SYNDICATE <span>//</span> TERRACE ARCHIVES <span>//</span> NOVA ATHLETICA <span>//</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. FEATURED BRANDS ─── */}
      <section className="section-padding">
        <div className="section-header reveal-on-scroll">
          <h2 className="section-title">Tier 1 Divisions</h2>
          <Link href="/shop" className="hidden md:flex items-center gap-2 text-white/50 hover:text-white transition-colors">
            Shop All <ArrowUpRight size={16} />
          </Link>
        </div>
        
        <div className="featured-grid">
          {FEATURED_BRANDS.map((brand) => (
            <Link key={brand.id} href={brand.link} className="featured-card group reveal-on-scroll">
              <Image src={brand.image} alt={brand.name} fill className="f-card-img" />
              <div className="f-card-overlay">
                <h3 className="f-card-title">{brand.name}</h3>
                <p className="f-card-sub">{brand.tagline}</p>
                <div className="f-card-btn">
                  Explore Gear <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── 4. HYPE BANNER (INVISIBLE INTEGRATION) ─── */}
      <section className="hype-banner reveal-on-scroll">
        <span className="hype-label">Incoming Drop</span>
        <h2 className="hype-title">404 Syndicate x The Vault</h2>
        <p className="text-[#050505] font-medium text-lg mb-8 max-w-2xl">
          The highly anticipated coder-club turned streetwear division is dropping their exclusive capsule collection. Heavyweight hoodies, technical pants, and limited edition kits.
        </p>
        <button className="hype-btn">Get Notified</button>
      </section>

      {/* ─── 5. CATEGORY BENTO ─── */}
      <section className="section-padding">
        <div className="section-header reveal-on-scroll">
          <h2 className="section-title">Shop by Division</h2>
        </div>
        <div className="bento-grid">
          <Link href="/shop?category=boots" className="bento-item bento-large reveal-on-scroll">
            <div className="bento-icon"><Zap size={24} /></div>
            <div className="bento-content">
              <h3>On-Pitch Performance</h3>
              <p>Firm ground boots, carbon guards, and grip socks.</p>
            </div>
            {/* Subtle background graphic */}
            <Zap size={200} className="absolute -bottom-10 -right-10 text-white/[0.02]" />
          </Link>
          <Link href="/shop?category=terrace" className="bento-item reveal-on-scroll">
            <div className="bento-content">
              <h3>Terrace & Casuals</h3>
              <p>Retro tracks, heavy scarves, and outerwear.</p>
            </div>
          </Link>
          <Link href="/shop?category=kits" className="bento-item reveal-on-scroll">
            <div className="bento-content">
              <h3>Authentic Kits</h3>
              <p>Player-issue match day shirts.</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ─── 6. COMPLETE DIRECTORY ─── */}
      <section className="section-padding" style={{ background: '#0a0a0a' }}>
        <div className="section-header reveal-on-scroll border-none">
          <h2 className="section-title">The Complete Index</h2>
        </div>
        
        <div className="directory-grid">
          {DIRECTORY.map((group) => (
            <div key={group.letter} className="dir-group reveal-on-scroll">
              <div className="dir-letter">{group.letter}</div>
              <div className="dir-list">
                {group.brands.map((brand) => (
                  <Link key={brand.name} href={`/shop?brand=${brand.name.toLowerCase().replace(' ', '-')}`} className="dir-link">
                    <span>{brand.name}</span>
                    <span className="dir-count">[{brand.count}]</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. CTA / FOOTER PORTION ─── */}
      <section className="cta-section reveal-on-scroll">
        <div>
          <h2 className="font-[Oswald] text-4xl font-bold uppercase mb-4">Gain Early Access</h2>
          <p className="text-white/50 text-sm max-w-sm">
            Join the inner circle. Get notified about exclusive brand drops, restocks, and private sales before the general public.
          </p>
        </div>
        <form className="cta-input-group" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="ENTER YOUR EMAIL" className="cta-input" />
          <button type="submit" className="cta-btn">Join</button>
        </form>
      </section>

    </div>
  );
}