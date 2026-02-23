'use client';

/**
 * @file app/admin/products/page.tsx
 * @description Admin Products Page — redesigned layout
 *
 * Layout (top → bottom):
 *   1. Stat cards (Total, Active, Inactive, Low Stock)
 *   2. Search bar + Category filter + Status filter + [Add Product] button
 *   3. Product table (30 per page, server-paginated)
 *   4. Pagination controls
 *
 * Modal (slide-in panel):
 *   - Uses <ProductImagePicker> for up to 5 images with featured selection
 *   - All other product fields unchanged
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Plus, Pencil, Trash2, X, Check, Loader2,
    ChevronDown, Search, Package, CheckCircle,
    XCircle, AlertTriangle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Image from 'next/image';
import ProductImagePicker, { ImagePickerValue } from './ProductImagePicker';

const ACCENT = '#00d4b6';
const CONDITIONS = ['Brand New', 'New with Tags', 'Used - Like New', 'Used - Good'];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category { _id: string; name: string; }

interface Product {
    _id: string; title: string; price: number; compareAtPrice?: number;
    stock: number; isActive: boolean; condition: string; brand?: string; team?: string;
    images: { url: string; public_id: string }[];
    featuredImageIndex?: number;
    category: { _id: string; name: string };
    createdAt: string;
}

interface Stats { total: number; active: number; inactive: number; lowStock: number; }
interface Pagination { total: number; page: number; limit: number; totalPages: number; }
interface Toast { message: string; type: 'success' | 'error'; }

interface FormState {
    title: string; description: string; price: string; compareAtPrice: string;
    categoryId: string; brand: string; team: string; condition: string; stock: string;
}

const EMPTY_FORM: FormState = {
    title: '', description: '', price: '', compareAtPrice: '',
    categoryId: '', brand: '', team: '', condition: '', stock: '0',
};

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
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
        }}>
            {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
            {toast.message}
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode; label: string; value: number | string; color: string;
}) {
    return (
        <div style={{
            background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14,
            padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)', flex: 1, minWidth: 160,
        }}>
            <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color, flexShrink: 0,
            }}>{icon}</div>
            <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>
                    {value}
                </div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#888', marginTop: 4 }}>
                    {label}
                </div>
            </div>
        </div>
    );
}

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ target, submitting, onClose, onConfirm }: {
    target: Product; submitting: boolean; onClose: () => void; onConfirm: () => void;
}) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} onClick={onClose} />
            <div style={{ position: 'relative', background: '#fff', borderRadius: 16, padding: 32, width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
                <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', marginBottom: 10 }}>
                    Delete Product?
                </h3>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#666', marginBottom: 24 }}>
                    <strong>{target.title}</strong> and its images will be permanently removed.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #e5e5e5', borderRadius: 8, padding: '10px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#666' }}>
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={submitting} style={{ background: submitting ? '#ccc' : '#ff6b6b', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Product Form Panel ───────────────────────────────────────────────────────
function ProductFormPanel({ editTarget, categories, onClose, onSuccess, showToast }: {
    editTarget: Product | null;
    categories: Category[];
    onClose: () => void;
    onSuccess: () => void;
    showToast: (msg: string, type: 'success' | 'error') => void;
}) {
    const [form, setForm] = useState<FormState>(EMPTY_FORM);
    const [pickerValue, setPickerValue] = useState<ImagePickerValue>({ files: [], featuredIndex: 0, existingUrls: [] });
    const [submitting, setSubmitting] = useState(false);

    // Populate form when editing
    useEffect(() => {
        if (editTarget) {
            setForm({
                title: editTarget.title,
                description: '',
                price: String(editTarget.price),
                compareAtPrice: String(editTarget.compareAtPrice || ''),
                categoryId: editTarget.category?._id || '',
                brand: editTarget.brand || '',
                team: editTarget.team || '',
                condition: editTarget.condition,
                stock: String(editTarget.stock),
            });
            setPickerValue({
                files: [],
                featuredIndex: editTarget.featuredImageIndex ?? 0,
                existingUrls: editTarget.images.map(i => i.url),
            });
        } else {
            setForm(EMPTY_FORM);
            setPickerValue({ files: [], featuredIndex: 0, existingUrls: [] });
        }
    }, [editTarget]);

    const handleSubmit = async () => {
        if (!form.title || !form.price || !form.categoryId || !form.condition) {
            return showToast('Please fill in all required fields', 'error');
        }

        setSubmitting(true);
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });

            // Attach new files from picker
            pickerValue.files.forEach(f => fd.append('images', f));
            fd.append('featuredImageIndex', String(pickerValue.featuredIndex));

            const url = editTarget ? `/api/admin/product/${editTarget._id}` : '/api/admin/product';
            const method = editTarget ? 'PUT' : 'POST';

            const res = await fetch(url, { method, body: fd });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed to save product', 'error');

            showToast(editTarget ? 'Product updated' : 'Product created', 'success');
            onSuccess();
            onClose();
        } catch {
            showToast('Server error', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const field = (label: string, key: keyof FormState, placeholder?: string, type = 'text', required = false) => (
        <div>
            <label style={labelStyle}>{label}{required && <span style={{ color: '#ff6b6b' }}> *</span>}</label>
            <input
                type={type}
                style={inputStyle}
                placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                onWheel={e => e.currentTarget.blur()}
            />
        </div>
    );

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
            <div style={{ position: 'relative', width: '100%', maxWidth: 540, background: '#fff', height: '100%', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: 0 }}>
                        {editTarget ? 'Edit Product' : 'New Product'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4 }}>
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>

                    {/* ── Image Picker (modular component) ── */}
                    <div>
                        <label style={labelStyle}>Images (up to 5)</label>
                        <ProductImagePicker
                            existingUrls={pickerValue.existingUrls}
                            onChange={setPickerValue}
                            maxImages={5}
                        />
                    </div>

                    {field('Title', 'title', 'e.g. Nike Mercurial Superfly', 'text', true)}

                    <div>
                        <label style={labelStyle}>Description</label>
                        <textarea
                            style={{ ...inputStyle, height: 90, resize: 'vertical' }}
                            placeholder="Product description..."
                            value={form.description}
                            onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {field('Price ($)', 'price', '0.00', 'number', true)}
                        {field('Compare At ($)', 'compareAtPrice', '0.00', 'number')}
                    </div>

                    {/* Category */}
                    <div>
                        <label style={labelStyle}>Category <span style={{ color: '#ff6b6b' }}>*</span></label>
                        <div style={{ position: 'relative' }}>
                            <select style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }} value={form.categoryId} onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}>
                                <option value="">Select category</option>
                                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    {/* Condition */}
                    <div>
                        <label style={labelStyle}>Condition <span style={{ color: '#ff6b6b' }}>*</span></label>
                        <div style={{ position: 'relative' }}>
                            <select style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }} value={form.condition} onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}>
                                <option value="">Select condition</option>
                                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        {field('Brand', 'brand', 'e.g. Nike')}
                        {field('Team', 'team', 'e.g. Man United')}
                    </div>

                    {field('Stock', 'stock', '0', 'number')}
                </div>

                {/* Footer */}
                <div style={{ padding: '20px 28px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 10, justifyContent: 'flex-end', position: 'sticky', bottom: 0, background: '#fff' }}>
                    <button onClick={onClose} style={{ background: 'transparent', color: '#666', border: '1px solid #e5e5e5', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button onClick={handleSubmit} disabled={submitting} style={{ background: submitting ? '#ccc' : ACCENT, color: '#020606', border: 'none', borderRadius: 8, padding: '11px 24px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
                        {editTarget ? 'Save Changes' : 'Create Product'}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0, lowStock: 0 });
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 30, totalPages: 1 });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Filters
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const searchWrapRef = useRef<HTMLDivElement>(null);
    const [suggestionsOpen, setSuggestionsOpen] = useState(false);
    const [filterCat, setFilterCat] = useState('');
    const [filterStatus, setFilterStatus] = useState('');

    // Modals
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState<Product | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);

    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

    // ── Fetch products (server-paginated) ─────────────────────────────────────
    const fetchProducts = useCallback(async (page = 1, s = search, cat = filterCat, status = filterStatus) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (s) params.set('search', s);
            if (cat) params.set('category', cat);
            if (status) params.set('status', status);

            const res = await fetch(`/api/admin/product?${params}`);
            const data = await res.json();
            setProducts(data.products || []);
            setPagination(data.pagination);
            if (data.stats) setStats(data.stats);
        } catch {
            showToast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    }, [search, filterCat, filterStatus]);

    // ── Fetch categories once ─────────────────────────────────────────────────
    useEffect(() => {
        fetch('/api/admin/category')
            .then(r => r.json())
            .then(d => setCategories(d.categories || []));
    }, []);

    useEffect(() => { fetchProducts(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const h = (e: MouseEvent) => {
            if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node))
                setSuggestionsOpen(false);
        };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    // Debounced search
    const handleSearchInput = (val: string) => {
        setSearchInput(val);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setSearch(val);
            fetchProducts(1, val, filterCat, filterStatus);
        }, 400);
    };

    const handleFilterCat = (val: string) => {
        setFilterCat(val);
        fetchProducts(1, search, val, filterStatus);
    };

    const handleFilterStatus = (val: string) => {
        setFilterStatus(val);
        fetchProducts(1, search, filterCat, val);
    };

    // ── Toggle active ─────────────────────────────────────────────────────────
    const handleToggleActive = async (product: Product) => {
        try {
            const fd = new FormData();
            fd.append('isActive', String(!product.isActive));
            const res = await fetch(`/api/admin/product/${product._id}`, { method: 'PUT', body: fd });
            if (!res.ok) return showToast('Failed to update status', 'error');
            showToast(`Product ${!product.isActive ? 'activated' : 'deactivated'}`, 'success');
            fetchProducts(pagination.page);
        } catch {
            showToast('Server error', 'error');
        }
    };

    // ── Delete ────────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/product/${deleteTarget._id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed to delete', 'error');
            showToast('Product deleted', 'success');
            setDeleteTarget(null);
            fetchProducts(pagination.page);
        } catch {
            showToast('Server error', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
                .prod-row:hover { background: #fafafa !important; }
                .action-btn:hover { opacity: 0.75; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

            {/* Page title */}
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase', margin: 0 }}>
                    Products
                </h1>
            </div>

            {/* ── 1. Stat Cards ─────────────────────────────────────────────── */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
                <StatCard icon={<Package size={22} />} label="Total Products" value={stats.total} color="#6366f1" />
                <StatCard icon={<CheckCircle size={22} />} label="Active" value={stats.active} color={ACCENT} />
                <StatCard icon={<XCircle size={22} />} label="Inactive" value={stats.inactive} color="#ff6b6b" />
                <StatCard icon={<AlertTriangle size={22} />} label="Low Stock (≤5)" value={stats.lowStock} color="#f59e0b" />
            </div>

            {/* ── 2. Search / Filter / Add button ───────────────────────────── */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
                {/* Search */}
                <div ref={searchWrapRef} style={{ position: 'relative', flex: '1 1 220px', maxWidth: 360 }}>
                    <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={e => { handleSearchInput(e.target.value); setSuggestionsOpen(e.target.value.trim().length > 0); }}
                        onFocus={() => searchInput.trim().length > 0 && setSuggestionsOpen(true)}
                        onKeyDown={e => e.key === 'Escape' && setSuggestionsOpen(false)}
                        style={{ ...inputStyle, paddingLeft: 36 }}
                    />
                    {suggestionsOpen && products.filter(p => p.title.toLowerCase().includes(searchInput.toLowerCase())).length > 0 && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, zIndex: 200, background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.10)', overflow: 'hidden' }}>
                            {products
                                .filter(p => p.title.toLowerCase().includes(searchInput.toLowerCase()))
                                .slice(0, 6)
                                .map(p => {
                                    const idx = p.title.toLowerCase().indexOf(searchInput.toLowerCase());
                                    return (
                                        <button
                                            key={p._id}
                                            onMouseDown={() => { handleSearchInput(p.title); setSuggestionsOpen(false); }}
                                            style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', textAlign: 'left', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#333' }}
                                            onMouseEnter={e => (e.currentTarget.style.background = '#f9fffe')}
                                            onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                                        >
                                            <span>
                                                {p.title.slice(0, idx)}
                                                <strong style={{ color: ACCENT }}>{p.title.slice(idx, idx + searchInput.length)}</strong>
                                                {p.title.slice(idx + searchInput.length)}
                                            </span>
                                            <span style={{ fontSize: 11, color: '#aaa', fontFamily: "'Barlow', sans-serif", flexShrink: 0, marginLeft: 8 }}>
                                                {p.category?.name}
                                            </span>
                                        </button>
                                    );
                                })
                            }
                        </div>
                    )}
                </div>
                {/* Category filter */}
                <div style={{ position: 'relative', flex: '0 0 180px' }}>
                    <select
                        value={filterCat}
                        onChange={e => handleFilterCat(e.target.value)}
                        style={{ ...inputStyle, appearance: 'none', paddingRight: 32 }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                </div>

                {/* Status filter */}
                <div style={{ position: 'relative', flex: '0 0 150px' }}>
                    <select
                        value={filterStatus}
                        onChange={e => handleFilterStatus(e.target.value)}
                        style={{ ...inputStyle, appearance: 'none', paddingRight: 32 }}
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                </div>

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Add Product */}
                <button
                    onClick={() => { setEditTarget(null); setShowForm(true); }}
                    style={{ background: ACCENT, color: '#020606', border: 'none', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                >
                    <Plus size={16} /> Add Product
                </button>
            </div>

            {/* ── 3. Table ──────────────────────────────────────────────────── */}
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: ACCENT, gap: 10 }}>
                        <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : products.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#999' }}>
                        No products found.
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #e5e5e5', background: '#fafafa' }}>
                                    {['Image', 'Title', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p, i) => {
                                    const featuredUrl = p.images?.[p.featuredImageIndex ?? 0]?.url || p.images?.[0]?.url;
                                    return (
                                        <tr key={p._id} className="prod-row" style={{ borderBottom: i < products.length - 1 ? '1px solid #f0f0f0' : 'none', transition: 'background 0.15s' }}>
                                            {/* Image */}
                                            <td style={{ padding: '14px 20px' }}>
                                                {featuredUrl ? (
                                                    <Image src={featuredUrl} alt={p.title} width={48} height={48} style={{ borderRadius: 8, objectFit: 'cover', border: '1px solid #f0f0f0' }} />
                                                ) : (
                                                    <div style={{ width: 48, height: 48, background: '#f5f5f5', borderRadius: 8 }} />
                                                )}
                                            </td>
                                            {/* Title */}
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{p.title}</div>
                                                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#aaa' }}>{p.condition}</div>
                                            </td>
                                            {/* Category */}
                                            <td style={{ padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#555' }}>
                                                {p.category?.name || '—'}
                                            </td>
                                            {/* Price */}
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>${p.price.toFixed(2)}</div>
                                                {p.compareAtPrice && (
                                                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#bbb', textDecoration: 'line-through' }}>${p.compareAtPrice.toFixed(2)}</div>
                                                )}
                                            </td>
                                            {/* Stock */}
                                            <td style={{ padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: p.stock <= 5 ? '#f59e0b' : '#1a1a1a', fontWeight: p.stock <= 5 ? 700 : 400 }}>
                                                {p.stock}
                                            </td>
                                            {/* Status toggle */}
                                            <td style={{ padding: '14px 20px' }}>
                                                <button
                                                    onClick={() => handleToggleActive(p)}
                                                    style={{ background: p.isActive ? '#e8fdf8' : '#fff0f0', color: p.isActive ? ACCENT : '#ff6b6b', border: `1px solid ${p.isActive ? ACCENT : '#ff6b6b'}`, borderRadius: 20, padding: '4px 12px', fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
                                                >
                                                    {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                                                </button>
                                            </td>
                                            {/* Actions */}
                                            <td style={{ padding: '14px 20px' }}>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <button className="action-btn" onClick={() => { setEditTarget(p); setShowForm(true); }} style={{ background: '#f0f8ff', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#0066ff', display: 'flex', alignItems: 'center' }}>
                                                        <Pencil size={14} />
                                                    </button>
                                                    <button className="action-btn" onClick={() => setDeleteTarget(p)} style={{ background: '#fff0f0', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#ff6b6b', display: 'flex', alignItems: 'center' }}>
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

            {/* ── 4. Pagination ─────────────────────────────────────────────── */}
            {pagination.totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>
                    <span style={{ color: '#888' }}>
                        Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => fetchProducts(pagination.page - 1)}
                            style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: '8px 14px', cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer', opacity: pagination.page <= 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}
                        >
                            <ChevronLeft size={14} /> Prev
                        </button>
                        {Array.from({ length: Math.min(pagination.totalPages, 7) }, (_, i) => {
                            const p = i + 1;
                            return (
                                <button key={p} onClick={() => fetchProducts(p)} style={{ background: pagination.page === p ? ACCENT : '#fff', color: pagination.page === p ? '#020606' : '#333', border: `1px solid ${pagination.page === p ? ACCENT : '#e5e5e5'}`, borderRadius: 8, padding: '8px 14px', cursor: 'pointer', fontWeight: pagination.page === p ? 700 : 400 }}>
                                    {p}
                                </button>
                            );
                        })}
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => fetchProducts(pagination.page + 1)}
                            style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 8, padding: '8px 14px', cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page >= pagination.totalPages ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: 4, color: '#333' }}
                        >
                            Next <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Modals ────────────────────────────────────────────────────── */}
            {showForm && (
                <ProductFormPanel
                    editTarget={editTarget}
                    categories={categories}
                    onClose={() => setShowForm(false)}
                    onSuccess={() => fetchProducts(pagination.page)}
                    showToast={showToast}
                />
            )}

            {deleteTarget && (
                <DeleteModal
                    target={deleteTarget}
                    submitting={submitting}
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                />
            )}

            {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}
        </div>
    );
}