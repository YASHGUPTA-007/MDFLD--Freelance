'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// ─── Routes match app/(user)/[page]/page.tsx ────────────────────────────────
const NAV = [
    {
        href: '/account',
        label: 'Account',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
        ),
    },
    {
        href: '/myorders',
        label: 'My Orders',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 8h14M5 8a2 2 0 1 0-4 0v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8m-14 0V6a2 2 0 1 1 4 0v2M9 12h6" />
            </svg>
        ),
    },
    {
        href: '/saved',
        label: 'Saved',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        ),
    },
    {
        href: '/addresses',
        label: 'Addresses',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
            </svg>
        ),
    },
    {
        href: '/settings',
        label: 'Settings',
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

interface Props {
    user: { name: string; email: string; joined: string };
}

export default function DashboardSidebar({ user }: Props) {
    const pathname = usePathname();
    const router   = useRouter();

    const initials = user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/');
        router.refresh();
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');

                /* Animations */
                @keyframes pulseGlow {
                    0% { transform: scale(1); opacity: 0.6; }
                    100% { transform: scale(1.15); opacity: 1; }
                }
                @keyframes drift {
                    0% { background-position: 0px 0px; }
                    100% { background-position: 28px 28px; }
                }
                @keyframes shimmer {
                    0% { transform: translateX(-150%) skewX(-20deg); }
                    100% { transform: translateX(250%) skewX(-20deg); }
                }

                .dsb-root {
                    width: 240px;
                    flex-shrink: 0;
                    background: #020606;
                    border-right: 1px solid rgba(0,212,182,0.08);
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    position: sticky;
                    top: 0;
                    overflow: hidden;
                    font-family: 'Barlow', sans-serif;
                }
                .dsb-glow {
                    position: absolute; top: -60px; left: -60px;
                    width: 260px; height: 260px;
                    background: radial-gradient(ellipse, rgba(0,212,182,0.1) 0%, transparent 70%);
                    pointer-events: none; z-index: 0;
                    animation: pulseGlow 6s ease-in-out infinite alternate;
                }
                .dsb-grid {
                    position: absolute; inset: 0;
                    pointer-events: none; z-index: 0;
                    background-image:
                        linear-gradient(rgba(0,212,182,0.02) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,212,182,0.02) 1px, transparent 1px);
                    background-size: 28px 28px;
                    animation: drift 20s linear infinite;
                }
                .dsb-content {
                    position: relative; z-index: 1;
                    display: flex; flex-direction: column; height: 100%;
                }
                .dsb-logo {
                    padding: 28px 24px 22px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }
                .dsb-logo-text {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 22px; font-weight: 900;
                    letter-spacing: -0.02em; text-transform: uppercase;
                    color: #fff; text-decoration: none; display: inline-block;
                    transition: transform 0.3s ease, text-shadow 0.3s ease;
                }
                .dsb-logo-text:hover {
                    transform: scale(1.02);
                    text-shadow: 0 0 12px rgba(0,212,182,0.4);
                }
                .dsb-logo-text span { color: #00d4b6; }
                .dsb-logo-sub {
                    font-size: 8px; font-weight: 700;
                    letter-spacing: 0.28em; text-transform: uppercase;
                    color: rgba(0,212,182,0.4); margin-top: 3px;
                }
                .dsb-user {
                    padding: 20px 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: flex; align-items: center; gap: 12px;
                }
                .dsb-avatar {
                    width: 40px; height: 40px; border-radius: 50%;
                    background: linear-gradient(135deg, rgba(0,212,182,0.2), rgba(0,212,182,0.04));
                    border: 1px solid rgba(0,212,182,0.3);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 16px; font-weight: 900; color: #00d4b6;
                    flex-shrink: 0; position: relative;
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
                    cursor: pointer;
                }
                .dsb-avatar::after {
                    content: ''; position: absolute; inset: -2px; border-radius: 50%;
                    background: linear-gradient(135deg, #00d4b6, transparent); z-index: -1;
                }
                .dsb-user:hover .dsb-avatar {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 0 15px rgba(0,212,182,0.3);
                }
                .dsb-user-name {
                    font-size: 13px; font-weight: 600; color: #fff;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                    letter-spacing: 0.01em;
                }
                .dsb-user-since {
                    font-size: 9px; font-weight: 700; letter-spacing: 0.2em;
                    text-transform: uppercase; color: rgba(0,212,182,0.5); margin-top: 2px;
                }
                .dsb-nav-label {
                    font-size: 8px; font-weight: 700; letter-spacing: 0.32em;
                    text-transform: uppercase; color: rgba(255,255,255,0.18);
                    padding: 20px 24px 10px;
                }
                .dsb-nav {
                    flex: 1; display: flex; flex-direction: column;
                    padding: 0 12px; gap: 2px;
                }
                .dsb-nav-item {
                    display: flex; align-items: center; gap: 12px;
                    padding: 11px 12px; border-radius: 2px;
                    text-decoration: none; color: rgba(255,255,255,0.35);
                    font-size: 12px; font-weight: 600;
                    letter-spacing: 0.12em; text-transform: uppercase;
                    border: 1px solid transparent;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative; overflow: hidden;
                }
                .dsb-nav-item svg {
                    transition: transform 0.3s ease;
                }
                .dsb-nav-item:hover {
                    color: rgba(255,255,255,0.9);
                    background: rgba(255,255,255,0.025);
                    border-color: rgba(255,255,255,0.06);
                    transform: translateX(6px); /* Slide forward on hover */
                }
                .dsb-nav-item:hover svg {
                    transform: scale(1.15) rotate(-3deg);
                    color: #00d4b6;
                }
                .dsb-nav-item.active {
                    color: #00d4b6;
                    background: rgba(0,212,182,0.06);
                    border-color: rgba(0,212,182,0.2);
                    border-left-color: #00d4b6;
                }
                .dsb-nav-item.active::before {
                    content: ''; position: absolute;
                    left: 0; top: 0; bottom: 0; width: 2px;
                    background: #00d4b6;
                    box-shadow: 0 0 8px rgba(0,212,182,0.6);
                }
                .dsb-nav-dot {
                    margin-left: auto; width: 4px; height: 4px;
                    border-radius: 50%; background: #00d4b6;
                    box-shadow: 0 0 6px rgba(0,212,182,0.8);
                }
                .dsb-status {
                    margin: 12px; padding: 14px 16px;
                    background: linear-gradient(135deg, rgba(0,212,182,0.08), rgba(0,212,182,0.02));
                    border: 1px solid rgba(0,212,182,0.18);
                    position: relative; overflow: hidden;
                    transition: transform 0.3s ease, border-color 0.3s ease;
                }
                .dsb-status:hover {
                    transform: translateY(-2px);
                    border-color: rgba(0,212,182,0.4);
                }
                .dsb-status::before {
                    content: ''; position: absolute;
                    top: 0; left: 0; width: 50%; height: 100%;
                    background: linear-gradient(to right, transparent, rgba(255,255,255,0.15), transparent);
                    animation: shimmer 4s infinite linear; /* Glass sweep effect */
                    pointer-events: none;
                }
                .dsb-status::after {
                    content: 'MDFLD'; position: absolute;
                    right: -6px; bottom: -8px;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 32px; font-weight: 900; color: transparent;
                    -webkit-text-stroke: 1px rgba(0,212,182,0.06);
                    letter-spacing: -0.02em; pointer-events: none; line-height: 1;
                }
                .dsb-status-label {
                    font-size: 8px; font-weight: 700; letter-spacing: 0.28em;
                    text-transform: uppercase; color: rgba(0,212,182,0.5); margin-bottom: 6px;
                }
                .dsb-status-val {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 22px; font-weight: 900; color: #00d4b6; letter-spacing: -0.02em;
                    text-shadow: 0 0 10px rgba(0,212,182,0.3);
                }
                .dsb-status-sub {
                    font-size: 9px; color: rgba(255,255,255,0.25); margin-top: 3px; letter-spacing: 0.04em;
                }
                .dsb-logout {
                    margin: 0 12px 16px;
                    display: flex; align-items: center; gap: 10px;
                    padding: 11px 12px; background: transparent;
                    border: 1px solid rgba(255,255,255,0.07);
                    color: rgba(255,255,255,0.25);
                    font-family: 'Barlow', sans-serif; font-size: 10px; font-weight: 700;
                    letter-spacing: 0.22em; text-transform: uppercase;
                    cursor: pointer; transition: all 0.25s ease;
                    width: calc(100% - 24px); border-radius: 2px;
                }
                .dsb-logout:hover {
                    border-color: rgba(255,60,60,0.4);
                    color: #ff6b6b;
                    background: rgba(255,60,60,0.06);
                    box-shadow: 0 4px 12px rgba(255,60,60,0.1);
                    transform: translateY(-1px);
                }
                .dsb-logout:active {
                    transform: translateY(1px);
                    background: rgba(255,60,60,0.1);
                }
                .dsb-logout svg {
                    transition: transform 0.3s ease;
                }
                .dsb-logout:hover svg {
                    transform: translateX(2px); /* Pushes icon subtly */
                }
            `}</style>

            <aside className="dsb-root">
                <div className="dsb-glow" />
                <div className="dsb-grid" />
                <div className="dsb-content">

                    <div className="dsb-logo">
                        <Link href="/" className="dsb-logo-text">MD<span>FLD</span></Link>
                        <div className="dsb-logo-sub">User Dashboard</div>
                    </div>

                    <div className="dsb-user">
                        <div className="dsb-avatar">{initials}</div>
                        <div style={{ overflow: 'hidden' }}>
                            <div className="dsb-user-name">{user.name}</div>
                            <div className="dsb-user-since">Since {user.joined}</div>
                        </div>
                    </div>

                    <div className="dsb-nav-label">Navigation</div>
                    <nav className="dsb-nav">
                        {NAV.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`dsb-nav-item${isActive ? ' active' : ''}`}
                                >
                                    {item.icon}
                                    {item.label}
                                    {isActive && <span className="dsb-nav-dot" />}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="dsb-status">
                        <div className="dsb-status-label">Member Status</div>
                        <div className="dsb-status-val">Elite ✦</div>
                        <div className="dsb-status-sub">Early access to all drops</div>
                    </div>

                    <button className="dsb-logout" onClick={handleLogout}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}