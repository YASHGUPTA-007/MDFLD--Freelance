'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Chrome } from 'lucide-react';

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);

  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#020606', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,800&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .grid-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,212,182,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,182,0.03) 1px, transparent 1px);
          background-size: 56px 56px;
        }
        .grid-bg::after {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse 80% 70% at 20% 50%, rgba(0,212,182,0.07) 0%, transparent 60%);
        }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes shimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(400%) skewX(-15deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        .animate-1 { animation: fadeUp 0.6s 0.1s both; }
        .animate-2 { animation: fadeUp 0.6s 0.2s both; }
        .animate-3 { animation: fadeUp 0.6s 0.3s both; }
        .animate-4 { animation: fadeUp 0.6s 0.4s both; }
        .animate-5 { animation: fadeUp 0.6s 0.5s both; }
        .animate-6 { animation: fadeUp 0.6s 0.6s both; }
        .animate-7 { animation: fadeUp 0.6s 0.7s both; }

        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .float-el { animation: float 4s ease-in-out infinite; }

        .input-wrap {
          position: relative;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.025);
          transition: border-color 0.3s, box-shadow 0.3s;
          display: flex; align-items: center;
        }
        .input-wrap.focused {
          border-color: rgba(0,212,182,0.5);
          box-shadow: 0 0 0 1px rgba(0,212,182,0.1), 0 4px 24px rgba(0,212,182,0.06);
        }
        .input-wrap input {
          flex: 1; background: transparent; border: none; outline: none;
          font-family: 'Barlow', sans-serif; font-size: 14px; color: #fff;
          padding: 15px 18px; letter-spacing: 0.02em; caret-color: #00d4b6;
        }
        .input-wrap input::placeholder { color: rgba(255,255,255,0.22); }
        .input-label {
          font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); margin-bottom: 8px; display: block;
        }
        .input-label.active { color: #00d4b6; }

        .btn-primary {
          position: relative; overflow: hidden; background: #00d4b6;
          border: none; color: #020606;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 14px; font-weight: 800; letter-spacing: 0.25em;
          text-transform: uppercase; padding: 16px 32px; cursor: pointer;
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
          transition: opacity 0.2s, transform 0.2s;
        }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary .shimmer { animation: shimmer 2.5s ease-in-out infinite; position: absolute; top: 0; left: 0; width: 30%; height: 100%; background: rgba(255,255,255,0.25); }

        .btn-google {
          position: relative; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);
          font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 600;
          letter-spacing: 0.05em; padding: 14px 24px; cursor: pointer;
          width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px;
          transition: border-color 0.25s, background 0.25s, color 0.25s;
        }
        .btn-google:hover { border-color: rgba(0,212,182,0.35); background: rgba(0,212,182,0.04); color: #fff; }

        .divider {
          display: flex; align-items: center; gap: 16px;
        }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.22); }

        .stat-card {
          background: rgba(5,12,10,0.7); backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.06); border-left: 2px solid #00d4b6;
          padding: 14px 20px 14px 16px;
        }

        .link-accent {
          color: #00d4b6; text-decoration: none; font-weight: 600;
          transition: opacity 0.2s;
        }
        .link-accent:hover { opacity: 0.75; }

        .forgot-link {
          font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500;
          letter-spacing: 0.1em; color: rgba(255,255,255,0.3); text-decoration: none;
          transition: color 0.2s;
        }
        .forgot-link:hover { color: #00d4b6; }

        .ghost-text {
          position: absolute; font-size: clamp(80px, 12vw, 180px); font-weight: 900;
          letter-spacing: -0.04em; color: transparent;
          -webkit-text-stroke: 1px rgba(0,212,182,0.04);
          text-transform: uppercase; user-select: none; pointer-events: none; line-height: 1;
        }
      `}</style>

      {/* Grid bg */}
      <div className="grid-bg" />

      {/* Ghost text */}
      <div className="ghost-text" style={{ bottom: '5%', left: '-2%', zIndex: 0 }}>MDFLD</div>

      {/* Top accent blob */}
      <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 400, background: 'radial-gradient(ellipse, rgba(0,212,182,0.08) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ─── LEFT PANEL — Branding ─── */}
      <div style={{ flex: '0 0 45%', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 56px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>

        {/* Logo */}
        <div className="animate-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', userSelect: 'none' }}>
          mdfld<span style={{ color: '#00d4b6' }}>.</span>
        </div>

        {/* Center content */}
        <div>
          {/* Eyebrow */}
          <div className="animate-2" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '7px 16px 7px 9px', marginBottom: 32 }}>
            <div style={{ position: 'relative', width: 7, height: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00d4b6', opacity: 0.5 }} />
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4b6', position: 'relative', zIndex: 1 }} />
            </div>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#00d4b6' }}>Members Only Access</span>
          </div>

          {/* Headline */}
          <div style={{ overflow: 'hidden', marginBottom: 2 }}>
            <h1 className="animate-3" style={{ fontSize: 'clamp(52px, 6vw, 86px)', fontWeight: 900, lineHeight: 0.88, textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>
              Welcome
            </h1>
          </div>
          <div style={{ overflow: 'hidden', marginBottom: 28 }}>
            <h1 className="animate-4" style={{ fontSize: 'clamp(52px, 6vw, 86px)', fontWeight: 900, lineHeight: 0.88, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: 0, background: 'linear-gradient(135deg, #00d4b6, #00b09c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 24px rgba(0,212,182,0.25))', paddingBottom: 6 }}>
              Back.
            </h1>
          </div>

          {/* Laser line */}
          <div className="animate-4" style={{ height: 2, width: 180, background: 'linear-gradient(90deg, #00d4b6, transparent)', boxShadow: '0 0 10px #00d4b6', marginBottom: 28 }} />

          <p className="animate-5" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 15, fontWeight: 300, lineHeight: 1.75, color: 'rgba(255,255,255,0.4)', maxWidth: 320 }}>
            Sign in to access exclusive drops, manage your collection, and dominate the midfield.
          </p>
        </div>

        {/* Bottom stats */}
        <div className="animate-6" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { n: '12K+', l: 'Members Worldwide' },
            { n: '5K+',  l: 'Exclusive Drops' },
          ].map((s, i) => (
            <div key={i} className="stat-card float-el" style={{ animationDelay: `${i * 0.8}s` }}>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, color: '#00d4b6', letterSpacing: '-0.02em', lineHeight: 1 }}>{s.n}</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── RIGHT PANEL — Form ─── */}
      <div style={{ flex: 1, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 64px' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          <h2 className="animate-1" style={{ fontSize: 32, fontWeight: 900, textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Sign In</h2>
          <p className="animate-2" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginBottom: 36, letterSpacing: '0.02em' }}>
            Don't have an account? <a href="/signup" className="link-accent">Create one →</a>
          </p>

          {/* Google */}
          <div className="animate-3">
            <button className="btn-google">
              {/* Google SVG */}
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="divider animate-4" style={{ margin: '24px 0' }}>
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          {/* Email */}
          <div className="animate-5" style={{ marginBottom: 18 }}>
            <label className={`input-label${emailFocus ? ' active' : ''}`}>Email Address</label>
            <div className={`input-wrap${emailFocus ? ' focused' : ''}`}>
              <input
                type="email" placeholder="you@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)}
              />
            </div>
          </div>

          {/* Password */}
          <div className="animate-5" style={{ marginBottom: 10 }}>
            <label className={`input-label${passFocus ? ' active' : ''}`}>Password</label>
            <div className={`input-wrap${passFocus ? ' focused' : ''}`}>
              <input
                type={showPass ? 'text' : 'password'} placeholder="••••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)}
              />
              <button onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.28)', padding: '0 16px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00d4b6')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className="animate-5" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 28 }}>
            <a href="#" className="forgot-link">Forgot password?</a>
          </div>

          {/* Submit */}
          <div className="animate-6">
            <button className="btn-primary">
              <div className="shimmer" />
              <span style={{ position: 'relative', zIndex: 2 }}>Sign In</span>
              <ArrowRight size={16} style={{ position: 'relative', zIndex: 2 }} />
            </button>
          </div>

          {/* Terms */}
          <p className="animate-7" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.2)', marginTop: 20, lineHeight: 1.6, textAlign: 'center', letterSpacing: '0.03em' }}>
            By signing in you agree to our{' '}
            <a href="#" style={{ color: 'rgba(0,212,182,0.6)', textDecoration: 'none' }}>Terms of Service</a>{' '}
            and{' '}
            <a href="#" style={{ color: 'rgba(0,212,182,0.6)', textDecoration: 'none' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}