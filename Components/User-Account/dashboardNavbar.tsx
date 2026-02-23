'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

// Routes match app/(user)/[page]/page.tsx — no /user/ prefix in URL
const CRUMBS: Record<string, string> = {
    '/account':   'Account',
    '/myorders':  'My Orders',
    '/saved':     'Saved',
    '/addresses': 'Addresses',
    '/settings':  'Settings',
};

interface Props {
    user: { name: string };
}

export default function DashboardNavbar({ user }: Props) {
    const pathname = usePathname();
    const page     = CRUMBS[pathname] ?? 'Dashboard';
    const initials = user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Barlow:wght@400;500;600;700&display=swap');

                .dnb {
                    position: sticky; top: 0; z-index: 50; flex-shrink: 0;
                    height: 64px; display: flex; align-items: center; gap: 0;
                    background: #020606;
                    border-bottom: 1px solid rgba(0,212,182,0.1);
                    font-family: 'Barlow', sans-serif;
                }
                .dnb::after {
                    content: ''; position: absolute; bottom: -1px; left: 0;
                    width: 160px; height: 1px;
                    background: linear-gradient(90deg, #00d4b6 0%, transparent 100%);
                    box-shadow: 0 0 10px rgba(0,212,182,0.5);
                    pointer-events: none;
                }
                .dnb-left {
                    flex: 1; display: flex; flex-direction: column;
                    justify-content: center; gap: 4px; padding: 0 28px; min-width: 0;
                }
                .dnb-breadcrumb { display: flex; align-items: center; gap: 6px; line-height: 1; }
                .dnb-crumb {
                    font-size: 9px; font-weight: 700; letter-spacing: 0.26em;
                    text-transform: uppercase; color: rgba(255,255,255,0.22);
                    text-decoration: none; transition: color 0.18s; white-space: nowrap;
                }
                .dnb-crumb:hover { color: rgba(255,255,255,0.5); }
                .dnb-sep { font-size: 9px; color: rgba(0,212,182,0.3); line-height: 1; }
                .dnb-crumb-active {
                    font-size: 9px; font-weight: 700; letter-spacing: 0.26em;
                    text-transform: uppercase; color: #00d4b6; white-space: nowrap;
                }
                .dnb-title {
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 22px; font-weight: 900; text-transform: uppercase;
                    letter-spacing: 0.02em; color: #fff; line-height: 1;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .dnb-title-accent { color: #00d4b6; }
                .dnb-right {
                    display: flex; align-items: center; gap: 8px; padding: 0 24px; flex-shrink: 0;
                }
                .dnb-search {
                    display: flex; align-items: center; gap: 8px;
                    height: 34px; padding: 0 14px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                    cursor: pointer; transition: border-color 0.2s, background 0.2s; white-space: nowrap;
                }
                .dnb-search:hover { border-color: rgba(0,212,182,0.25); background: rgba(0,212,182,0.03); }
                .dnb-search-text {
                    font-size: 9px; font-weight: 700; letter-spacing: 0.2em;
                    text-transform: uppercase; color: rgba(255,255,255,0.2);
                }
                .dnb-kbd {
                    font-size: 8px; color: rgba(255,255,255,0.15);
                    border: 1px solid rgba(255,255,255,0.1); padding: 1px 6px;
                    letter-spacing: 0.04em; line-height: 1.6;
                }
                .dnb-divider {
                    width: 1px; height: 22px; background: rgba(255,255,255,0.07);
                    flex-shrink: 0; margin: 0 4px;
                }
                .dnb-btn {
                    position: relative; width: 34px; height: 34px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.35); cursor: pointer;
                    text-decoration: none; transition: all 0.2s; flex-shrink: 0;
                }
                .dnb-btn:hover {
                    background: rgba(0,212,182,0.06); border-color: rgba(0,212,182,0.3); color: #00d4b6;
                }
                .dnb-dot {
                    position: absolute; top: 7px; right: 7px;
                    width: 5px; height: 5px; border-radius: 50%;
                    background: #00d4b6; border: 1.5px solid #020606;
                    box-shadow: 0 0 6px rgba(0,212,182,0.8);
                }
                .dnb-avatar {
                    width: 34px; height: 34px; border-radius: 50%;
                    background: linear-gradient(135deg, rgba(0,212,182,0.25), rgba(0,212,182,0.06));
                    border: 1px solid rgba(0,212,182,0.35);
                    display: flex; align-items: center; justify-content: center;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: 13px; font-weight: 900; color: #00d4b6;
                    cursor: pointer; flex-shrink: 0; transition: border-color 0.2s, box-shadow 0.2s;
                }
                .dnb-avatar:hover { border-color: #00d4b6; box-shadow: 0 0 12px rgba(0,212,182,0.3); }
            `}</style>

            <header className="dnb">
                <div className="dnb-left">
                    <nav className="dnb-breadcrumb" aria-label="breadcrumb">
                        <Link href="/"        className="dnb-crumb">Home</Link>
                        <span className="dnb-sep">/</span>
                        <Link href="/account" className="dnb-crumb">Dashboard</Link>
                        <span className="dnb-sep">/</span>
                        <span className="dnb-crumb-active">{page}</span>
                    </nav>
                    <div className="dnb-title">
                        <span className="dnb-title-accent">{page.charAt(0)}</span>
                        {page.slice(1)}
                    </div>
                </div>

                <div className="dnb-right">
                    <div className="dnb-search" role="button" aria-label="Search">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                            stroke="rgba(255,255,255,0.25)" strokeWidth="2.2"
                            strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"/>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                        <span className="dnb-search-text">Search</span>
                        <span className="dnb-kbd">⌘K</span>
                    </div>

                    <div className="dnb-divider" />

                    <Link href="/shop" className="dnb-btn" title="Shop">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                        </svg>
                    </Link>

                    <button className="dnb-btn" title="Notifications" style={{ border: 'none' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                        <span className="dnb-dot" />
                    </button>

                    <div className="dnb-divider" />
                    <div className="dnb-avatar" title={user.name}>{initials}</div>
                </div>
            </header>
        </>
    );
}