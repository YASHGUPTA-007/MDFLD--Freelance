'use client';

/**
 * @file app/admin/categories/page.tsx
 * @description Admin Categories Page — updated layout matching Products page
 *
 * - Stat cards: Total, Active, Inactive
 * - Search bar with dropdown suggestions + status filter + Add button in toolbar
 * - Table: Name, Slug, Products, Status, Created, Actions
 * - Product count column (from API aggregation)
 * - Create / Edit modal, Delete confirm modal, Toast
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2, Search, Tag, CheckCircle, XCircle, Package } from 'lucide-react';

const ACCENT = '#00d4b6';

interface Category {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
    productCount: number;
    createdAt: string;
}

interface Toast { message: string; type: 'success' | 'error'; }

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    border: '1px solid #e5e5e5', borderRadius: 8,
    fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#1a1a1a',
    outline: 'none', background: '#fafafa', boxSizing: 'border-box',
};

const btnPrimary: React.CSSProperties = {
    background: ACCENT, color: '#020606', border: 'none',
    borderRadius: 8, padding: '11px 20px',
    fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
};

const btnGhost: React.CSSProperties = {
    background: 'transparent', color: '#666', border: '1px solid #e5e5e5',
    borderRadius: 8, padding: '11px 20px',
    fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer',
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
function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
    return (
        <div style={{
            flex: '1 1 180px', background: '#fff', borderRadius: 14,
            padding: '20px 22px', border: '1px solid #f0f0f0',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex', alignItems: 'center', gap: 16,
        }}>
            <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                {icon}
            </div>
            <div>
                <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 30, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>{value}</p>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#999', marginTop: 3 }}>{label}</p>
            </div>
        </div>
    );
}

// ─── Search Bar with Suggestions ─────────────────────────────────────────────
function SearchBar({ categories, onFilter }: { categories: Category[]; onFilter: (q: string) => void }) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const wrapRef = useRef<HTMLDivElement>(null);

    const suggestions = query.trim().length > 0
        ? categories.filter(c => c.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
        : [];

    const handleChange = (val: string) => {
        setQuery(val);
        onFilter(val);
        setOpen(val.trim().length > 0);
    };

    const handleSelect = (name: string) => {
        setQuery(name);
        onFilter(name);
        setOpen(false);
    };

    // Close on outside click
    useEffect(() => {
        const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const highlight = (name: string) => {
        if (!query.trim()) return name;
        const idx = name.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return name;
        return (
            <>
                {name.slice(0, idx)}
                <strong style={{ color: ACCENT, fontWeight: 700 }}>{name.slice(idx, idx + query.length)}</strong>
                {name.slice(idx + query.length)}
            </>
        );
    };

    return (
        <div ref={wrapRef} style={{ position: 'relative', flex: '1 1 220px', maxWidth: 360 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none', zIndex: 1 }} />
            <input
                type="text"
                placeholder="Search categories..."
                value={query}
                onChange={e => handleChange(e.target.value)}
                onFocus={() => query.trim().length > 0 && setOpen(true)}
                onKeyDown={e => e.key === 'Escape' && setOpen(false)}
                style={{ ...inputStyle, paddingLeft: 36 }}
            />

            {/* Suggestions dropdown */}
            {open && suggestions.length > 0 && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200,
                    background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.10)', overflow: 'hidden',
                }}>
                    {suggestions.map(cat => (
                        <button
                            key={cat._id}
                            onMouseDown={() => handleSelect(cat.name)}
                            style={{
                                width: '100%', padding: '10px 14px',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: 'none', border: 'none', borderBottom: '1px solid #f5f5f5',
                                cursor: 'pointer', textAlign: 'left',
                                fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#333',
                                transition: 'background 0.1s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#f9fffe')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                        >
                            <span>{highlight(cat.name)}</span>
                            <span style={{
                                fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700,
                                color: cat.isActive ? ACCENT : '#bbb',
                                background: cat.isActive ? 'rgba(0,212,182,0.1)' : 'rgba(0,0,0,0.05)',
                                padding: '2px 8px', borderRadius: 10, letterSpacing: '0.05em',
                            }}>
                                {cat.productCount} products
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4 }}><X size={20} /></button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editTarget, setEditTarget] = useState<Category | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

    const [nameInput, setNameInput] = useState('');
    const [toast, setToast] = useState<Toast | null>(null);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/category');
            const data = await res.json();
            setCategories(data.categories || []);
        } catch {
            showToast('Failed to load categories', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    // Client-side filter
    const filtered = categories.filter(cat => {
        const matchSearch = !searchQuery || cat.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchStatus = !filterStatus ||
            (filterStatus === 'active' && cat.isActive) ||
            (filterStatus === 'inactive' && !cat.isActive);
        return matchSearch && matchStatus;
    });

    // Stats
    const activeCount   = categories.filter(c => c.isActive).length;
    const inactiveCount = categories.filter(c => !c.isActive).length;

    // ── Create ────────────────────────────────────────────────────────────────
    const handleCreate = async () => {
        if (!nameInput.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch('/api/admin/category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameInput.trim() }),
            });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed to create', 'error');
            showToast('Category created', 'success');
            setShowCreateModal(false);
            setNameInput('');
            fetchCategories();
        } catch {
            showToast('Server error', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Edit ──────────────────────────────────────────────────────────────────
    const handleEdit = async () => {
        if (!editTarget || !nameInput.trim()) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/category/${editTarget._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameInput.trim() }),
            });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed to update', 'error');
            showToast('Category updated', 'success');
            setEditTarget(null);
            setNameInput('');
            fetchCategories();
        } catch {
            showToast('Server error', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ── Toggle Active ─────────────────────────────────────────────────────────
    const handleToggleActive = async (cat: Category) => {
        try {
            const res = await fetch(`/api/admin/category/${cat._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !cat.isActive }),
            });
            if (!res.ok) return showToast('Failed to update status', 'error');
            showToast(`Category ${!cat.isActive ? 'activated' : 'deactivated'}`, 'success');
            fetchCategories();
        } catch {
            showToast('Server error', 'error');
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/category/${deleteTarget._id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed to delete', 'error');
            showToast('Category deleted', 'success');
            setDeleteTarget(null);
            fetchCategories();
        } catch {
            showToast('Server error', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const slugPreview = (name: string) =>
        name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    return (
        <div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
                .cat-row:hover { background: #fafafa !important; }
                .action-btn { transition: opacity 0.2s; }
                .action-btn:hover { opacity: 0.75; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}

            {/* ── Page Title ─────────────────────────────────────────────────── */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0 }}>
                    Categories
                </h1>
            </div>

            {/* ── 1. Stat Cards ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
                <StatCard icon={<Tag size={22} />}         label="Total Categories" value={categories.length} color="#6366f1" />
                <StatCard icon={<CheckCircle size={22} />} label="Active"           value={activeCount}       color={ACCENT} />
                <StatCard icon={<XCircle size={22} />}     label="Inactive"         value={inactiveCount}     color="#ff6b6b" />
                <StatCard icon={<Package size={22} />}     label="Total Products"   value={categories.reduce((s, c) => s + (c.productCount ?? 0), 0)} color="#f59e0b" />
            </div>

            {/* ── 2. Toolbar ─────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
                <SearchBar categories={categories} onFilter={setSearchQuery} />

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
                    </select>
                    <svg style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#aaa' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                </div>

                <div style={{ flex: 1 }} />

                <button style={btnPrimary} onClick={() => { setNameInput(''); setShowCreateModal(true); }}>
                    <Plus size={16} /> Add Category
                </button>
            </div>

            {/* ── 3. Table ───────────────────────────────────────────────────── */}
            <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 60, gap: 10, color: ACCENT }}>
                        <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>Loading...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#999' }}>
                        {categories.length === 0 ? 'No categories yet.' : 'No results match your search.'}
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                                    {['Name', 'Slug', 'Products', 'Status', 'Created', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: '#aaa', letterSpacing: '0.1em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((cat, i) => (
                                    <tr key={cat._id} className="cat-row" style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f7f7f7' : 'none', transition: 'background 0.15s' }}>
                                        {/* Name */}
                                        <td style={{ padding: '15px 16px', fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                                            {cat.name}
                                        </td>

                                        {/* Slug */}
                                        <td style={{ padding: '15px 16px' }}>
                                            <span style={{ fontFamily: 'monospace', fontSize: 12, color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 5 }}>
                                                {cat.slug}
                                            </span>
                                        </td>

                                        {/* Product Count */}
                                        <td style={{ padding: '15px 16px' }}>
                                            <span style={{
                                                fontFamily: "'Barlow', sans-serif", fontSize: 13,
                                                color: cat.productCount > 0 ? '#444' : '#ccc',
                                                display: 'flex', alignItems: 'center', gap: 5,
                                            }}>
                                                <Package size={13} style={{ color: cat.productCount > 0 ? '#f59e0b' : '#ddd' }} />
                                                {cat.productCount}
                                            </span>
                                        </td>

                                        {/* Status toggle */}
                                        <td style={{ padding: '15px 16px' }}>
                                            <button
                                                onClick={() => handleToggleActive(cat)}
                                                style={{
                                                    padding: '4px 12px', borderRadius: 20, border: `1px solid ${cat.isActive ? 'rgba(0,212,182,0.3)' : 'rgba(0,0,0,0.1)'}`, cursor: 'pointer',
                                                    fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                                                    background: cat.isActive ? 'rgba(0,212,182,0.1)' : 'rgba(0,0,0,0.04)',
                                                    color: cat.isActive ? ACCENT : '#999',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </button>
                                        </td>

                                        {/* Created */}
                                        <td style={{ padding: '15px 16px', fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#aaa' }}>
                                            {new Date(cat.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '15px 16px' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button className="action-btn" onClick={() => { setEditTarget(cat); setNameInput(cat.name); }} style={{ width: 32, height: 32, background: 'rgba(0,102,255,0.08)', border: 'none', borderRadius: 7, cursor: 'pointer', color: '#0066ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Pencil size={14} />
                                                </button>
                                                <button className="action-btn" onClick={() => setDeleteTarget(cat)} style={{ width: 32, height: 32, background: 'rgba(255,107,107,0.08)', border: 'none', borderRadius: 7, cursor: 'pointer', color: '#ff6b6b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Create Modal ───────────────────────────────────────────────── */}
            {showCreateModal && (
                <Modal title="Add Category" onClose={() => setShowCreateModal(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                                Category Name
                            </label>
                            <input style={inputStyle} placeholder="e.g. Football Boots" value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} autoFocus />
                            {nameInput && (
                                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 6 }}>
                                    Slug: <span style={{ fontFamily: 'monospace', color: '#888' }}>{slugPreview(nameInput)}</span>
                                </p>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button style={btnGhost} onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button style={{ ...btnPrimary, opacity: submitting || !nameInput.trim() ? 0.6 : 1 }} onClick={handleCreate} disabled={submitting || !nameInput.trim()}>
                                {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={14} />}
                                Create
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── Edit Modal ─────────────────────────────────────────────────── */}
            {editTarget && (
                <Modal title="Edit Category" onClose={() => setEditTarget(null)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: '#666', letterSpacing: '0.07em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                                Category Name
                            </label>
                            <input style={inputStyle} value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEdit()} autoFocus />
                            {nameInput && (
                                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 6 }}>
                                    Slug: <span style={{ fontFamily: 'monospace', color: '#888' }}>{slugPreview(nameInput)}</span>
                                </p>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button style={btnGhost} onClick={() => setEditTarget(null)}>Cancel</button>
                            <button style={{ ...btnPrimary, opacity: submitting || !nameInput.trim() ? 0.6 : 1 }} onClick={handleEdit} disabled={submitting || !nameInput.trim()}>
                                {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
                                Save
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* ── Delete Modal ───────────────────────────────────────────────── */}
            {deleteTarget && (
                <Modal title="Delete Category" onClose={() => setDeleteTarget(null)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                            Are you sure you want to delete <strong style={{ color: '#1a1a1a' }}>{deleteTarget.name}</strong>?
                            {deleteTarget.productCount > 0 && (
                                <><br /><span style={{ color: '#ff6b6b', fontSize: 12 }}>⚠ This category has {deleteTarget.productCount} product{deleteTarget.productCount > 1 ? 's' : ''} — deletion will be blocked.</span></>
                            )}
                            {deleteTarget.productCount === 0 && (
                                <><br /><span style={{ color: '#aaa', fontSize: 12 }}>This cannot be undone.</span></>
                            )}
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button style={btnGhost} onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button onClick={handleDelete} disabled={submitting} style={{ background: submitting ? '#ccc' : '#ff6b6b', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}