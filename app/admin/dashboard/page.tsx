'use client';

import React, { useEffect, useState } from 'react';
import { Users, Package, ShoppingBag, TrendingUp, DollarSign, Activity } from 'lucide-react';

const ACCENT = '#00d4b6';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  revenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    // This is a placeholder - you'll need to create the API endpoint
    setTimeout(() => {
      setStats({
        totalUsers: 1248,
        totalProducts: 342,
        totalOrders: 892,
        revenue: 125430,
      });
      setLoading(false);
    }, 500);
  }, []);

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: ACCENT, bg: 'rgba(0,212,182,0.1)' },
    { icon: Package, label: 'Products', value: stats.totalProducts, color: '#0066ff', bg: 'rgba(0,102,255,0.1)' },
    { icon: ShoppingBag, label: 'Orders', value: stats.totalOrders, color: '#ff6b6b', bg: 'rgba(255,107,107,0.1)' },
    { icon: DollarSign, label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, color: '#00ff88', bg: 'rgba(0,255,136,0.1)' },
  ];

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
      `}</style>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.03em', marginBottom: 8, textTransform: 'uppercase' }}>
          Dashboard
        </h1>
        <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(0,0,0,0.6)', letterSpacing: '0.05em' }}>
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <div style={{ color: ACCENT, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18 }}>Loading...</div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 32 }}>
            {statCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e5e5',
                    borderRadius: 16,
                    padding: '24px',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 8px 24px ${card.color}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = '#e5e5e5';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: card.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} color={card.color} />
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, color: '#1a1a1a', letterSpacing: '-0.02em', marginBottom: 4 }}>
                    {card.value}
                  </div>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(0,0,0,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                    {card.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Activity Section */}
          <div style={{ background: '#ffffff', border: '1px solid #e5e5e5', borderRadius: 16, padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Activity size={20} color={ACCENT} />
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
                Recent Activity
              </h2>
            </div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(0,0,0,0.5)', textAlign: 'center', padding: '40px 0' }}>
              No recent activity to display
            </div>
          </div>
        </>
      )}
    </div>
  );
}
