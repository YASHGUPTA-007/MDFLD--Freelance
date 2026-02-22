"use client"
import React, { useState } from 'react';
import { ArrowRight, Instagram, Twitter, Youtube, Facebook, ShieldCheck, Zap, Globe } from 'lucide-react';

const ACCENT = '#00d4b6';
const ACCENT_FAINT = 'rgba(0,212,182,0.06)';
const ACCENT_BORDER = 'rgba(0,212,182,0.15)';

const LINKS: Record<string, string[]> = {
  Shop: ['New Arrivals', 'Football Boots', 'Match Kits', 'Training Gear', 'Goalkeeper', 'Accessories', 'Sale'],
  Support: ['Track Order', 'Returns & Refunds', 'Size Guide', 'Authentication', 'Contact Us', 'FAQs'],
  Company: ['About Midfield', 'Careers', 'Press', 'Partnerships', 'Sustainability', 'Affiliates'],
};

const SOCIALS = [
  { icon: <Instagram size={16} />, label: 'Instagram', handle: '@midfield.fc' },
  { icon: <Twitter size={16} />, label: 'Twitter', handle: '@midfieldfc' },
  { icon: <Youtube size={16} />, label: 'YouTube', handle: 'Midfield TV' },
  { icon: <Facebook size={16} />, label: 'Facebook', handle: 'Midfield' },
];

const PAYMENTS = ['VISA', 'MC', 'AMEX', 'APPLE', 'PAYPAL', 'CRYPTO'];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <footer style={{
      background: '#010404',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      fontFamily: "'Barlow Condensed', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        .footer-link {
          font-family: 'Barlow', sans-serif; font-size: 12px;
          color: rgba(255,255,255,0.32); text-decoration: none;
          letter-spacing: 0.04em; transition: color 0.2s;
          display: block; padding: 4px 0; cursor: pointer; background: none; border: none;
        }
        .footer-link:hover { color: ${ACCENT}; }
        .social-btn {
          display: flex; align-items: center; gap: 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          padding: 10px 14px; cursor: pointer; transition: all 0.25s;
          text-decoration: none; width: 100%;
        }
        .social-btn:hover {
          background: rgba(0,212,182,0.06);
          border-color: rgba(0,212,182,0.25);
        }
        .footer-nl-input { caret-color: ${ACCENT}; }
        .footer-nl-input::placeholder { color: rgba(255,255,255,0.2); }
        .legal-link {
          font-family: 'Barlow', sans-serif; font-size: 10px;
          color: rgba(255,255,255,0.18); text-decoration: none;
          letter-spacing: 0.06em; transition: color 0.2s;
        }
        .legal-link:hover { color: ${ACCENT}; }
        @keyframes footer-ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .footer-ticker { animation: footer-ticker 30s linear infinite; display: flex; white-space: nowrap; }
      `}</style>

      {/* Top accent line */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${ACCENT}, rgba(0,212,182,0.4), transparent)`, boxShadow: `0 0 20px rgba(0,212,182,0.3)` }} />

      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: 0, left: '10%', width: 500, height: 300, background: 'radial-gradient(ellipse, rgba(0,212,182,0.05) 0%, transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* Ghost wordmark */}
      <div style={{
        position: 'absolute', bottom: 60, right: '-2%',
        fontSize: 'clamp(80px, 12vw, 180px)', fontWeight: 900, letterSpacing: '-0.06em',
        color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.025)',
        textTransform: 'uppercase', lineHeight: 1, userSelect: 'none', pointerEvents: 'none',
      }}>MIDFIELD</div>

      {/* ── MAIN BODY ── */}
      <div style={{ padding: 'clamp(48px, 6vw, 80px) clamp(20px, 4vw, 52px) 0', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr 1.2fr', gap: 48, marginBottom: 64 }}>

          {/* COL 1 — Brand */}
          <div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#fff', lineHeight: 1 }}>
                MID<span style={{ color: ACCENT }}>FIELD</span>
              </div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>
                The Apex of Football Culture
              </div>
            </div>

            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 300, lineHeight: 1.8, color: 'rgba(255,255,255,0.32)', maxWidth: 240, marginBottom: 28 }}>
              Premium football boots, kits and gear — blockchain verified, globally shipped, pro approved.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { icon: <ShieldCheck size={11} />, text: 'Blockchain Verified Auth' },
                { icon: <Globe size={11} />, text: '150+ Countries Shipped' },
                { icon: <Zap size={11} />, text: 'Same-Day Dispatch Available' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ color: ACCENT, flexShrink: 0 }}>{b.icon}</div>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.28)', letterSpacing: '0.05em' }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COLS 2–4 — Nav links */}
          {Object.entries(LINKS).map(([heading, links]) => (
            <div key={heading}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, marginBottom: 20 }}>{heading}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {links.map(l => (
                  <a key={l} href="#" className="footer-link">{l}</a>
                ))}
              </div>
            </div>
          ))}

          {/* COL 5 — Newsletter + Socials */}
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, marginBottom: 20 }}>Stay Ahead</div>

            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', lineHeight: 1.7, marginBottom: 16 }}>
              Drop alerts, exclusive deals, early access.
            </p>

            {sent ? (
              <div style={{ background: ACCENT_FAINT, border: `1px solid ${ACCENT_BORDER}`, borderLeft: `2px solid ${ACCENT}`, padding: '14px 16px', marginBottom: 28 }}>
                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: ACCENT }}>✓ You're In</span>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>First drop alert coming soon.</div>
              </div>
            ) : (
              <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, border: `1px solid ${focused ? 'rgba(0,212,182,0.35)' : 'rgba(255,255,255,0.08)'}`, background: 'rgba(255,255,255,0.02)', transition: 'border-color 0.3s' }}>
                  <input
                    className="footer-nl-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="your@email.com"
                    style={{ background: 'transparent', border: 'none', outline: 'none', fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#fff', padding: '12px 14px', letterSpacing: '0.04em' }}
                  />
                  <button
                    onClick={() => email.includes('@') && setSent(true)}
                    onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                    onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    style={{ background: ACCENT, border: 'none', color: '#020606', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase', padding: '11px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'filter 0.2s' }}
                  >
                    Subscribe <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href="#" className="social-btn">
                  <span style={{ color: ACCENT, flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)', flex: 1, letterSpacing: '0.05em' }}>{s.handle}</span>
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{s.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 28, marginBottom: 28, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginRight: 8 }}>We Accept</span>
          {PAYMENTS.map(p => (
            <div key={p} style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', padding: '5px 10px' }}>{p}</div>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShieldCheck size={12} style={{ color: ACCENT }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em' }}>256-bit SSL Secured</span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', padding: '18px clamp(20px, 4vw, 52px)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 2 }}>
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em' }}>
          © 2025 Midfield FC Ltd. All rights reserved.
        </span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map(l => (
            <a
              key={l}
              href="#"
              className="legal-link"
            >{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}