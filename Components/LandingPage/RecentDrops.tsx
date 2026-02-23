"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, Flame, ShoppingBag, Clock } from "lucide-react";

const ACCENT = "#00d4b6";

interface Drop {
  id: number;
  brand: string;
  name: string;
  shortName: string;
  time: string;
  price: string;
  originalPrice: string;
  img: string;
  stock: number;
  viewers: number;
  hot: boolean;
  tag: string;
  number: string;
}

interface ActivityItem {
  user: string;
  location: string;
  product: string;
  time: string;
}

const DROPS: Drop[] = [
  { id: 0, brand: "Nike", name: "Phantom GX2 Elite", shortName: "Phantom GX2", time: "2m", price: "$259", originalPrice: "$299", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=90&auto=format&fit=crop", stock: 6, viewers: 34, hot: true, tag: "JUST DROPPED", number: "01" },
  { id: 1, brand: "Adidas", name: "X Crazyfast.1 FG", shortName: "Crazyfast.1", time: "18m", price: "$199", originalPrice: "$239", img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=90&auto=format&fit=crop", stock: 14, viewers: 21, hot: true, tag: "LIMITED", number: "02" },
  { id: 2, brand: "New Balance", name: "Tekela V4 Magia", shortName: "Tekela V4", time: "1h", price: "$179", originalPrice: "$219", img: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=90&auto=format&fit=crop", stock: 22, viewers: 9, hot: false, tag: "NEW", number: "03" },
  { id: 3, brand: "Puma", name: "King Platinum 21", shortName: "King Platinum", time: "2h", price: "$149", originalPrice: "$189", img: "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=800&q=90&auto=format&fit=crop", stock: 3, viewers: 47, hot: true, tag: "ALMOST GONE", number: "04" },
  { id: 4, brand: "Mizuno", name: "Wave Cup Legend", shortName: "Wave Cup", time: "3h", price: "$169", originalPrice: "$209", img: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&q=90&auto=format&fit=crop", stock: 18, viewers: 7, hot: false, tag: "PRO", number: "05" },
  { id: 5, brand: "Under Armour", name: "Clone Magnetico Pro", shortName: "Magnetico Pro", time: "5h", price: "$129", originalPrice: "$159", img: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=90&auto=format&fit=crop", stock: 31, viewers: 4, hot: false, tag: "SALE", number: "06" },
];

const ACTIVITY: ActivityItem[] = [
  { user: "Jake M.", location: "London", product: "Mercurial Superfly 10", time: "12s" },
  { user: "Sofía R.", location: "Madrid", product: "Predator Elite", time: "34s" },
  { user: "Tom B.", location: "Berlin", product: "Future 7 Ultimate", time: "1m" },
  { user: "Amara D.", location: "Lagos", product: "Copa Pure.1", time: "2m" },
  { user: "Lucas F.", location: "Paris", product: "Phantom GX Elite", time: "3m" },
];

export default function RecentDrops() {
  const [featured, setFeatured] = useState(0);
  const [added, setAdded] = useState<number | null>(null);
  const [toastIndex, setToastIndex] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const cycle = () => {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        setTimeout(() => setToastIndex(i => (i + 1) % ACTIVITY.length), 400);
      }, 3200);
    };
    cycle();
    const t = setInterval(cycle, 4800);
    return () => clearInterval(t);
  }, []);

  const handleAdd = (id: number) => {
    setAdded(id);
    setTimeout(() => setAdded(null), 2000);
  };

  const drop = DROPS[featured];

  return (
    <section style={{ background: "#060a09", fontFamily: "'Barlow Condensed', sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,300;0,400;0,700;0,800;0,900;1,700;1,900&family=Barlow:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes livepulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .live-dot { animation: livepulse 1.6s ease-in-out infinite; }

        @keyframes marqueemove { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        .marquee-track { animation: marqueemove 20s linear infinite; display:flex; white-space:nowrap; width:max-content; }

        .drop-row { cursor: pointer; transition: background 0.18s; }
        .drop-row:hover { background: rgba(0,212,182,0.04) !important; }

        .view-link:hover { color: ${ACCENT} !important; }
        .add-btn:active { transform: scale(0.95); }
      `}</style>

      {/* SCROLLING MARQUEE */}
      <div style={{ background: "#0b100f", borderBottom: "1px solid rgba(0,212,182,0.07)", padding: "9px 0", overflow: "hidden" }}>
        <div className="marquee-track">
          {[...Array(3)].map((_, g) =>
            DROPS.map((d) => (
              <span key={`${g}-${d.id}`} style={{ display: "inline-flex", alignItems: "center", gap: 14, padding: "0 28px", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: ACCENT, opacity: 0.4 }}>{d.number}</span>
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>{d.brand} — {d.shortName}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: ACCENT }}>{d.price}</span>
              </span>
            ))
          )}
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1px 460px", minHeight: "100vh" }}>

        {/* ═══ LEFT: INDEXED LIST ═══ */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Section header */}
          <div style={{ padding: "36px 44px 24px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
              <div className="live-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff4d4d", flexShrink: 0 }} />
              <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.4em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>Live Drop Feed</span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(0,212,182,0.45)" }}>— {DROPS.length} today</span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(44px, 5vw, 70px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: 0.86, color: "#fff", margin: 0 }}>
                Fresh<br /><em style={{ color: ACCENT, fontStyle: "italic" }}>Drops.</em>
              </h2>
              <a href="#" className="view-link" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.22)", textDecoration: "none", display: "flex", alignItems: "center", gap: 7, transition: "color 0.2s" }}>
                View All <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "36px 1fr 80px 100px 110px", padding: "10px 44px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {["#", "Product", "Viewers", "Stock", "Price"].map((l, i) => (
              <div key={l} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(255,255,255,0.16)", textAlign: i > 1 ? "center" : "left" }}>{l}</div>
            ))}
          </div>

          {/* Rows */}
          <div style={{ flex: 1 }}>
            {DROPS.map((d, i) => {
              const isFeatured = featured === d.id;
              const lowStock = d.stock <= 8;
              const isAdded = added === d.id;

              return (
                <motion.div
                  key={d.id}
                  className="drop-row"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  onMouseEnter={() => setFeatured(d.id)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "36px 1fr 80px 100px 110px",
                    padding: "0 44px",
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    height: 76,
                    background: isFeatured ? "rgba(0,212,182,0.03)" : "transparent",
                    position: "relative",
                  }}
                >
                  {/* Active bar */}
                  <motion.div
                    animate={{ opacity: isFeatured ? 1 : 0, scaleY: isFeatured ? 1 : 0.2 }}
                    transition={{ duration: 0.25 }}
                    style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: lowStock ? "#ff4d4d" : ACCENT, transformOrigin: "center" }}
                  />

                  {/* Index number */}
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: isFeatured ? ACCENT : "rgba(255,255,255,0.16)", transition: "color 0.2s" }}>{d.number}</span>

                  {/* Product */}
                  <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
                    <div style={{ width: 48, height: 48, overflow: "hidden", flexShrink: 0, border: `1px solid ${isFeatured ? "rgba(0,212,182,0.22)" : "rgba(255,255,255,0.05)"}`, transition: "border-color 0.25s" }}>
                      <img src={d.img} alt={d.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.58) saturate(0.75)", transition: "transform 0.5s ease", transform: isFeatured ? "scale(1.08)" : "scale(1)" }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: ACCENT, opacity: 0.75 }}>{d.brand}</span>
                        {d.hot && <Flame size={9} style={{ color: lowStock ? "#ff4d4d" : "rgba(255,140,0,0.7)", flexShrink: 0 }} />}
                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 7, letterSpacing: "0.14em", textTransform: "uppercase", padding: "2px 7px", background: lowStock ? "rgba(255,77,77,0.1)" : d.tag === "JUST DROPPED" ? "rgba(0,212,182,0.1)" : "rgba(255,255,255,0.04)", color: lowStock ? "#ff4d4d" : d.tag === "JUST DROPPED" ? ACCENT : "rgba(255,255,255,0.3)" }}>{d.tag}</span>
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 800, textTransform: "uppercase", color: isFeatured ? "#fff" : "rgba(255,255,255,0.58)", letterSpacing: "0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", transition: "color 0.2s" }}>{d.name}</div>
                    </div>
                  </div>

                  {/* Viewers */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <Eye size={9} style={{ color: "rgba(255,255,255,0.18)" }} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.32)" }}>{d.viewers}</span>
                  </div>

                  {/* Stock bar */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                    <div style={{ width: 52, height: 2, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${(d.stock / 35) * 100}%`, background: lowStock ? "#ff4d4d" : ACCENT, transition: "width 0.4s" }} />
                    </div>
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: lowStock ? "#ff4d4d" : "rgba(255,255,255,0.28)" }}>{d.stock}</span>
                  </div>

                  {/* Price + add */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 19, fontWeight: 900, color: isFeatured ? ACCENT : "rgba(255,255,255,0.75)", letterSpacing: "-0.02em", lineHeight: 1, transition: "color 0.2s" }}>{d.price}</div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: "rgba(255,255,255,0.18)", textDecoration: "line-through" }}>{d.originalPrice}</div>
                    </div>
                    <button
                      className="add-btn"
                      onClick={(e) => { e.stopPropagation(); handleAdd(d.id); }}
                      style={{ width: 32, height: 32, border: `1px solid ${isAdded ? ACCENT : "rgba(255,255,255,0.09)"}`, background: isAdded ? "rgba(0,212,182,0.1)" : "transparent", color: isAdded ? ACCENT : "rgba(255,255,255,0.35)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s" }}
                    >
                      {isAdded ? <span style={{ fontSize: 12 }}>✓</span> : <ShoppingBag size={12} />}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ═══ DIVIDER ═══ */}
        <div style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* ═══ RIGHT: STICKY FEATURE + ACTIVITY ═══ */}
        <div style={{ position: "sticky", top: 0, height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* BIG IMAGE */}
          <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={drop.id}
                src={drop.img}
                alt={drop.name}
                initial={{ opacity: 0, scale: 1.07 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.36) saturate(0.8)" }}
              />
            </AnimatePresence>

            {/* Gradient overlays */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(6,10,9,1) 0%, rgba(6,10,9,0.35) 55%, transparent 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(6,10,9,0.5) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, ${ACCENT}, transparent)`, opacity: 0.5 }} />

            {/* Drop tag */}
            <AnimatePresence mode="wait">
              <motion.div key={`tag-${drop.id}`} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ position: "absolute", top: 22, left: 22 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7, background: drop.tag === "ALMOST GONE" ? "#ff4d4d" : ACCENT, color: "#060a09", fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, fontWeight: 900, letterSpacing: "0.3em", padding: "5px 13px" }}>
                  {drop.hot && <Flame size={9} />}{drop.tag}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Viewers */}
            <div style={{ position: "absolute", top: 22, right: 22, display: "flex", alignItems: "center", gap: 7, background: "rgba(6,10,9,0.75)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.07)", padding: "6px 12px" }}>
              <div className="live-dot" style={{ width: 5, height: 5, borderRadius: "50%", background: "#ff4d4d" }} />
              <Eye size={10} style={{ color: "rgba(255,255,255,0.35)" }} />
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.55)" }}>{drop.viewers} viewing</span>
            </div>

            {/* Product info at bottom */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 26px 24px" }}>
              <AnimatePresence mode="wait">
                <motion.div key={`info-${drop.id}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.38 }}>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.38em", textTransform: "uppercase", color: ACCENT }}>{drop.brand}</span>
                    <div style={{ height: 1, flex: 1, background: "rgba(0,212,182,0.12)" }} />
                    <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", gap: 5 }}>
                      <Clock size={8} /> {drop.time} ago
                    </span>
                  </div>

                  <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "clamp(26px, 2.8vw, 38px)", fontWeight: 900, textTransform: "uppercase", letterSpacing: "-0.02em", color: "#fff", lineHeight: 0.9, marginBottom: 18 }}>{drop.name}</h3>

                  {/* Stock */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, color: "rgba(255,255,255,0.28)", letterSpacing: "0.18em", textTransform: "uppercase" }}>Availability</span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: drop.stock <= 8 ? "#ff4d4d" : "rgba(255,255,255,0.3)" }}>{drop.stock} pairs left</span>
                    </div>
                    <div style={{ height: 2, background: "rgba(255,255,255,0.06)" }}>
                      <motion.div key={drop.id} initial={{ width: 0 }} animate={{ width: `${(drop.stock / 35) * 100}%` }} transition={{ duration: 0.7, ease: "easeOut" }} style={{ height: "100%", background: drop.stock <= 8 ? "#ff4d4d" : ACCENT }} />
                    </div>
                  </div>

                  {/* Price + CTA */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 46, fontWeight: 900, color: ACCENT, letterSpacing: "-0.04em", lineHeight: 1 }}>{drop.price}</div>
                      <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.18)", textDecoration: "line-through" }}>{drop.originalPrice}</div>
                    </div>
                    <button
                      onClick={() => handleAdd(drop.id)}
                      style={{
                        background: added === drop.id ? "rgba(0,212,182,0.1)" : ACCENT,
                        border: `1px solid ${added === drop.id ? ACCENT : "transparent"}`,
                        color: added === drop.id ? ACCENT : "#060a09",
                        fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 900,
                        letterSpacing: "0.28em", textTransform: "uppercase",
                        padding: "14px 26px", cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 10,
                        transition: "all 0.22s",
                      }}
                    >
                      <ShoppingBag size={14} />
                      {added === drop.id ? "Added ✓" : "Add to Bag"}
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* ACTIVITY PANEL */}
          <div style={{ background: "#0b100f", borderTop: "1px solid rgba(0,212,182,0.07)" }}>
            <div style={{ padding: "13px 22px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="live-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#ff4d4d" }} />
                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(255,255,255,0.24)" }}>Recent Purchases</span>
              </div>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(0,212,182,0.4)" }}>LIVE</span>
            </div>

            {ACTIVITY.map((item, i) => (
              <div key={i} style={{ padding: "10px 22px", borderBottom: i < ACTIVITY.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none", display: "flex", alignItems: "center", gap: 11 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(0,212,182,0.06)", border: "1px solid rgba(0,212,182,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, fontWeight: 800, color: ACCENT, opacity: 0.65 }}>{item.user[0]}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)" }}>
                    <span style={{ color: "rgba(255,255,255,0.82)", fontWeight: 600 }}>{item.user}</span>
                    <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 9 }}> · {item.location}</span>
                  </div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "rgba(255,255,255,0.26)", letterSpacing: "0.06em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.product}</div>
                </div>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.15)", flexShrink: 0 }}>{item.time}</span>
              </div>
            ))}

            {/* Toast */}
            <AnimatePresence>
              {showToast && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  style={{ margin: "8px 14px 12px", padding: "10px 14px", background: "rgba(0,212,182,0.05)", border: "1px solid rgba(0,212,182,0.16)", display: "flex", alignItems: "center", gap: 10 }}
                >
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACCENT, flexShrink: 0, boxShadow: `0 0 8px ${ACCENT}` }} />
                  <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.5)", flex: 1 }}>
                    <span style={{ color: "#fff", fontWeight: 600 }}>{ACTIVITY[toastIndex].user}</span> just bought <span style={{ color: ACCENT }}>{ACTIVITY[toastIndex].product}</span>
                  </span>
                  <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.18)" }}>{ACTIVITY[toastIndex].time} ago</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}