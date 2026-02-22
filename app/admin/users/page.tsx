'use client';

/**
 * @file app/admin/users/page.tsx
 * @description Admin Users Page
 *
 * - Table: Avatar, Name, Email, Role, Total Orders, Total Spent, Refund Count, Joined, Actions
 * - Search by name or email
 * - Pagination (10 per page)
 * - Actions dropdown: View Orders, Change Role, Block/Unblock
 * - Confirmation modal for role change and block/unblock
 * - Toast notifications
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  Search, ChevronLeft, ChevronRight, MoreVertical,
  ShoppingBag, Shield, Ban, CheckCircle, Loader2, X, Check
} from 'lucide-react';

const ACCENT = '#00d4b6';

interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  isBlocked: boolean;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
  refundCount: number;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface Toast { message: string; type: 'success' | 'error'; }

interface ConfirmModal {
  userId: string;
  userName: string;
  action: 'role' | 'block';
  currentValue: string | boolean;
}

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

// ─── Confirm Modal ────────────────────────────────────────────────────────────
function ConfirmationModal({ modal, onClose, onConfirm, submitting }: {
  modal: ConfirmModal;
  onClose: () => void;
  onConfirm: () => void;
  submitting: boolean;
}) {
  const isBlock = modal.action === 'block';
  const isBlocked = modal.currentValue === true;
  const isAdmin = modal.currentValue === 'admin';

  const title = isBlock
    ? (isBlocked ? 'Unblock User' : 'Block User')
    : (isAdmin ? 'Demote to User' : 'Promote to Admin');

  const description = isBlock
    ? (isBlocked
      ? `Unblocking ${modal.userName} will restore their access to the platform.`
      : `Blocking ${modal.userName} will prevent them from logging in or making purchases.`)
    : (isAdmin
      ? `${modal.userName} will lose admin access and become a regular user.`
      : `${modal.userName} will gain full admin access to the dashboard.`);

  const confirmColor = isBlock && !isBlocked ? '#ff6b6b' : ACCENT;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420, boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={20} /></button>
        </div>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#555', lineHeight: 1.6, marginBottom: 24 }}>
          {description}
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'transparent', color: '#666', border: '1px solid #e5e5e5', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Cancel
          </button>
          <button onClick={onConfirm} disabled={submitting} style={{ background: submitting ? '#ccc' : confirmColor, color: confirmColor === '#ff6b6b' ? '#fff' : '#020606', border: 'none', borderRadius: 8, padding: '11px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {submitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Check size={14} />}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Actions Dropdown ─────────────────────────────────────────────────────────
function ActionsDropdown({ user, onAction }: {
  user: User;
  onAction: (action: 'orders' | 'role' | 'block', user: User) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const menuItem = (icon: React.ReactNode, label: string, onClick: () => void, color = '#1a1a1a') => (
    <button
      onClick={() => { onClick(); setOpen(false); }}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 16px', background: 'none', border: 'none',
        fontFamily: "'Barlow', sans-serif", fontSize: 13, color, cursor: 'pointer',
        textAlign: 'left', transition: 'background 0.15s',
      }}
      onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
      onMouseLeave={e => e.currentTarget.style.background = 'none'}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ background: 'rgba(0,0,0,0.04)', border: 'none', borderRadius: 7, padding: '7px 10px', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center' }}
      >
        <MoreVertical size={15} />
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '110%', zIndex: 100,
          background: '#fff', border: '1px solid #e5e5e5', borderRadius: 10,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', minWidth: 180,
          overflow: 'hidden',
        }}>
          {menuItem(<ShoppingBag size={14} />, 'View Orders', () => onAction('orders', user))}
          {menuItem(
            <Shield size={14} />,
            user.role === 'admin' ? 'Demote to User' : 'Promote to Admin',
            () => onAction('role', user),
            '#0066ff'
          )}
          {menuItem(
            user.isBlocked ? <CheckCircle size={14} /> : <Ban size={14} />,
            user.isBlocked ? 'Unblock User' : 'Block User',
            () => onAction('block', user),
            user.isBlocked ? ACCENT : '#ff6b6b'
          )}
        </div>
      )}
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function UserAvatar({ user }: { user: User }) {
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  if (user.avatar) {
    return <img src={user.avatar} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid #f0f0f0' }} />;
  }
  return (
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #00a896)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 800, color: '#020606' }}>
      {initials}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [confirmModal, setConfirmModal] = useState<ConfirmModal | null>(null);
  const [toast, setToast] = useState<Toast | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => setToast({ message, type });

  const fetchUsers = useCallback(async (page = 1, searchTerm = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (searchTerm) params.set('search', searchTerm);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setPagination(data.pagination);
    } catch {
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(1); }, []);

  // Debounced search
  const handleSearchInput = (val: string) => {
    setSearchInput(val);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(val);
      fetchUsers(1, val);
    }, 400);
  };

  const handleAction = (action: 'orders' | 'role' | 'block', user: User) => {
    if (action === 'orders') {
      window.open(`/admin/orders?userId=${user._id}`, '_blank');
      return;
    }
    setConfirmModal({
      userId: user._id,
      userName: user.name,
      action,
      currentValue: action === 'role' ? user.role : user.isBlocked,
    });
  };

  const handleConfirm = async () => {
    if (!confirmModal) return;
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {};
      if (confirmModal.action === 'role') {
        body.role = confirmModal.currentValue === 'admin' ? 'user' : 'admin';
      } else {
        body.isBlocked = !confirmModal.currentValue;
      }

      const res = await fetch(`/api/admin/users/${confirmModal.userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) return showToast(data.error || 'Failed', 'error');

      showToast(
        confirmModal.action === 'role'
          ? `Role updated to ${body.role}`
          : `User ${body.isBlocked ? 'blocked' : 'unblocked'}`,
        'success'
      );
      setConfirmModal(null);
      fetchUsers(pagination.page);
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
                .user-row:hover { background: #fafafa !important; }
                .tbl-wrap { overflow-x: auto; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
            Users
          </h1>
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#999', marginTop: 2 }}>
            {pagination.total} total
          </p>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: 280 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={e => handleSearchInput(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px 10px 36px',
              border: '1px solid #e5e5e5', borderRadius: 8,
              fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#1a1a1a',
              outline: 'none', background: '#fafafa',
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: ACCENT, gap: 10 }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#999' }}>
            {search ? `No users found for "${search}"` : 'No users yet.'}
          </div>
        ) : (
          <div className="tbl-wrap">
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e5e5', background: '#fafafa' }}>
                  {['User', 'Email', 'Role', 'Orders', 'Spent', 'Refunds', 'Joined', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700, color: '#999', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={user._id} className="user-row" style={{ borderBottom: i < users.length - 1 ? '1px solid #f0f0f0' : 'none', transition: 'background 0.15s', opacity: user.isBlocked ? 0.6 : 1 }}>
                    {/* User */}
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <UserAvatar user={user} />
                        <div>
                          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {user.name}
                            {user.isBlocked && (
                              <span style={{ fontSize: 10, background: 'rgba(255,107,107,0.12)', color: '#ff6b6b', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>BLOCKED</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Email */}
                    <td style={{ padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#666' }}>
                      {user.email}
                    </td>
                    {/* Role */}
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                        fontFamily: "'Barlow', sans-serif", letterSpacing: '0.05em',
                        background: user.role === 'admin' ? 'rgba(0,102,255,0.1)' : 'rgba(0,0,0,0.05)',
                        color: (user.role ?? 'user') === 'admin' ? '#0066ff' : '#888',

                      }}>
                        {(user.role ?? 'user').toUpperCase()}
                      </span>
                    </td>
                    {/* Orders */}
                    <td style={{ padding: '14px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>
                      {user.totalOrders}
                    </td>
                    {/* Spent */}
                    <td style={{ padding: '14px 20px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 700, color: ACCENT }}>
                      £{user.totalSpent.toFixed(2)}
                    </td>
                    {/* Refunds */}
                    <td style={{ padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: user.refundCount > 0 ? '#f59e0b' : '#aaa' }}>
                      {user.refundCount}
                    </td>
                    {/* Joined */}
                    <td style={{ padding: '14px 20px', fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#aaa' }}>
                      {new Date(user.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    {/* Actions */}
                    <td style={{ padding: '14px 20px' }}>
                      <ActionsDropdown user={user} onAction={handleAction} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#999' }}>
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => fetchUsers(pagination.page - 1)}
                disabled={pagination.page === 1}
                style={{ background: 'none', border: '1px solid #e5e5e5', borderRadius: 7, padding: '6px 10px', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', color: pagination.page === 1 ? '#ccc' : '#666', display: 'flex', alignItems: 'center' }}
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.totalPages || Math.abs(p - pagination.page) <= 1)
                .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                  if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) => p === '...' ? (
                  <span key={`dot-${idx}`} style={{ padding: '6px 4px', color: '#ccc', fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>...</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => fetchUsers(p as number)}
                    style={{ background: pagination.page === p ? ACCENT : 'none', border: `1px solid ${pagination.page === p ? ACCENT : '#e5e5e5'}`, borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: pagination.page === p ? '#020606' : '#666' }}
                  >
                    {p}
                  </button>
                ))}
              <button
                onClick={() => fetchUsers(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                style={{ background: 'none', border: '1px solid #e5e5e5', borderRadius: 7, padding: '6px 10px', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer', color: pagination.page === pagination.totalPages ? '#ccc' : '#666', display: 'flex', alignItems: 'center' }}
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmModal && (
        <ConfirmationModal
          modal={confirmModal}
          onClose={() => setConfirmModal(null)}
          onConfirm={handleConfirm}
          submitting={submitting}
        />
      )}

      {toast && <ToastNotification toast={toast} onClose={() => setToast(null)} />}
    </div>
  );
}