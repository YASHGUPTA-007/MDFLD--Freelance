"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  SlidersHorizontal,
  X,
  Check,
  Search,
  ChevronRight,
  ChevronLeft,
  Heart,
} from "lucide-react";
import gsap from "gsap";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Product {
  _id: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  condition: string;
  stock: number;
  images: { url: string; public_id: string }[];
  category: { _id: string; name: string; slug: string };
}

interface FilterState {
  condition: string[];
  priceMax: number;
  sort: "default" | "low-high" | "high-low";
}

const CONDITION_OPTIONS = [
  "Brand New",
  "New with Tags",
  "Used - Like New",
  "Used - Good",
];
const ACCENT = "#00f0ff";
const PAGE_SIZE = 40;

// ─── Hero Banners ─────────────────────────────────────────────────────────────
const BANNERS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2000&auto=format&fit=crop",
    title: "THE NEW SEASON",
    subtitle: "Authentic match gear engineered for peak performance.",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=2000&auto=format&fit=crop",
    title: "ELITE FOOTWEAR",
    subtitle:
      "Precision and control. Shop the latest turf and firm ground boots.",
  },
  {
    id: 3,
    // SWAPPED: New gritty, high-fashion streetwear image for Terrace Culture
    image:
      "https://images.unsplash.com/photo-1552318414-b845dfd2d5fb?q=80&w=2000&auto=format&fit=crop",
    title: "TERRACE CULTURE",
    subtitle: "Take the game to the streets. Premium outerwear and apparel.",
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    // Tiny timeout to force browser reflow for the CSS transition
    const timeout = setTimeout(() => setProgress(100), 50);
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [current]);

  const goTo = (index: number) => setCurrent(index);
  const prev = () =>
    setCurrent((p) => (p - 1 + BANNERS.length) % BANNERS.length);
  const next = () => setCurrent((p) => (p + 1) % BANNERS.length);

  return (
    <div className="hero-slider-wrap">
      {BANNERS.map((banner, index) => {
        const isActive = index === current;
        return (
          <div
            key={banner.id}
            className={`hero-slide ${isActive ? "active" : ""}`}
          >
            <Image
              src={banner.image}
              alt={banner.title}
              fill
              priority={index === 0}
              className="hero-img"
            />
            <div className="hero-overlay" />
            <div className="hero-content">
              <h2 className="hero-title">
                <span className="text-reveal">{banner.title}</span>
              </h2>
              <p className="hero-subtitle">
                <span className="text-reveal delay-100">{banner.subtitle}</span>
              </p>
              <div className="text-reveal delay-200">
                <button className="hero-btn">Shop Collection</button>
              </div>
            </div>
          </div>
        );
      })}

      {/* Progress Bar Indicator */}
      <div className="absolute bottom-0 left-0 h-1 bg-white/20 z-20 w-full">
        <div
          className="h-full bg-[#00f0ff] transition-all ease-linear"
          style={{
            width: `${progress}%`,
            transitionDuration: progress === 0 ? "0s" : "5s",
          }}
        />
      </div>

      <button className="slider-nav left" onClick={prev}>
        <ChevronLeft size={24} />
      </button>
      <button className="slider-nav right" onClick={next}>
        <ChevronRight size={24} />
      </button>

      <div className="slider-dots">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === current ? "active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
function Marquee() {
  const text =
    "⚡️ FREE SHIPPING ON ORDERS OVER $100 ⚡️ NEW SEASON ARRIVALS ⚡️ AUTHENTIC MATCH GEAR ⚡️ LIMITED EDITION DROPS ⚡️ ";
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

// ─── Filter Sheet ─────────────────────────────────────────────────────────────
function FilterSheet({
  filters,
  onApply,
  onClose,
}: {
  filters: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<FilterState>(filters);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (drawerRef.current)
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        { x: 0, duration: 0.45, ease: "expo.out" },
      );
    if (overlayRef.current)
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3 },
      );
  }, []);

  const toggleCondition = (c: string) =>
    setLocal((p) => ({
      ...p,
      condition: p.condition.includes(c)
        ? p.condition.filter((x) => x !== c)
        : [...p.condition, c],
    }));

  const handleApply = () => {
    if (!drawerRef.current) {
      onApply(local);
      onClose();
      return;
    }
    gsap.to(drawerRef.current, {
      x: "100%",
      duration: 0.35,
      ease: "power3.in",
      onComplete: () => {
        onApply(local);
        onClose();
      },
    });
    if (overlayRef.current)
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  const handleClose = () => {
    if (drawerRef.current)
      gsap.to(drawerRef.current, {
        x: "100%",
        duration: 0.35,
        ease: "power3.in",
        onComplete: onClose,
      });
    if (overlayRef.current)
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
  };

  return (
    <div
      ref={overlayRef}
      className="filter-overlay"
      onClick={(e) => {
        if (e.target === overlayRef.current) handleClose();
      }}
    >
      <div ref={drawerRef} className="filter-drawer">
        <div className="drawer-header">
          <div>
            <p className="drawer-eyebrow">Refine Results</p>
            <h2 className="drawer-title">Filters</h2>
          </div>
          <button onClick={handleClose} className="drawer-close">
            <X size={18} />
          </button>
        </div>
        <div className="drawer-scroll">
          <div className="filter-section">
            <h3 className="filter-label">Condition</h3>
            <div className="condition-grid">
              {CONDITION_OPTIONS.map((c) => {
                const active = local.condition.includes(c);
                return (
                  <button
                    key={c}
                    onClick={() => toggleCondition(c)}
                    className={`condition-btn ${active ? "active" : ""}`}
                  >
                    <span className="cond-dot" /> {c}{" "}
                    {active && (
                      <Check size={13} style={{ marginLeft: "auto" }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="filter-section">
            <div className="price-header">
              <h3 className="filter-label">Max Price</h3>
              <span className="price-display">${local.priceMax}</span>
            </div>
            <div className="range-wrap">
              <input
                type="range"
                min={20}
                max={1000}
                step={10}
                value={local.priceMax}
                onChange={(e) =>
                  setLocal((p) => ({ ...p, priceMax: Number(e.target.value) }))
                }
                className="price-range"
                style={
                  {
                    "--pct": `${((local.priceMax - 20) / 980) * 100}%`,
                  } as React.CSSProperties
                }
              />
              <div className="range-labels">
                <span>$20</span>
                <span>$1000</span>
              </div>
            </div>
          </div>
          <div className="filter-section">
            <h3 className="filter-label">Sort By</h3>
            <div className="sort-grid">
              {(
                [
                  { key: "default", label: "Newest First" },
                  { key: "low-high", label: "Price: Low → High" },
                  { key: "high-low", label: "Price: High → Low" },
                ] as const
              ).map((s) => (
                <button
                  key={s.key}
                  onClick={() => setLocal((p) => ({ ...p, sort: s.key }))}
                  className={`sort-btn ${local.sort === s.key ? "active" : ""}`}
                >
                  {local.sort === s.key && <Check size={13} />} {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="drawer-actions">
          <button
            onClick={() =>
              setLocal({ condition: [], priceMax: 1000, sort: "default" })
            }
            className="btn-reset"
          >
            Reset All
          </button>
          <button onClick={handleApply} className="btn-apply">
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar({
  products,
  onSearch,
}: {
  products: Product[];
  onSearch: (q: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const allTitles = products.map((p) => p.title);

  const update = (val: string) => {
    if (!val.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    const lower = val.toLowerCase();
    const matched = allTitles
      .filter((t) => t.toLowerCase().includes(lower))
      .slice(0, 6);
    setSuggestions(matched);
    setOpen(matched.length > 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    update(val);
    onSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const select = (s: string) => {
    setQuery(s);
    setSuggestions([]);
    setOpen(false);
    onSearch(s);
  };

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={wrapRef} className={`search-wrap ${focused ? "focused" : ""}`}>
      <Search size={16} className="text-white/50" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          setFocused(true);
          if (suggestions.length) setOpen(true);
        }}
        onBlur={() => setFocused(false)}
        placeholder="Search gear..."
        className="search-input"
      />
      {query && (
        <button
          onClick={() => {
            setQuery("");
            setSuggestions([]);
            setOpen(false);
            onSearch("");
          }}
          className="search-clear"
        >
          <X size={14} />
        </button>
      )}
      {open && (
        <div className="search-dropdown">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => select(s)}
              className="search-suggestion"
            >
              <Search size={12} className="opacity-50" />{" "}
              <span>
                <b>{s.slice(0, query.length)}</b>
                {s.slice(query.length)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
// ─── Wishlist Button ──────────────────────────────────────────────────────────
function WishlistButton({ productId }: { productId: string }) {
  const [saved, setSaved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/wishlist")
      .then((r) => r.json())
      .then((d) => {
        if (d.wishlist) setSaved(d.wishlist.includes(productId));
      })
      .catch(() => {});
  }, [productId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok) setSaved(data.added);
    } catch {}
    setLoading(false);
  };

  if (saved === null) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className="wishlist-card-btn"
      aria-label={saved ? "Remove from saved" : "Save item"}
    >
      <Heart size={14} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, index }: { product: Product; index: number }) {
  const imageUrl = product.images?.[0]?.url;
  const isOOS = product.stock === 0;
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  // Staggered delay for the waterfall reveal effect
  const delay = (index % PAGE_SIZE) * 0.05;

  return (
    <Link
      href={`/shop/${product._id}`}
      className="product-card group animate-fade-up"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="card-img-wrap">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="card-img-empty">📦</div>
        )}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isOOS && <span className="badge badge-error">Sold Out</span>}
          {discount && !isOOS && (
            <span className="badge badge-accent">-{discount}%</span>
          )}
          {product.condition === "Brand New" && !isOOS && (
            <span className="badge badge-dark">New</span>
          )}
        </div>
        <WishlistButton productId={product._id} />
      </div>
      <div className="card-info">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
            {product.brand || "Apparel"}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-white/30">
            {product.category?.name}
          </span>
        </div>
        <h3 className="text-sm font-medium text-white mb-2 line-clamp-2 group-hover:text-[#00f0ff] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-white font-[Oswald] tracking-wide">
            ${product.price.toFixed(2)}
          </span>
          {product.compareAtPrice && (
            <span className="text-xs text-white/40 line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCategoryId, setActiveCategoryId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    condition: [],
    priceMax: 1000,
    sort: "default",
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []));
  }, []);

  useEffect(() => {
    setLoading(true);
    setVisibleCount(PAGE_SIZE);
    const params = new URLSearchParams();
    if (activeCategoryId) params.set("category", activeCategoryId);
    if (filters.sort !== "default") params.set("sort", filters.sort);
    if (filters.priceMax < 1000)
      params.set("maxPrice", String(filters.priceMax));
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setAllProducts(d.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [activeCategoryId, filters.sort, filters.priceMax]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, filters.condition]);

  const filtered = allProducts.filter((p) => {
    if (
      filters.condition.length > 0 &&
      !filters.condition.includes(p.condition)
    )
      return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      (p.brand ?? "").toLowerCase().includes(q)
    );
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setVisibleCount((c) => c + PAGE_SIZE);
            setIsLoadingMore(false);
          }, 500);
        }
      },
      { rootMargin: "400px" },
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, isLoadingMore]);

  const activeFilterCount =
    filters.condition.length +
    (filters.priceMax < 1000 ? 1 : 0) +
    (filters.sort !== "default" ? 1 : 0);

  return (
    <div className="shop-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap');

        :root {
          --bg: #050505;
          --bg-panel: #0f0f0f;
          --border: rgba(255,255,255,0.08);
          --accent: ${ACCENT};
          --text-primary: #ffffff;
          --text-secondary: #a0a0a0;
          --font-sans: 'Inter', sans-serif;
          --font-display: 'Oswald', sans-serif;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .shop-root { background: var(--bg); min-height: 100vh; color: var(--text-primary); font-family: var(--font-sans); padding-top: 60px; }

        /* ── Hero Slider w/ Text Animations ── */
        .hero-slider-wrap { position: relative; width: 100%; height: 60vh; min-height: 400px; max-height: 700px; overflow: hidden; background: #000; }
        .hero-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease-in-out; }
        .hero-slide.active { opacity: 1; z-index: 1; }
        .hero-img { object-fit: cover; transition: transform 6s ease-out; transform: scale(1.05); }
        .hero-slide.active .hero-img { transform: scale(1); }
        .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 100%); }
        .hero-content { position: absolute; bottom: 15%; left: 5%; right: 5%; z-index: 2; max-width: 800px; padding: 0 clamp(16px, 4vw, 40px); }
        
        /* Text Reveal Animation */
        .text-reveal { display: inline-block; transform: translateY(100%); opacity: 0; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease; }
        .hero-slide.active .text-reveal { transform: translateY(0); opacity: 1; }
        .delay-100 { transition-delay: 0.1s; }
        .delay-200 { transition-delay: 0.2s; }

        .hero-title { font-family: var(--font-display); font-size: clamp(40px, 6vw, 80px); font-weight: 700; line-height: 1.1; text-transform: uppercase; margin-bottom: 8px; overflow: hidden; }
        .hero-subtitle { font-size: clamp(14px, 2vw, 18px); color: var(--text-secondary); margin-bottom: 24px; overflow: hidden; }
        .hero-btn { background: #fff; color: #000; font-weight: 600; padding: 14px 32px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; transition: all 0.2s; cursor: pointer; border: none; }
        .hero-btn:hover { background: var(--accent); }
        
        .slider-nav { position: absolute; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(255,255,255,0.1); backdrop-filter: blur(4px); border: none; color: #fff; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; opacity: 0; }
        .hero-slider-wrap:hover .slider-nav { opacity: 1; }
        .slider-nav:hover { background: var(--accent); color: #000; }
        .slider-nav.left { left: 24px; }
        .slider-nav.right { right: 24px; }
        .slider-dots { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; gap: 8px; z-index: 10; }
        .dot { width: 40px; height: 3px; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: background 0.3s; }
        .dot.active { background: #fff; }

        /* ── Marquee ── */
        .marquee-container { background: var(--accent); color: #000; padding: 12px 0; overflow: hidden; white-space: nowrap; border-top: 1px solid rgba(255,255,255,0.1); }
        .marquee-content { display: inline-block; font-family: var(--font-display); font-weight: 600; font-size: 14px; letter-spacing: 0.1em; animation: marquee 25s linear infinite; }
        .marquee-content span { padding-right: 20px; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33%); } }

        /* ── Toolbar Area ── */
        .shop-toolbar-wrapper { position: sticky; top: 60px; z-index: 40; background: rgba(5,5,5,0.85); backdrop-filter: blur(16px); border-bottom: 1px solid var(--border); padding: 16px clamp(16px, 4vw, 40px); display: flex; flex-direction: column; gap: 16px; }
        @media (min-width: 768px) { .shop-toolbar-wrapper { flex-direction: row; align-items: center; justify-content: space-between; } }
        .cat-bar { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 4px; }
        .cat-bar::-webkit-scrollbar { display: none; }
        .cat-pill { padding: 8px 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 40px; color: var(--text-secondary); font-size: 13px; font-weight: 500; white-space: nowrap; cursor: pointer; transition: all 0.2s; }
        .cat-pill:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .cat-pill.active { background: #fff; color: #000; border-color: #fff; }
        .toolbar-actions { display: flex; gap: 12px; width: 100%; }
        @media (min-width: 768px) { .toolbar-actions { width: auto; } }

        /* ── Search & Filter triggers ── */
        .search-wrap { flex: 1; display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 4px; padding: 0 16px; height: 44px; min-width: 200px; position: relative; transition: border-color 0.2s; }
        .search-wrap.focused { border-color: var(--accent); }
        .search-input { flex: 1; background: transparent; border: none; outline: none; color: #fff; font-size: 14px; }
        .search-clear { background: transparent; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; }
        .search-dropdown { position: absolute; top: calc(100% + 8px); left: 0; right: 0; background: var(--bg-panel); border: 1px solid var(--border); border-radius: 4px; box-shadow: 0 10px 40px rgba(0,0,0,0.8); overflow: hidden; z-index: 50; }
        .search-suggestion { width: 100%; padding: 12px 16px; display: flex; align-items: center; gap: 10px; background: transparent; border: none; border-bottom: 1px solid var(--border); color: var(--text-secondary); font-size: 13px; cursor: pointer; text-align: left; }
        .search-suggestion:last-child { border-bottom: none; }
        .search-suggestion:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .search-suggestion b { color: var(--accent); font-weight: 600; }
        
        .filter-trigger { display: flex; align-items: center; gap: 8px; height: 44px; padding: 0 20px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 4px; color: #fff; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
        .filter-trigger:hover { border-color: var(--accent); }
        .filter-badge { background: var(--accent); color: #000; width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }

        /* ── Grid & Enhanced Product Cards ── */
        .grid-container { padding: 40px clamp(16px, 4vw, 40px); }
        .product-grid { display: grid; gap: 24px; grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 768px) { .product-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; } }
        @media (min-width: 1200px) { .product-grid { grid-template-columns: repeat(4, 1fr); gap: 40px; } }
        
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) backwards; }

        .product-card { 
          display: flex; flex-direction: column; background: var(--bg); cursor: pointer; text-decoration: none;
          border: 1px solid transparent; border-radius: 6px; padding: 8px; transition: all 0.3s ease;
        }
        .product-card:hover {
          border-color: rgba(0, 240, 255, 0.2);
          background: rgba(255,255,255,0.01);
          box-shadow: 0 10px 30px rgba(0, 240, 255, 0.03);
          transform: translateY(-4px);
        }
      .card-img-wrap { position: relative; aspect-ratio: 3/4; background: #111; overflow: hidden; margin-bottom: 16px; border-radius: 4px; }
        .card-img-empty { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 3rem; opacity: 0.1; }
        .badge { padding: 4px 10px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 2px; }
        .badge-error { background: #ff3c50; color: #fff; }
        .badge-accent { background: var(--accent); color: #000; }
        .badge-dark { background: #fff; color: #000; }
        .card-info { padding: 0 4px; }

        .skeleton-card { aspect-ratio: 4/5; background: #111; border-radius: 4px; animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .load-more-bar { padding: 40px 0; text-align: center; color: var(--accent); font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }

        /* ── Filter Drawer Elements ── */
        .filter-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; justify-content: flex-end; }
        .filter-drawer { width: min(400px, 100vw); height: 100vh; background: var(--bg-panel); border-left: 1px solid var(--border); display: flex; flex-direction: column; }
        .drawer-header { padding: 32px 24px 24px; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: flex-start; }
        .drawer-eyebrow { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 4px; }
        .drawer-title { font-size: 24px; font-weight: 700; color: #fff; }
        .drawer-close { width: 36px; height: 36px; border-radius: 4px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
        .drawer-close:hover { background: rgba(255,255,255,0.1); }
        .drawer-scroll { flex: 1; overflow-y: auto; padding: 0 24px; }
        .filter-section { padding: 24px 0; border-bottom: 1px solid var(--border); }
        .filter-section:last-child { border-bottom: none; }
        .filter-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary); margin-bottom: 16px; }
        .condition-grid { display: flex; flex-direction: column; gap: 8px; }
        .condition-btn { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 4px; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .condition-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .condition-btn.active { background: rgba(0,240,255,0.1); border-color: var(--accent); color: #fff; }
        .cond-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--text-secondary); }
        .condition-btn.active .cond-dot { background: var(--accent); }
        .price-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .price-display { font-size: 18px; font-weight: 700; color: #fff; }
        .range-wrap { position: relative; }
        .price-range { -webkit-appearance: none; width: 100%; height: 2px; background: linear-gradient(to right, var(--accent) var(--pct,50%), rgba(255,255,255,0.1) var(--pct,50%)); border-radius: 2px; outline: none; }
        .price-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--accent); cursor: pointer; }
        .range-labels { display: flex; justify-content: space-between; margin-top: 12px; font-size: 11px; color: var(--text-secondary); }
        .sort-grid { display: flex; flex-direction: column; gap: 8px; }
        .sort-btn { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 4px; color: var(--text-secondary); font-size: 13px; cursor: pointer; transition: all 0.2s; }
        .sort-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .sort-btn.active { background: rgba(0,240,255,0.1); border-color: var(--accent); color: #fff; }
        .drawer-actions { padding: 24px; border-top: 1px solid var(--border); display: flex; gap: 12px; }
        .btn-reset { flex: 1; padding: 14px; background: transparent; border: 1px solid var(--border); border-radius: 4px; color: #fff; font-weight: 600; font-size: 13px; cursor: pointer; }
        .btn-apply { flex: 2; padding: 14px; background: #fff; border: none; border-radius: 4px; color: #000; font-weight: 700; font-size: 13px; cursor: pointer; transition: background 0.2s; }
        .btn-apply:hover { background: var(--accent); }
        .wishlist-card-btn {
  position: absolute; top: 10px; right: 10px; z-index: 10;
  width: 32px; height: 32px; border-radius: 50%;
  background: rgba(0,0,0,0.6); backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  color: #fff; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
}
.wishlist-card-btn:hover { background: rgba(255,60,80,0.3); border-color: #ff3c50; color: #ff3c50; }
.wishlist-card-btn svg { color: inherit; transition: transform 0.2s; }
.wishlist-card-btn:hover svg { transform: scale(1.2); }
      `}</style>

      {/* 1. Hero Banners */}
      <HeroSlider />

      {/* 2. Marquee */}
      <Marquee />

      {/* 3. Sticky Toolbar */}
      <div className="shop-toolbar-wrapper">
        <div className="cat-bar">
          <button
            className={`cat-pill ${activeCategory === "All" ? "active" : ""}`}
            onClick={() => {
              setActiveCategory("All");
              setActiveCategoryId("");
            }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              className={`cat-pill ${activeCategory === cat.name ? "active" : ""}`}
              onClick={() => {
                setActiveCategory(cat.name);
                setActiveCategoryId(cat._id);
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="toolbar-actions">
          <SearchBar products={allProducts} onSearch={setSearchQuery} />
          <button
            className="filter-trigger"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontal size={16} /> Filters
            {activeFilterCount > 0 && (
              <span className="filter-badge">{activeFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* 4. Product Grid */}
      <div className="grid-container">
        {!loading && (
          <div
            style={{
              marginBottom: 24,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            Showing {visible.length} of {filtered.length} Results
          </div>
        )}

        <div className="product-grid">
          {loading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <div key={i}>
                <div className="skeleton-card" style={{ marginBottom: 16 }} />
                <div
                  style={{
                    height: 12,
                    background: "#111",
                    width: "66%",
                    marginBottom: 8,
                    borderRadius: 2,
                  }}
                />
                <div
                  style={{
                    height: 16,
                    background: "#111",
                    width: "33%",
                    borderRadius: 2,
                  }}
                />
              </div>
            ))
          ) : visible.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: "120px 0",
                textAlign: "center",
                color: "var(--text-secondary)",
              }}
            >
              <p style={{ fontSize: 24, marginBottom: 8, color: "#fff" }}>
                No gear found.
              </p>
              <p>Try clearing your filters or search term.</p>
            </div>
          ) : (
            visible.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} />
            ))
          )}
        </div>

        <div ref={sentinelRef} style={{ height: "20px" }} />

        {isLoadingMore && <div className="load-more-bar">Loading ...</div>}
        {!hasMore && !loading && visible.length > 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "64px 0",
              color: "rgba(255,255,255,0.2)",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            — End of Collection —
          </div>
        )}
      </div>

      {filterOpen && (
        <FilterSheet
          filters={filters}
          onApply={(f) => setFilters(f)}
          onClose={() => setFilterOpen(false)}
        />
      )}
    </div>
  );
}
