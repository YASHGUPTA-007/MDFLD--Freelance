'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ACCENT = '#00d4b6';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocus, setEmailFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin/dashboard');
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
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#020606', minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,800;0,900;1,800&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .grid-bg { position: absolute; inset: 0; pointer-events: none; background-image: linear-gradient(rgba(0,212,182,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,182,0.03) 1px, transparent 1px); background-size: 56px 56px; }
        .grid-bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 70% at 20% 50%, rgba(0,212,182,0.07) 0%, transparent 60%); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .input-wrap { position: relative; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.025); transition: border-color 0.3s, box-shadow 0.3s; display: flex; align-items: center; }
        .input-wrap.focused { border-color: rgba(0,212,182,0.5); box-shadow: 0 0 0 1px rgba(0,212,182,0.1), 0 4px 24px rgba(0,212,182,0.06); }
        .input-wrap input { flex: 1; background: transparent; border: none; outline: none; font-family: 'Barlow', sans-serif; font-size: 14px; color: #fff; padding: 15px 18px; letter-spacing: 0.02em; caret-color: #00d4b6; }
        .input-wrap input::placeholder { color: rgba(255,255,255,0.22); }
        .input-label { font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.28em; text-transform: uppercase; color: rgba(255,255,255,0.35); margin-bottom: 8px; display: block; }
        .input-label.active { color: #00d4b6; }
        .btn-primary { position: relative; overflow: hidden; background: #00d4b6; border: none; color: #020606; font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 800; letter-spacing: 0.25em; text-transform: uppercase; padding: 16px 32px; cursor: pointer; width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; transition: opacity 0.2s, transform 0.2s; }
        .btn-primary:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .error-box { background: rgba(255,60,60,0.08); border: 1px solid rgba(255,60,60,0.25); padding: 12px 16px; margin-bottom: 20px; font-family: 'Barlow', sans-serif; font-size: 12px; color: rgba(255,100,100,0.9); letter-spacing: 0.04em; }
      `}</style>

      <div className="grid-bg" />
      
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440, padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(0,212,182,0.1)', border: '1px solid rgba(0,212,182,0.2)', marginBottom: 24 }}>
            <Shield style={{ width: 32, height: 32, color: ACCENT }} />
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, fontWeight: 900, letterSpacing: '-0.02em', color: '#fff', marginBottom: 12, textTransform: 'uppercase' }}>Admin Portal</h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="error-box" style={{ animation: 'fadeUp 0.4s ease both' }}>
            {error}
          </div>
        )}

        <div style={{ marginBottom: 24 }}>
          <label className={`input-label ${emailFocus ? 'active' : ''}`}>Email Address</label>
          <div className={`input-wrap ${emailFocus ? 'focused' : ''}`}>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              placeholder="admin@example.com"
            />
          </div>
        </div>

        <div style={{ marginBottom: 32 }}>
          <label className={`input-label ${passFocus ? 'active' : ''}`}>Password</label>
          <div className={`input-wrap ${passFocus ? 'focused' : ''}`}>
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setPassFocus(true)}
              onBlur={() => setPassFocus(false)}
              placeholder="Enter your password"
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 18px', color: 'rgba(255,255,255,0.3)', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = ACCENT}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? 'Signing In...' : 'Sign In'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  );
}
