'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, ArrowLeft, ShoppingBag, Heart, Share2, Tag, Package, Layers, Users, Sparkles } from 'lucide-react';
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

        // Added a slight scale down and blur for a more dramatic, fluid switch
        const xOut = dir === 'next' ? '-15%' : '15%';
        const xIn = dir === 'next' ? '15%' : '-15%';

        gsap.to(el, {
            x: xOut, scale: 0.95, opacity: 0, filter: 'blur(4px)', duration: 0.3, ease: 'power2.inOut', onComplete: () => {
                setCurrent(next);
                gsap.fromTo(el, 
                    { x: xIn, scale: 1.05, opacity: 0, filter: 'blur(8px)' }, 
                    { x: 0, scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.4, ease: 'power3.out', onComplete: () => setAnimating(false) }
                );
            }
        });
    }, [animating, current, total]);

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') go('next');
            if (e.key === 'ArrowLeft') go('prev');
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [go]);

    if (total === 0) return (
        <div className="empty-state-box">📦</div>
    );

    return (
        <div className="carousel-wrapper">
            {/* Main image */}
            <div className="main-image-container group">
                {/* Subtle background glow mimicking the image */}
                <div className="absolute inset-0 bg-accent/20 blur-[100px] -z-10 transition-opacity duration-700 opacity-50 group-hover:opacity-80"></div>
                
                <div ref={mainRef} className="absolute inset-0">
                    <Image
                        src={images[current].url}
                        alt={`Product image ${current + 1}`}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                </div>

                {/* Glassmorphic Controls */}
                {total > 1 && (
                    <>
                        <button onClick={() => go('prev')} className="carousel-arrow left-4" aria-label="Previous image">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={() => go('next')} className="carousel-arrow right-4" aria-label="Next image">
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}

                {total > 1 && (
                    <div className="carousel-counter">
                        {current + 1} / {total}
                    </div>
                )}
            </div>

            {/* Thumbnail strip */}
            {total > 1 && (
                <div className="thumb-scroll">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => { if (!animating) setCurrent(i); }}
                            className={`thumb-btn ${i === current ? 'active' : ''}`}
                        >
                            <Image src={img.url} alt={`Thumb ${i + 1}`} fill sizes="64px" className="object-cover" />
                            {i !== current && <div className="absolute inset-0 bg-black/40 hover:bg-black/10 transition-colors"></div>}
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
        <div className="pdp-grid pt-10">
            <div className="flex flex-col gap-4">
                <div className="sk aspect-[3/4] rounded-2xl" />
                <div className="flex gap-3">
                    {[0, 1, 2].map(i => <div key={i} className="sk w-16 h-20 rounded-xl" />)}
                </div>
            </div>
            <div className="flex flex-col gap-6 pt-4">
                <div className="sk h-4 w-1/3 rounded" />
                <div className="sk h-14 w-11/12 rounded-lg" />
                <div className="sk h-10 w-2/5 rounded-lg" />
                <div className="sk h-[1px] w-full" />
                {[80, 65, 90, 70].map((w, i) => (
                    <div key={i} className="sk h-3 rounded" style={{ width: `${w}%` }} />
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

    // Entrance Animation Ref
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!id) return;
        // Simulating fetch for preview, replace with actual endpoint
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
            .catch(() => { });
    }, [product]);

    // Trigger Entrance Animations when product loads
    useEffect(() => {
        if (product && !loading && contentRef.current) {
            const elements = contentRef.current.querySelectorAll('.stagger-animate');
            gsap.fromTo(elements, 
                { y: 30, opacity: 0, filter: 'blur(4px)' }, 
                { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.08, duration: 0.8, ease: 'power3.out', delay: 0.1 }
            );

            gsap.fromTo('.carousel-wrapper',
                { scale: 0.95, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1, ease: 'expo.out' }
            );
        }
    }, [product, loading]);

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
        const data = await res.json();
        if (res.ok) {
            setWishlist(data.added);
            showToast(data.added ? 'Added to wishlist' : 'Removed from wishlist', data.added ? 'wishlist' : 'remove');
        } else if (res.status === 401) {
            showToast('Please log in to save items', 'error');
        }
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
        <div className="page-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
                
                :root {
                    --bg-dark: #020606;
                    --bg-panel: #0a1111;
                    --accent: ${ACCENT};
                    --accent-glow: rgba(0, 212, 182, 0.4);
                }

                *, *::before, *::after { box-sizing: border-box; }

                .page-wrapper {
                    background: var(--bg-dark);
                    min-height: 100vh;
                    color: #fff;
                    padding-top: 80px;
                    position: relative;
                    overflow: hidden;
                }

                /* Animated Grid Background for continuous "alive" feel */
                @keyframes panGrid {
                    0% { transform: translateY(0); }
                    100% { transform: translateY(56px); }
                }
                .grid-bg {
                    position: fixed; top: -56px; left: 0; right: 0; bottom: -56px;
                    z-index: 0; pointer-events: none;
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
                    background-size: 56px 56px;
                    animation: panGrid 20s linear infinite;
                    mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
                    -webkit-mask-image: linear-gradient(to bottom, transparent, black 20%, black 80%, transparent);
                }

                /* Layout */
                .content-layer { position: relative; z-index: 10; max-width: 1280px; margin: 0 auto; }
                
                .pdp-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: clamp(32px, 5vw, 64px);
                    padding: clamp(24px, 5vw, 64px);
                }
                @media (min-width: 960px) {
                    .pdp-grid { grid-template-columns: 1fr 1.1fr; align-items: start; }
                    .pdp-right { position: sticky; top: 120px; }
                }

                /* Carousel Styling */
                .carousel-wrapper { display: flex; flex-direction: column; gap: 16px; opacity: 0; }
                .main-image-container {
                    position: relative; border-radius: 20px; overflow: hidden; background: var(--bg-panel);
                    aspect-ratio: 3/4; border: 1px solid rgba(255,255,255,0.05);
                }
                .carousel-arrow {
                    position: absolute; top: 50%; transform: translateY(-50%);
                    background: rgba(10, 17, 17, 0.6); backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 50px;
                    width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; color: #fff; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); z-index: 10;
                }
                .carousel-arrow:hover { 
                    background: rgba(0,212,182,0.2); border-color: var(--accent); color: var(--accent); 
                    box-shadow: 0 0 20px var(--accent-glow); scale: 1.1;
                }
                .carousel-counter {
                    position: absolute; bottom: 16px; right: 16px;
                    background: rgba(10, 17, 17, 0.6); backdrop-filter: blur(12px);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 100px; padding: 6px 16px;
                    font-family: 'Barlow', sans-serif; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.9);
                    letter-spacing: 0.05em; z-index: 10;
                }
                .thumb-scroll { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
                .thumb-scroll::-webkit-scrollbar { display: none; }
                .thumb-btn {
                    flex-shrink: 0; width: 72px; height: 90px; border-radius: 12px; overflow: hidden;
                    border: 2px solid transparent; background: var(--bg-panel); cursor: pointer; padding: 0;
                    position: relative; transition: all 0.3s ease;
                }
                .thumb-btn.active { border-color: var(--accent); box-shadow: 0 0 15px rgba(0,212,182,0.3); }
                .thumb-btn:not(.active) { opacity: 0.6; }
                .thumb-btn:hover:not(.active) { opacity: 1; transform: translateY(-2px); }

                /* Typography & Details */
                .overline-text {
                    font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 700;
                    letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent);
                }
                .product-title {
                    font-family: 'Barlow Condensed', sans-serif; font-size: clamp(36px, 5vw, 64px);
                    font-weight: 900; text-transform: uppercase; line-height: 0.95; letter-spacing: -0.02em;
                    color: #fff; margin: 0 0 24px;
                    text-shadow: 0 4px 20px rgba(0,0,0,0.5);
                }
                .price-tag {
                    font-family: 'Barlow Condensed', sans-serif; font-size: 42px; font-weight: 900; color: #fff;
                    display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
                }
                .discount-badge {
                    font-size: 16px; color: #020606; background: var(--accent); border-radius: 6px; padding: 4px 12px;
                    box-shadow: 0 0 15px var(--accent-glow);
                }

                /* Divider */
                .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); margin: 32px 0; }

                /* Meta Pills */
                .meta-pill {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 8px; padding: 10px 16px;
                    font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8);
                    transition: all 0.3s ease;
                }
                .meta-pill:hover { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }
                .meta-pill svg { color: var(--accent); }

                /* Buttons */
                .btn-primary {
                    flex: 1; padding: 18px; position: relative; overflow: hidden;
                    background: var(--accent); border: none; border-radius: 12px;
                    font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 900;
                    letter-spacing: 0.12em; text-transform: uppercase; color: #020606;
                    cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .btn-primary::after {
                    content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    transform: skewX(-20deg); transition: all 0.5s;
                }
                .btn-primary:hover:not(:disabled) { 
                    background: #00f0cf; box-shadow: 0 8px 30px rgba(0,212,182,0.4); transform: translateY(-2px); 
                }
                .btn-primary:hover::after { left: 150%; }
                .btn-primary:disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.2); cursor: not-allowed; }

                .btn-icon {
                    width: 60px; height: 60px; border-radius: 12px; flex-shrink: 0;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); color: rgba(255,255,255,0.6);
                }
                .btn-icon:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); color: #fff; transform: translateY(-2px); }
                .btn-icon.active { background: rgba(255,60,80,0.1); border-color: rgba(255,60,80,0.4); color: #ff3c50; box-shadow: 0 4px 20px rgba(255,60,80,0.2); }

                /* Status & Dots */
                @keyframes pulse-dot { 0% {box-shadow: 0 0 0 0 rgba(0,212,182,0.4)} 70% {box-shadow: 0 0 0 8px transparent} 100% {box-shadow: 0 0 0 0 transparent} }
                @keyframes pulse-dot-red { 0% {box-shadow: 0 0 0 0 rgba(248,113,113,0.4)} 70% {box-shadow: 0 0 0 8px transparent} 100% {box-shadow: 0 0 0 0 transparent} }
                .stock-dot { width: 8px; height: 8px; border-radius: 50%; }
                .stock-dot.in-stock { background: var(--accent); animation: pulse-dot 2s infinite; }
                .stock-dot.out-of-stock { background: #f87171; animation: pulse-dot-red 2s infinite; }

                /* Skeletons */
                @keyframes shimmer { 0%{background-position:-1000px 0} 100%{background-position:1000px 0} }
                .sk {
                    background: linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0.02) 75%);
                    background-size: 1000px 100%; animation: shimmer 2s infinite linear;
                }
            `}</style>

            <div className="grid-bg" />

            <div className="content-layer">
                {/* ── Back nav ── */}
                <div style={{ padding: '0 clamp(24px, 5vw, 64px)' }}>
                    <button className="flex items-center gap-2 text-[12px] font-bold tracking-[0.1em] uppercase text-white/40 hover:text-white transition-colors" onClick={() => router.back()}>
                        <ArrowLeft size={16} /> Back to shop
                    </button>
                </div>

                {loading && <Skeleton />}

                {notFound && !loading && (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <div className="text-8xl font-black font-['Barlow_Condensed'] text-white/5">404</div>
                        <div className="text-2xl font-bold font-['Barlow_Condensed'] uppercase tracking-widest text-white/40">Item M.I.A.</div>
                        <button className="mt-4 flex items-center gap-2 text-accent border border-accent/20 px-6 py-3 rounded-lg hover:bg-accent/10 transition-colors" onClick={() => router.push('/shop')}>
                            <ArrowLeft size={14} /> Return to Grid
                        </button>
                    </div>
                )}

                {product && !loading && (
                    <div className="pdp-grid" ref={contentRef}>
                        {/* ─ LEFT: Images ─ */}
                        <div>
                            <ImageCarousel images={product.images} />
                        </div>

                        {/* ─ RIGHT: Details ─ */}
                        <div className="pdp-right flex flex-col">
                            
                            <div className="stagger-animate flex items-center gap-2 mb-4">
                                <span className="overline-text flex items-center gap-1">
                                    <Sparkles size={12} /> {product.category?.name ?? 'Product'}
                                </span>
                                {product.brand && (
                                    <>
                                        <span className="text-white/20 text-[10px]">•</span>
                                        <span className="overline-text text-white/50">{product.brand}</span>
                                    </>
                                )}
                            </div>

                            <h1 className="stagger-animate product-title">{product.title}</h1>

                            <div className="stagger-animate price-tag">
                                <span>${product.price}</span>
                                {product.compareAtPrice && (
                                    <span className="text-2xl text-white/30 line-through font-normal">${product.compareAtPrice}</span>
                                )}
                                {discount && (
                                    <span className="discount-badge">SAVE {discount}%</span>
                                )}
                            </div>

                            <div className="stagger-animate flex items-center gap-4 mb-8">
                                <div style={{
                                    background: 'rgba(2,6,6,0.8)', border: `1px solid ${conditionColor}`,
                                    borderRadius: '6px', padding: '6px 14px',
                                    fontFamily: "'Barlow', sans-serif", fontSize: '12px', fontWeight: 700,
                                    letterSpacing: '0.15em', textTransform: 'uppercase', color: conditionColor,
                                    boxShadow: `0 0 10px ${conditionColor}33`
                                }}>
                                    {product.condition}
                                </div>
                                <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                                    <div className={`stock-dot ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`} />
                                    <span className="font-['Barlow'] text-xs font-semibold tracking-wider text-white/60">
                                        {isOutOfStock ? 'OUT OF STOCK' : `${product.stock} IN VAULT`}
                                    </span>
                                </div>
                            </div>

                            <div className="stagger-animate divider" />

                            <div className="stagger-animate mb-6">
                                <div className="overline-text mb-3 text-white/40">The Details</div>
                                <p className="font-['Barlow'] text-[15px] leading-relaxed text-white/60 whitespace-pre-wrap">
                                    {product.description}
                                </p>
                            </div>

                            <div className="stagger-animate divider" />

                            <div className="stagger-animate flex flex-wrap gap-3 mb-10">
                                <div className="meta-pill"><Tag size={16} /> <span>{product.category?.name}</span></div>
                                {product.brand && <div className="meta-pill"><Layers size={16} /> <span>{product.brand}</span></div>}
                                {product.team && <div className="meta-pill"><Users size={16} /> <span>{product.team}</span></div>}
                                <div className="meta-pill"><Package size={16} /> <span>{product.condition}</span></div>
                            </div>

                            {/* CTA Actions */}
                            <div className="stagger-animate flex gap-3 mb-4">
                                <button className="btn-primary" disabled={isOutOfStock}>
                                    <span className="flex items-center justify-center gap-3">
                                        <ShoppingBag size={20} />
                                        {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
                                    </span>
                                </button>
                                <button className={`btn-icon ${wishlist ? 'active' : ''}`} onClick={handleWishlist} disabled={wishlistLoading} aria-label="Wishlist">
                                    <Heart size={22} fill={wishlist ? 'currentColor' : 'none'} className={wishlist ? 'scale-110 transition-transform' : ''} />
                                </button>
                                <button className="btn-icon" onClick={handleShare} aria-label="Share">
                                    <Share2 size={20} style={{ color: copied ? ACCENT : undefined }} />
                                </button>
                            </div>

                            {isOutOfStock && (
                                <button className="stagger-animate w-full p-4 mt-2 bg-white/5 border border-white/10 rounded-xl font-['Barlow_Condensed'] text-lg font-black tracking-[0.1em] uppercase text-white/70 hover:bg-white/10 transition-colors">
                                    Notify When Available
                                </button>
                            )}

                            {/* Trust Badges */}
                            <div className="stagger-animate mt-8 flex gap-6 flex-wrap justify-center sm:justify-start">
                                {['Authentic Guaranteed', 'Secure Checkout', 'Fast Dispatch'].map(t => (
                                    <span key={t} className="flex items-center gap-1.5 font-['Barlow'] text-[11px] font-bold tracking-wider text-white/30 uppercase">
                                        <span className="text-accent">✓</span> {t}
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