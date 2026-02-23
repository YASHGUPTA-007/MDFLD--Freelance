'use client';

import { useState } from 'react';

const STATUS_COLOR: Record<string, string> = {
    'Delivered':  '#00d4b6',
    'In Transit': '#f59e0b',
    'Processing': 'rgba(255,255,255,0.45)',
    'Cancelled':  'rgba(255,80,80,0.8)',
};

const MOCK_ORDERS = [
    { id: '#ORD-4421', item: 'Midfield Tactical Tee — Black/L',   status: 'Delivered',  date: '18 Feb 2026', price: '$49.00' },
    { id: '#ORD-4398', item: 'Drop 07 Hoodie — Olive/M',          status: 'In Transit', date: '21 Feb 2026', price: '$89.00' },
    { id: '#ORD-4301', item: 'Core Cap — Black',                   status: 'Processing', date: '23 Feb 2026', price: '$32.00' },
    { id: '#ORD-4187', item: 'Midfield Tactical Tee — White/XL',  status: 'Delivered',  date: '01 Jan 2026', price: '$49.00' },
    { id: '#ORD-4002', item: 'Drop 05 Cargo — Black/32',          status: 'Cancelled',  date: '14 Dec 2025', price: '$112.00' },
];

const TABS = ['All', 'Active', 'Delivered', 'Cancelled'];

export default function MyOrdersPage() {
    const [tab, setTab] = useState('All');

    const filtered = MOCK_ORDERS.filter(o => {
        if (tab === 'All')       return true;
        if (tab === 'Active')    return o.status === 'In Transit' || o.status === 'Processing';
        if (tab === 'Delivered') return o.status === 'Delivered';
        if (tab === 'Cancelled') return o.status === 'Cancelled';
        return true;
    });

    return (
        <>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .mo-a1 { animation: fadeUp 0.5s 0.05s both; }
                .mo-a2 { animation: fadeUp 0.5s 0.15s both; }
                .mo-a3 { animation: fadeUp 0.5s 0.25s both; }

                .mo-tab {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.3);
                    font-family: 'Barlow', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    padding: 8px 18px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .mo-tab:hover {
                    border-color: rgba(0,212,182,0.25);
                    color: rgba(255,255,255,0.6);
                }
                .mo-tab.active {
                    border-color: #00d4b6;
                    color: #00d4b6;
                    background: rgba(0,212,182,0.06);
                }

                .mo-row {
                    display: grid;
                    grid-template-columns: 120px 1fr 120px 90px 100px;
                    align-items: center;
                    gap: 16px;
                    padding: 16px 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    transition: background 0.2s;
                    font-family: 'Barlow', sans-serif;
                }
                .mo-row:hover { background: rgba(255,255,255,0.02); }
                .mo-row:last-child { border-bottom: none; }

                .mo-empty {
                    padding: 64px 24px;
                    text-align: center;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 16px;
                    font-weight: 700;
                    color: rgba(255,255,255,0.1);
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                }

                .mo-track-btn {
                    background: transparent;
                    border: 1px solid rgba(0,212,182,0.2);
                    color: rgba(0,212,182,0.6);
                    font-family: 'Barlow', sans-serif;
                    font-size: 8px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    padding: 5px 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .mo-track-btn:hover {
                    border-color: #00d4b6;
                    color: #00d4b6;
                    background: rgba(0,212,182,0.05);
                }
            `}</style>

            {/* Page title */}
            <div className="mo-a1" style={{ marginBottom: 40 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.7)', marginBottom: 8 }}>
                    Your purchases
                </div>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.9, margin: 0, color: '#fff' }}>
                    My<span style={{ background: 'linear-gradient(135deg, #00d4b6, #00b09c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 16px rgba(0,212,182,0.3))', paddingBottom: 4 }}>
                        {' '}Orders.
                    </span>
                </h1>
                <div style={{ height: 2, background: 'linear-gradient(90deg, #00d4b6, transparent)', boxShadow: '0 0 12px rgba(0,212,182,0.4)', marginTop: 16, maxWidth: 200 }} />
            </div>

            {/* Stats strip */}
            <div className="mo-a1" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 36 }}>
                {[
                    { n: MOCK_ORDERS.length,                                                        l: 'Total Orders' },
                    { n: MOCK_ORDERS.filter(o => o.status === 'In Transit' || o.status === 'Processing').length, l: 'Active' },
                    { n: MOCK_ORDERS.filter(o => o.status === 'Delivered').length,                  l: 'Delivered' },
                    { n: '$' + MOCK_ORDERS.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + parseFloat(o.price.replace('$','')), 0).toFixed(0), l: 'Total Spent' },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderTop: '2px solid #00d4b6', padding: '18px 22px', transition: 'background 0.25s, transform 0.25s' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(0,212,182,0.04)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.025)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
                    >
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginTop: 5 }}>{s.l}</div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="mo-a2" style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {TABS.map(t => (
                    <button key={t} className={`mo-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
                ))}
            </div>

            {/* Table */}
            <div className="mo-a3" style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.015)' }}>
                {/* Header */}
                <div className="mo-row" style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Order ID', 'Item', 'Status', 'Price', ''].map(h => (
                        <span key={h} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>{h}</span>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="mo-empty">No {tab.toLowerCase()} orders</div>
                ) : (
                    filtered.map((o, i) => (
                        <div key={i} className="mo-row">
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, color: 'rgba(0,212,182,0.8)', letterSpacing: '0.04em' }}>{o.id}</span>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{o.item}</span>
                            <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: STATUS_COLOR[o.status] ?? '#fff' }}>{o.status}</span>
                            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: '-0.01em' }}>{o.price}</span>
                            {(o.status === 'In Transit' || o.status === 'Processing') ? (
                                <button className="mo-track-btn">Track →</button>
                            ) : (
                                <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.1em', fontFamily: "'Barlow', sans-serif" }}>{o.date}</span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
}