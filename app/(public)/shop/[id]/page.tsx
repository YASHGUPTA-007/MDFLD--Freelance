'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingBag, Heart, Share2, Tag, Package, Layers, Users } from 'lucide-react';
import gsap from 'gsap';
import { useToast } from '@/Components/Toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Product {
    _id: string;
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    condition: 'Brand New' | 'New with Tags' | 'Used - Like New' | 'Used - Good';
    brand?: string;
    team?: string;
    stock: number;
    images: { url: string; public_id: string }[];
    category: { _id: string; name: string; slug: string };
    createdAt: string;
}

const ACCENT = '#00d4b6';

const CONDITION_COLOR: Record<string, string> = {
    'Brand New': '#00d4b6',
    'New with Tags': '#6ee7b7',
    'Used - Like New': '#fbbf24',
    'Used - Good': '#f87171',
};

// ─── Image Carousel ───────────────────────────────────────────────────────────
function ImageCarousel({ images }: { images: { url: string }[] }) {
    const [current, setCurrent] = useState(0);
    const [animating, setAnimating] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);
    const total = images.length;

    const go = useCallback((dir: 'next' | 'prev') => {
        if (animating || total <= 1) return;
        setAnimating(true);

        const next = dir === 'next'
            ? (current + 1) % total
            : (current - 1 + total) % total;

        const el = mainRef.current;
        if (!el) { setCurrent(next); setAnimating(false); return; }

        const xOut = dir === 'next' ? '-8%' : '8%';
        const xIn = dir === 'next' ? '8%' : '-8%';

        gsap.to(el, {
            x: xOut, opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: () => {
                setCurrent(next);
                gsap.fromTo(el, { x: xIn, opacity: 0 }, { x: 0, opacity: 1, duration: 0.28, ease: 'power2.out', onComplete: () => setAnimating(false) });
            }
        });
    }, [animating, current, total]);

    // Keyboard nav
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') go('next');
            if (e.key === 'ArrowLeft') go('prev');
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [go]);

    if (total === 0) return (
        <div style={{ aspectRatio: '3/4', background: '#111d1d', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>
            📦
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

            {/* Main image */}
            <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', background: '#111d1d', aspectRatio: '3/4' }}>
                <div ref={mainRef} style={{ position: 'absolute', inset: 0 }}>
                    <Image
                        src={images[current].url}
                        alt={`Product image ${current + 1}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        style={{ objectFit: 'cover' }}
                    />
                </div>

                {/* Prev / Next arrows */}
                {total > 1 && (
                    <>
                        <button onClick={() => go('prev')} className="carousel-arrow" style={{ left: 14 }} aria-label="Previous image">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => go('next')} className="carousel-arrow" style={{ right: 14 }} aria-label="Next image">
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {/* Counter pill */}
                {total > 1 && (
                    <div style={{
                        position: 'absolute', bottom: 14, right: 14,
                        background: 'rgba(2,6,6,0.75)', backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 100, padding: '4px 12px',
                        fontFamily: "'Barlow', sans-serif", fontSize: 11,
                        fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                        letterSpacing: '0.05em',
                    }}>
                        {current + 1} / {total}
                    </div>
                )}
            </div>

            {/* Thumbnail strip */}
            {total > 1 && (
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }} className="thumb-scroll">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => { if (!animating) setCurrent(i); }}
                            style={{
                                flexShrink: 0,
                                width: 64, height: 80,
                                borderRadius: 8, overflow: 'hidden',
                                border: `2px solid ${i === current ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                                background: '#111d1d', cursor: 'pointer', padding: 0,
                                position: 'relative',
                                transition: 'border-color 0.2s',
                                opacity: i === current ? 1 : 0.55,
                            }}
                        >
                            <Image src={img.url} alt={`Thumb ${i + 1}`} fill sizes="64px" style={{ objectFit: 'cover' }} />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Skeleton() {
    return (
        <div className="pdp-grid" style={{ padding: 'clamp(24px, 5vw, 64px)', gap: 'clamp(24px, 4vw, 64px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="sk" style={{ aspectRatio: '3/4', borderRadius: 16 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                    {[0, 1, 2].map(i => <div key={i} className="sk" style={{ width: 64, height: 80, borderRadius: 8 }} />)}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8 }}>
                <div className="sk" style={{ height: 12, width: '30%', borderRadius: 4 }} />
                <div className="sk" style={{ height: 52, width: '90%', borderRadius: 6 }} />
                <div className="sk" style={{ height: 32, width: '40%', borderRadius: 6 }} />
                <div className="sk" style={{ height: 1, width: '100%' }} />
                {[80, 60, 90, 70].map((w, i) => (
                    <div key={i} className="sk" style={{ height: 12, width: `${w}%`, borderRadius: 4 }} />
                ))}
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [wishlist, setWishlist] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);
    const { showToast, ToastContainer } = useToast();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/products/${id}`)
            .then(r => r.json())
            .then(d => {
                if (d.product) setProduct(d.product);
                else setNotFound(true);
                setLoading(false);
            })
            .catch(() => { setNotFound(true); setLoading(false); });
    }, [id]);

    useEffect(() => {
        if (!product) return;
        fetch('/api/wishlist')
            .then(r => r.json())
            .then(d => {
                if (d.wishlist) setWishlist(d.wishlist.includes(product._id));
            })
            .catch(() => { }); // not logged in — silently ignore
    }, [product]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleWishlist = async () => {
        if (wishlistLoading || !product) return;
        setWishlistLoading(true);
        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product._id }),
            });

            if (res.status === 401) {
                showToast('Login to save items', 'info');
                return;
            }

            const data = await res.json();
            if (!res.ok) { showToast(data.error ?? 'Something went wrong', 'error'); return; }

            setWishlist(data.added);
            showToast(
                data.added ? 'Added to wishlist' : 'Removed from wishlist',
                data.added ? 'wishlist' : 'remove'
            );
        } catch {
            showToast('Something went wrong', 'error');
        } finally {
            setWishlistLoading(false);
        }
    };

    const isOutOfStock = product?.stock === 0;
    const discount = product?.compareAtPrice
        ? Math.round((1 - product.price / product.compareAtPrice) * 100)
        : null;

    const conditionColor = product ? (CONDITION_COLOR[product.condition] ?? ACCENT) : ACCENT;

    return (
        <div style={{ background: '#020606', minHeight: '100vh', color: '#fff', paddingTop: 80 }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .grid-bg {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        /* Two-col layout on desktop */
        .pdp-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(24px, 4vw, 48px);
          padding: clamp(24px, 5vw, 64px);
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (min-width: 900px) {
          .pdp-grid {
            grid-template-columns: 1fr 1fr;
            align-items: start;
          }
        }

        /* Sticky right col on desktop */
        @media (min-width: 900px) {
          .pdp-right { position: sticky; top: 100px; }
        }

        /* Carousel arrows */
        .carousel-arrow {
          position: absolute; top: 50%; transform: translateY(-50%);
          background: rgba(2,6,6,0.75); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12); border-radius: 50%;
          width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #fff; transition: all 0.2s; z-index: 10;
        }
        .carousel-arrow:hover { background: rgba(0,212,182,0.15); border-color: ${ACCENT}; color: ${ACCENT}; }

        /* Thumb scrollbar */
        .thumb-scroll::-webkit-scrollbar { display: none; }

        /* Divider */
        .divider { height: 1px; background: rgba(255,255,255,0.06); margin: 24px 0; }

        /* Meta row */
        .meta-pill {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px; padding: 8px 14px;
          font-family: 'Barlow', sans-serif; font-size: 12px; color: rgba(255,255,255,0.65);
        }
        .meta-pill svg { color: ${ACCENT}; flex-shrink: 0; }

        /* CTA buttons */
        .btn-primary {
          width: 100%; padding: 16px;
          background: ${ACCENT}; border: none; border-radius: 10px;
          font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 900;
          letter-spacing: 0.12em; text-transform: uppercase; color: #020606;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-primary:hover:not(:disabled) { background: #00f0cf; box-shadow: 0 0 24px rgba(0,212,182,0.35); }
        .btn-primary:disabled { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); cursor: not-allowed; }

        .btn-secondary {
          width: 100%; padding: 16px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
          font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 900;
          letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.7);
          cursor: pointer; transition: all 0.2s;
        }
        .btn-secondary:hover { border-color: rgba(255,255,255,0.25); color: #fff; }

        .btn-icon {
          width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.2s; color: rgba(255,255,255,0.6);
        }
        .btn-icon:hover { border-color: rgba(255,255,255,0.25); color: #fff; }
        .btn-icon.active { background: rgba(255,60,80,0.12); border-color: rgba(255,60,80,0.4); color: #ff3c50; }

        /* Back btn */
        .back-btn {
          display: inline-flex; align-items: center; gap: 8px;
          background: none; border: none; cursor: pointer;
          font-family: 'Barlow', sans-serif; font-size: 12px; font-weight: 600;
          letter-spacing: 0.12em; text-transform: uppercase; color: rgba(255,255,255,0.4);
          transition: color 0.2s; padding: 0;
        }
        .back-btn:hover { color: #fff; }

        /* Skeleton */
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .sk {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
          background-size: 400px 100%; animation: shimmer 1.4s ease infinite;
        }

        /* Stock badge */
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .stock-dot { width: 6px; height: 6px; border-radius: 50%; animation: pulse-dot 2s ease infinite; }

        /* Description */
        .desc-text {
          font-family: 'Barlow', sans-serif; font-size: 14px; line-height: 1.75;
          color: rgba(255,255,255,0.55); white-space: pre-wrap;
        }
      `}</style>

            <div className="grid-bg" />

            <div style={{ position: 'relative', zIndex: 10 }}>

                {/* ── Back nav ── */}
                <div style={{ padding: 'clamp(16px, 3vw, 32px) clamp(24px, 5vw, 64px) 0', maxWidth: 1200, margin: '0 auto' }}>
                    <button className="back-btn" onClick={() => router.back()}>
                        <ArrowLeft size={14} />
                        Back to shop
                    </button>
                </div>

                {/* ── Loading ── */}
                {loading && <Skeleton />}

                {/* ── Not found ── */}
                {notFound && !loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px', gap: 16 }}>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, fontWeight: 900, color: 'rgba(255,255,255,0.1)' }}>404</div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Product not found</div>
                        <button className="back-btn" style={{ marginTop: 8 }} onClick={() => router.push('/shop')}>
                            <ArrowLeft size={14} /> Go to shop
                        </button>
                    </div>
                )}

                {/* ── Product ── */}
                {product && !loading && (
                    <div className="pdp-grid">

                        {/* ─ LEFT: Images ─ */}
                        <div>
                            <ImageCarousel images={product.images} />
                        </div>

                        {/* ─ RIGHT: Details ─ */}
                        <div className="pdp-right" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                            {/* Breadcrumb / category */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: ACCENT }}>
                                    {product.category?.name ?? 'Product'}
                                </span>
                                {product.brand && (
                                    <>
                                        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10 }}>·</span>
                                        <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>
                                            {product.brand}
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* Title */}
                            <h1 style={{
                                fontFamily: "'Barlow Condensed', sans-serif",
                                fontSize: 'clamp(32px, 5vw, 52px)',
                                fontWeight: 900, textTransform: 'uppercase',
                                lineHeight: 1, letterSpacing: '-0.01em',
                                color: '#fff', margin: '0 0 20px',
                            }}>
                                {product.title}
                            </h1>

                            {/* Price */}
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
                                <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 900, color: '#fff' }}>
                                    £{product.price}
                                </span>
                                {product.compareAtPrice && (
                                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>
                                        £{product.compareAtPrice}
                                    </span>
                                )}
                                {discount && (
                                    <span style={{
                                        fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 900,
                                        color: ACCENT, background: 'rgba(0,212,182,0.12)',
                                        border: `1px solid rgba(0,212,182,0.25)`, borderRadius: 5, padding: '3px 10px',
                                    }}>
                                        -{discount}%
                                    </span>
                                )}
                            </div>

                            {/* Condition + stock */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                                <div style={{
                                    background: 'rgba(2,6,6,0.8)', border: `1px solid ${conditionColor}`,
                                    borderRadius: 5, padding: '5px 12px',
                                    fontFamily: "'Barlow', sans-serif", fontSize: 11, fontWeight: 700,
                                    letterSpacing: '0.15em', textTransform: 'uppercase', color: conditionColor,
                                }}>
                                    {product.condition}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div className="stock-dot" style={{ background: isOutOfStock ? '#f87171' : '#00d4b6' }} />
                                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: isOutOfStock ? '#f87171' : 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.08em' }}>
                                        {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
                                    </span>
                                </div>
                            </div>

                            <div className="divider" />

                            {/* Description */}
                            <div style={{ marginBottom: 24 }}>
                                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 10 }}>
                                    Description
                                </div>
                                <p className="desc-text">{product.description}</p>
                            </div>

                            <div className="divider" />

                            {/* Meta pills */}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
                                <div className="meta-pill">
                                    <Tag size={13} />
                                    <span>{product.category?.name}</span>
                                </div>
                                {product.brand && (
                                    <div className="meta-pill">
                                        <Layers size={13} />
                                        <span>{product.brand}</span>
                                    </div>
                                )}
                                {product.team && (
                                    <div className="meta-pill">
                                        <Users size={13} />
                                        <span>{product.team}</span>
                                    </div>
                                )}
                                <div className="meta-pill">
                                    <Package size={13} />
                                    <span>{product.condition}</span>
                                </div>
                            </div>

                            {/* CTA row */}
                            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                                <button className="btn-primary" disabled={isOutOfStock}>
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                                        <ShoppingBag size={16} />
                                        {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                                    </span>
                                </button>
                                <button
                                    className={`btn-icon${wishlist ? ' active' : ''}`}
                                    onClick={handleWishlist}
                                    disabled={wishlistLoading}
                                    aria-label="Wishlist"
                                    style={{ opacity: wishlistLoading ? 0.6 : 1, transition: 'opacity 0.2s' }}
                                >
                                    <Heart
                                        size={18}
                                        fill={wishlist ? '#ff3c50' : 'none'}
                                        style={{ transition: 'fill 0.2s, transform 0.2s', transform: wishlist ? 'scale(1.15)' : 'scale(1)' }}
                                    />
                                </button>
                                <button
                                    className="btn-icon"
                                    onClick={handleShare}
                                    aria-label="Share"
                                    title={copied ? 'Copied!' : 'Copy link'}
                                >
                                    <Share2 size={16} style={{ color: copied ? ACCENT : undefined }} />
                                </button>
                            </div>

                            {/* Notify if OOS */}
                            {isOutOfStock && (
                                <button className="btn-secondary">Notify When Available</button>
                            )}

                            {/* Trust strip */}
                            <div style={{ marginTop: 24, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {[
                                    '✓ Authentic Guaranteed',
                                    '✓ Secure Checkout',
                                    '✓ Fast Dispatch',
                                ].map(t => (
                                    <span key={t} style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase' }}>
                                        {t}
                                    </span>
                                ))}
                            </div>

                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}