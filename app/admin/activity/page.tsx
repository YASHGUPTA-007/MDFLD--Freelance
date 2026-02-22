'use client';

/**
 * @file app/admin/activity/page.tsx
 * @description Admin Full Activity Feed Page
 *
 * - Paginated full activity feed (20 per page)
 * - Shows all users registered + products added
 * - Sorted by most recent first
 * - Orders will appear here automatically once order flow is built
 */

import React, { useEffect, useState, useCallback } from 'react';
import { Activity, UserPlus, Box, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const ACCENT = '#00d4b6';

interface ActivityItem {
    type: 'user' | 'product';
    label: string;
    detail: string;
    subdetail: string | null;
    createdAt: string;
}

interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

function timeAgo(date: string) {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ActivityPage() {
    const [items, setItems] = useState<ActivityItem[]>([]);
    const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: 20, totalPages: 1 });
    const [loading, setLoading] = useState(true);

    const fetchActivity = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/activity?limit=20&page=${page}`);
            const data = await res.json();
            setItems(data.items || []);
            setPagination(data.pagination);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchActivity(1); }, [fetchActivity]);

    const activityIcon = (type: ActivityItem['type']) => {
        const isUser = type === 'user';
        return (
            <div style={{
                width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                background: isUser ? 'rgba(0,212,182,0.1)' : 'rgba(0,102,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                {isUser ? <UserPlus size={16} color={ACCENT} /> : <Box size={16} color="#0066ff" />}
            </div>
        );
    };

    return (
        <div>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
                .act-row:hover { background: #fafafa !important; }
            `}</style>

            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>
                    Activity
                </h1>
                <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#999', marginTop: 2 }}>
                    {pagination.total} total events
                </p>
            </div>

            {/* Feed */}
            <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>

                {/* Legend */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} />
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#999' }}>User registered</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0066ff' }} />
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#999' }}>Product added</span>
                    </div>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 0', color: ACCENT, gap: 10 }}>
                        <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
                    </div>
                ) : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#999' }}>
                        No activity yet.
                    </div>
                ) : (
                    <div>
                        {items.map((item, i) => (
                            <div
                                key={i}
                                className="act-row"
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 16,
                                    padding: '16px 24px',
                                    borderBottom: i < items.length - 1 ? '1px solid #f5f5f5' : 'none',
                                    transition: 'background 0.15s',
                                }}
                            >
                                {activityIcon(item.type)}

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#555' }}>
                                        {item.label} —{' '}
                                        <span style={{ fontWeight: 600, color: '#1a1a1a' }}>{item.detail}</span>
                                    </div>
                                    {item.subdetail && (
                                        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 2 }}>
                                            {item.subdetail}
                                        </div>
                                    )}
                                </div>

                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: '#bbb' }}>
                                        {timeAgo(item.createdAt)}
                                    </div>
                                    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: '#ccc', marginTop: 2 }}>
                                        {formatDate(item.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
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
                                onClick={() => fetchActivity(pagination.page - 1)}
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
                                        onClick={() => fetchActivity(p as number)}
                                        style={{ background: pagination.page === p ? ACCENT : 'none', border: `1px solid ${pagination.page === p ? ACCENT : '#e5e5e5'}`, borderRadius: 7, padding: '6px 12px', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600, color: pagination.page === p ? '#020606' : '#666' }}
                                    >
                                        {p}
                                    </button>
                                ))}
                            <button
                                onClick={() => fetchActivity(pagination.page + 1)}
                                disabled={pagination.page === pagination.totalPages}
                                style={{ background: 'none', border: '1px solid #e5e5e5', borderRadius: 7, padding: '6px 10px', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer', color: pagination.page === pagination.totalPages ? '#ccc' : '#666', display: 'flex', alignItems: 'center' }}
                            >
                                <ChevronRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}