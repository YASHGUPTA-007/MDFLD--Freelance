import React, { useRef, useEffect, useState } from 'react';
import { ShieldCheck, Zap, RotateCcw, Headphones, Award, Truck } from 'lucide-react';

const ACCENT = '#00d4b6';
const ACCENT_FAINT = 'rgba(0,212,182,0.06)';
const ACCENT_BORDER = 'rgba(0,212,182,0.15)';

const TRUST_ITEMS = [
  { icon: <ShieldCheck />, title: 'Blockchain Verified', sub: 'Every item authenticated on-chain' },
  { icon: <Truck />, title: 'Free Global Shipping', sub: 'On all orders over $100' },
  { icon: <RotateCcw />, title: '30-Day Returns', sub: 'No questions asked policy' },
  { icon: <Zap />, title: 'Same-Day Dispatch', sub: 'Order before 2PM weekdays' },
  { icon: <Headphones />, title: '24/7 Expert Support', sub: 'Real humans, real answers' },
  { icon: <Award />, title: 'Pro-Approved Gear', sub: 'Trusted by elite athletes' },
];

const BRANDS = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Mizuno', 'Under Armour', 'Umbro', 'Hummel'];

export default function TrustBar() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{
      background: '#030909',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      fontFamily: "'Barlow Condensed', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        .trust-card {
          transition: background 0.28s, border-color 0.28s, transform 0.28s;
        }
        .trust-card:hover {
          background: rgba(0,212,182,0.06) !important;
          border-color: rgba(0,212,182,0.25) !important;
          transform: translateY(-2px);
        }
        @keyframes brand-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .brand-track { animation: brand-scroll 22s linear infinite; display: flex; }
        .brand-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Trust pillars grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {TRUST_ITEMS.map((item, i) => (
          <div
            key={i}
            className="trust-card"
            style={{
              padding: '28px 24px',
              borderRight: i < TRUST_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              background: 'transparent',
              border: '1px solid transparent',
              cursor: 'default',
              position: 'relative',
            }}
          >
            <div style={{
              width: 36, height: 36,
              background: ACCENT_FAINT,
              border: `1px solid ${ACCENT_BORDER}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 14,
            }}>
              {React.cloneElement(item.icon, { style: { width: 17, height: 17, color: ACCENT } })}
            </div>
            <div style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 15, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              color: '#fff', marginBottom: 4,
            }}>{item.title}</div>
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 11, color: 'rgba(255,255,255,0.35)',
              fontWeight: 400, lineHeight: 1.5,
            }}>{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Brand carousel */}
      <div style={{ padding: '22px 0', overflow: 'hidden', position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 120,
          background: 'linear-gradient(to right, #030909, transparent)', zIndex: 2,
        }} />
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: 120,
          background: 'linear-gradient(to left, #030909, transparent)', zIndex: 2,
        }} />
        <div className="brand-track">
          {[...BRANDS, ...BRANDS].map((b, i) => (
            <div key={i} style={{
              padding: '0 48px',
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 18, fontWeight: 900,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: i % 5 === 0 ? ACCENT : 'rgba(255,255,255,0.12)',
              whiteSpace: 'nowrap',
              transition: 'color 0.2s',
            }}>{b}</div>
          ))}
        </div>
      </div>
    </section>
  );
}