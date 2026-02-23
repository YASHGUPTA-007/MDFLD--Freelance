'use client';

import { useState } from 'react';

type Address = {
    id: number;
    label: string;
    name: string;
    line1: string;
    line2: string;
    city: string;
    zip: string;
    country: string;
    isDefault: boolean;
};

const MOCK_ADDRESSES: Address[] = [
    { id: 1, label: 'Home', name: 'Arjun Sharma', line1: '42, MG Road', line2: 'Sector 4', city: 'Bhopal, MP 462001', zip: '462001', country: 'India', isDefault: true },
];

const EMPTY: Omit<Address, 'id' | 'isDefault'> = { label: '', name: '', line1: '', line2: '', city: '', zip: '', country: '' };

export default function AddressesPage() {
    const [addresses, setAddresses]   = useState<Address[]>(MOCK_ADDRESSES);
    const [showForm, setShowForm]     = useState(false);
    const [editId, setEditId]         = useState<number | null>(null);
    const [form, setForm]             = useState(EMPTY);

    const openNew = () => { setForm(EMPTY); setEditId(null); setShowForm(true); };
    const openEdit = (a: Address) => {
        setForm({ label: a.label, name: a.name, line1: a.line1, line2: a.line2, city: a.city, zip: a.zip, country: a.country });
        setEditId(a.id);
        setShowForm(true);
    };
    const close = () => { setShowForm(false); setEditId(null); };

    const save = () => {
        if (!form.name || !form.line1) return;
        if (editId !== null) {
            setAddresses(prev => prev.map(a => a.id === editId ? { ...a, ...form } : a));
        } else {
            setAddresses(prev => [...prev, { ...form, id: Date.now(), isDefault: prev.length === 0 }]);
        }
        close();
    };

    const remove    = (id: number) => setAddresses(prev => prev.filter(a => a.id !== id));
    const setDefault = (id: number) => setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));

    const field = (label: string, key: keyof typeof form, placeholder: string, full = false) => (
        <div style={{ gridColumn: full ? '1 / -1' : 'auto' }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.5)', marginBottom: 6 }}>{label}</div>
            <input
                value={form[key]}
                placeholder={placeholder}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 13, padding: '10px 14px', outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'rgba(0,212,182,0.45)'}
                onBlur={e  => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .ad-a1 { animation: fadeUp 0.5s 0.05s both; }
                .ad-a2 { animation: fadeUp 0.5s 0.15s both; }

                .ad-card {
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.07);
                    padding: 22px 24px;
                    position: relative;
                    transition: border-color 0.25s, background 0.25s;
                }
                .ad-card.default {
                    border-color: rgba(0,212,182,0.3);
                    background: rgba(0,212,182,0.03);
                }
                .ad-card:hover { background: rgba(255,255,255,0.03); }

                .ad-icon-btn {
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.3);
                    font-family: 'Barlow', sans-serif;
                    font-size: 8px;
                    font-weight: 700;
                    letter-spacing: 0.18em;
                    text-transform: uppercase;
                    padding: 6px 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ad-icon-btn:hover { border-color: rgba(0,212,182,0.3); color: #00d4b6; background: rgba(0,212,182,0.04); }
                .ad-icon-btn.danger:hover { border-color: rgba(255,60,60,0.3); color: rgba(255,100,100,0.8); background: rgba(255,60,60,0.04); }

                .ad-add-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 20px;
                    background: transparent;
                    border: 1px dashed rgba(0,212,182,0.2);
                    color: rgba(0,212,182,0.5);
                    font-family: 'Barlow', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.2s;
                    width: 100%;
                    margin-top: 8px;
                }
                .ad-add-btn:hover { border-color: rgba(0,212,182,0.5); color: #00d4b6; background: rgba(0,212,182,0.03); }

                .ad-save-btn {
                    padding: 11px 28px;
                    background: rgba(0,212,182,0.1);
                    border: 1px solid #00d4b6;
                    color: #00d4b6;
                    font-family: 'Barlow', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ad-save-btn:hover { background: rgba(0,212,182,0.18); box-shadow: 0 0 16px rgba(0,212,182,0.2); }

                .ad-cancel-btn {
                    padding: 11px 22px;
                    background: transparent;
                    border: 1px solid rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.3);
                    font-family: 'Barlow', sans-serif;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.22em;
                    text-transform: uppercase;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .ad-cancel-btn:hover { border-color: rgba(255,255,255,0.25); color: rgba(255,255,255,0.6); }
            `}</style>

            {/* Title */}
            <div className="ad-a1" style={{ marginBottom: 40 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.7)', marginBottom: 8 }}>
                    Delivery locations
                </div>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.03em', lineHeight: 0.9, margin: 0, color: '#fff' }}>
                    My
                    <span style={{ background: 'linear-gradient(135deg, #00d4b6, #00b09c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', filter: 'drop-shadow(0 0 16px rgba(0,212,182,0.3))', paddingBottom: 4 }}>
                        {' '}Addresses.
                    </span>
                </h1>
                <div style={{ height: 2, background: 'linear-gradient(90deg, #00d4b6, transparent)', boxShadow: '0 0 12px rgba(0,212,182,0.4)', marginTop: 16, maxWidth: 200 }} />
            </div>

            {/* Address grid */}
            <div className="ad-a2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 16 }}>
                {addresses.map(a => (
                    <div key={a.id} className={`ad-card${a.isDefault ? ' default' : ''}`}>
                        {/* Default badge */}
                        {a.isDefault && (
                            <div style={{ position: 'absolute', top: 12, right: 12, fontFamily: "'Barlow', sans-serif", fontSize: 7, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00d4b6', border: '1px solid rgba(0,212,182,0.3)', padding: '2px 7px' }}>
                                Default
                            </div>
                        )}
                        {/* Top accent */}
                        <div style={{ height: 2, background: a.isDefault ? 'linear-gradient(90deg, #00d4b6, transparent)' : 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)', boxShadow: a.isDefault ? '0 0 10px rgba(0,212,182,0.3)' : 'none', marginBottom: 16 }} />

                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(0,212,182,0.6)', marginBottom: 6 }}>{a.label}</div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', marginBottom: 10 }}>{a.name}</div>
                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                            {a.line1}<br />
                            {a.line2 && <>{a.line2}<br /></>}
                            {a.city}<br />
                            {a.country}
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
                            <button className="ad-icon-btn" onClick={() => openEdit(a)}>Edit</button>
                            {!a.isDefault && (
                                <button className="ad-icon-btn" onClick={() => setDefault(a.id)}>Set Default</button>
                            )}
                            {!a.isDefault && (
                                <button className="ad-icon-btn danger" onClick={() => remove(a.id)}>Remove</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add new */}
            {!showForm && (
                <button className="ad-add-btn" onClick={openNew}>+ Add New Address</button>
            )}

            {/* Form */}
            {showForm && (
                <div style={{ border: '1px solid rgba(0,212,182,0.2)', background: 'rgba(0,212,182,0.02)', padding: '28px 28px 24px', marginTop: 8 }}>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#fff', marginBottom: 22 }}>
                        {editId ? 'Edit Address' : 'New Address'}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
                        {field('Label',   'label',   'e.g. Home, Work')}
                        {field('Full Name', 'name',  'Recipient name')}
                        {field('Address Line 1', 'line1', '42, MG Road', true)}
                        {field('Address Line 2', 'line2', 'Apartment, area (optional)', true)}
                        {field('City / State / PIN', 'city', 'Bhopal, MP 462001')}
                        {field('Country', 'country', 'India')}
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button className="ad-save-btn" onClick={save}>{editId ? 'Save Changes' : 'Add Address'}</button>
                        <button className="ad-cancel-btn" onClick={close}>Cancel</button>
                    </div>
                </div>
            )}
        </>
    );
}