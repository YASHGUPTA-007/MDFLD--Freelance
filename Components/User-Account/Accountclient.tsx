'use client';

import React, { useState } from 'react';

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
    { n: '$0', l: 'Total Spent' },
    { n: '0',  l: 'Active Drops' },
];

export default function AccountClient({ user }: Props) {
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({ name: user.name, email: user.email, phone: '', address: '' });

    const initials = user.name
        .split(' ')
        .map((w: string) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse-ring {
                    0%   { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(2); opacity: 0; }
                }

                .ac-a1 { animation: fadeUp 0.55s 0.05s both; }
                .ac-a2 { animation: fadeUp 0.55s 0.15s both; }
                .ac-a3 { animation: fadeUp 0.55s 0.25s both; }
                .ac-a4 { animation: fadeUp 0.55s 0.35s both; }

                .ac-pulse { animation: pulse-ring 2s ease-out infinite; }

                /* ── Stat cards ── */
                .ac-stat {
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-top: 2px solid #00d4b6;
                    padding: 20px 24px;
                    transition: background 0.25s, border-color 0.25s, transform 0.25s;
                }
                .ac-stat:hover {
                    background: rgba(0,212,182,0.04);
                    border-color: rgba(0,212,182,0.3);
                    transform: translateY(-3px);
                }

                /* ── Order table ── */
                .ac-order-row {
                    display: grid;
                    grid-template-columns: 1fr 2fr 1fr 1fr;
                    align-items: center;
                    padding: 15px 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    gap: 16px;
                    transition: background 0.2s;
                }
                .ac-order-row:hover { background: rgba(255,255,255,0.02); }
                .ac-order-row:last-child { border-bottom: none; }

                /* ── Quick action btns ── */
                .ac-quick {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    padding: 16px 20px;
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.55);
                    font-family: 'Barlow', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.25s;
                }
                .ac-quick:hover {
                    background: rgba(0,212,182,0.05);
                    border-color: rgba(0,212,182,0.25);
                    color: #fff;
                }
                .ac-quick:hover .ac-arrow {
                    color: #00d4b6;
                    transform: translateX(4px);
                }
                .ac-arrow {
                    transition: transform 0.25s, color 0.25s;
                    color: rgba(255,255,255,0.2);
                    margin-left: auto;
                    font-size: 14px;
                }

                /* ── Edit form inputs ── */
                .ac-input {
                    width: 100%;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: #fff;
                    font-family: 'Barlow', sans-serif;
                    font-size: 13px;
                    font-weight: 400;
                    padding: 10px 14px;
                    outline: none;
                    transition: border-color 0.2s;
                    box-sizing: border-box;
                }
                .ac-input:focus { border-color: rgba(0,212,182,0.45); }
                .ac-input::placeholder { color: rgba(255,255,255,0.18); }

                /* ── Edit toggle btn ── */
                .ac-edit-btn {
                    background: transparent;
                    border: 1px solid rgba(0,212,182,0.25);
                    color: rgba(0,212,182,0.7);
                    font-family: 'Barlow', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    padding: 8px 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ac-edit-btn:hover {
                    border-color: #00d4b6;
                    color: #00d4b6;
                    background: rgba(0,212,182,0.04);
                }

                /* ── Save btn ── */
                .ac-save-btn {
                    background: rgba(0,212,182,0.1);
                    border: 1px solid #00d4b6;
                    color: #00d4b6;
                    font-family: 'Barlow', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    padding: 10px 24px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ac-save-btn:hover {
                    background: rgba(0,212,182,0.18);
                    box-shadow: 0 0 16px rgba(0,212,182,0.2);
                }
            `}</style>

            {/* ── HEADER ──────────────────────────────────── */}
            <div className="ac-a1" style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <div style={{ position: 'absolute', inset: -3, background: 'linear-gradient(135deg, #00d4b6, transparent)', borderRadius: '50%' }} />
                        <div style={{
                            position: 'relative', width: 68, height: 68, borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(0,212,182,0.2), rgba(0,212,182,0.05))',
                            border: '1px solid rgba(0,212,182,0.3)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <div className="ac-pulse" style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '1px solid rgba(0,212,182,0.4)' }} />
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 900, color: '#00d4b6', letterSpacing: '-0.02em' }}>
                                {initials}
                            </span>
                        </div>
                    </div>

                    {/* Name / joined */}
                    <div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.7)', marginBottom: 5 }}>
                            Member since {user.joined}
                        </div>
                        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.9, margin: 0, color: '#fff' }}>
                            {user.name.split(' ')[0]}&apos;s
                            <span style={{
                                display: 'block',
                                background: 'linear-gradient(135deg, #00d4b6, #00b09c)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                filter: 'drop-shadow(0 0 18px rgba(0,212,182,0.3))',
                                paddingBottom: 4,
                            }}>
                                Account.
                            </span>
                        </h1>
                    </div>
                </div>

                {/* Edit toggle */}
                <button className="ac-edit-btn" onClick={() => setEditMode(p => !p)}>
                    {editMode ? '✕ Cancel' : '✎ Edit Profile'}
                </button>
            </div>

            {/* Laser line */}
            <div className="ac-a1" style={{
                height: 2,
                background: 'linear-gradient(90deg, #00d4b6, transparent)',
                boxShadow: '0 0 12px rgba(0,212,182,0.4)',
                marginBottom: 40,
                maxWidth: 280,
            }} />

            {/* ── STATS ───────────────────────────────────── */}
            <div className="ac-a2" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 40 }}>
                {STATS.map((s, i) => (
                    <div key={i} className="ac-stat">
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: 5 }}>{s.l}</div>
                    </div>
                ))}
            </div>

            {/* ── MAIN GRID ───────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>

                {/* Left — Orders + Profile Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

                    {/* Profile info / edit form */}
                    <div className="ac-a3">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                                Profile Info
                            </span>
                            {editMode && (
                                <button className="ac-save-btn" onClick={() => setEditMode(false)}>
                                    Save Changes
                                </button>
                            )}
                        </div>

                        <div style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)', padding: '24px' }}>
                            {editMode ? (
                                // ── Edit mode ──
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    {[
                                        { label: 'Full Name',    key: 'name',    placeholder: 'Your name' },
                                        { label: 'Email',        key: 'email',   placeholder: 'you@email.com' },
                                        { label: 'Phone',        key: 'phone',   placeholder: '+1 000 000 0000' },
                                        { label: 'Address',      key: 'address', placeholder: '123 Main St' },
                                    ].map(f => (
                                        <div key={f.key} style={{ gridColumn: f.key === 'address' ? '1 / -1' : 'auto' }}>
                                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.5)', marginBottom: 7 }}>
                                                {f.label}
                                            </div>
                                            <input
                                                className="ac-input"
                                                value={form[f.key as keyof typeof form]}
                                                placeholder={f.placeholder}
                                                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // ── View mode ──
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                    {[
                                        { label: 'Full Name', value: user.name },
                                        { label: 'Email',     value: user.email },
                                        { label: 'Phone',     value: form.phone || '—' },
                                        { label: 'Address',   value: form.address || '—' },
                                    ].map(f => (
                                        <div key={f.label} style={{ gridColumn: f.label === 'Address' ? '1 / -1' : 'auto' }}>
                                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.4)', marginBottom: 5 }}>
                                                {f.label}
                                            </div>
                                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                                                {f.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Orders table */}
                    <div className="ac-a3">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                                Recent Orders
                            </span>
                            <a href="/user/myorders" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#00d4b6', textDecoration: 'none' }}>
                                View All →
                            </a>
                        </div>
                        <div style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}>
                            {/* Header row */}
                            <div className="ac-order-row" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                                {['Order ID', 'Item', 'Status', 'Price'].map(h => (
                                    <span key={h} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                                        {h}
                                    </span>
                                ))}
                            </div>
                            {/* Empty state */}
                            <div style={{ padding: '44px 24px', textAlign: 'center' }}>
                                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: 'rgba(255,255,255,0.12)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                                    No orders yet
                                </div>
                                <a href="/shop" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#00d4b6', textDecoration: 'none', letterSpacing: '0.08em' }}>
                                    Browse the shop →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right — Quick Actions + Member card */}
                <div className="ac-a4" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>
                        Quick Actions
                    </span>

                    {[
                        { label: 'My Orders',    icon: '📦', href: '/user/myorders' },
                        { label: 'Saved Items',  icon: '♡',  href: '/user/saved' },
                        { label: 'My Addresses', icon: '📍', href: '/user/addresses' },
                        { label: 'Settings',     icon: '⚙',  href: '/user/settings' },
                    ].map((item, i) => (
                        <a key={i} href={item.href} className="ac-quick">
                            <span style={{ fontSize: 15 }}>{item.icon}</span>
                            <span>{item.label}</span>
                            <span className="ac-arrow">→</span>
                        </a>
                    ))}

                    {/* Member card */}
                    <div style={{
                        marginTop: 6,
                        background: 'linear-gradient(135deg, rgba(0,212,182,0.1), rgba(0,212,182,0.03))',
                        border: '1px solid rgba(0,212,182,0.2)',
                        padding: '18px 20px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40%', background: 'linear-gradient(to left, rgba(0,212,182,0.05), transparent)' }} />
                        {/* Ghost text inside card */}
                        <div style={{
                            position: 'absolute', right: -4, bottom: -8,
                            fontFamily: "'Barlow Condensed', sans-serif",
                            fontSize: 44, fontWeight: 900, color: 'transparent',
                            WebkitTextStroke: '1px rgba(0,212,182,0.07)',
                            letterSpacing: '-0.02em', pointerEvents: 'none', lineHeight: 1,
                        }}>
                            MDFLD
                        </div>
                        <div style={{ position: 'relative', zIndex: 1 }}>
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.6)', marginBottom: 7 }}>
                                Member Status
                            </div>
                            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 900, color: '#00d4b6', letterSpacing: '-0.02em' }}>
                                Elite ✦
                            </div>
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
                                Early access to all drops
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}