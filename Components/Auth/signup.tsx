'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';

const PERKS = [
  'Early access to exclusive drops',
  'Blockchain verified authentication',
  'Free shipping on first order',
  'Members-only pricing',
];

export default function SignupPage() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [focus, setFocus] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

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
          background: radial-gradient(ellipse 70% 60% at 80% 40%, rgba(0,212,182,0.07) 0%, transparent 65%);
        }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes shimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(400%) skewX(-15deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        @keyframes draw { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }

        .a1 { animation: fadeUp 0.6s 0.05s both; }
        .a2 { animation: fadeUp 0.6s 0.15s both; }
        .a3 { animation: fadeUp 0.6s 0.25s both; }
        .a4 { animation: fadeUp 0.6s 0.35s both; }
        .a5 { animation: fadeUp 0.6s 0.45s both; }
        .a6 { animation: fadeUp 0.6s 0.55s both; }
        .a7 { animation: fadeUp 0.6s 0.65s both; }
        .a8 { animation: fadeUp 0.6s 0.75s both; }

        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .float-el   { animation: float 5s ease-in-out infinite; }

        .input-wrap {
          position: relative; border: 1px solid rgba(255,255,255,0.08);
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
          padding: 14px 18px; letter-spacing: 0.02em; caret-color: #00d4b6;
        }
        .input-wrap input::placeholder { color: rgba(255,255,255,0.2); }
        .input-label {
          font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 700;
          letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-bottom: 7px; display: block;
          transition: color 0.25s;
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
        .btn-primary .shimmer-bar { animation: shimmer 2.5s ease-in-out infinite; position: absolute; top: 0; left: 0; width: 30%; height: 100%; background: rgba(255,255,255,0.25); }

        .btn-google {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.7); font-family: 'Barlow', sans-serif;
          font-size: 13px; font-weight: 600; letter-spacing: 0.05em;
          padding: 14px 24px; cursor: pointer; width: 100%;
          display: flex; align-items: center; justify-content: center; gap: 12px;
          transition: border-color 0.25s, background 0.25s, color 0.25s;
        }
        .btn-google:hover { border-color: rgba(0,212,182,0.35); background: rgba(0,212,182,0.04); color: #fff; }

        .divider { display: flex; align-items: center; gap: 16px; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .divider-text { font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.25em; text-transform: uppercase; color: rgba(255,255,255,0.22); }

        .perk-item {
          display: flex; align-items: center; gap: 12;
          padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .perk-check {
          width: 20px; height: 20px; border-radius: 50%; background: rgba(0,212,182,0.12);
          border: 1px solid rgba(0,212,182,0.25); display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .checkbox-wrap {
          display: flex; align-items: flex-start; gap: 12; cursor: pointer;
        }
        .checkbox-box {
          width: 18px; height: 18px; border: 1px solid rgba(255,255,255,0.2);
          background: transparent; flex-shrink: 0; margin-top: 1px;
          display: flex; align-items: center; justify-content: center;
          transition: border-color 0.25s, background 0.25s; cursor: pointer;
        }
        .checkbox-box.checked { border-color: #00d4b6; background: rgba(0,212,182,0.15); }

        .link-accent { color: #00d4b6; text-decoration: none; font-weight: 600; transition: opacity 0.2s; }
        .link-accent:hover { opacity: 0.75; }

        .ghost-text {
          position: absolute; font-size: clamp(80px, 12vw, 180px); font-weight: 900;
          letter-spacing: -0.04em; color: transparent;
          -webkit-text-stroke: 1px rgba(0,212,182,0.04);
          text-transform: uppercase; user-select: none; pointer-events: none; line-height: 1;
        }
      `}</style>

      {/* Grid */}
      <div className="grid-bg" />

      {/* Ghost text */}
      <div className="ghost-text" style={{ bottom: '2%', right: '-2%', zIndex: 0 }}>JOIN</div>

      {/* Blob */}
      <div style={{ position: 'absolute', top: '-8%', right: '-5%', width: 550, height: 450, background: 'radial-gradient(ellipse, rgba(0,212,182,0.07) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* ─── LEFT PANEL — Form ─── */}
      <div style={{ flex: 1, position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 64px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>

          {/* Logo */}
          <a href="/" style={{ display: 'inline-block', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', textDecoration: 'none', marginBottom: 36 }} className="a1">
            mdfld<span style={{ color: '#00d4b6' }}>.</span>
          </a>

          <h2 className="a2" style={{ fontSize: 32, fontWeight: 900, textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>Create Account</h2>
          <p className="a3" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 28, letterSpacing: '0.02em' }}>
            Already have an account? <a href="/login" className="link-accent">Sign in →</a>
          </p>

          {/* Google */}
          <div className="a3">
            <button className="btn-google">
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign up with Google
            </button>
          </div>

          {/* Divider */}
          <div className="divider a4" style={{ margin: '22px 0' }}>
            <div className="divider-line" />
            <span className="divider-text">or</span>
            <div className="divider-line" />
          </div>

          {/* Name + Email row */}
          <div className="a4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label className={`input-label${focus === 'name' ? ' active' : ''}`}>Full Name</label>
              <div className={`input-wrap${focus === 'name' ? ' focused' : ''}`}>
                <input type="text" placeholder="John Doe" value={form.name} onChange={set('name')} onFocus={() => setFocus('name')} onBlur={() => setFocus(null)} />
              </div>
            </div>
            <div>
              <label className={`input-label${focus === 'email' ? ' active' : ''}`}>Email</label>
              <div className={`input-wrap${focus === 'email' ? ' focused' : ''}`}>
                <input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} onFocus={() => setFocus('email')} onBlur={() => setFocus(null)} />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="a5" style={{ marginBottom: 14 }}>
            <label className={`input-label${focus === 'password' ? ' active' : ''}`}>Password</label>
            <div className={`input-wrap${focus === 'password' ? ' focused' : ''}`}>
              <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={set('password')} onFocus={() => setFocus('password')} onBlur={() => setFocus(null)} />
              <button onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.28)', padding: '0 16px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00d4b6')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}>
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div className="a5" style={{ marginBottom: 22 }}>
            <label className={`input-label${focus === 'confirm' ? ' active' : ''}`}>Confirm Password</label>
            <div className={`input-wrap${focus === 'confirm' ? ' focused' : ''}`}>
              <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} onFocus={() => setFocus('confirm')} onBlur={() => setFocus(null)} />
              <button onClick={() => setShowConfirm(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.28)', padding: '0 16px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00d4b6')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}>
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Terms checkbox */}
          <div className="a6" style={{ marginBottom: 24 }}>
            <label className="checkbox-wrap" onClick={() => setAgreed(p => !p)}>
              <div className={`checkbox-box${agreed ? ' checked' : ''}`}>
                {agreed && <Check size={11} color="#00d4b6" strokeWidth={3} />}
              </div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.55, letterSpacing: '0.02em' }}>
                I agree to the{' '}
                <a href="#" className="link-accent" onClick={e => e.stopPropagation()}>Terms of Service</a>{' '}
                and{' '}
                <a href="#" className="link-accent" onClick={e => e.stopPropagation()}>Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="a7">
            <button className="btn-primary" disabled={!agreed} style={{ opacity: agreed ? 1 : 0.45, cursor: agreed ? 'pointer' : 'not-allowed' }}>
              <div className="shimmer-bar" />
              <span style={{ position: 'relative', zIndex: 2 }}>Create Account</span>
              <ArrowRight size={16} style={{ position: 'relative', zIndex: 2 }} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── RIGHT PANEL — Perks ─── */}
      <div style={{ flex: '0 0 40%', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 56px' }}>

        {/* Eyebrow */}
        <div className="a1" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', padding: '7px 16px 7px 9px', marginBottom: 36, alignSelf: 'flex-start' }}>
          <div style={{ position: 'relative', width: 7, height: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00d4b6', opacity: 0.5 }} />
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#00d4b6', position: 'relative', zIndex: 1 }} />
          </div>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.32em', textTransform: 'uppercase', color: '#00d4b6' }}>Why Join mdfld</span>
        </div>

        {/* Headline */}
        <div style={{ overflow: 'hidden', marginBottom: 2 }}>
          <h1 className="a2" style={{ fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 900, lineHeight: 0.88, textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.03em', margin: 0 }}>Join The</h1>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 24 }}>
          <h1 className="a3" style={{ fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 900, lineHeight: 0.88, textTransform: 'uppercase', letterSpacing: '-0.03em', margin: 0, background: 'linear-gradient(135deg, #00d4b6, #00b09c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 20px rgba(0,212,182,0.22))', paddingBottom: 6 }}>
            Elite.
          </h1>
        </div>

        {/* Laser line */}
        <div className="a3" style={{ height: 2, width: 140, background: 'linear-gradient(90deg, #00d4b6, transparent)', boxShadow: '0 0 8px #00d4b6', marginBottom: 36 }} />

        {/* Perks list */}
        <div className="a4" style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 40 }}>
          {PERKS.map((perk, i) => (
            <div key={i} className="perk-item" style={{ animationDelay: `${0.4 + i * 0.1}s`, display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="perk-check">
                <Check size={10} color="#00d4b6" strokeWidth={3} />
              </div>
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.02em' }}>{perk}</span>
            </div>
          ))}
        </div>

        {/* Floating stat card */}
        <div className="float-el a5" style={{ background: 'rgba(5,14,12,0.75)', backdropFilter: 'blur(18px)', border: '1px solid rgba(255,255,255,0.06)', borderLeft: '2px solid #00d4b6', padding: '18px 22px 18px 18px', alignSelf: 'flex-start' }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.6)', marginBottom: 6 }}>Community</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>12K<span style={{ color: '#00d4b6' }}>+</span></div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginTop: 4, letterSpacing: '0.04em' }}>Members & growing every day</div>
        </div>
      </div>
    </div>
  );
}