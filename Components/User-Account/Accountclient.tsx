'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/Components/Navbar';

interface Props {
    user: {
        name: string;
        email: string;
        joined: string;
    };
}

const STATS = [
    { n: '0', l: 'Orders' },
    { n: '0', l: 'Wishlist' },
    { n: '£0', l: 'Total Spent' },
    { n: '0', l: 'Active Drops' },
];

const STATUS_COLOR: Record<string, string> = {
    'Delivered': '#00d4b6',
    'In Transit': '#f59e0b',
    'Processing': 'rgba(255,255,255,0.4)',
};

export default function AccountClient({ user }: Props) {
    const router = useRouter();
    const initials = user.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#020606', minHeight: '100vh', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .grid-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; background-image: linear-gradient(rgba(0,212,182,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,182,0.025) 1px, transparent 1px); background-size: 56px 56px; }
        .grid-bg::after { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,212,182,0.06) 0%, transparent 70%); }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2); opacity: 0; } }
        .a1 { animation: fadeUp 0.6s 0.05s both; } .a2 { animation: fadeUp 0.6s 0.15s both; } .a3 { animation: fadeUp 0.6s 0.25s both; } .a4 { animation: fadeUp 0.6s 0.35s both; }
        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
        .stat-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-top: 2px solid #00d4b6; padding: 24px 28px; transition: border-color 0.25s, background 0.25s, transform 0.25s; }
        .stat-card:hover { background: rgba(0,212,182,0.04); border-color: rgba(0,212,182,0.3); border-top-color: #00d4b6; transform: translateY(-3px); }
        .order-row { display: grid; grid-template-columns: 1fr 2fr 1fr 1fr; align-items: center; padding: 16px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; gap: 16px; }
        .order-row:hover { background: rgba(255,255,255,0.02); }
        .order-row:last-child { border-bottom: none; }
        .quick-btn { display: flex; align-items: center; gap: 14px; padding: 18px 22px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.6); font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.25s; }
        .quick-btn:hover { background: rgba(0,212,182,0.05); border-color: rgba(0,212,182,0.25); color: #fff; }
        .quick-btn:hover .qb-arrow { color: #00d4b6; transform: translateX(4px); }
        .qb-arrow { transition: transform 0.25s, color 0.25s; color: rgba(255,255,255,0.2); margin-left: auto; }
        .logout-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.35); font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; padding: 10px 20px; cursor: pointer; transition: border-color 0.25s, color 0.25s; }
        .logout-btn:hover { border-color: rgba(255,60,60,0.4); color: rgba(255,100,100,0.8); }
        .ghost-text { position: fixed; font-size: clamp(100px, 18vw, 260px); font-weight: 900; letter-spacing: -0.04em; color: transparent; -webkit-text-stroke: 1px rgba(0,212,182,0.03); text-transform: uppercase; user-select: none; pointer-events: none; line-height: 1; z-index: 0; }
      `}</style>

            <div className="grid-bg" />
            <div className="ghost-text" style={{ bottom: '-2%', right: '-1%' }}>MDFLD</div>
            <div style={{ position: 'fixed', top: '-10%', left: '30%', width: 600, height: 500, background: 'radial-gradient(ellipse, rgba(0,212,182,0.06) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />

            <Navbar />

            <div style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '120px 40px 80px' }}>

                {/* GREETING */}
                <div className="a1" style={{ marginBottom: 64, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative', flexShrink: 0 }}>
                            <div style={{ position: 'absolute', inset: -3, background: 'linear-gradient(135deg, #00d4b6, transparent)', borderRadius: '50%' }} />
                            <div style={{ position: 'relative', width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(0,212,182,0.2), rgba(0,212,182,0.05))', border: '1px solid rgba(0,212,182,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="pulse-ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(0,212,182,0.4)' }} />
                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, color: '#00d4b6', letterSpacing: '-0.02em' }}>{initials}</span>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.7)', marginBottom: 6 }}>
                                Member since {user.joined}
                            </div>
                            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.9, margin: 0 }}>
                                {user.name.split(' ')[0]}&apos;s
                                <span style={{ display: 'block', background: 'linear-gradient(135deg, #00d4b6, #00b09c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 20px rgba(0,212,182,0.3))', paddingBottom: 4 }}>
                                    Dashboard.
                                </span>
                            </h1>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
                </div>

                {/* Laser line */}
                <div className="a1" style={{ height: 2, background: 'linear-gradient(90deg, #00d4b6, transparent)', boxShadow: '0 0 12px rgba(0,212,182,0.4)', marginBottom: 48, maxWidth: 300 }} />

                {/* STATS */}
                <div className="a2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 48 }}>
                    {STATS.map((s, i) => (
                        <div key={i} className="stat-card">
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</div>
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: 6 }}>{s.l}</div>
                        </div>
                    ))}
                </div>

                {/* MAIN GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24 }}>

                    {/* Orders */}
                    <div className="a3">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Recent Orders</span>
                            <a href="#" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00d4b6', textDecoration: 'none' }}>View All →</a>
                        </div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}>
                            <div className="order-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                                {['Order ID', 'Item', 'Status', 'Price'].map(h => (
                                    <span key={h} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{h}</span>
                                ))}
                            </div>
                            {/* Empty state */}
                            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: 'rgba(255,255,255,0.15)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>No orders yet</div>
                                <a href="/shop" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#00d4b6', textDecoration: 'none', letterSpacing: '0.08em' }}>Browse the shop →</a>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="a4" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Quick Actions</span>
                        {[
                            { label: 'My Orders', icon: '📦', href: '#' },
                            { label: 'Wishlist', icon: '♡', href: '#' },
                            { label: 'My Addresses', icon: '📍', href: '#' },
                            { label: 'Settings', icon: '⚙', href: '#' },
                        ].map((item, i) => (
                            <a key={i} href={item.href} className="quick-btn">
                                <span style={{ fontSize: 16 }}>{item.icon}</span>
                                <span>{item.label}</span>
                                <span className="qb-arrow">→</span>
                            </a>
                        ))}

                        {/* Member card */}
                        <div style={{ marginTop: 8, background: 'linear-gradient(135deg, rgba(0,212,182,0.1), rgba(0,212,182,0.03))', border: '1px solid rgba(0,212,182,0.2)', padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: 'linear-gradient(to left, rgba(0,212,182,0.05), transparent)' }} />
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.6)', marginBottom: 8 }}>Member Status</div>
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900, color: '#00d4b6', letterSpacing: '-0.02em' }}>Elite ✦</div>
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Early access to all drops</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}