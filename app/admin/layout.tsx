// v2 fixed
'use client';

/**
 * @file app/admin/layout.tsx
 * @description Admin Layout
 *
 * Desktop: Sidebar visible by default. Admin badge toggles collapse/expand.
 * Mobile/Tablet: Sidebar hidden. Admin badge moves to top-right. Clicking opens bottom drawer.
 * Drawer closes on nav item click or Esc key.
 */

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Package, ShoppingBag,
  Settings, LogOut, Shield, Tag, Activity,
  Instagram,
} from 'lucide-react';

const ACCENT = '#00d4b6';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Tag, label: 'Categories', path: '/admin/categories' },
  { icon: Package, label: 'Products', path: '/admin/products' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders' },
  { icon: Activity, label: 'Activity', path: '/admin/activity' },
  { icon: Instagram, label: 'Social Posts', path: '/admin/social-posts' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const logoutBtnStyle: React.CSSProperties = {
  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
  padding: '12px 16px',
  background: 'rgba(255,60,60,0.1)', border: '1px solid rgba(255,60,60,0.2)',
  borderRadius: 8, color: 'rgba(255,100,100,0.9)',
  fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
  letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
};

// ── Moved outside AdminLayout to avoid "components created during render" error ──

interface AdminBadgeProps {
  forDrawer?: boolean;
  isMobile: boolean;
  collapsed: boolean;
  onToggle: () => void;
}

const AdminBadge = ({ forDrawer = false, isMobile, collapsed, onToggle }: AdminBadgeProps) => (
  <div
    onClick={onToggle}
    style={{
      display: 'flex', alignItems: 'center', gap: 12,
      cursor: 'pointer', padding: '6px 8px', borderRadius: 10,
      transition: 'all 0.2s',
    }}
  >
    <div
      style={{
        width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: `linear-gradient(135deg, ${ACCENT}, #00a896)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 12px rgba(0,212,182,0.35)`,
        transition: 'box-shadow 0.2s',
      }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 22px rgba(0,212,182,0.7)`}
      onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 12px rgba(0,212,182,0.35)`}
      title={isMobile ? 'Open menu' : (collapsed ? 'Expand sidebar' : 'Collapse sidebar')}
    >
      <Shield size={20} color="#020606" />
    </div>
    {(!collapsed || isMobile) && !forDrawer && (
      <div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Admin</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>Dashboard</div>
      </div>
    )}
    {forDrawer && (
      <div>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>Admin</div>
        <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em' }}>Dashboard</div>
      </div>
    )}
  </div>
);

interface NavItemsProps {
  onNavigate: (path: string) => void;
  collapsed: boolean;
  isMobile: boolean;
  pathname: string;
}

const NavItems = ({ onNavigate, collapsed, isMobile, pathname }: NavItemsProps) => (
  <>
    {menuItems.map((item, i) => {
      const Icon = item.icon;
      const isActive = pathname === item.path;
      return (
        <a
          key={i}
          href={item.path}
          onClick={e => { e.preventDefault(); onNavigate(item.path); }}
          style={{
            display: 'flex', alignItems: 'center',
            gap: collapsed && !isMobile ? 0 : 12,
            padding: '12px 16px', marginBottom: 4, borderRadius: 8,
            background: isActive ? 'rgba(0,212,182,0.15)' : 'transparent',
            border: isActive ? '1px solid rgba(0,212,182,0.3)' : '1px solid transparent',
            color: isActive ? ACCENT : 'rgba(255,255,255,0.7)',
            textDecoration: 'none',
            fontFamily: "'Barlow', sans-serif", fontSize: 13, fontWeight: 600,
            letterSpacing: '0.05em', transition: 'all 0.2s', cursor: 'pointer',
            justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            if (!isActive) {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#fff';
            }
          }}
          onMouseLeave={e => {
            if (!isActive) {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
            }
          }}
          title={collapsed && !isMobile ? item.label : ''}
        >
          <Icon size={18} style={{ flexShrink: 0 }} />
          {(!collapsed || isMobile) && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
        </a>
      );
    })}
  </>
);

interface UserFooterProps {
  compact: boolean;
  adminUser: { name: string; email: string } | null;
  handleLogout: () => void;
}

const UserFooter = ({ compact, adminUser, handleLogout }: UserFooterProps) => (
  <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
    {!compact ? (
      <>
        <div style={{ marginBottom: 12, padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 4 }}>Signed in as</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>{adminUser?.name}</div>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{adminUser?.email}</div>
        </div>
        <button onClick={handleLogout} style={logoutBtnStyle}>
          <LogOut size={16} /><span>Logout</span>
        </button>
      </>
    ) : (
      <button onClick={handleLogout} title="Logout" style={{ ...logoutBtnStyle, justifyContent: 'center', padding: '12px' }}>
        <LogOut size={18} />
      </button>
    )}
  </div>
);

// ────────────────────────────────────────────────────────────────────────────

interface AdminLayoutProps { children: React.ReactNode; }

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);   // desktop collapse
  const [drawerOpen, setDrawerOpen] = useState(false); // mobile drawer
  const [isMobile, setIsMobile] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login' || pathname === '/Admin/login';

  // Detect mobile/tablet
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Esc closes drawer
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auth check — async to avoid synchronous setState cascading renders
  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }
    const checkAuth = async () => {
      try {
        const r = await fetch('/api/admin/me');
        const d = await r.json();
        if (d.user) {
          setAdminUser(d.user);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navigate = (path: string) => {
    router.push(path);
    setDrawerOpen(false);
  };

  if (isLoginPage) return <>{children}</>;

  if (loading || !adminUser) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#020606' }}>
        <div style={{ color: ACCENT, fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", background: '#f5f5f5', minHeight: '100vh', display: 'flex' }}>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
            `}</style>

      {/* ── DESKTOP SIDEBAR ───────────────────────────── */}
      {!isMobile && (
        <aside style={{
          width: collapsed ? 80 : 280,
          minWidth: collapsed ? 80 : 280,
          background: '#1a1a1a',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column',
          transition: 'width 0.25s ease, min-width 0.25s ease',
          overflow: 'hidden',
          position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
        }}>
          {/* Badge */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <AdminBadge
              isMobile={isMobile}
              collapsed={collapsed}
              onToggle={() => isMobile ? setDrawerOpen(o => !o) : setCollapsed(o => !o)}
            />
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
            <NavItems onNavigate={navigate} collapsed={collapsed} isMobile={isMobile} pathname={pathname} />
          </nav>

          {/* Footer */}
          <UserFooter compact={collapsed} adminUser={adminUser} handleLogout={handleLogout} />
        </aside>
      )}

      {/* ── MAIN CONTENT ──────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{
          height: 64, background: '#ffffff', borderBottom: '1px solid #e5e5e5',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', position: 'sticky', top: 0, zIndex: 50,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.02em' }}>
            {menuItems.find(item => item.path === pathname)?.label || 'Admin'}
          </div>

          {/* Mobile: Admin badge in top-right */}
          {isMobile && (
            <div
              onClick={() => setDrawerOpen(o => !o)}
              style={{
                width: 40, height: 40, borderRadius: '50%', cursor: 'pointer',
                background: `linear-gradient(135deg, ${ACCENT}, #00a896)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 0 12px rgba(0,212,182,0.35)`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px rgba(0,212,182,0.55)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 12px rgba(0,212,182,0.35)`}
              title="Open menu"
            >
              <Shield size={20} color="#020606" />
            </div>
          )}
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', background: '#ffffff', height: 0 }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>

      {/* ── MOBILE BOTTOM DRAWER ──────────────────────── */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {drawerOpen && (
            <div
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                zIndex: 200, transition: 'opacity 0.25s',
              }}
            />
          )}

          {/* Drawer */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
            background: '#1a1a1a',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            paddingBottom: 'env(safe-area-inset-bottom)',
            maxHeight: '80vh', overflowY: 'auto',
          }}>
            {/* Drawer handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
              <div style={{ width: 40, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Drawer header */}
            <div style={{ padding: '12px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <AdminBadge
                forDrawer
                isMobile={isMobile}
                collapsed={collapsed}
                onToggle={() => isMobile ? setDrawerOpen(o => !o) : setCollapsed(o => !o)}
              />
            </div>

            {/* Drawer nav */}
            <nav style={{ padding: '12px 16px' }}>
              <NavItems onNavigate={navigate} collapsed={collapsed} isMobile={isMobile} pathname={pathname} />
            </nav>

            {/* Drawer footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ marginBottom: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 2 }}>Signed in as</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff' }}>{adminUser?.name}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{adminUser?.email}</div>
              </div>
              <button onClick={handleLogout} style={logoutBtnStyle}>
                <LogOut size={16} /><span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}