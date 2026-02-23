'use client';

/**
 * @file app/admin/dashboard/page.tsx
 * @description Enhanced Admin Dashboard Page
 *
 * Professional UI improvements:
 * - Refined color palette with better contrast
 * - Smooth micro-interactions and transitions
 * - Enhanced typography hierarchy
 * - Better visual spacing and rhythm
 * - Improved card designs with depth
 * - Professional activity feed styling
 */

import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingBag, DollarSign, Activity, Tag, Loader2, UserPlus, Box, ArrowRight, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ACCENT = '#00d4b6';
const BLUE = '#0066ff';
const RED = '#ff6b6b';
const GREEN = '#00c96e';

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
    background: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: 16,
    padding: '20px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    position: 'relative',
    overflow: 'hidden',
  };

  const iconBox = (bg: string, color: string, Icon: React.ElementType) => (
    <div style={{
      width: 44,
      height: 44,
      borderRadius: 12,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      transition: 'transform 0.3s ease',
    }}>
      <Icon size={20} color={color} strokeWidth={2.5} />
    </div>
  );

  const statValue = (val: string | number, color = '#0f172a') => (
    <div style={{
      fontFamily: "'Barlow Condensed', sans-serif",
      fontSize: 32,
      fontWeight: 900,
      color,
      letterSpacing: '-0.03em',
      lineHeight: 1,
      textShadow: '0 1px 2px rgba(0,0,0,0.05)',
    }}>
      {val}
    </div>
  );

  const statLabel = (label: string) => (
    <div style={{
      fontFamily: "'Barlow', sans-serif",
      fontSize: 12,
      color: '#64748b',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      marginTop: 6,
      fontWeight: 600,
    }}>
      {label}
    </div>
  );

  const hoverHandlers = (color: string) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.borderColor = color;
      e.currentTarget.style.boxShadow = `0 12px 32px ${color}18, 0 4px 12px ${color}12`;
      const icon = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
      if (icon) icon.style.transform = 'scale(1.08)';
    },
    onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.borderColor = '#e8e8e8';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
      const icon = e.currentTarget.querySelector('[data-icon]') as HTMLElement;
      if (icon) icon.style.transform = 'scale(1)';
    },
  });

  const activityIcon = (type: ActivityItem['type']) => {
    const isUser = type === 'user';
    return (
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        flexShrink: 0,
        background: isUser ? 'rgba(0,212,182,0.12)' : 'rgba(0,102,255,0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1.5px solid ${isUser ? 'rgba(0,212,182,0.2)' : 'rgba(0,102,255,0.2)'}`,
      }}>
        {isUser
          ? <UserPlus size={16} color={ACCENT} strokeWidth={2.5} />
          : <Box size={16} color={BLUE} strokeWidth={2.5} />
        }
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafbfc' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
      `}</style>

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
        {/* Enhanced Header */}
        <div style={{ marginBottom: 28, animation: 'fadeIn 0.6s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <div style={{
              width: 4,
              height: 32,
              background: `linear-gradient(180deg, ${ACCENT} 0%, ${BLUE} 100%)`,
              borderRadius: 2,
            }} />
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 38,
              fontWeight: 900,
              color: '#0f172a',
              letterSpacing: '-0.04em',
              margin: 0,
              textTransform: 'uppercase',
              background: `linear-gradient(135deg, #0f172a 0%, #334155 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Dashboard
            </h1>
          </div>
          <p style={{
            fontFamily: "'Barlow', sans-serif",
            fontSize: 13,
            color: '#64748b',
            marginLeft: 14,
            fontWeight: 500,
          }}>
            Monitor your store&apos;s performance and recent activity
          </p>
        </div>

        {/* Stats Grid */}
        {loadingStats ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
            gap: 12,
            color: ACCENT,
            animation: 'fadeIn 0.4s ease',
          }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, fontWeight: 600 }}>
              Loading statistics...
            </span>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
            marginBottom: 24,
            animation: 'fadeIn 0.6s ease 0.1s backwards',
          }}>
            {/* Users Card */}
            <div style={cardBase} {...hoverHandlers(ACCENT)}>
              <div style={{ marginBottom: 14 }} data-icon>
                {iconBox('rgba(0,212,182,0.12)', ACCENT, Users)}
              </div>
              {statValue(stats.totalUsers.toLocaleString())}
              {statLabel('Total Users')}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: `radial-gradient(circle at top right, ${ACCENT}08, transparent)`,
                borderRadius: '0 16px 0 0',
              }} />
            </div>

            {/* Products + Categories Card */}
            <div style={cardBase} {...hoverHandlers(BLUE)}>
              <div style={{ marginBottom: 12 }} data-icon>
                {iconBox('rgba(0,102,255,0.12)', BLUE, Package)}
              </div>
              {statValue(stats.totalProducts.toLocaleString())}
              {statLabel('Products')}
              
              <div style={{
                width: '100%',
                height: 1,
                background: 'linear-gradient(90deg, transparent, #e8e8e8, transparent)',
                margin: '14px 0 12px',
              }} />
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'rgba(0,102,255,0.04)',
                borderRadius: 10,
                padding: '10px 12px',
                border: '1px solid rgba(0,102,255,0.08)',
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#0f172a',
                    lineHeight: 1,
                    marginBottom: 3,
                  }}>
                    {stats.totalCategories.toLocaleString()}
                  </div>
                  {statLabel('Categories')}
                </div>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(0,102,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Tag size={16} color={BLUE} strokeWidth={2.5} />
                </div>
              </div>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: `radial-gradient(circle at top right, ${BLUE}08, transparent)`,
                borderRadius: '0 16px 0 0',
              }} />
            </div>

            {/* Orders Card */}
            <div style={cardBase} {...hoverHandlers(RED)}>
              <div style={{ marginBottom: 14 }} data-icon>
                {iconBox('rgba(255,107,107,0.12)', RED, ShoppingBag)}
              </div>
              {statValue(stats.totalOrders.toLocaleString())}
              {statLabel('Total Orders')}
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: `radial-gradient(circle at top right, ${RED}08, transparent)`,
                borderRadius: '0 16px 0 0',
              }} />
            </div>

            {/* Revenue Card */}
            <div style={cardBase} {...hoverHandlers(GREEN)}>
              <div style={{ marginBottom: 14 }} data-icon>
                {iconBox('rgba(0,201,110,0.12)', GREEN, DollarSign)}
              </div>
              {statValue(
                `$${stats.revenue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                GREEN
              )}
              {statLabel('Total Revenue')}
              <div style={{
                position: 'absolute',
                bottom: 12,
                right: 16,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
                color: GREEN,
                fontFamily: "'Barlow', sans-serif",
                fontWeight: 700,
                letterSpacing: '0.03em',
              }}>
                <TrendingUp size={13} strokeWidth={3} />
              </div>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 100,
                height: 100,
                background: `radial-gradient(circle at top right, ${GREEN}08, transparent)`,
                borderRadius: '0 16px 0 0',
              }} />
            </div>
          </div>
        )}

        {/* Enhanced Recent Activity */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e8e8e8',
          borderRadius: 16,
          padding: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
          animation: 'fadeIn 0.6s ease 0.2s backwards',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
            paddingBottom: 16,
            borderBottom: '2px solid #f1f5f9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `linear-gradient(135deg, ${ACCENT}15, ${BLUE}15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1.5px solid ${ACCENT}30`,
              }}>
                <Activity size={18} color={ACCENT} strokeWidth={2.5} />
              </div>
              <h2 style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22,
                fontWeight: 900,
                color: '#0f172a',
                letterSpacing: '-0.02em',
                margin: 0,
                textTransform: 'uppercase',
              }}>
                Recent Activity
              </h2>
            </div>
            <button
              onClick={() => router.push('/admin/activity')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: `linear-gradient(135deg, ${ACCENT}, ${BLUE})`,
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                cursor: 'pointer',
                fontFamily: "'Barlow', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '0.03em',
                transition: 'all 0.2s ease',
                boxShadow: `0 2px 8px ${ACCENT}30`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 2px 8px ${ACCENT}30`;
              }}
            >
              View All <ArrowRight size={14} strokeWidth={3} />
            </button>
          </div>

          {loadingActivity ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '36px 0',
              gap: 10,
              color: ACCENT,
            }}>
              <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600 }}>
                Loading activity...
              </span>
            </div>
          ) : activity.length === 0 ? (
            <div style={{
              fontFamily: "'Barlow', sans-serif",
              fontSize: 13,
              color: '#94a3b8',
              textAlign: 'center',
              padding: '36px 0',
              fontWeight: 500,
            }}>
              No recent activity to display
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activity.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 14,
                    padding: '12px 10px',
                    borderRadius: 10,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  {activityIcon(item.type)}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Barlow', sans-serif",
                      fontSize: 13,
                      color: '#475569',
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}>
                      {item.label} —{' '}
                      <span style={{ fontWeight: 700, color: '#0f172a' }}>{item.detail}</span>
                    </div>
                    {item.subdetail && (
                      <div style={{
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: 11,
                        color: '#94a3b8',
                        marginTop: 3,
                        fontWeight: 500,
                      }}>
                        {item.subdetail}
                      </div>
                    )}
                  </div>
                  <div style={{
                    fontFamily: "'Barlow', sans-serif",
                    fontSize: 11,
                    color: '#cbd5e1',
                    flexShrink: 0,
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                  }}>
                    {timeAgo(item.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}