'use client';

/**
 * @file app/admin/dashboard/page.tsx
 * @description Admin Dashboard Page
 *
 * - Real stats from /api/admin/stats
 * - Recent activity (5 items) from /api/admin/activity
 * - Products card split 60/40 with categories
 * - "View All Activity" link to /admin/activity
 */

import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingBag, DollarSign, Activity, Tag, Loader2, UserPlus, Box, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ACCENT = '#00d4b6';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  revenue: number;
}

interface ActivityItem {
  type: 'user' | 'product';
  label: string;
  detail: string;
  subdetail: string | null;
  createdAt: string;
}

function timeAgo(date: string) {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalProducts: 0, totalCategories: 0, totalOrders: 0, revenue: 0 });
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(d => { if (!d.error) setStats(d); })
      .catch(console.error)
      .finally(() => setLoadingStats(false));

    fetch('/api/admin/activity?limit=5')
      .then(r => r.json())
      .then(d => { if (!d.error) setActivity(d.items || []); })
      .catch(console.error)
      .finally(() => setLoadingActivity(false));
  }, []);

  const cardBase: React.CSSProperties = {
    background: '#ffffff', border: '1px solid #e5e5e5',
    borderRadius: 16, padding: '24px',
    transition: 'all 0.25s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  };

  const iconBox = (bg: string, color: string, Icon: React.ElementType) => (
    <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={22} color={color} />
    </div>
  );

  const statValue = (val: string | number, color = '#1a1a1a') => (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, fontWeight: 900, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
      {val}
    </div>
  );

  const statLabel = (label: string) => (
    <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(0,0,0,0.45)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4 }}>
      {label}
    </div>
  );

  const hoverHandlers = (color: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.boxShadow = `0 8px 24px ${color}28`;
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#e5e5e5';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
    },
  });

  const activityIcon = (type: ActivityItem['type']) => {
    const isUser = type === 'user';
    return (
      <div style={{
        width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'rgba(0,212,182,0.1)' : 'rgba(0,102,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {isUser
          ? <UserPlus size={15} color={ACCENT} />
          : <Box size={15} color="#0066ff" />
        }
      </div>
    );
  };

  return (
    <div>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em', marginBottom: 6, textTransform: 'uppercase' }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(0,0,0,0.5)' }}>
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Stats */}
      {loadingStats ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 160, gap: 10, color: ACCENT }}>
          <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13 }}>Loading stats...</span>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>

          {/* Users */}
          <div style={cardBase} {...hoverHandlers(ACCENT)}>
            <div style={{ marginBottom: 16 }}>{iconBox('rgba(0,212,182,0.1)', ACCENT, Users)}</div>
            {statValue(stats.totalUsers.toLocaleString())}
            {statLabel('Total Users')}
          </div>

          {/* Products + Categories split */}
          <div style={cardBase} {...hoverHandlers('#0066ff')}>
            <div style={{ marginBottom: 12 }}>{iconBox('rgba(0,102,255,0.1)', '#0066ff', Package)}</div>
            {statValue(stats.totalProducts.toLocaleString())}
            {statLabel('Products')}
            <div style={{ width: '100%', height: 1, background: '#f0f0f0', margin: '16px 0' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 900, color: '#1a1a1a', lineHeight: 1 }}>
                  {stats.totalCategories.toLocaleString()}
                </div>
                {statLabel('Active Categories')}
              </div>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0,102,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={15} color="#0066ff" />
              </div>
            </div>
          </div>

          {/* Orders */}
          <div style={cardBase} {...hoverHandlers('#ff6b6b')}>
            <div style={{ marginBottom: 16 }}>{iconBox('rgba(255,107,107,0.1)', '#ff6b6b', ShoppingBag)}</div>
            {statValue(stats.totalOrders.toLocaleString())}
            {statLabel('Total Orders')}
          </div>

          {/* Revenue */}
          <div style={cardBase} {...hoverHandlers('#00c96e')}>
            <div style={{ marginBottom: 16 }}>{iconBox('rgba(0,201,110,0.1)', '#00c96e', DollarSign)}</div>
            {statValue(`£${stats.revenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, '#00c96e')}
            {statLabel('Total Revenue')}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: 16, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity size={18} color={ACCENT} />
            <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
              Recent Activity
            </h2>
          </div>
          <button
            onClick={() => router.push('/admin/activity')}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, color: ACCENT, letterSpacing: '0.03em' }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            View All <ArrowRight size={13} />
          </button>
        </div>

        {loadingActivity ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0', gap: 8, color: ACCENT }}>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          </div>
        ) : activity.length === 0 ? (
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(0,0,0,0.4)', textAlign: 'center', padding: '32px 0' }}>
            No activity yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {activity.map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderBottom: i < activity.length - 1 ? '1px solid #f5f5f5' : 'none',
              }}>
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
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#bbb', flexShrink: 0 }}>
                  {timeAgo(item.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}