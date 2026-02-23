'use client';

// DashboardShell.tsx
// Pure client wrapper — owns all the visual atmosphere + flex shell.
// layout.tsx (server) renders this and passes sidebar/navbar/children as props.

export default function DashboardShell({
    sidebar,
    navbar,
    children,
}: {
    sidebar: React.ReactNode;
    navbar: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
                html, body { height: 100%; }

                /* ── Background atmosphere ── */
                .dl-grid {
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    z-index: 0;
                    background-image:
                        linear-gradient(rgba(0,212,182,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0,212,182,0.025) 1px, transparent 1px);
                    background-size: 56px 56px;
                }
                .dl-grid::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 70% 50% at 60% 0%, rgba(0,212,182,0.04) 0%, transparent 70%);
                }
                .dl-glow {
                    position: fixed;
                    top: -10%;
                    left: 35%;
                    width: 500px;
                    height: 400px;
                    background: radial-gradient(ellipse, rgba(0,212,182,0.05) 0%, transparent 70%);
                    filter: blur(60px);
                    pointer-events: none;
                    z-index: 0;
                }
                .dl-ghost {
                    position: fixed;
                    right: -1%;
                    bottom: -2%;
                    font-family: 'Barlow Condensed', sans-serif;
                    font-size: clamp(100px, 18vw, 240px);
                    font-weight: 900;
                    letter-spacing: -0.04em;
                    text-transform: uppercase;
                    color: transparent;
                    -webkit-text-stroke: 1px rgba(0,212,182,0.03);
                    pointer-events: none;
                    user-select: none;
                    z-index: 0;
                    line-height: 1;
                }

                /* ── Shell ── */
                .dl-shell {
                    position: relative;
                    z-index: 1;
                    display: flex;
                    min-height: 100vh;
                    background: #020606;
                    color: #fff;
                }

                /* Sidebar column — fixed width, isolated stacking context */
                .dl-sidebar-col {
                    width: 240px;
                    flex-shrink: 0;
                    position: relative;
                    z-index: 2;
                }

                /* Main column — navbar on top, scrollable page below */
                .dl-main-col {
                    flex: 1;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    z-index: 1;
                }

                .dl-navbar-row {
                    flex-shrink: 0;
                    position: relative;
                    z-index: 10;
                }

                .dl-page {
                    flex: 1;
                    overflow-y: auto;
                    padding: 40px 48px 60px;
                }

                @media (max-width: 900px) {
                    .dl-sidebar-col { display: none; }
                    .dl-page { padding: 24px 20px 48px; }
                }
            `}</style>

            {/* Atmosphere */}
            <div className="dl-grid" />
            <div className="dl-glow"  />
            <div className="dl-ghost">MDFLD</div>

            <div className="dl-shell">

                {/* Sidebar */}
                <div className="dl-sidebar-col">
                    {sidebar}
                </div>

                {/* Main (navbar + page) */}
                <div className="dl-main-col">
                    <div className="dl-navbar-row">
                        {navbar}
                    </div>
                    <main className="dl-page">
                        {children}
                    </main>
                </div>

            </div>
        </>
    );
}