'use client';

/**
 * @file app/admin/discounts/page.tsx
 * @description Admin Discount Codes Page — layout matches Products page
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    Plus, Pencil, Trash2, X, Check, Loader2,
    Search, CheckCircle, XCircle, TrendingUp, Copy,
    PercentDiamond,
} from 'lucide-react';

const ACCENT = '#00d4b6';

// ─── Types ────────────────────────────────────────────────────────────────────
interface DiscountCode {
    _id: string;
    code: string;
    influencerName: string;
    discountValue: number;
    isActive: boolean;
    usageCount: number;
    usageLimit: number | null;
    expiresAt: string | null;
    minOrderAmount: number;
    stripeCouponId: string | null;
    createdBy: { name: string; email: string } | null;
    createdAt: string;
}

interface Toast { message: string; type: 'success' | 'error'; }

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1px solid #e5e5e5', borderRadius: 8,
    fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#1a1a1a',
    outline: 'none', background: '#fafafa', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
    fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
    color: '#666', letterSpacing: '0.07em', textTransform: 'uppercase',
    display: 'block', marginBottom: 6,
};

// ─── Toast ────────────────────────────────────────────────────────────────────
function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
            background: toast.type === 'success' ? '#1a2e2a' : '#2e1a1a',
            border: `1px solid ${toast.type === 'success' ? ACCENT : '#ff6b6b'}`,
            borderRadius: 10, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: "'Barlow', sans-serif", fontSize: 13,
            color: toast.type === 'success' ? ACCENT : '#ff6b6b',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
            {toast.type === 'success' ? <Check size={15} /> : <X size={15} />}
            {toast.message}
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string; }) {
    return (
        <div style={{
            flex: '1 1 180px', background: '#fff', borderRadius: 14,
            padding: '20px 22px', border: '1px solid #f0f0f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', gap: 16,
        }}>
            <div style={{
                width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color,
            }}>
                {icon}
            </div>
            <div>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>
                    {value}
                </p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#999', marginTop: 3 }}>
                    {label}
                </p>
            </div>
        </div>
    );
}

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ code, onConfirm, onCancel, submitting }: {
    code: DiscountCode; onConfirm: () => void; onCancel: () => void; submitting: boolean;
}) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 14, padding: 28, width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 8 }}>
                    Delete Discount Code?
                </h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#666', marginBottom: 20, lineHeight: 1.5 }}>
                    This will permanently delete <strong>{code.code}</strong> and remove the associated Stripe coupon. This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={onCancel} style={{ flex: 1, padding: '11px 0', border: '1px solid #e5e5e5', borderRadius: 8, background: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#666', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={submitting} style={{ flex: 1, padding: '11px 0', border: 'none', borderRadius: 8, background: submitting ? '#ccc' : '#ff4d4f', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Form Panel ───────────────────────────────────────────────────────────────
function DiscountFormPanel({ editTarget, onClose, onSuccess, showToast }: {
    editTarget: DiscountCode | null;
    onClose: () => void;
    onSuccess: () => void;
    showToast: (msg: string, type: 'success' | 'error') => void;
}) {
    const [code, setCode] = useState('');
    const [influencerName, setInfluencerName] = useState('');
    const [discountValue, setDiscountValue] = useState('');
    const [usageLimit, setUsageLimit] = useState('');
    const [minOrderAmount, setMinOrderAmount] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (editTarget) {
            setCode(editTarget.code);
            setInfluencerName(editTarget.influencerName);
            setDiscountValue(String(editTarget.discountValue));
            setUsageLimit(editTarget.usageLimit ? String(editTarget.usageLimit) : '');
            setMinOrderAmount(editTarget.minOrderAmount ? String(editTarget.minOrderAmount) : '');
            setExpiresAt(editTarget.expiresAt ? editTarget.expiresAt.slice(0, 10) : '');
            setIsActive(editTarget.isActive);
        } else {
            setCode(''); setInfluencerName(''); setDiscountValue('');
            setUsageLimit(''); setMinOrderAmount(''); setExpiresAt(''); setIsActive(true);
        }
    }, [editTarget]);

    const handleSubmit = async () => {
        if (!code.trim()) return showToast('Code is required', 'error');
        if (!influencerName.trim()) return showToast('Influencer name is required', 'error');
        if (!discountValue || Number(discountValue) < 1 || Number(discountValue) > 100)
            return showToast('Discount must be between 1–100%', 'error');

        setSubmitting(true);
        try {
            const body = {
                code: code.trim().toUpperCase(),
                influencerName: influencerName.trim(),
                discountValue: Number(discountValue),
                usageLimit: usageLimit ? Number(usageLimit) : null,
                minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
                expiresAt: expiresAt || null,
                isActive,
            };
            const url = editTarget ? `/api/admin/discounts/${editTarget._id}` : '/api/admin/discounts';
            const method = editTarget ? 'PUT' : 'POST';
            const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed to save', 'error');
            showToast(editTarget ? 'Code updated' : 'Code created + Stripe coupon synced', 'success');
            onSuccess();
            onClose();
        } catch {
            showToast('Server error', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(3px)' }} />
            <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 301, width: '100%', maxWidth: 480, background: '#fff', boxShadow: '-20px 0 60px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>

                <div style={{ padding: '22px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 900, color: '#1a1a1a', textTransform: 'uppercase' }}>
                            {editTarget ? 'Edit Code' : 'New Discount Code'}
                        </h2>
                        {!editTarget && <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#999', marginTop: 2 }}>Stripe coupon will be created automatically</p>}
                    </div>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={20} /></button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                        <div>
                            <label style={labelStyle}>Discount Code *</label>
                            <input style={{ ...inputStyle, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em' }} value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER20" disabled={!!editTarget} />
                            {editTarget && <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 4 }}>Code cannot be changed after creation</p>}
                        </div>

                        <div>
                            <label style={labelStyle}>Influencer / Partner Name *</label>
                            <input style={inputStyle} value={influencerName} onChange={e => setInfluencerName(e.target.value)} placeholder="e.g. John Doe" />
                        </div>

                        <div>
                            <label style={labelStyle}>Discount Percentage (%) *</label>
                            <input style={inputStyle} type="number" min={1} max={100} value={discountValue} onChange={e => setDiscountValue(e.target.value)} onWheel={e => e.currentTarget.blur()} placeholder="e.g. 20" />
                            {editTarget && <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#f97316', marginTop: 4 }}>⚠ Changing this will recreate the Stripe coupon</p>}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            <div>
                                <label style={labelStyle}>Usage Limit</label>
                                <input style={inputStyle} type="number" min={1} value={usageLimit} onChange={e => setUsageLimit(e.target.value)} onWheel={e => e.currentTarget.blur()} placeholder="Unlimited" />
                            </div>
                            <div>
                                <label style={labelStyle}>Min Order (£)</label>
                                <input style={inputStyle} type="number" min={0} value={minOrderAmount} onChange={e => setMinOrderAmount(e.target.value)} onWheel={e => e.currentTarget.blur()} placeholder="0" />
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>Expiry Date</label>
                            <input style={inputStyle} type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#fafafa', borderRadius: 8, border: '1px solid #f0f0f0' }}>
                            <div>
                                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Active</p>
                                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#999' }}>Users can apply this code at checkout</p>
                            </div>
                            <button onClick={() => setIsActive(v => !v)} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: isActive ? ACCENT : '#ddd', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, transition: 'left 0.2s', left: isActive ? 23 : 3 }} />
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ padding: '16px 28px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 10, background: '#fff' }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '11px 0', border: '1px solid #e5e5e5', borderRadius: 8, background: '#fff', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#666', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={submitting} style={{ flex: 2, padding: '11px 0', border: 'none', borderRadius: 8, background: submitting ? '#ccc' : ACCENT, fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: submitting ? '#fff' : '#020a0a', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
                        {editTarget ? 'Save Changes' : 'Create Code'}
                    </button>
                </div>
            </div>
        </>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ active, expired }: { active: boolean; expired: boolean }) {
    const color = expired ? '#f97316' : active ? '#16a34a' : '#ef4444';
    const bg = expired ? 'rgba(249,115,22,0.1)' : active ? 'rgba(22,163,74,0.1)' : 'rgba(239,68,68,0.1)';
    const label = expired ? 'EXPIRED' : active ? 'ACTIVE' : 'INACTIVE';
    return (
        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color, background: bg, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: '0.06em', border: `1px solid ${color}40` }}>
            {label}
        </span>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DiscountsPage() {
    const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [panelOpen, setPanelOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<DiscountCode | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<DiscountCode | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState<Toast | null>(null);
    const [toggling, setToggling] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // suppress unused ref warning — kept for future debounce use
    const _searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });
    const isExpired = (d: DiscountCode) => d.expiresAt ? new Date() > new Date(d.expiresAt) : false;

    const fetchDiscounts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/discounts');
            const data = await res.json();
            setDiscounts(data.discounts || []);
        } catch {
            showToast('Failed to load discounts', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDiscounts(); }, [fetchDiscounts]);

    // Client-side filter (discount list is typically small)
    const filtered = discounts.filter(d => {
        const matchSearch = !searchInput ||
            d.code.toLowerCase().includes(searchInput.toLowerCase()) ||
            d.influencerName.toLowerCase().includes(searchInput.toLowerCase());
        const matchStatus = !filterStatus ||
            (filterStatus === 'active' && d.isActive && !isExpired(d)) ||
            (filterStatus === 'inactive' && !d.isActive) ||
            (filterStatus === 'expired' && isExpired(d));
        return matchSearch && matchStatus;
    });

    // Stats always from full list
    const activeCount = discounts.filter(d => d.isActive && !isExpired(d)).length;
    const expiredCount = discounts.filter(d => isExpired(d)).length;
    const totalUses = discounts.reduce((s, d) => s + d.usageCount, 0);

    const handleToggle = async (d: DiscountCode) => {
        setToggling(d._id);
        try {
            const res = await fetch(`/api/admin/discounts/${d._id}`, { method: 'PATCH' });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed', 'error');
            setDiscounts(prev => prev.map(item => item._id === d._id ? { ...item, isActive: data.isActive } : item));
            showToast(`Code ${data.isActive ? 'activated' : 'deactivated'}`, 'success');
        } catch {
            showToast('Server error', 'error');
        } finally {
            setToggling(null);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/discounts/${deleteTarget._id}`, { method: 'DELETE' });
            if (!res.ok) { const d = await res.json(); return showToast(d.error || 'Delete failed', 'error'); }
            showToast('Code deleted', 'success');
            setDeleteTarget(null);
            fetchDiscounts();
        } catch {
            showToast('Server error', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopied(code);
        setTimeout(() => setCopied(null), 1500);
    };

    return (
        <div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
                .disc-row:hover { background: #fafafa !important; }
                .action-btn { transition: opacity 0.2s; }
                .action-btn:hover { opacity: 0.75; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}
            {deleteTarget && <DeleteModal code={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} submitting={deleting} />}
            {panelOpen && <DiscountFormPanel editTarget={editTarget} onClose={() => { setPanelOpen(false); setEditTarget(null); }} onSuccess={fetchDiscounts} showToast={showToast} />}

            {/* ── Page Title ─────────────────────────────────────────────────── */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0 }}>
                    Discounts
                </h1>
            </div>

            {/* ── 1. Stat Cards ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
                <StatCard icon={<PercentDiamond size={22} />} label="Total Codes" value={discounts.length} color="#6366f1" />
                <StatCard icon={<CheckCircle size={22} />} label="Active" value={activeCount} color={ACCENT} />
                <StatCard icon={<XCircle size={22} />} label="Expired" value={expiredCount} color="#ff6b6b" />
                <StatCard icon={<TrendingUp size={22} />} label="Total Uses" value={totalUses} color="#f59e0b" />
            </div>

            {/* ── 2. Search / Filter / Add ───────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1 1 220px', maxWidth: 360 }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Search codes or partners..."
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: 36 }}
                    />
                </div>

                {/* Status filter */}
                <div style={{ position: 'relative', flex: '0 0 160px' }}>
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        style={{ ...inputStyle, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="expired">Expired</option>
                    </select>
                    <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                </div>

                <div style={{ flex: 1 }} />

                {/* Add Button */}
                <button
                    onClick={() => { setEditTarget(null); setPanelOpen(true); }}
                    style={{ background: ACCENT, color: '#020606', border: 'none', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                >
                    <Plus size={16} /> Add Code
                </button>
            </div>

            {/* ── 3. Table ───────────────────────────────────────────────────── */}
            <div style={{ background: '#fff', borderRadius: 14, border: '1px solid #f0f0f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 10, color: ACCENT }}>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>Loading...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ padding: 60, textAlign: 'center' }}>
                        <PercentDiamond size={36} style={{ color: '#ddd', margin: '0 auto 12px', display: 'block' }} />
                        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#aaa' }}>
                            {discounts.length === 0 ? 'No discount codes yet' : 'No results match your search'}
                        </p>
                        {discounts.length === 0 && (
                            <button onClick={() => { setEditTarget(null); setPanelOpen(true); }} style={{ marginTop: 16, padding: '10px 20px', background: ACCENT, border: 'none', borderRadius: 8, fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: '#020a0a', cursor: 'pointer' }}>
                                Create First Code
                            </button>
                        )}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                                    {['Code', 'Partner', 'Discount', 'Usage', 'Min Order', 'Expires', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((d, i) => {
                                    const expired = isExpired(d);
                                    return (
                                        <tr key={d._id} className="disc-row" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f7f7f7' : 'none', transition: 'background 0.15s' }}>
                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <span style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: '#1a1a1a', letterSpacing: '0.06em', background: '#f5f5f5', padding: '4px 10px', borderRadius: 6 }}>
                                                        {d.code}
                                                    </span>
                                                    <button onClick={() => handleCopy(d.code)} title="Copy" style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied === d.code ? ACCENT : '#bbb', padding: 2, transition: 'color 0.2s', display: 'flex' }}>
                                                        {copied === d.code ? <Check size={13} /> : <Copy size={13} />}
                                                    </button>
                                                </div>
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#444' }}>{d.influencerName}</span>
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, color: ACCENT }}>
                                                    {d.discountValue}%
                                                </span>
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#444', fontVariantNumeric: 'tabular-nums' }}>
                                                    {d.usageCount}
                                                    <span style={{ color: '#aaa' }}>{d.usageLimit ? ` / ${d.usageLimit}` : ' / ∞'}</span>
                                                </span>
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: d.minOrderAmount > 0 ? '#444' : '#ccc' }}>
                                                    {d.minOrderAmount > 0 ? `£${d.minOrderAmount}` : '—'}
                                                </span>
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: expired ? '#f97316' : '#666' }}>
                                                    {d.expiresAt ? new Date(d.expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                                                </span>
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <StatusBadge active={d.isActive} expired={expired} />
                                            </td>

                                            <td style={{ padding: '14px 16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    {/* Toggle */}
                                                    <button onClick={() => handleToggle(d)} disabled={toggling === d._id} title={d.isActive ? 'Deactivate' : 'Activate'} style={{ width: 36, height: 20, borderRadius: 10, border: 'none', background: d.isActive ? ACCENT : '#ddd', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                                                        {toggling === d._id
                                                            ? <Loader2 size={10} style={{ color: '#fff', position: 'absolute', top: 5, left: 13, animation: 'spin 1s linear infinite' }} />
                                                            : <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: d.isActive ? 19 : 3, transition: 'left 0.2s' }} />
                                                        }
                                                    </button>

                                                    {/* Edit */}
                                                    <button onClick={() => { setEditTarget(d); setPanelOpen(true); }} className="action-btn" style={{ width: 32, height: 32, border: '1px solid #e5e5e5', borderRadius: 7, background: '#fff', cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Pencil size={14} />
                                                    </button>

                                                    {/* Delete */}
                                                    <button onClick={() => setDeleteTarget(d)} className="action-btn" style={{ width: 32, height: 32, border: '1px solid #fecaca', borderRadius: 7, background: '#fff5f5', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}