'use client';

/**
 * @file app/admin/products/page.tsx
 * @description Admin Products Page
 *
 * - Table view: Image, Title, Category, Price, Stock, Status, Actions
 * - Add Product button → opens create form (slide-in panel)
 * - Edit button → opens edit form (pre-filled)
 * - Toggle active/inactive status inline
 * - Delete button → confirmation modal (also deletes Cloudinary images)
 * - Image upload (multiple), category dropdown, condition dropdown
 * - Toast notifications for success/error
 */

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2, ImagePlus, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const ACCENT = '#00d4b6';

const CONDITIONS = ['Brand New', 'New with Tags', 'Used - Like New', 'Used - Good'];

interface Category { _id: string; name: string; }
interface Product {
  _id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  isActive: boolean;
  condition: string;
  brand?: string;
  team?: string;
  images: { url: string; public_id: string }[];
  category: { _id: string; name: string };
  createdAt: string;
}

interface Toast { message: string; type: 'success' | 'error'; }

interface FormState {
  title: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: string;
  brand: string;
  team: string;
  condition: string;
  stock: string;
}

const EMPTY_FORM: FormState = {
  title: '', description: '', price: '', compareAtPrice: '',
  categoryId: '', brand: '', team: '', condition: '', stock: '0',
};

// ─── Toast ────────────────────────────────────────────────────────────────────
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

// ─── Delete Confirm Modal ─────────────────────────────────────────────────────
function DeleteModal({ product, onClose, onConfirm, submitting }: {
  product: Product; onClose: () => void;
  onConfirm: () => void; submitting: boolean;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>Delete Product</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={20} /></button>
        </div>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
          Are you sure you want to delete <strong style={{ color: '#1a1a1a' }}>{product.title}</strong>?
          <br /><span style={{ color: '#ff6b6b', fontSize: 12 }}>This will also delete all product images from Cloudinary.</span>
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', color: '#666', border: '1px solid #e5e5e5', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={submitting} style={{ background: submitting ? '#ccc' : '#ff6b6b', color: '#fff', border: 'none', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setImagePreviews(editTarget.images.map(i => i.url));
    } else {
      setForm(EMPTY_FORM);
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [editTarget]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreviews(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.categoryId || !form.condition) {
      return showToast('Please fill in all required fields', 'error');
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      imageFiles.forEach(f => fd.append('images', f));

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
      />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
      {/* Backdrop */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />

      {/* Panel */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 520, background: '#fff', height: '100%', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>
        {/* Panel Header */}
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: '#1a1a1a' }}>
            {editTarget ? 'Edit Product' : 'New Product'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: 4 }}>
            <X size={22} />
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>

          {/* Image Upload */}
          <div>
            <label style={labelStyle}>Images</label>
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: '2px dashed #e5e5e5', borderRadius: 10, padding: '20px',
                cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s',
                background: '#fafafa',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e5e5')}
            >
              {imagePreviews.length > 0 ? (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                  {imagePreviews.map((src, i) => (
                    <img key={i} src={src} alt="" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid #e5e5e5' }} />
                  ))}
                </div>
              ) : (
                <div style={{ color: '#aaa', fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>
                  <ImagePlus size={28} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                  Click to upload images
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
            {imagePreviews.length > 0 && (
              <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 6 }}>
                {imageFiles.length > 0 ? `${imageFiles.length} new image(s) selected` : 'Existing images (upload new to replace)'}
              </p>
            )}
          </div>

          {field('Title', 'title', 'e.g. Nike Mercurial Superfly', 'text', true)}

          {/* Description */}
          <div>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, height: 90, resize: 'vertical' }}
              placeholder="Product description..."
              value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
            />
          </div>

          {/* Price row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('Price (£)', 'price', '0.00', 'number', true)}
            {field('Compare At (£)', 'compareAtPrice', '0.00', 'number')}
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category <span style={{ color: '#ff6b6b' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <select
                style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}
                value={form.categoryId}
                onChange={e => setForm(p => ({ ...p, categoryId: e.target.value }))}
              >
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
              <select
                style={{ ...inputStyle, appearance: 'none', paddingRight: 36 }}
                value={form.condition}
                onChange={e => setForm(p => ({ ...p, condition: e.target.value }))}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
            </div>
          </div>

          {/* Brand + Team */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {field('Brand', 'brand', 'e.g. Nike')}
            {field('Team', 'team', 'e.g. Man United')}
          </div>

          {field('Stock', 'stock', '0', 'number')}
        </div>

        {/* Panel Footer */}
        <div style={{ padding: '20px 28px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 10, justifyContent: 'flex-end', position: 'sticky', bottom: 0, background: '#fff' }}>
          <button onClick={onClose} style={{ background: 'transparent', color: '#666', border: '1px solid #e5e5e5', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ background: submitting ? '#ccc' : ACCENT, color: '#020606', border: 'none', borderRadius: 8, padding: '11px 24px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
            {editTarget ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared Styles ────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px',
  border: '1px solid #e5e5e5', borderRadius: 8,
  fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#1a1a1a',
  outline: 'none', background: '#fafafa',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
  color: '#666', letterSpacing: '0.07em', textTransform: 'uppercase',
  display: 'block', marginBottom: 6,
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/admin/product'),
        fetch('/api/admin/category'),
      ]);
      const pData = await pRes.json();
      const cData = await cRes.json();
      setProducts(pData.products || []);
      setCategories(cData.categories || []);
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleToggleActive = async (product: Product) => {
    try {
      const fd = new FormData();
      fd.append('isActive', String(!product.isActive));
      const res = await fetch(`/api/admin/product/${product._id}`, { method: 'PUT', body: fd });
      if (!res.ok) return showToast('Failed to update status', 'error');
      showToast(`Product ${!product.isActive ? 'activated' : 'deactivated'}`, 'success');
      fetchAll();
    } catch {
      showToast('Server error', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/product/${deleteTarget._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Failed to delete', 'error');
      showToast('Product deleted', 'success');
      setDeleteTarget(null);
      fetchAll();
    } catch {
      showToast('Server error', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
                .prod-row:hover { background: #fafafa !important; }
                .action-btn:hover { opacity: 0.75; }
                .tbl-wrap { overflow-x: auto; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            Products
          </h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#999', marginTop: 2 }}>
            {products.length} total
          </p>
        </div>
        <button
          onClick={() => { setEditTarget(null); setShowForm(true); }}
          style={{ background: ACCENT, color: '#020606', border: 'none', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: ACCENT, gap: 10 }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#999' }}>
            No products yet. Click &quot;Add Product&quot; to create one.
          </div>
        ) : (
          <div className="tbl-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 780 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5', background: '#fafafa' }}>
                  {['Image', 'Title', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p._id} className="prod-row" style={{ borderBottom: i < products.length - 1 ? '1px solid #f0f0f0' : 'none', transition: 'background 0.15s' }}>
                    {/* Image */}
                    <td style={{ padding: '14px 20px' }}>
                      {p.images?.[0]?.url ? (
                        <Image src={p.images[0].url} alt={p.title} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8, border: '1px solid #f0f0f0' }} />

                      ) : (
                        <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <ImagePlus size={16} color="#ccc" />
                        </div>
                      )}
                    </td>
                    {/* Title */}
                    <td style={{ padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600, color: '#1a1a1a', maxWidth: 200 }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: '#aaa', fontWeight: 400, marginTop: 2 }}>{p.condition}</div>
                    </td>
                    {/* Category */}
                    <td style={{ padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#666' }}>
                      {p.category?.name || '—'}
                    </td>
                    {/* Price */}
                    <td style={{ padding: '14px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
                      £{p.price.toFixed(2)}
                      {p.compareAtPrice && (
                        <div style={{ fontSize: 11, color: '#aaa', fontWeight: 400, textDecoration: 'line-through' }}>£{p.compareAtPrice.toFixed(2)}</div>
                      )}
                    </td>
                    {/* Stock */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
                        color: p.stock === 0 ? '#ff6b6b' : p.stock < 5 ? '#f59e0b' : '#1a1a1a',
                      }}>
                        {p.stock === 0 ? 'Out' : p.stock}
                      </span>
                    </td>
                    {/* Status */}
                    <td style={{ padding: '14px 20px' }}>
                      <button
                        onClick={() => handleToggleActive(p)}
                        style={{
                          padding: '4px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
                          fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
                          background: p.isActive ? 'rgba(0,212,182,0.12)' : 'rgba(0,0,0,0.06)',
                          color: p.isActive ? ACCENT : '#999',
                          transition: 'all 0.2s',
                        }}
                      >
                        {p.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </button>
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          className="action-btn"
                          onClick={() => { setEditTarget(p); setShowForm(true); }}
                          style={{ background: 'rgba(0,102,255,0.08)', border: 'none', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', color: '#0066ff' }}
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          className="action-btn"
                          onClick={() => setDeleteTarget(p)}
                          style={{ background: 'rgba(255,107,107,0.08)', border: 'none', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', color: '#ff6b6b' }}
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

      {/* Form Panel */}
      {showForm && (
        <ProductFormPanel
          editTarget={editTarget}
          categories={categories}
          onClose={() => { setShowForm(false); setEditTarget(null); }}
          onSuccess={fetchAll}
          showToast={showToast}
        />
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal
          product={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          submitting={submitting}
        />
      )}

      {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}