'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PERKS = [
  'Early access to exclusive drops',
  'Blockchain verified authentication',
  'Free shipping on first order',
  'Members-only pricing',
];

export default function SignupPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [focus, setFocus] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSignup = async () => {
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/account');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: '#020606', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'stretch' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Oswald:wght@400;500;600;700&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Background & Overlays */
        .bg-image { position: absolute; inset: 0; z-index: 0; background-image: url('https://images.unsplash.com/photo-1556056504-5c7696c4c28d?q=80&w=2500&auto=format&fit=crop'); background-size: cover; background-position: center; filter: grayscale(40%) contrast(120%); }
        .bg-overlay { position: absolute; inset: 0; z-index: 1; background: linear-gradient(135deg, rgba(2,6,6,0.95) 0%, rgba(2,6,6,0.7) 40%, rgba(0,212,182,0.15) 100%); }
        .grid-bg { position: absolute; inset: 0; z-index: 2; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 56px 56px; }
        
        /* Animations */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes shimmer { 0% { transform: translateX(-100%) skewX(-15deg); } 100% { transform: translateX(400%) skewX(-15deg); } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-12px) rotate(1deg); } }
        
        .a1 { animation: fadeUp 0.6s 0.05s both; } .a2 { animation: fadeUp 0.6s 0.15s both; } .a3 { animation: fadeUp 0.6s 0.25s both; } .a4 { animation: fadeUp 0.6s 0.35s both; } .a5 { animation: fadeUp 0.6s 0.45s both; } .a6 { animation: fadeUp 0.6s 0.55s both; } .a7 { animation: fadeUp 0.6s 0.65s both; }
        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .float-el { animation: float 5s ease-in-out infinite; }
        
        /* Glassmorphism Left Panel (Form) */
        .glass-panel { background: rgba(5, 12, 10, 0.45); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border-right: 1px solid rgba(255,255,255,0.05); box-shadow: 20px 0 40px rgba(0,0,0,0.5); }
        
        /* Inputs */
        .input-wrap { position: relative; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); backdrop-filter: blur(10px); transition: border-color 0.3s, box-shadow 0.3s, background 0.3s; display: flex; align-items: center; border-radius: 4px; }
        .input-wrap.focused { border-color: rgba(0,212,182,0.6); background: rgba(0,212,182,0.05); box-shadow: 0 0 0 1px rgba(0,212,182,0.1), 0 4px 24px rgba(0,212,182,0.08); }
        .input-wrap input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Inter', sans-serif; font-size: 14px; color: #fff; padding: 14px 18px; letter-spacing: 0.01em; caret-color: #00d4b6; }
        .input-wrap input::placeholder { color: rgba(255,255,255,0.25); }
        
        .input-label { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-bottom: 8px; display: block; transition: color 0.3s; }
        .input-label.active { color: #00d4b6; }
        
        /* Buttons */
        .btn-primary { position: relative; overflow: hidden; background: #00d4b6; border: none; color: #020606; font-family: 'Oswald', sans-serif; font-size: 16px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; padding: 18px 32px; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 4px; transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s; box-shadow: 0 8px 24px rgba(0,212,182,0.2); }
        .btn-primary:hover:not(:disabled) { opacity: 0.95; transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,212,182,0.3); }
        .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; box-shadow: none; }
        .btn-primary .shimmer-bar { animation: shimmer 2.5s ease-in-out infinite; position: absolute; top: 0; left: 0; width: 30%; height: 100%; background: rgba(255,255,255,0.3); }
        
        .btn-google { position: relative; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.8); font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500; padding: 14px 24px; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; border-radius: 4px; backdrop-filter: blur(10px); transition: border-color 0.3s, background 0.3s, color 0.3s, transform 0.2s; }
        .btn-google:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.08); color: #fff; transform: translateY(-1px); }
        
        /* Misc UI */
        .divider { display: flex; align-items: center; gap: 16px; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .divider-text { font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.4); }
        
        .perk-check { width: 22px; height: 22px; border-radius: 50%; background: rgba(0,212,182,0.1); border: 1px solid rgba(0,212,182,0.3); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        
        .checkbox-wrap { display: flex; align-items: flex-start; gap: 12px; cursor: pointer; user-select: none; }
        .checkbox-box { width: 18px; height: 18px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: transparent; flex-shrink: 0; margin-top: 2px; display: flex; align-items: center; justify-content: center; transition: border-color 0.25s, background 0.25s; }
        .checkbox-box.checked { border-color: #00d4b6; background: rgba(0,212,182,0.15); }
        
        .link-accent { color: #00d4b6; text-decoration: none; font-weight: 500; transition: opacity 0.2s; }
        .link-accent:hover { opacity: 0.75; }
        
        .ghost-text { position: absolute; font-size: clamp(80px, 14vw, 220px); font-weight: 700; letter-spacing: -0.02em; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.03); text-transform: uppercase; user-select: none; pointer-events: none; line-height: 1; z-index: 2; }
        
        .error-box { background: rgba(255,60,60,0.1); border: 1px solid rgba(255,60,60,0.3); border-radius: 4px; padding: 14px 16px; margin-bottom: 24px; font-family: 'Inter', sans-serif; font-size: 13px; color: #ff6b6b; display: flex; align-items: center; gap: 8px; }
      `}</style>

      {/* Background Layers */}
      <div className="bg-image" />
      <div className="bg-overlay" />
      <div className="grid-bg" />
      
      <div className="ghost-text" style={{ bottom: '-2%', right: '-2%' }}>JOIN</div>
      <div style={{ position: 'absolute', top: '20%', right: '10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,212,182,0.08) 0%, transparent 60%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 2 }} />

      {/* LEFT PANEL — Form (Glassmorphism) */}
      <div className="glass-panel" style={{ flex: 1, position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 64px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          <Link href="/" style={{ display: 'inline-block', fontFamily: "'Oswald', sans-serif", fontSize: 28, fontWeight: 700, letterSpacing: '0.02em', color: '#fff', textDecoration: 'none', textTransform: 'uppercase', marginBottom: 36 }} className="a1">
            mdfld<span style={{ color: '#00d4b6' }}>.</span>
          </Link>

          <h2 className="a2" style={{ fontSize: 36, fontWeight: 700, textTransform: 'uppercase', color: '#fff', marginBottom: 8 }}>Create Account</h2>
          <p className="a3" style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.5)', marginBottom: 36 }}>
            Already have an account? <a href="/login" className="link-accent">Sign in &rarr;</a>
          </p>

          {/* Google */}
          <div className="a3">
            <button className="btn-google" onClick={() => window.location.href = '/api/auth/google'}>
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Sign up with Google
            </button>
          </div>

          <div className="divider a4" style={{ margin: '28px 0' }}>
            <div className="divider-line" /><span className="divider-text">or register with email</span><div className="divider-line" />
          </div>

          {/* Error */}
          {error && (
            <div className="error-box a4">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          {/* Name + Email */}
          <div className="a4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
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
          <div className="a5" style={{ marginBottom: 16 }}>
            <label className={`input-label${focus === 'password' ? ' active' : ''}`}>Password</label>
            <div className={`input-wrap${focus === 'password' ? ' focused' : ''}`}>
              <input type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={set('password')} onFocus={() => setFocus('password')} onBlur={() => setFocus(null)} />
              <button onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '0 18px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00d4b6')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div className="a5" style={{ marginBottom: 28 }}>
            <label className={`input-label${focus === 'confirm' ? ' active' : ''}`}>Confirm Password</label>
            <div className={`input-wrap${focus === 'confirm' ? ' focused' : ''}`}>
              <input type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} onFocus={() => setFocus('confirm')} onBlur={() => setFocus(null)} />
              <button onClick={() => setShowConfirm(p => !p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: '0 18px', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#00d4b6')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="a6" style={{ marginBottom: 32 }}>
            <label className="checkbox-wrap" onClick={() => setAgreed(p => !p)}>
              <div className={`checkbox-box${agreed ? ' checked' : ''}`}>
                {agreed && <Check size={12} color="#00d4b6" strokeWidth={3} />}
              </div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                I agree to the <a href="#" className="link-accent" onClick={e => e.stopPropagation()}>Terms of Service</a> and <a href="#" className="link-accent" onClick={e => e.stopPropagation()}>Privacy Policy</a>
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="a7">
            <button className="btn-primary" onClick={handleSignup} disabled={!agreed || loading}>
              <div className="shimmer-bar" />
              <span style={{ position: 'relative', zIndex: 2 }}>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight size={18} style={{ position: 'relative', zIndex: 2 }} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — Perks */}
      <div style={{ flex: '0 0 40%', position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '56px 64px' }}>
        <div className="a1" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, backdropFilter: 'blur(10px)', padding: '8px 20px 8px 10px', marginBottom: 40, alignSelf: 'flex-start' }}>
          <div style={{ position: 'relative', width: 8, height: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00d4b6', opacity: 0.5 }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00d4b6', position: 'relative', zIndex: 1 }} />
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00d4b6' }}>Why Join mdfld</span>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 4 }}>
          <h1 className="a2" style={{ fontSize: 'clamp(48px, 5.5vw, 80px)', fontWeight: 700, lineHeight: 1.1, textTransform: 'uppercase', color: '#fff', margin: 0 }}>Join The</h1>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: 32 }}>
          <h1 className="a3" style={{ fontSize: 'clamp(48px, 5.5vw, 80px)', fontWeight: 700, lineHeight: 1.1, textTransform: 'uppercase', margin: 0, background: 'linear-gradient(135deg, #00d4b6, #008f7a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 24px rgba(0,212,182,0.2))', paddingBottom: 6 }}>Elite.</h1>
        </div>
        <div className="a3" style={{ height: 3, width: 140, background: 'linear-gradient(90deg, #00d4b6, transparent)', boxShadow: '0 0 16px rgba(0,212,182,0.6)', marginBottom: 40, borderRadius: 2 }} />
        
        <div className="a4" style={{ display: 'flex', flexDirection: 'column', marginBottom: 48 }}>
          {PERKS.map((perk, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="perk-check"><Check size={12} color="#00d4b6" strokeWidth={3} /></div>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 300, color: 'rgba(255,255,255,0.8)' }}>{perk}</span>
            </div>
          ))}
        </div>
        
        <div className="float-el a5" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)', borderLeft: '3px solid #00d4b6', padding: '20px 24px', alignSelf: 'flex-start', borderRadius: '0 4px 4px 0' }}>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00d4b6', marginBottom: 8 }}>Community</div>
          <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 36, fontWeight: 600, color: '#fff', lineHeight: 1 }}>12K<span style={{ color: '#00d4b6' }}>+</span></div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Members & growing every day</div>
        </div>
      </div>
    </div>
  );
}