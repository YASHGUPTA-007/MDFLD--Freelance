'use client';

/**
 * @file app/admin/categories/page.tsx
 * @description Admin Categories Page
 *
 * - Table view: Name, Slug, Status, Created At, Actions
 * - Add Category button → opens create modal
 * - Edit (pencil) button → opens edit modal (pre-filled)
 * - Toggle active/inactive status inline
 * - Delete (trash) button → confirmation modal (blocked if in use)
 * - Toast notifications for success/error
 */

import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';

const ACCENT = '#00d4b6';

interface Category {
    _id: string;
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: string;
}

interface Toast {
    message: string;
    type: 'success' | 'error';
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div style={{
            position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
            background: toast.type === 'success' ? '#1a2e2a' : '#2e1a1a',
            border: `1px solid ${toast.type === 'success' ? ACCENT : '#ff6b6b'}`,
            borderRadius: 10, padding: '14px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
            fontFamily: "'Barlow', sans-serif", fontSize: 13,
            color: toast.type === 'success' ? ACCENT : '#ff6b6b',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
            {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
            {toast.message}
        </div>
    );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }} onClick={onClose}>
            <div style={{
                background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 440,
                boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>
                        {title}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4 }}>
                        <X size={20} />
                    </button>
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

    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

    // ── Fetch ──
    const fetchCategories = async () => {
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
    };

    useEffect(() => { fetchCategories(); }, []);

    // ── Create ──
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

    // ── Edit ──
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

    // ── Toggle Active ──
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

    // ── Delete ──
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

    const inputStyle: React.CSSProperties = {
        width: '100%', padding: '12px 14px',
        border: '1px solid #e5e5e5', borderRadius: 8,
        fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#1a1a1a',
        outline: 'none', background: '#fafafa',
    };

    const btnPrimary: React.CSSProperties = {
        background: ACCENT, color: '#020606', border: 'none',
        borderRadius: 8, padding: '11px 20px',
        fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
    };

    const btnGhost: React.CSSProperties = {
        background: 'transparent', color: '#666', border: '1px solid #e5e5e5',
        borderRadius: 8, padding: '11px 20px',
        fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
        cursor: 'pointer',
    };

    return (
        <div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
                .cat-row:hover { background: #fafafa !important; }
                .action-btn:hover { opacity: 0.75; }
                .tbl-wrap { overflow-x: auto; }
            `}</style>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, gap: 12, flexWrap: 'wrap' }}>
                <div>
                    <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                        Categories
                    </h1>
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#999', marginTop: 2 }}>
                        {categories.length} total
                    </p>
                </div>
                <button style={{ ...btnPrimary, whiteSpace: 'nowrap', flexShrink: 0 }} onClick={() => { setNameInput(''); setShowCreateModal(true); }}>
                    <Plus size={16} /> Add Category
                </button>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: ACCENT }}>
                        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                ) : categories.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#999' }}>
                        No categories yet. Click &quot;Add Category&quot; to create one.
                    </div>
                ) : (
                    <div className="tbl-wrap">
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e5e5', background: '#fafafa' }}>
                                    {['Name', 'Slug', 'Status', 'Created', 'Actions'].map(h => (
                                        <th key={h} style={{
                                            padding: '14px 20px', textAlign: 'left',
                                            fontFamily: "'Barlow', sans-serif", fontSize: 11,
                                            fontWeight: 700, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase',
                                        }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat, i) => (
                                    <tr key={cat._id} className="cat-row" style={{
                                        borderBottom: i < categories.length - 1 ? '1px solid #f0f0f0' : 'none',
                                        transition: 'background 0.15s',
                                    }}>
                                        <td style={{ padding: '16px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                                            {cat.name}
                                        </td>
                                        <td style={{ padding: '16px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#888' }}>
                                            {cat.slug}
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <button
                                                onClick={() => handleToggleActive(cat)}
                                                style={{
                                                    padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                                                    fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                                                    letterSpacing: '0.05em',
                                                    background: cat.isActive ? 'rgba(0,212,182,0.12)' : 'rgba(0,0,0,0.06)',
                                                    color: cat.isActive ? ACCENT : '#999',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {cat.isActive ? 'ACTIVE' : 'INACTIVE'}
                                            </button>
                                        </td>
                                        <td style={{ padding: '16px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#aaa' }}>
                                            {new Date(cat.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td style={{ padding: '16px 20px' }}>
                                            <div style={{ display: 'flex', gap: 8 }}>
                                                <button
                                                    className="action-btn"
                                                    onClick={() => { setEditTarget(cat); setNameInput(cat.name); }}
                                                    style={{ background: 'rgba(0,102,255,0.08)', border: 'none', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', color: '#0066ff', transition: 'opacity 0.2s' }}
                                                >
                                                    <Pencil size={14} />
                                                </button>
                                                <button
                                                    className="action-btn"
                                                    onClick={() => setDeleteTarget(cat)}
                                                    style={{ background: 'rgba(255,107,107,0.08)', border: 'none', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', color: '#ff6b6b', transition: 'opacity 0.2s' }}
                                                >
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

            {/* Create Modal */}
            {showCreateModal && (
                <Modal title="Add Category" onClose={() => setShowCreateModal(false)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: '#666', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                                Category Name
                            </label>
                            <input
                                style={inputStyle}
                                placeholder="e.g. Football Boots"
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                                autoFocus
                            />
                            {nameInput && (
                                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 6 }}>
                                    Slug: {nameInput.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
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

            {/* Edit Modal */}
            {editTarget && (
                <Modal title="Edit Category" onClose={() => setEditTarget(null)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div>
                            <label style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: '#666', letterSpacing: '0.06em', textTransform: 'uppercase', display: 'block', marginBottom: 6 }}>
                                Category Name
                            </label>
                            <input
                                style={inputStyle}
                                value={nameInput}
                                onChange={e => setNameInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleEdit()}
                                autoFocus
                            />
                            {nameInput && (
                                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 6 }}>
                                    Slug: {nameInput.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
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

            {/* Delete Confirm Modal */}
            {deleteTarget && (
                <Modal title="Delete Category" onClose={() => setDeleteTarget(null)}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                            Are you sure you want to delete <strong style={{ color: '#1a1a1a' }}>{deleteTarget.name}</strong>?
                            <br />
                            <span style={{ color: '#ff6b6b', fontSize: 12 }}>This cannot be undone. Deletion is blocked if products use this category.</span>
                        </p>
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button style={btnGhost} onClick={() => setDeleteTarget(null)}>Cancel</button>
                            <button
                                onClick={handleDelete}
                                disabled={submitting}
                                style={{
                                    background: submitting ? '#ccc' : '#ff6b6b', color: '#fff', border: 'none',
                                    borderRadius: 8, padding: '11px 20px', cursor: submitting ? 'not-allowed' : 'pointer',
                                    fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700,
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}
                            >
                                {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}
        </div>
    );
}