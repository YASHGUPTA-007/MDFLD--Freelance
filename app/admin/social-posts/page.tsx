'use client';

/**
 * @file app/admin/social-posts/page.tsx
 * @description Admin Social Posts Page
 *
 * - Grid view of posts with image preview, caption, status, actions
 * - Add Post button → slide-in form panel
 * - Edit button → pre-filled form panel
 * - Toggle active/inactive inline
 * - Delete confirmation modal (also removes from Cloudinary)
 * - Toast notifications
 */

import React, { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2, ImagePlus, Instagram, ExternalLink } from 'lucide-react';
import Image from 'next/image';

const ACCENT = '#00d4b6';

interface SocialPost {
    _id: string;
    image: { url: string; public_id: string };
    instagramUrl: string;
    caption?: string;
    isActive: boolean;
    createdAt: string;
}

interface Toast { message: string; type: 'success' | 'error'; }

// ─── Toast ────────────────────────────────────────────────────────────────────
function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
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

// ─── Delete Modal ─────────────────────────────────────────────────────────────
function DeleteModal({ onClose, onConfirm, submitting }: { onClose: () => void; onConfirm: () => void; submitting: boolean; }) {
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>Delete Post</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={20} /></button>
                </div>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
                    Are you sure? This will also delete the image from Cloudinary.
                </p>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #e5e5e5', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#666', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={onConfirm} disabled={submitting} style={{ background: submitting ? '#ccc' : '#ff6b6b', border: 'none', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, color: '#fff', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Trash2 size={14} />}
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Form Panel ───────────────────────────────────────────────────────────────
function PostFormPanel({ editTarget, onClose, onSuccess, showToast }: {
    editTarget: SocialPost | null;
    onClose: () => void;
    onSuccess: () => void;
    showToast: (msg: string, type: 'success' | 'error') => void;
}) {
    const [instagramUrl, setInstagramUrl] = useState('');
    const [caption, setCaption] = useState('');
    const [isActive, setIsActive] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (editTarget) {
            setInstagramUrl(editTarget.instagramUrl);
            setCaption(editTarget.caption || '');
            setIsActive(editTarget.isActive);
            setImagePreview(editTarget.image.url);
        } else {
            setInstagramUrl(''); setCaption(''); setIsActive(true);
            setImageFile(null); setImagePreview(null);
        }
    }, [editTarget]);

    const handleSubmit = async () => {
        if (!instagramUrl.trim()) return showToast('Instagram URL is required', 'error');
        if (!editTarget && !imageFile) return showToast('Image is required', 'error');

        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append('instagramUrl', instagramUrl.trim());
            fd.append('caption', caption);
            fd.append('isActive', String(isActive));
            if (imageFile) fd.append('image', imageFile);

            const url = editTarget ? `/api/admin/social-posts/${editTarget._id}` : '/api/admin/social-posts';
            const method = editTarget ? 'PUT' : 'POST';

            const res = await fetch(url, { method, body: fd });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed to save', 'error');

            showToast(editTarget ? 'Post updated' : 'Post created', 'success');
            onSuccess();
            onClose();
        } catch { showToast('Server error', 'error'); }
        finally { setSubmitting(false); }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
            <div style={{ position: 'relative', width: '100%', maxWidth: 480, background: '#fff', height: '100%', overflowY: 'auto', boxShadow: '-8px 0 40px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>

                {/* Header */}
                <div style={{ padding: '24px 28px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 10 }}>
                    <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: '#1a1a1a' }}>
                        {editTarget ? 'Edit Post' : 'New Post'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={22} /></button>
                </div>

                {/* Body */}
                <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, flex: 1 }}>

                    {/* Image upload */}
                    <div>
                        <label style={labelStyle}>Image <span style={{ color: '#ff6b6b' }}>*</span></label>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{ border: '2px dashed #e5e5e5', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color 0.2s', background: '#fafafa', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 280 }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = ACCENT}
                            onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e5e5'}
                        >
                            {imagePreview ? (
                                <Image src={imagePreview} alt="Preview" width={280} height={280} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ textAlign: 'center', color: '#aaa', fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>
                                    <ImagePlus size={32} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.4 }} />
                                    Click to upload image
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) { setImageFile(f); setImagePreview(URL.createObjectURL(f)); }
                        }} />
                        {editTarget && !imageFile && <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 6 }}>Click to replace existing image</p>}
                    </div>

                    {/* Instagram URL */}
                    <div>
                        <label style={labelStyle}>Instagram URL <span style={{ color: '#ff6b6b' }}>*</span></label>
                        <div style={{ position: 'relative' }}>
                            <Instagram size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
                            <input
                                style={{ ...inputStyle, paddingLeft: 36 }}
                                placeholder="https://instagram.com/p/..."
                                value={instagramUrl}
                                onChange={e => setInstagramUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Caption */}
                    <div>
                        <label style={labelStyle}>Caption <span style={{ color: '#bbb', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
                        <textarea
                            style={{ ...inputStyle, height: 80, resize: 'vertical' }}
                            placeholder="Add a caption..."
                            value={caption}
                            onChange={e => setCaption(e.target.value)}
                        />
                    </div>

                    {/* Active toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: '#fafafa', borderRadius: 10, border: '1px solid #f0f0f0' }}>
                        <div>
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Active</div>
                            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 2 }}>Show on landing page</div>
                        </div>
                        <div onClick={() => setIsActive(o => !o)} style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', background: isActive ? ACCENT : '#e0e0e0', position: 'relative', transition: 'background 0.2s' }}>
                            <div style={{ position: 'absolute', top: 3, left: isActive ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '20px 28px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 10, justifyContent: 'flex-end', position: 'sticky', bottom: 0, background: '#fff' }}>
                    <button onClick={onClose} style={{ background: 'transparent', border: '1px solid #e5e5e5', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#666', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSubmit} disabled={submitting} style={{ background: submitting ? '#ccc' : ACCENT, color: '#020606', border: 'none', borderRadius: 8, padding: '11px 24px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
                        {editTarget ? 'Save Changes' : 'Create Post'}
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
export default function SocialPostsPage() {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editTarget, setEditTarget] = useState<SocialPost | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SocialPost | null>(null);
    const [toast, setToast] = useState<Toast | null>(null);

    const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/social-posts');
            const data = await res.json();
            setPosts(data.posts || []);
        } catch { showToast('Failed to load posts', 'error'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchPosts(); }, []);

    const handleToggleActive = async (post: SocialPost) => {
        try {
            const fd = new FormData();
            fd.append('isActive', String(!post.isActive));
            const res = await fetch(`/api/admin/social-posts/${post._id}`, { method: 'PUT', body: fd });
            if (!res.ok) return showToast('Failed to update', 'error');
            showToast(`Post ${!post.isActive ? 'activated' : 'deactivated'}`, 'success');
            fetchPosts();
        } catch { showToast('Server error', 'error'); }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setSubmitting(true);
        try {
            const res = await fetch(`/api/admin/social-posts/${deleteTarget._id}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) return showToast(data.error || 'Failed to delete', 'error');
            showToast('Post deleted', 'success');
            setDeleteTarget(null);
            fetchPosts();
        } catch { showToast('Server error', 'error'); }
        finally { setSubmitting(false); }
    };

    return (
        <div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                .post-card:hover .post-actions { opacity: 1 !important; }
                .post-card:hover img { transform: scale(1.04); }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                    Social Posts
                </h1>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#999', marginTop: 2, marginBottom: 16 }}>
                    {posts.length} total · Powers the Instagram section on landing page
                </p>
                <button
                    onClick={() => { setEditTarget(null); setShowForm(true); }}
                    style={{ background: ACCENT, color: '#020606', border: 'none', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                    <Plus size={16} /> Add Post
                </button>
            </div>

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 300, color: ACCENT, gap: 10 }}>
                    <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
                </div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#999', background: '#fff', borderRadius: 16, border: '1px solid #e5e5e5' }}>
                    No posts yet. Click &quot;Add Post&quot; to create one.
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                    {posts.map(post => (
                        <div key={post._id} className="post-card" style={{ background: '#fff', borderRadius: 14, border: '1px solid #e5e5e5', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s', position: 'relative' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'}
                        >
                            {/* Image */}
                            <div style={{ aspectRatio: '1', overflow: 'hidden', background: '#f5f5f5', position: 'relative' }}>
                                <Image
                                    src={post.image.url} alt={post.caption || 'Social post'}
                                    width={300} height={300}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease', display: 'block' }}
                                />
                                {/* Hover actions overlay */}
                                <div className="post-actions" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: 0, transition: 'opacity 0.2s' }}>
                                    <button onClick={() => window.open(post.instagramUrl, '_blank')} style={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600 }}>
                                        <ExternalLink size={13} /> View
                                    </button>
                                    <button onClick={() => { setEditTarget(post); setShowForm(true); }} style={{ background: 'rgba(0,102,255,0.85)', border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
                                        <Pencil size={13} />
                                    </button>
                                    <button onClick={() => setDeleteTarget(post)} style={{ background: 'rgba(255,107,107,0.85)', border: 'none', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center' }}>
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div style={{ padding: '12px 14px' }}>
                                {post.caption && (
                                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#555', marginBottom: 10, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                        {post.caption}
                                    </p>
                                )}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <button
                                        onClick={() => handleToggleActive(post)}
                                        style={{ padding: '3px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.05em', background: post.isActive ? 'rgba(0,212,182,0.12)' : 'rgba(0,0,0,0.06)', color: post.isActive ? ACCENT : '#999', transition: 'all 0.2s' }}
                                    >
                                        {post.isActive ? 'ACTIVE' : 'INACTIVE'}
                                    </button>
                                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: '#ccc' }}>
                                        {new Date(post.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showForm && (
                <PostFormPanel
                    editTarget={editTarget}
                    onClose={() => { setShowForm(false); setEditTarget(null); }}
                    onSuccess={fetchPosts}
                    showToast={showToast}
                />
            )}

            {deleteTarget && (
                <DeleteModal
                    onClose={() => setDeleteTarget(null)}
                    onConfirm={handleDelete}
                    submitting={submitting}
                />
            )}

            {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}
        </div>
    );
}