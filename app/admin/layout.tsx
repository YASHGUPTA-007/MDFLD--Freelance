'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ACCENT = '#00d4b6';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile menu
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // Desktop collapse
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login' || pathname === '/Admin/login';

  useEffect(() => {
    // Skip auth check on login page
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Check authentication for other pages
    fetch('/api/admin/me')
      .then(r => r.json())
      .then(d => {
        if (d.user) {
          setAdminUser(d.user);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'))
      .finally(() => setLoading(false));
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Package, label: 'Products', path: '/admin/products' },
    { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  // If on login page, render children without sidebar/navbar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading only for authenticated pages
  if (loading || !adminUser) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#020606' }}>
        <div style={{ color: ACCENT, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18 }}>Loading...</div>
      </div>
    );
  }

  const sidebarWidth = sidebarCollapsed ? 80 : 280;

  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#f5f5f5', minHeight: '100vh', display: 'flex' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @media (min-width: 1024px) {
          aside[data-sidebar-collapsed="false"] {
            width: 280px !important;
            min-width: 280px !important;
            position: relative !important;
            z-index: 1 !important;
          }
          aside[data-sidebar-collapsed="true"] {
            width: 80px !important;
            min-width: 80px !important;
            position: relative !important;
            z-index: 1 !important;
          }
        }
      `}</style>

      {/* Sidebar - Part of flex layout on desktop */}
      <aside
        data-sidebar-collapsed={sidebarCollapsed}
        style={{
          width: sidebarOpen ? '280px' : '0',
          minWidth: sidebarOpen ? '280px' : '0',
          background: '#1a1a1a',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s ease, min-width 0.3s ease',
          overflow: 'hidden',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
        className="lg:relative"
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
          {!sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #00a896)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} color="#020606" />
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Admin</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>Dashboard</div>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${ACCENT}, #00a896)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={20} color="#020606" />
              </div>
            </div>
          )}
          {/* Collapse Button - Desktop Only */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              position: 'absolute',
              top: 24,
              right: 12,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              transition: 'all 0.2s',
            }}
            className="hidden lg:flex"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.color = ACCENT;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <a
                key={i}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.path);
                  setSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  marginBottom: 4,
                  borderRadius: 8,
                  background: isActive ? `rgba(0,212,182,0.15)` : 'transparent',
                  border: isActive ? `1px solid rgba(0,212,182,0.3)` : '1px solid transparent',
                  color: isActive ? ACCENT : 'rgba(255,255,255,0.7)',
                  textDecoration: 'none',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  transition: 'all 0.2s',
                  cursor: 'pointer',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
                  }
                }}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon size={18} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </a>
            );
          })}
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {!sidebarCollapsed && (
            <>
              <div style={{ marginBottom: 12, padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Signed in as</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>{adminUser.name}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{adminUser.email}</div>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  background: 'rgba(255,60,60,0.1)',
                  border: '1px solid rgba(255,60,60,0.2)',
                  borderRadius: 8,
                  color: 'rgba(255,100,100,0.9)',
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,60,60,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(255,60,60,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,60,60,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,60,60,0.2)';
                }}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          )}
          {sidebarCollapsed && (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                background: 'rgba(255,60,60,0.1)',
                border: '1px solid rgba(255,60,60,0.2)',
                borderRadius: 8,
                color: 'rgba(255,100,100,0.9)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Logout"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,60,60,0.15)';
                e.currentTarget.style.borderColor = 'rgba(255,60,60,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,60,60,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,60,60,0.2)';
              }}
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content - Adjusts with sidebar */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          marginLeft: sidebarOpen ? '280px' : '0', 
          transition: 'margin-left 0.3s ease',
          minWidth: 0,
        }} 
        className="lg:!ml-0"
      >
        {/* Navbar */}
        <header
          style={{
            height: 64,
            background: '#ffffff',
            borderBottom: '1px solid #e5e5e5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 24px',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
            {menuItems.find(item => item.path === pathname)?.label || 'Admin'}
          </div>
        </header>

        {/* Page Content - White Background */}
        <main style={{ 
          flex: 1, 
          padding: '32px', 
          overflowY: 'auto', 
          background: '#ffffff',
          transition: 'margin-left 0.3s ease',
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
          }}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 99,
          }}
          className="lg:hidden"
        />
      )}
    </div>
  );
}
