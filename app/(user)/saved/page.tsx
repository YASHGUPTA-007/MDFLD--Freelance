'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Sparkles } from 'lucide-react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';
import { useToast } from '@/Components/Toast';

// ─── Types ────────────────────────────────────────────────────────────────────
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

const ACCENT = '#00f0ff';

// ─── Saved Product Card ───────────────────────────────────────────────────────
function SavedCard({ product, onRemove }: { product: Product; onRemove: (id: string) => void }) {
  const [removing, setRemoving] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const imageUrl = product.images?.[0]?.url;
  const isOOS = product.stock === 0;
  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  const handleRemove = () => {
    if (removing || !cardRef.current) return;
    setRemoving(true);
    gsap.to(cardRef.current, {
      scale: 0.9,
      opacity: 0,
      x: -50,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => onRemove(product._id),
    });
  };

  return (
    <div ref={cardRef} className="saved-card group">
      <Link href={`/shop/${product._id}`} className="card-image-section">
        <div className="card-img-container">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              sizes="300px"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="card-img-empty">📦</div>
          )}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {isOOS && <span className="badge badge-error">Sold Out</span>}
            {discount && !isOOS && <span className="badge badge-accent">-{discount}%</span>}
          </div>
        </div>
      </Link>

      <div className="card-content">
        <Link href={`/shop/${product._id}`} className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                  {product.brand || 'Apparel'}
                </span>
                <span className="text-white/20">•</span>
                <span className="text-[10px] uppercase tracking-wider text-accent">
                  {product.category?.name}
                </span>
              </div>
              <h3 className="text-base font-semibold text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                {product.title}
              </h3>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full mb-3">
                <div className={`w-1.5 h-1.5 rounded-full ${isOOS ? 'bg-red-500' : 'bg-accent'}`} />
                <span className="text-[10px] uppercase tracking-wide text-white/60 font-semibold">
                  {product.condition}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl font-bold text-white font-['Oswald'] tracking-wide">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm text-white/40 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
        </Link>

        <div className="flex gap-2">
          <button className="btn-primary flex-1" disabled={isOOS}>
            <ShoppingBag size={18} />
            {isOOS ? 'Out of Stock' : 'Add to Bag'}
          </button>
          <button
            className="btn-remove"
            onClick={handleRemove}
            disabled={removing}
            aria-label="Remove from saved"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState() {
  const router = useRouter();
  return (
    <div className="empty-container">
      <div className="empty-icon">
        <Heart size={64} className="text-white/10" />
      </div>
      <h2 className="empty-title">Your Collection is Empty</h2>
      <p className="empty-subtitle">Start building your dream lineup by saving your favorite gear</p>
      <button className="empty-cta" onClick={() => router.push('/shop')}>
        <Sparkles size={18} />
        Explore the Shop
      </button>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SavedSkeleton() {
  return (
    <div className="saved-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="saved-card">
<div className="sk aspect-[3/4] rounded-lg mb-4" />
          <div className="card-content">
            <div className="sk h-3 w-1/3 rounded mb-2" />
            <div className="sk h-5 w-full rounded mb-2" />
            <div className="sk h-5 w-3/4 rounded mb-3" />
            <div className="sk h-4 w-1/4 rounded mb-4" />
            <div className="flex gap-2">
              <div className="sk h-12 flex-1 rounded" />
              <div className="sk h-12 w-12 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Saved Page ──────────────────────────────────────────────────────────
export default function SavedPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchSavedProducts();
  }, []);

  const fetchSavedProducts = async () => {
    try {
      const res = await fetch('/api/wishlist');
      if (res.status === 401) {
        // Not logged in — just show empty state
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to fetch saved products:', error);
      showToast('Failed to load saved items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p._id !== productId));
        showToast('Removed from saved', 'remove');
      }
    } catch (error) {
      console.error('Failed to remove product:', error);
      showToast('Failed to remove item', 'error');
    }
  };

  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const totalSavings = products.reduce((sum, p) => {
    if (p.compareAtPrice) return sum + (p.compareAtPrice - p.price);
    return sum;
  }, 0);

  return (
    <div className="saved-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@500;600;700&display=swap');

        :root {
          --bg: #050505;
          --bg-panel: #0f0f0f;
          --border: rgba(255,255,255,0.08);
          --accent: ${ACCENT};
          --text-primary: #ffffff;
          --text-secondary: #a0a0a0;
        }

        .saved-page {
          background: var(--bg);
          min-height: 100vh;
          color: var(--text-primary);
          font-family: 'Inter', sans-serif;
          padding-top: 80px;
          position: relative;
        }

        @keyframes panGrid {
          0% { transform: translateY(0); }
          100% { transform: translateY(56px); }
        }
        .saved-page::before {
          content: '';
          position: fixed;
          top: -56px; left: 0; right: 0; bottom: -56px;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 56px 56px;
          animation: panGrid 20s linear infinite;
          mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
        }

        .content-wrapper {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(24px, 5vw, 64px);
        }

        .page-header { margin-bottom: 48px; }

        .back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: rgba(255,255,255,0.4);
          background: transparent; border: none; cursor: pointer;
          transition: color 0.2s; margin-bottom: 32px; padding: 0;
        }
        .back-btn:hover { color: #fff; }

        .page-title-section {
          display: flex; justify-content: space-between;
          align-items: flex-start; flex-wrap: wrap; gap: 24px;
        }

        .title-content h1 {
          font-family: 'Oswald', sans-serif;
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 700; text-transform: uppercase;
          line-height: 1.1; margin-bottom: 8px;
          background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .title-content p { color: var(--text-secondary); font-size: 14px; }

        .stats-grid { display: flex; gap: 24px; flex-wrap: wrap; }

        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--border);
          border-radius: 12px; padding: 16px 24px; min-width: 140px;
        }
        .stat-label {
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: 0.1em; color: var(--text-secondary); margin-bottom: 4px;
        }
        .stat-value { font-family: 'Oswald', sans-serif; font-size: 24px; font-weight: 700; color: #fff; }
        .stat-value.accent { color: var(--accent); }

        .saved-grid {
          display: grid; gap: 24px; grid-template-columns: 1fr;
        }
        @media (min-width: 640px) { .saved-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .saved-grid { grid-template-columns: repeat(3, 1fr); gap: 32px; } }

        .saved-card {
          background: var(--bg-panel); border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .saved-card:hover {
          border-color: rgba(0, 240, 255, 0.3);
          box-shadow: 0 8px 32px rgba(0, 240, 255, 0.1);
          transform: translateY(-4px);
        }

        .card-image-section { display: block; text-decoration: none; }

      .card-img-container {
  position: relative; aspect-ratio: 3/4;
  background: #111; overflow: hidden;
}
        .card-img-empty {
          position: absolute; inset: 0; display: flex;
          align-items: center; justify-content: center;
          font-size: 3rem; opacity: 0.1;
        }

        .badge {
          padding: 4px 10px; font-size: 10px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em; border-radius: 4px;
        }
        .badge-error { background: #ff3c50; color: #fff; }
        .badge-accent { background: var(--accent); color: #000; }

        .card-content { padding: 20px; display: flex; flex-direction: column; }

        .btn-primary {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 12px 20px; background: var(--accent); border: none;
          border-radius: 8px; color: #000; font-weight: 700; font-size: 13px;
          text-transform: uppercase; letter-spacing: 0.05em;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          background: #00fff5;
          box-shadow: 0 4px 20px rgba(0, 240, 255, 0.3);
        }
        .btn-primary:disabled {
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.3); cursor: not-allowed;
        }

        .btn-remove {
          width: 48px; height: 48px; flex-shrink: 0;
          background: rgba(255, 60, 80, 0.1);
          border: 1px solid rgba(255, 60, 80, 0.2);
          border-radius: 8px; color: #ff3c50;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-remove:hover:not(:disabled) {
          background: rgba(255, 60, 80, 0.2);
          border-color: #ff3c50; transform: scale(1.05);
        }
        .btn-remove:disabled { opacity: 0.5; cursor: not-allowed; }

        .empty-container {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 120px 24px; text-align: center;
        }
        .empty-icon { margin-bottom: 24px; opacity: 0.5; }
        .empty-title {
          font-family: 'Oswald', sans-serif; font-size: 32px; font-weight: 700;
          text-transform: uppercase; margin-bottom: 12px; color: rgba(255,255,255,0.8);
        }
        .empty-subtitle { color: var(--text-secondary); font-size: 15px; margin-bottom: 32px; max-width: 400px; }
        .empty-cta {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 16px 32px; background: var(--accent); border: none;
          border-radius: 8px; color: #000; font-weight: 700; font-size: 14px;
          text-transform: uppercase; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s;
        }
        .empty-cta:hover {
          background: #00fff5;
          box-shadow: 0 4px 20px rgba(0, 240, 255, 0.4);
          transform: translateY(-2px);
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .sk {
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0.02) 25%,
            rgba(255,255,255,0.06) 50%,
            rgba(255,255,255,0.02) 75%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      <div className="content-wrapper">
        <div className="page-header">
          <button className="back-btn" onClick={() => router.back()}>
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="page-title-section">
            <div className="title-content">
              <h1>Saved Collection</h1>
              <p>Your curated selection of favorite gear</p>
            </div>

            {!loading && products.length > 0 && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Items</div>
                  <div className="stat-value">{products.length}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Value</div>
                  <div className="stat-value accent">${totalValue.toFixed(2)}</div>
                </div>
                {totalSavings > 0 && (
                  <div className="stat-card">
                    <div className="stat-label">Potential Savings</div>
                    <div className="stat-value accent">${totalSavings.toFixed(2)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {loading && <SavedSkeleton />}
        {!loading && products.length === 0 && <EmptyState />}
        {!loading && products.length > 0 && (
          <div className="saved-grid">
            {products.map((product) => (
              <SavedCard key={product._id} product={product} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}