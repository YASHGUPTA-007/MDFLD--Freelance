// v2
'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Heart, ShoppingBag, Search, X, Menu, ChevronRight, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const ACCENT = '#00d4b6';
const LINKS = ['HOME', 'SHOP', 'DROPS', 'BRANDS', 'CONTACT'];
const LINK_HREF: Record<string, string> = {
  HOME: '/',
  SHOP: '/shop',
  DROPS: '/drops',
  BRANDS: '/brands',
  CONTACT: '/contact',
};

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [authUser, setAuthUser] = useState<{ name: string, email: string } | null>(null);
  const [cartCount] = useState(3);
  const [wishCount] = useState(2);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => { if (d.user) setAuthUser(d.user); });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');

        .nb-root { font-family: 'Barlow', sans-serif; }

        .nb-link {
          position: relative; text-decoration: none;
          font-size: 11px; font-weight: 700; letter-spacing: 0.22em;
          text-transform: uppercase; color: rgba(255,255,255,0.7);
          padding: 6px 0; transition: color 0.25s; white-space: nowrap;
        }
        .nb-link::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 0; height: 2px; border-radius: 2px;
          background: ${ACCENT}; transition: width 0.3s ease;
        }
        .nb-link:hover { color: #fff; }
        .nb-link:hover::after { width: 100%; }

        .nb-icon {
          position: relative; display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 50%; cursor: pointer;
          transition: background 0.25s, color 0.25s; color: rgba(255,255,255,0.65);
          background: transparent; border: none;
        }
        .nb-icon:hover { background: rgba(255,255,255,0.07); color: ${ACCENT}; }
        .nb-icon svg { transition: transform 0.25s, color 0.25s; }
        .nb-icon:hover svg { transform: scale(1.12); }

        .nb-badge {
          position: absolute; top: -2px; right: -2px;
          min-width: 16px; height: 16px; border-radius: 50%;
          background: ${ACCENT}; color: #020606;
          font-size: 8px; font-weight: 900; letter-spacing: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Barlow', sans-serif; padding: 0 2px;
          box-shadow: 0 0 8px rgba(0,212,182,0.5);
        }

        .nb-logo {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 28px; font-weight: 900; letter-spacing: -0.02em;
          color: #fff; cursor: pointer; user-select: none;
          position: relative; text-decoration: none; line-height: 1;
        }
        .nb-logo .dot { color: ${ACCENT}; display: inline-block; }
        .nb-logo::after {
          content: ''; position: absolute; bottom: -2px; left: 0;
          width: 0; height: 2px; border-radius: 2px;
          background: linear-gradient(90deg, ${ACCENT}, transparent);
          transition: width 0.45s ease;
        }
        .nb-logo:hover::after { width: 100%; }
        .nb-logo:hover .dot { animation: dot-bounce 0.4s ease; }
        @keyframes dot-bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }

        /* LOGIN LINK */
        .nb-login-link {
          font-family: 'Barlow', sans-serif;
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: rgba(255,255,255,0.6);
          text-decoration: none; padding: 8px 4px;
          transition: color 0.25s; white-space: nowrap;
          position: relative;
        }
        .nb-login-link::after {
          content: ''; position: absolute; bottom: 4px; left: 0;
          width: 0; height: 1px; background: ${ACCENT}; transition: width 0.3s ease;
        }
        .nb-login-link:hover { color: #fff; }
        .nb-login-link:hover::after { width: 100%; }

        /* SIGNUP BUTTON */
        .nb-signup-btn {
          position: relative; overflow: hidden;
          background: ${ACCENT}; border: none; color: #020606;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; font-weight: 800; letter-spacing: 0.22em;
          text-transform: uppercase; padding: 9px 20px;
          cursor: pointer; display: flex; align-items: center; gap: 8px;
          text-decoration: none; white-space: nowrap;
          transition: opacity 0.2s, transform 0.2s;
        }
        .nb-signup-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .nb-signup-btn .nb-shimmer {
          position: absolute; top: 0; left: 0; width: 30%; height: 100%;
          background: rgba(255,255,255,0.25);
          animation: nb-shimmer 2.8s ease-in-out infinite;
        }
        @keyframes nb-shimmer {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(400%) skewX(-15deg); }
        }

        /* DIVIDER */
        .nb-auth-divider {
          width: 1px; height: 16px;
          background: rgba(255,255,255,0.12); flex-shrink: 0;
        }

        /* SEARCH OVERLAY */
        .nb-search-overlay {
          position: fixed; inset: 0; z-index: 200;
          background: rgba(2,6,6,0.92); backdrop-filter: blur(20px);
          display: flex; align-items: flex-start; justify-content: center;
          padding-top: 120px; transition: opacity 0.3s;
        }
        .nb-search-box { width: 100%; max-width: 700px; padding: 0 24px; }
        .nb-search-input-wrap {
          display: flex; align-items: center; gap: 16px;
          border-bottom: 2px solid ${ACCENT};
          padding-bottom: 16px; margin-bottom: 24px;
        }
        .nb-search-input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(28px, 5vw, 48px); font-weight: 800;
          color: #fff; letter-spacing: -0.02em; caret-color: ${ACCENT};
        }
        .nb-search-input::placeholder { color: rgba(255,255,255,0.2); }

        /* MOBILE MENU */
        .nb-mobile-menu {
          position: fixed; inset: 0; z-index: 100;
          background: #020606; display: flex; flex-direction: column;
          padding: 32px;
          transform: translateX(100%);
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .nb-mobile-menu.open { transform: translateX(0); }
        .nb-mobile-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(42px, 10vw, 72px); font-weight: 900;
          text-transform: uppercase; letter-spacing: -0.02em;
          color: rgba(255,255,255,0.2); text-decoration: none;
          line-height: 1.05; transition: color 0.2s;
          display: flex; align-items: center; justify-content: space-between;
          border-bottom: 1px solid rgba(255,255,255,0.05); padding: 12px 0;
        }
        .nb-mobile-link:hover { color: #fff; }
        .nb-mobile-link:hover .mob-arrow { color: ${ACCENT}; transform: translateX(6px); }
        .mob-arrow { transition: transform 0.25s, color 0.25s; color: rgba(255,255,255,0.15); }

        .mob-grid {
          position: absolute; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(0,212,182,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,182,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .mob-grid::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 60% at 20% 80%, rgba(0,212,182,0.06), transparent 70%);
        }

        .nb-pill { transition: all 0.6s cubic-bezier(0.4,0,0.2,1); }

        @keyframes fadeSlideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        .nb-root { animation: fadeSlideDown 0.6s ease both; }

        .nb-link-active { color: #fff !important; }
        .nb-link-active::after { width: 100% !important; background: #00d4b6; }
      `}</style>

      {/* ─── MAIN NAV ─── */}
      <nav
        ref={navRef}
        className="nb-root"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
          padding: scrolled ? '12px clamp(12px, 2vw, 16px)' : '0',
        }}
      >
        <div
          className="nb-pill"
          style={{
            margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            transition: 'all 0.6s cubic-bezier(0.4,0,0.2,1)',
            ...(scrolled ? {
              maxWidth: '1100px',
              borderRadius: 18,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(2,6,6,0.85)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,212,182,0.04)',
              padding: '12px clamp(16px, 3vw, 28px)',
            } : {
              maxWidth: '100%',
              borderRadius: 0,
              border: 'none',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              background: 'linear-gradient(to bottom, rgba(2,6,6,0.6) 0%, transparent 100%)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              boxShadow: 'none',
              padding: '20px clamp(16px, 4vw, 40px)',
            }),
          }}
        >
          {/* LOGO */}
          <Link href="/" className="nb-logo">
            mdfld<span className="dot">.</span>
          </Link>

          {/* NAV LINKS — desktop */}
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }} className="hidden md:flex">
            {LINKS.map(l => {
              const isActive = pathname === LINK_HREF[l] || (l === 'SHOP' && pathname.startsWith('/shop'));
              return (
                <Link
                  key={l}
                  href={LINK_HREF[l] ?? '#'}
                  className={`nb-link${isActive ? ' nb-link-active' : ''}`}
                >
                  {l}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>

            {/* Search */}
            <button className="nb-icon" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={18} />
            </button>

            {/* Wishlist — desktop only */}
            <button className="nb-icon hidden md:flex" aria-label="Wishlist">
              <Heart size={18} />
              {wishCount > 0 && <span className="nb-badge">{wishCount}</span>}
            </button>

            {/* Cart */}
            <button className="nb-icon" aria-label="Cart">
              <ShoppingBag size={18} />
              {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
            </button>

            {/* ── AUTH BUTTONS — desktop only ── */}
            <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12, marginLeft: 8 }}>
              <div className="nb-auth-divider" />
              {authUser ? (
                <a href="/account" style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,212,182,0.15)', border: '1px solid rgba(0,212,182,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 900, color: '#00d4b6', textDecoration: 'none' }}>
                  {authUser.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                </a>
              ) : (
                <a href="/login" className="nb-login-link">Login</a>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="nb-icon flex md:hidden"
              style={{ marginLeft: 4 }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* ─── SEARCH OVERLAY ─── */}
      {searchOpen && (
        <div className="nb-search-overlay" onClick={() => setSearchOpen(false)}>
          <div className="nb-search-box" onClick={e => e.stopPropagation()}>
            <div className="nb-search-input-wrap">
              <Search size={28} color={ACCENT} style={{ flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                className="nb-search-input"
                placeholder="Search boots, kits…"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
              />
              <button
                className="nb-icon"
                style={{ flexShrink: 0, width: 44, height: 44 }}
                onClick={() => setSearchOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', alignSelf: 'center' }}>Popular</span>
              {['Mercurial', 'Predator', 'Copa Pure', 'Phantom GX', 'Dri-FIT Kit'].map(t => (
                <button
                  key={t}
                  onClick={() => setSearchVal(t)}
                  style={{
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.55)', fontFamily: "'Barlow', sans-serif",
                    fontSize: 11, letterSpacing: '0.08em', padding: '6px 16px', cursor: 'pointer',
                    borderRadius: 0, transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = `rgba(0,212,182,0.4)`; (e.currentTarget as HTMLButtonElement).style.color = ACCENT; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  {t}
                </button>
              ))}
            </div>
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 32, letterSpacing: '0.1em' }}>
              Press <kbd style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>ESC</kbd> to close
            </p>
          </div>
        </div>
      )}

      {/* ─── MOBILE MENU ─── */}
      <div className={`nb-mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div className="mob-grid" />

        {/* Top row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48, position: 'relative', zIndex: 2 }}>
          <Link href="/" className="nb-logo" style={{ fontSize: 26 }}>
            mdfld<span className="dot">.</span>
          </Link>
          <button className="nb-icon" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>

        {/* Links */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
          {LINKS.map((l, i) => (
            <Link key={l} href={LINK_HREF[l] ?? '#'}
              className="nb-mobile-link"
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {l}
              <ChevronRight size={28} className="mob-arrow" />
            </Link>
          ))}
        </nav>

        {/* Bottom strip — auth + icons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 32, borderTop: '1px solid rgba(255,255,255,0.06)', position: 'relative', zIndex: 2 }}>

          {/* Auth buttons */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {authUser ? (
              <a href="/account" onClick={() => setMobileOpen(false)} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 900, color: '#00d4b6', textDecoration: 'none', width: 44, height: 44, border: '1px solid rgba(0,212,182,0.4)', background: 'rgba(0,212,182,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {authUser.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
              </a>
            ) : (
              <a href="/login" onClick={() => setMobileOpen(false)} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.1)', transition: 'color 0.2s, border-color 0.2s' }}>
                Login
              </a>
            )}

          </div>

          {/* Cart + Wishlist icons */}
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="nb-icon" style={{ width: 44, height: 44 }}>
              <Heart size={19} />
              {wishCount > 0 && <span className="nb-badge">{wishCount}</span>}
            </button>
            <button className="nb-icon" style={{ width: 44, height: 44 }}>
              <ShoppingBag size={19} />
              {cartCount > 0 && <span className="nb-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}