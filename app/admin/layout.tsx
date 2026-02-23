// v3 — redesigned with company branding
'use client';

/**
 * @file app/admin/layout.tsx
 * @description Admin Layout — premium sidebar with company branding
 *
 * Desktop: Sidebar visible. Badge toggles collapse/expand.
 * Mobile/Tablet: Hidden. Badge in topbar opens bottom drawer.
 * Drawer closes on nav click or Esc.
 */

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, Package, ShoppingBag,
  Settings, LogOut, Shield, Tag, Activity,
  Instagram, ChevronLeft, ChevronRight, Percent,
} from 'lucide-react';

const ACCENT = '#00d4b6';
const BG_SIDE = '#080e0e';
const BG_MAIN = '#f7f9f9';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', group: 'main' },
  { icon: Users, label: 'Users', path: '/admin/users', group: 'main' },
  { icon: Tag, label: 'Categories', path: '/admin/categories', group: 'main' },
  { icon: Package, label: 'Products', path: '/admin/products', group: 'main' },
  { icon: Percent, label: 'Discounts', path: '/admin/discounts', group: 'main' },
  { icon: ShoppingBag, label: 'Orders', path: '/admin/orders', group: 'main' },
  { icon: Activity, label: 'Activity', path: '/admin/activity', group: 'analytics' },
  { icon: Instagram, label: 'Social Posts', path: '/admin/social-posts', group: 'analytics' },
  { icon: Settings, label: 'Settings', path: '/admin/settings', group: 'system' },
];

const groups: Record<string, string> = {
  main: 'Manage',
  analytics: 'Insights',
  system: 'System',
};

// ─── Brand Logo Mark ─────────────────────────────────────────────────────────
function LogoMark({ collapsed }: { collapsed: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 4px',
    }}>
      {/* Icon mark */}
      <div style={{
        width: 36, height: 36, flexShrink: 0,
        background: `linear-gradient(135deg, ${ACCENT} 0%, #007a6e 100%)`,
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 0 1px rgba(0,212,182,0.3), 0 4px 16px rgba(0,212,182,0.2)`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* inner shine */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
          borderRadius: '10px 10px 0 0',
        }} />
        <span style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 900,
          color: '#020a0a', letterSpacing: '-0.05em', position: 'relative',
          lineHeight: 1,
        }}>M</span>
      </div>

      {/* Wordmark */}
      {!collapsed && (
        <div style={{ overflow: 'hidden' }}>
          <div style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 17, fontWeight: 800,
            color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1,
            whiteSpace: 'nowrap',
          }}>
            mdfld
            <span style={{ color: ACCENT }}>.</span>
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.28)', marginTop: 2,
            whiteSpace: 'nowrap',
          }}>
            Admin
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Nav Items ────────────────────────────────────────────────────────────────
interface NavItemsProps {
  onNavigate: (path: string) => void;
  collapsed: boolean;
  isMobile: boolean;
  pathname: string;
}

function NavItems({ onNavigate, collapsed, isMobile, pathname }: NavItemsProps) {
  const show = !collapsed || isMobile;

  // Group items
  const rendered: React.ReactNode[] = [];
  let lastGroup = '';

  menuItems.forEach((item, i) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;

    if (show && item.group !== lastGroup) {
      if (lastGroup !== '') rendered.push(
        <div key={`div-${item.group}`} style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '10px 0' }} />
      );
      rendered.push(
        <div key={`lbl-${item.group}`} style={{
          fontFamily: "'DM Mono', monospace", fontSize: 8,
          letterSpacing: '0.24em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.2)', padding: '4px 12px 8px',
        }}>
          {groups[item.group]}
        </div>
      );
      lastGroup = item.group;
    }
    if (!show && item.group !== lastGroup) {
      if (lastGroup !== '') rendered.push(
        <div key={`div-${item.group}`} style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '8px 4px' }} />
      );
      lastGroup = item.group;
    }

    rendered.push(
      <a
        key={i}
        href={item.path}
        onClick={e => { e.preventDefault(); onNavigate(item.path); }}
        title={collapsed && !isMobile ? item.label : ''}
        style={{
          display: 'flex', alignItems: 'center',
          gap: show ? 11 : 0,
          padding: show ? '10px 12px' : '11px',
          marginBottom: 2, borderRadius: 9,
          background: isActive ? 'rgba(0,212,182,0.12)' : 'transparent',
          border: `1px solid ${isActive ? 'rgba(0,212,182,0.25)' : 'transparent'}`,
          color: isActive ? ACCENT : 'rgba(255,255,255,0.52)',
          textDecoration: 'none',
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
          transition: 'all 0.18s', cursor: 'pointer',
          justifyContent: show ? 'flex-start' : 'center',
          position: 'relative',
        }}
        onMouseEnter={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.color = '#fff';
          }
        }}
        onMouseLeave={e => {
          if (!isActive) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.52)';
          }
        }}
      >
        {/* Active left bar */}
        {isActive && (
          <div style={{
            position: 'absolute', left: 0, top: '20%', bottom: '20%',
            width: 3, borderRadius: '0 3px 3px 0',
            background: ACCENT,
            boxShadow: `0 0 8px ${ACCENT}`,
          }} />
        )}
        <Icon size={16} style={{ flexShrink: 0, opacity: isActive ? 1 : 0.75 }} />
        {show && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
      </a>
    );
  });

  return <>{rendered}</>;
}

// ─── User Footer ──────────────────────────────────────────────────────────────
interface UserFooterProps {
  compact: boolean;
  adminUser: { name: string; email: string } | null;
  handleLogout: () => void;
}

function UserFooter({ compact, adminUser, handleLogout }: UserFooterProps) {
  return (
    <div style={{
      padding: compact ? '16px 10px' : '16px',
      borderTop: '1px solid rgba(255,255,255,0.07)',
    }}>
      {!compact ? (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 10, padding: '12px 14px',
          marginBottom: 10,
        }}>
          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: `linear-gradient(135deg, ${ACCENT}, #005a52)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: '#020a0a',
            }}>
              {adminUser?.name?.charAt(0).toUpperCase() ?? 'A'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                color: '#fff', letterSpacing: '-0.01em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {adminUser?.name}
              </div>
              <div style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9,
                color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {adminUser?.email}
              </div>
            </div>
          </div>

          {/* Role badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'rgba(0,212,182,0.1)', border: '1px solid rgba(0,212,182,0.2)',
            borderRadius: 5, padding: '3px 8px',
          }}>
            <Shield size={10} color={ACCENT} />
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: 8,
              letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT,
            }}>
              Super Admin
            </span>
          </div>
        </div>
      ) : (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: `linear-gradient(135deg, ${ACCENT}, #005a52)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: '#020a0a',
          margin: '0 auto 10px',
        }}>
          {adminUser?.name?.charAt(0).toUpperCase() ?? 'A'}
        </div>
      )}

      <button
        onClick={handleLogout}
        title={compact ? 'Logout' : ''}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: compact ? 'center' : 'flex-start',
          gap: 8, padding: compact ? '10px' : '10px 12px',
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 8, color: 'rgba(239,100,100,0.8)',
          fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: '0.04em', cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.15)';
          e.currentTarget.style.color = '#fc8181';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(239,68,68,0.08)';
          e.currentTarget.style.color = 'rgba(239,100,100,0.8)';
        }}
      >
        <LogOut size={15} />
        {!compact && <span>Sign Out</span>}
      </button>
    </div>
  );
}

// ─── Main Layout ──────────────────────────────────────────────────────────────
interface AdminLayoutProps { children: React.ReactNode; }

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login' || pathname === '/Admin/login';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  useEffect(() => {
    if (isLoginPage) { setLoading(false); return; }
    const check = async () => {
      try {
        const r = await fetch('/api/admin/me');
        const d = await r.json();
        if (d.user) setAdminUser(d.user);
        else router.push('/admin/login');
      } catch { router.push('/admin/login'); }
      finally { setLoading(false); }
    };
    check();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const navigate = (path: string) => { router.push(path); setDrawerOpen(false); };

  const activeLabel = menuItems.find(item => item.path === pathname)?.label ?? 'Admin';

  if (isLoginPage) return <>{children}</>;

  if (loading || !adminUser) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: BG_SIDE, flexDirection: 'column', gap: 16,
      }}>
        <div style={{
          width: 42, height: 42,
          background: `linear-gradient(135deg, ${ACCENT}, #007a6e)`,
          borderRadius: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: 'serif', fontSize: 20, fontWeight: 900, color: '#020a0a' }}>M</span>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 10,
          letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)',
        }}>
          Authenticating…
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'Outfit', sans-serif",
      background: BG_MAIN,
      minHeight: '100vh', display: 'flex',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* Sidebar scrollbar */
        .admin-nav::-webkit-scrollbar { width: 3px; }
        .admin-nav::-webkit-scrollbar-track { background: transparent; }
        .admin-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

        /* Drawer scrollbar */
        .admin-drawer::-webkit-scrollbar { display: none; }

        /* Subtle page bg texture */
        .admin-main-bg {
          background-color: #f7f9f9;
          background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0);
          background-size: 28px 28px;
        }

        /* Topbar shadow */
        .admin-topbar {
          box-shadow: 0 1px 0 rgba(0,0,0,0.07), 0 2px 12px rgba(0,0,0,0.04);
        }

        /* Content cards look */
        .admin-content {
          animation: fadeUp 0.3s ease;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Sidebar transition */
        .admin-sidebar {
          transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1),
                      min-width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>

      {/* ── DESKTOP SIDEBAR ─────────────────────────────── */}
      {!isMobile && (
        <aside
          className="admin-sidebar"
          style={{
            width: collapsed ? 70 : 256,
            minWidth: collapsed ? 70 : 256,
            background: BG_SIDE,
            borderRight: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', flexDirection: 'column',
            position: 'sticky', top: 0, height: '100vh', flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          {/* ── Logo area ── */}
          <div style={{
            padding: collapsed ? '20px 17px' : '20px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
          }}>
            <LogoMark collapsed={collapsed} />

            {/* Collapse toggle — only when expanded */}
            {!collapsed && (
              <button
                onClick={() => setCollapsed(true)}
                title="Collapse sidebar"
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: 'rgba(0,212,182,0.12)',
                  border: '1px solid rgba(0,212,182,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: ACCENT,
                  transition: 'all 0.2s', flexShrink: 0,
                  boxShadow: '0 0 10px rgba(0,212,182,0.1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(0,212,182,0.22)';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(0,212,182,0.25)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(0,212,182,0.12)';
                  e.currentTarget.style.boxShadow = '0 0 10px rgba(0,212,182,0.1)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <ChevronLeft size={15} />
              </button>
            )}

            {/* Expand toggle — when collapsed, clicking the logo area expands */}
            {collapsed && (
              <button
                onClick={() => setCollapsed(false)}
                title="Expand sidebar"
                style={{
                  position: 'absolute', bottom: -1, left: 0, right: 0,
                  height: 0, width: 0, border: 'none', background: 'transparent',
                  cursor: 'pointer', opacity: 0,
                }}
                tabIndex={-1}
              />
            )}
          </div>

          {/* Collapsed expand hint */}
          {collapsed && (
            <button
              onClick={() => setCollapsed(false)}
              title="Expand sidebar"
              style={{
                margin: '8px auto 0', width: 36, height: 28, borderRadius: 7,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'rgba(255,255,255,0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = ACCENT; e.currentTarget.style.borderColor = 'rgba(0,212,182,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <ChevronRight size={13} />
            </button>
          )}

          {/* ── Nav ── */}
          <nav className="admin-nav" style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
            <NavItems onNavigate={navigate} collapsed={collapsed} isMobile={false} pathname={pathname} />
          </nav>

          {/* ── User footer ── */}
          <UserFooter compact={collapsed} adminUser={adminUser} handleLogout={handleLogout} />
        </aside>
      )}

      {/* ── MAIN AREA ───────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Topbar */}
        <header
          className="admin-topbar"
          style={{
            height: 60, background: '#fff',
            borderBottom: '1px solid rgba(0,0,0,0.07)',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px', flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Mobile logo */}
            {isMobile && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: `linear-gradient(135deg, ${ACCENT}, #007a6e)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 900, color: '#020a0a' }}>M</span>
                </div>
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 800,
                  color: '#0f1a1a', letterSpacing: '-0.03em',
                }}>mdfld<span style={{ color: ACCENT }}>.</span></span>
              </div>
            )}

            {/* Breadcrumb separator on mobile */}
            {isMobile && (
              <span style={{ color: '#ccc', fontSize: 14 }}>›</span>
            )}

            {/* Page title */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <span style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 15, fontWeight: 700,
                color: '#0f1a1a', letterSpacing: '-0.02em',
              }}>
                {activeLabel}
              </span>
              {!isMobile && (
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.3)',
                }}>
                  mdfld.admin
                </span>
              )}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Live indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 0 3px rgba(34,197,94,0.15)',
              }} />
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 9,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(0,0,0,0.3)',
              }}>Live</span>
            </div>

            {/* Mobile menu trigger */}
            {isMobile && (
              <button
                onClick={() => setDrawerOpen(o => !o)}
                style={{
                  width: 36, height: 36, borderRadius: 9, cursor: 'pointer',
                  background: `linear-gradient(135deg, ${ACCENT}, #007a6e)`,
                  border: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 12px rgba(0,212,182,0.3)`,
                  transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 20px rgba(0,212,182,0.5)`}
                onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 12px rgba(0,212,182,0.3)`}
                title="Open menu"
              >
                <Shield size={17} color="#020a0a" />
              </button>
            )}

            {/* Desktop: small admin avatar */}
            {!isMobile && (
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: `linear-gradient(135deg, ${ACCENT}, #005a52)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700,
                color: '#020a0a', cursor: 'default',
                boxShadow: `0 0 0 2px rgba(0,212,182,0.2)`,
              }}>
                {adminUser?.name?.charAt(0).toUpperCase() ?? 'A'}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main
          className="admin-main-bg"
          style={{ flex: 1, padding: '28px 32px', overflowY: 'auto', height: 0 }}
        >
          <div className="admin-content" style={{ maxWidth: 1400, margin: '0 auto', width: '100%' }}>
            {children}
          </div>
        </main>
      </div>

      {/* ── MOBILE BOTTOM DRAWER ────────────────────────── */}
      {isMobile && (
        <>
          {drawerOpen && (
            <div
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                backdropFilter: 'blur(4px)',
                zIndex: 200,
              }}
            />
          )}

          <div
            className="admin-drawer"
            style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
              background: BG_SIDE,
              borderTop: '1px solid rgba(255,255,255,0.1)',
              borderTopLeftRadius: 22, borderTopRightRadius: 22,
              transform: drawerOpen ? 'translateY(0)' : 'translateY(100%)',
              transition: 'transform 0.32s cubic-bezier(0.22, 1, 0.36, 1)',
              paddingBottom: 'env(safe-area-inset-bottom)',
              maxHeight: '82vh', overflowY: 'auto',
              boxShadow: '0 -20px 60px rgba(0,0,0,0.5)',
            }}
          >
            {/* Drag handle */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '14px 0 6px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)' }} />
            </div>

            {/* Drawer header */}
            <div style={{
              padding: '10px 20px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <LogoMark collapsed={false} />
            </div>

            {/* Nav */}
            <nav style={{ padding: '12px 14px' }}>
              <NavItems onNavigate={navigate} collapsed={false} isMobile={true} pathname={pathname} />
            </nav>

            {/* Footer */}
            <UserFooter compact={false} adminUser={adminUser} handleLogout={handleLogout} />
          </div>
        </>
      )}
    </div>
  );
}