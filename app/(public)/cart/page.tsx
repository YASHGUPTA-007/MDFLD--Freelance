'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowLeft, ArrowRight, Shield, Truck, RotateCcw, Zap, ChevronDown } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface CartItem {
  id: string;
  title: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  condition: string;
  size?: string;
  quantity: number;
  image?: string;
  category?: string;
}

// ─── Static Demo Data ─────────────────────────────────────────────────────────
const DEMO_ITEMS: CartItem[] = [
  {
    id: '1',
    title: 'Nike Air Zoom Pegasus 40 Running Shoes',
    brand: 'Nike',
    price: 89.99,
    compareAtPrice: 130.00,
    condition: 'Used - Like New',
    size: 'UK 10',
    quantity: 1,
    category: 'Running',
  },
  {
    id: '2',
    title: 'Adidas Predator Elite Firm Ground Boots',
    brand: 'Adidas',
    price: 149.00,
    compareAtPrice: 220.00,
    condition: 'Brand New',
    size: 'UK 9',
    quantity: 1,
    category: 'Football',
  },
  {
    id: '3',
    title: 'Under Armour HeatGear Compression Top',
    brand: 'Under Armour',
    price: 34.50,
    condition: 'New with Tags',
    size: 'L',
    quantity: 2,
    category: 'Training',
  },
];

const PROMO_CODES: Record<string, number> = {
  'SPORT20': 20,
  'SAVE10': 10,
  'NEWBIE': 15,
};

const COND_MAP: Record<string, { label: string; color: string }> = {
  'Brand New':       { label: 'Brand New',   color: '#00d4b6' },
  'New with Tags':   { label: 'New w/ Tags', color: '#a3e635' },
  'Used - Like New': { label: 'Like New',    color: '#facc15' },
  'Used - Good':     { label: 'Good',        color: '#fb923c' },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [displayed, setDisplayed] = useState(value);
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current === value) return;
    const start = prevRef.current;
    const end = value;
    const duration = 400;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayed(start + (end - start) * ease);
      if (progress < 1) requestAnimationFrame(animate);
      else { setDisplayed(end); prevRef.current = end; }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{prefix}{displayed.toFixed(2)}</>;
}

// ─── Cart Item Row ─────────────────────────────────────────────────────────────
function CartItemRow({
  item, onQty, onRemove, index
}: {
  item: CartItem;
  onQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  index: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateX(-20px)';
    const t = setTimeout(() => {
      el.style.transition = `opacity 0.45s ease ${index * 0.07}s, transform 0.45s cubic-bezier(0.22,1,0.36,1) ${index * 0.07}s`;
      el.style.opacity = '1';
      el.style.transform = 'translateX(0)';
    }, 30);
    return () => clearTimeout(t);
  }, [index]);

  const handleRemove = () => {
    setRemoving(true);
    const el = rowRef.current;
    if (el) {
      el.style.transition = 'opacity 0.3s ease, transform 0.3s ease, max-height 0.4s ease 0.2s, margin 0.4s ease 0.2s, padding 0.4s ease 0.2s';
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px) scale(0.97)';
      setTimeout(() => {
        el.style.maxHeight = '0';
        el.style.marginBottom = '0';
        el.style.overflow = 'hidden';
      }, 280);
      setTimeout(() => onRemove(item.id), 650);
    } else {
      onRemove(item.id);
    }
  };

  const cond = COND_MAP[item.condition] ?? { label: item.condition, color: '#00d4b6' };
  const discount = item.compareAtPrice
    ? Math.round((1 - item.price / item.compareAtPrice) * 100) : null;

  return (
    <div ref={rowRef} className="ci-root" style={{ maxHeight: 200 }}>
      {/* Image */}
      <div className="ci-img">
        {item.image ? (
          <Image src={item.image} alt={item.title} fill style={{ objectFit: 'cover' }} />
        ) : (
          <div className="ci-img-empty">
            <ShoppingBag size={22} strokeWidth={1} />
          </div>
        )}
        {discount && (
          <span className="ci-disc">−{discount}%</span>
        )}
      </div>

      {/* Info */}
      <div className="ci-info">
        <div className="ci-top">
          <div className="ci-meta">
            {item.brand && <span className="ci-brand">{item.brand}</span>}
            {item.category && <span className="ci-cat">{item.category}</span>}
          </div>
          <button className="ci-del" onClick={handleRemove} aria-label="Remove item">
            <X size={13} />
          </button>
        </div>

        <h3 className="ci-title">{item.title}</h3>

        <div className="ci-attrs">
          {item.size && (
            <span className="ci-attr">
              <span className="ci-attr-label">Size</span>
              {item.size}
            </span>
          )}
          <span className="ci-attr" style={{ color: cond.color, borderColor: `${cond.color}30`, background: `${cond.color}10` }}>
            <span className="ci-cond-dot" style={{ background: cond.color }} />
            {cond.label}
          </span>
        </div>

        <div className="ci-bottom">
          {/* Qty stepper */}
          <div className="ci-qty">
            <button
              className="ci-qty-btn"
              onClick={() => onQty(item.id, -1)}
              disabled={item.quantity <= 1}
            >
              <Minus size={11} />
            </button>
            <span className="ci-qty-val">{item.quantity}</span>
            <button
              className="ci-qty-btn"
              onClick={() => onQty(item.id, 1)}
            >
              <Plus size={11} />
            </button>
          </div>

          {/* Price */}
          <div className="ci-price-group">
            {item.compareAtPrice && (
              <span className="ci-compare">${(item.compareAtPrice * item.quantity).toFixed(2)}</span>
            )}
            <span className="ci-price">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Cart ───────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="empty-root">
      <div className="empty-orbit">
        <div className="empty-ring r1" />
        <div className="empty-ring r2" />
        <div className="empty-ring r3" />
        <div className="empty-icon-wrap">
          <ShoppingBag size={36} strokeWidth={1} />
        </div>
      </div>
      <h2 className="empty-title">Your cart is empty</h2>
      <p className="empty-sub">Looks like you haven't added anything yet. Discover premium gear at unbeatable prices.</p>
      <Link href="/shop" className="empty-cta">
        Explore the Shop
        <ArrowRight size={15} />
      </Link>
    </div>
  );
}

// ─── Order Summary ────────────────────────────────────────────────────────────
function OrderSummary({ items, promoDiscount }: { items: CartItem[]; promoDiscount: number }) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const originalTotal = items.reduce((s, i) => s + (i.compareAtPrice ?? i.price) * i.quantity, 0);
  const itemSavings = originalTotal - subtotal;
  const promoAmt = (subtotal * promoDiscount) / 100;
  const shipping = subtotal >= 75 ? 0 : 8.99;
  const total = subtotal - promoAmt + shipping;

  return (
    <div className="os-rows">
      <div className="os-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      {itemSavings > 0 && (
        <div className="os-row os-row-save">
          <span>Item savings</span>
          <span>−${itemSavings.toFixed(2)}</span>
        </div>
      )}
      {promoDiscount > 0 && (
        <div className="os-row os-row-save">
          <span>Promo ({promoDiscount}% off)</span>
          <span>−${promoAmt.toFixed(2)}</span>
        </div>
      )}
      <div className="os-row">
        <span>Shipping</span>
        <span className={shipping === 0 ? 'os-free' : ''}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
      </div>
      {shipping > 0 && (
        <div className="os-ship-hint">
          Add ${(75 - subtotal).toFixed(2)} more for free shipping
          <div className="os-progress-bar">
            <div className="os-progress-fill" style={{ width: `${Math.min((subtotal / 75) * 100, 100)}%` }} />
          </div>
        </div>
      )}
      <div className="os-divider" />
      <div className="os-total-row">
        <span>Total</span>
        <span className="os-total-val">
          $<AnimatedNumber value={total} />
        </span>
      </div>
    </div>
  );
}

// ─── Main Cart Page ───────────────────────────────────────────────────────────
export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(DEMO_ITEMS);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoOpen, setPromoOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stagger header elements in
    const els = headerRef.current?.querySelectorAll('.anim-in');
    els?.forEach((el, i) => {
      (el as HTMLElement).style.opacity = '0';
      (el as HTMLElement).style.transform = 'translateY(20px)';
      setTimeout(() => {
        (el as HTMLElement).style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s`;
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.transform = 'translateY(0)';
      }, 50);
    });

    // Summary panel slides in from right
    if (summaryRef.current) {
      summaryRef.current.style.opacity = '0';
      summaryRef.current.style.transform = 'translateX(24px)';
      setTimeout(() => {
        summaryRef.current!.style.transition = 'opacity 0.6s ease 0.25s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.25s';
        summaryRef.current!.style.opacity = '1';
        summaryRef.current!.style.transform = 'translateX(0)';
      }, 50);
    }
  }, []);

  const handleQty = useCallback((id: string, delta: number) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  }, []);

  const handleRemove = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handlePromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoDiscount(PROMO_CODES[code]);
      setPromoError('');
      setPromoInput('');
    } else {
      setPromoError('Invalid promo code');
      setTimeout(() => setPromoError(''), 2500);
    }
  };

  const handleCheckout = () => {
    setCheckingOut(true);
    setTimeout(() => setCheckingOut(false), 2000);
  };

  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <div className="cart-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800&family=Azeret+Mono:wght@400;500;600&display=swap');

        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}

        :root{
          --bg:#06080b;
          --bg2:#0b0e14;
          --bg3:#11151e;
          --bg4:#161b27;
          --border:rgba(255,255,255,0.06);
          --border2:rgba(255,255,255,0.1);
          --border3:rgba(255,255,255,0.16);
          --a:#00d4b6;
          --adim:rgba(0,212,182,0.08);
          --aglow:rgba(0,212,182,0.2);
          --text:#e8ecf4;
          --text2:rgba(232,236,244,0.5);
          --text3:rgba(232,236,244,0.22);
          --red:#ff4d6d;
          --font:'Cabinet Grotesk',sans-serif;
          --display:'Clash Display',sans-serif;
          --mono:'Azeret Mono',monospace;
          --r:14px;
          --rs:8px;
        }

        .cart-root{
          min-height:100vh;
          background:var(--bg);
          color:var(--text);
          font-family:var(--font);
          overflow-x:hidden;
          padding-top:72px;
          position:relative;
        }

        /* ── Ambient BG ── */
        .cart-root::before{
          content:'';
          position:fixed;inset:0;z-index:0;pointer-events:none;
          background:
            radial-gradient(ellipse 60% 50% at 20% 0%, rgba(0,212,182,0.04) 0%, transparent 60%),
            radial-gradient(ellipse 50% 60% at 85% 90%, rgba(0,100,220,0.03) 0%, transparent 55%);
        }

        /* Grid lines */
        .cart-root::after{
          content:'';
          position:fixed;inset:0;z-index:0;pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,0.013) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,0.013) 1px,transparent 1px);
          background-size:52px 52px;
        }

        .cart-inner{
          position:relative;z-index:10;
          max-width:1280px;
          margin:0 auto;
          padding:0 clamp(16px,5vw,64px) 80px;
        }

        /* ── Page Header ── */
        .cart-header{
          padding:clamp(32px,5vw,64px) 0 40px;
          border-bottom:1px solid var(--border);
          margin-bottom:48px;
        }
        .cart-header-inner{
          display:flex;align-items:flex-end;justify-content:space-between;
          gap:16px;flex-wrap:wrap;
        }
        .cart-eyebrow{
          font-family:var(--mono);font-size:9px;font-weight:600;
          letter-spacing:0.25em;text-transform:uppercase;
          color:var(--a);margin-bottom:10px;
          display:flex;align-items:center;gap:8px;
        }
        .cart-eyebrow::before{
          content:'';width:20px;height:1px;background:var(--a);
        }
        .cart-title{
          font-family:var(--display);
          font-size:clamp(38px,6vw,72px);
          font-weight:700;
          letter-spacing:-0.04em;
          line-height:0.95;
          color:var(--text);
        }
        .cart-title-em{
          color:transparent;
          -webkit-text-stroke:1.5px rgba(255,255,255,0.18);
        }
        .cart-count-badge{
          display:inline-flex;align-items:center;justify-content:center;
          min-width:38px;height:38px;padding:0 10px;
          background:var(--adim);
          border:1px solid rgba(0,212,182,0.25);
          border-radius:100px;
          font-family:var(--mono);font-size:13px;font-weight:600;
          color:var(--a);
          margin-left:14px;
          vertical-align:middle;
          position:relative;top:-8px;
        }
        .back-link{
          display:inline-flex;align-items:center;gap:8px;
          font-family:var(--font);font-size:13px;font-weight:600;
          color:var(--text2);text-decoration:none;
          transition:color 0.2s;
          padding:10px 0;
        }
        .back-link:hover{color:var(--text);}

        /* ── Two-column layout ── */
        .cart-layout{
          display:grid;
          grid-template-columns:1fr;
          gap:32px;
          align-items:start;
        }
        @media(min-width:900px){
          .cart-layout{
            grid-template-columns:1fr 380px;
            gap:40px;
          }
        }
        @media(min-width:1100px){
          .cart-layout{
            grid-template-columns:1fr 420px;
          }
        }

        /* ── Cart Items Column ── */
        .items-col{}
        .items-label{
          font-family:var(--mono);font-size:9px;font-weight:600;
          letter-spacing:0.22em;text-transform:uppercase;
          color:var(--text3);margin-bottom:20px;
          display:flex;align-items:center;gap:10px;
        }
        .items-label::after{content:'';flex:1;height:1px;background:var(--border);}
        .items-list{display:flex;flex-direction:column;gap:14px;}

        /* ── Cart Item ── */
        .ci-root{
          display:flex;gap:16px;
          background:var(--bg2);
          border:1px solid var(--border);
          border-radius:var(--r);
          padding:16px;
          position:relative;
          transition:border-color 0.25s;
          overflow:hidden;
        }
        .ci-root::before{
          content:'';
          position:absolute;left:0;top:0;bottom:0;width:2px;
          background:linear-gradient(to bottom,transparent,var(--a),transparent);
          opacity:0;transition:opacity 0.3s;
        }
        .ci-root:hover{border-color:var(--border2);}
        .ci-root:hover::before{opacity:1;}

        .ci-img{
          flex-shrink:0;
          width:90px;height:110px;
          border-radius:10px;
          overflow:hidden;
          background:var(--bg3);
          position:relative;
        }
        .ci-img-empty{
          width:100%;height:100%;
          display:flex;align-items:center;justify-content:center;
          color:var(--text3);
        }
        .ci-disc{
          position:absolute;top:6px;right:6px;
          font-family:var(--mono);font-size:8px;font-weight:700;
          background:var(--a);color:#020606;
          padding:2px 6px;border-radius:4px;letter-spacing:0.04em;
        }

        .ci-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:8px;}

        .ci-top{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}
        .ci-meta{display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
        .ci-brand{
          font-family:var(--mono);font-size:8px;font-weight:600;
          letter-spacing:0.2em;text-transform:uppercase;color:var(--a);
        }
        .ci-cat{
          font-family:var(--mono);font-size:8px;letter-spacing:0.14em;
          text-transform:uppercase;color:var(--text3);
        }

        .ci-del{
          flex-shrink:0;width:28px;height:28px;border-radius:7px;
          background:transparent;border:1px solid var(--border);
          color:var(--text3);cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.2s;
        }
        .ci-del:hover{background:rgba(255,77,109,0.1);border-color:rgba(255,77,109,0.3);color:var(--red);}

        .ci-title{
          font-size:14px;font-weight:700;line-height:1.35;
          letter-spacing:-0.01em;color:var(--text);
          display:-webkit-box;-webkit-line-clamp:2;
          -webkit-box-orient:vertical;overflow:hidden;
        }

        .ci-attrs{display:flex;align-items:center;gap:7px;flex-wrap:wrap;}
        .ci-attr{
          display:inline-flex;align-items:center;gap:5px;
          font-family:var(--mono);font-size:9px;font-weight:500;
          letter-spacing:0.1em;text-transform:uppercase;
          padding:3px 9px;border-radius:5px;
          background:rgba(255,255,255,0.04);
          border:1px solid var(--border);
          color:var(--text2);
        }
        .ci-attr-label{
          color:var(--text3);margin-right:2px;font-weight:400;
        }
        .ci-cond-dot{width:5px;height:5px;border-radius:50%;flex-shrink:0;}

        .ci-bottom{
          display:flex;align-items:center;justify-content:space-between;
          gap:12px;margin-top:4px;
        }

        .ci-qty{
          display:flex;align-items:center;gap:0;
          background:var(--bg3);
          border:1px solid var(--border2);
          border-radius:8px;
          overflow:hidden;
        }
        .ci-qty-btn{
          width:32px;height:32px;
          background:transparent;border:none;
          color:var(--text2);cursor:pointer;
          display:flex;align-items:center;justify-content:center;
          transition:all 0.2s;
        }
        .ci-qty-btn:hover:not(:disabled){background:rgba(255,255,255,0.07);color:var(--text);}
        .ci-qty-btn:disabled{opacity:0.3;cursor:not-allowed;}
        .ci-qty-val{
          min-width:36px;text-align:center;
          font-family:var(--mono);font-size:13px;font-weight:600;
          color:var(--text);border-left:1px solid var(--border);border-right:1px solid var(--border);
          height:32px;display:flex;align-items:center;justify-content:center;
        }

        .ci-price-group{display:flex;align-items:baseline;gap:8px;}
        .ci-compare{
          font-size:12px;color:var(--text3);text-decoration:line-through;
          font-family:var(--mono);
        }
        .ci-price{
          font-family:var(--display);font-size:20px;font-weight:700;
          letter-spacing:-0.03em;color:var(--text);
        }

        /* ── Trust Bar ── */
        .trust-bar{
          display:grid;grid-template-columns:repeat(3,1fr);
          gap:10px;margin-top:24px;
        }
        @media(max-width:500px){.trust-bar{grid-template-columns:1fr;}}
        .trust-item{
          display:flex;align-items:center;gap:10px;
          background:var(--bg2);border:1px solid var(--border);
          border-radius:10px;padding:13px 14px;
          transition:border-color 0.2s;
        }
        .trust-item:hover{border-color:var(--border2);}
        .trust-icon{
          width:32px;height:32px;border-radius:8px;
          background:var(--adim);border:1px solid rgba(0,212,182,0.15);
          display:flex;align-items:center;justify-content:center;
          flex-shrink:0;color:var(--a);
        }
        .trust-text{}
        .trust-name{font-size:12px;font-weight:700;color:var(--text);line-height:1;}
        .trust-desc{font-size:10px;color:var(--text3);margin-top:2px;font-family:var(--mono);}

        /* ── Summary Panel ── */
        .summary-panel{
          background:var(--bg2);
          border:1px solid var(--border2);
          border-radius:18px;
          overflow:hidden;
          position:sticky;
          top:24px;
        }

        .summary-header{
          padding:24px 24px 20px;
          border-bottom:1px solid var(--border);
          background:linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%);
          position:relative;
          overflow:hidden;
        }
        .summary-header::before{
          content:'';position:absolute;top:-30px;right:-30px;
          width:120px;height:120px;border-radius:50%;
          background:radial-gradient(circle,rgba(0,212,182,0.08),transparent 70%);
          pointer-events:none;
        }
        .summary-label{
          font-family:var(--mono);font-size:9px;font-weight:600;
          letter-spacing:0.22em;text-transform:uppercase;color:var(--a);
          margin-bottom:6px;
        }
        .summary-title{
          font-family:var(--display);font-size:22px;font-weight:700;
          letter-spacing:-0.025em;color:var(--text);
        }

        .summary-body{padding:20px 24px;}

        /* Order summary rows */
        .os-rows{display:flex;flex-direction:column;gap:12px;}
        .os-row{
          display:flex;align-items:center;justify-content:space-between;
          font-size:14px;color:var(--text2);font-weight:500;
        }
        .os-row-save span:last-child{color:#4ade80;font-weight:700;}
        .os-free{color:var(--a)!important;font-weight:700!important;}
        .os-divider{height:1px;background:var(--border);margin:4px 0;}
        .os-total-row{
          display:flex;align-items:center;justify-content:space-between;
          font-size:15px;font-weight:700;color:var(--text);
        }
        .os-total-val{
          font-family:var(--display);font-size:26px;font-weight:700;
          letter-spacing:-0.035em;color:var(--text);
        }

        .os-ship-hint{
          font-size:11px;color:var(--text3);font-family:var(--mono);
          letter-spacing:0.04em;
          display:flex;flex-direction:column;gap:7px;
          background:var(--bg3);border-radius:8px;padding:11px 13px;
          border:1px solid var(--border);
          margin-top:-4px;
        }
        .os-progress-bar{
          height:2px;background:rgba(255,255,255,0.06);border-radius:4px;overflow:hidden;
        }
        .os-progress-fill{
          height:100%;background:var(--a);border-radius:4px;
          transition:width 0.6s cubic-bezier(0.22,1,0.36,1);
        }

        /* Promo code */
        .promo-section{
          border-top:1px solid var(--border);
          padding:16px 24px;
        }
        .promo-toggle{
          display:flex;align-items:center;justify-content:space-between;
          width:100%;background:transparent;border:none;cursor:pointer;
          color:var(--text2);font-family:var(--font);font-size:13px;font-weight:600;
          padding:4px 0;transition:color 0.2s;
        }
        .promo-toggle:hover{color:var(--text);}
        .promo-toggle svg{transition:transform 0.25s;}
        .promo-toggle.open svg{transform:rotate(180deg);}

        .promo-body{
          overflow:hidden;
          max-height:0;
          transition:max-height 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        .promo-body.open{max-height:120px;}

        .promo-input-row{
          display:flex;gap:8px;margin-top:12px;
        }
        .promo-input{
          flex:1;height:42px;padding:0 14px;
          background:var(--bg3);border:1px solid var(--border2);
          border-radius:8px;
          font-family:var(--mono);font-size:12px;font-weight:500;
          letter-spacing:0.1em;text-transform:uppercase;
          color:var(--text);outline:none;
          transition:border-color 0.2s;
        }
        .promo-input:focus{border-color:rgba(0,212,182,0.4);}
        .promo-input::placeholder{text-transform:none;letter-spacing:0;color:var(--text3);}
        .promo-apply{
          height:42px;padding:0 16px;
          background:var(--bg3);border:1px solid var(--border2);
          border-radius:8px;
          font-family:var(--font);font-size:12px;font-weight:700;
          color:var(--text2);cursor:pointer;
          transition:all 0.2s;white-space:nowrap;
        }
        .promo-apply:hover{border-color:rgba(0,212,182,0.35);color:var(--a);}
        .promo-error{
          font-family:var(--mono);font-size:10px;color:var(--red);
          margin-top:7px;letter-spacing:0.06em;
          animation:shake 0.4s ease;
        }
        @keyframes shake{
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-5px)}
          60%{transform:translateX(5px)}
          80%{transform:translateX(-2px)}
        }
        .promo-applied{
          display:flex;align-items:center;justify-content:space-between;
          background:rgba(74,222,128,0.07);
          border:1px solid rgba(74,222,128,0.2);
          border-radius:8px;padding:10px 13px;margin-top:12px;
        }
        .promo-applied-txt{
          font-family:var(--mono);font-size:10px;font-weight:600;
          letter-spacing:0.12em;color:#4ade80;
        }
        .promo-remove{
          background:transparent;border:none;cursor:pointer;
          color:rgba(74,222,128,0.5);font-size:11px;font-family:var(--mono);
          transition:color 0.2s;
        }
        .promo-remove:hover{color:#4ade80;}

        /* Checkout button */
        .checkout-section{padding:0 24px 24px;}
        .checkout-btn{
          width:100%;height:58px;
          background:var(--a);border:none;
          border-radius:12px;
          font-family:var(--display);font-size:16px;font-weight:700;
          letter-spacing:-0.01em;
          color:#020606;cursor:pointer;
          display:flex;align-items:center;justify-content:center;gap:10px;
          position:relative;overflow:hidden;
          transition:transform 0.2s,opacity 0.2s;
        }
        .checkout-btn::before{
          content:'';
          position:absolute;inset:0;
          background:linear-gradient(135deg,transparent 0%,rgba(255,255,255,0.15) 50%,transparent 100%);
          transform:translateX(-100%);
          transition:transform 0.5s ease;
        }
        .checkout-btn:hover::before{transform:translateX(100%);}
        .checkout-btn:hover{transform:translateY(-1px);}
        .checkout-btn:active{transform:translateY(0);}
        .checkout-btn.loading{opacity:0.75;cursor:not-allowed;}

        .checkout-spin{
          width:18px;height:18px;border-radius:50%;
          border:2px solid rgba(2,6,6,0.2);
          border-top-color:#020606;
          animation:spin 0.7s linear infinite;
        }
        @keyframes spin{to{transform:rotate(360deg)}}

        .checkout-sub{
          text-align:center;margin-top:10px;
          font-family:var(--mono);font-size:9px;color:var(--text3);
          letter-spacing:0.1em;
          display:flex;align-items:center;justify-content:center;gap:6px;
        }

        /* ── Empty State ── */
        .empty-root{
          display:flex;flex-direction:column;align-items:center;
          padding:clamp(60px,12vw,120px) 0;
          text-align:center;
        }
        .empty-orbit{
          position:relative;
          width:140px;height:140px;
          display:flex;align-items:center;justify-content:center;
          margin-bottom:32px;
        }
        .empty-ring{
          position:absolute;border-radius:50%;border:1px solid;
        }
        .r1{
          width:140px;height:140px;
          border-color:rgba(0,212,182,0.15);
          animation:ringFade 3s ease infinite;
        }
        .r2{
          width:100px;height:100px;
          border-color:rgba(0,212,182,0.2);
          animation:ringFade 3s ease 0.5s infinite;
        }
        .r3{
          width:60px;height:60px;
          border-color:rgba(0,212,182,0.3);
          animation:ringFade 3s ease 1s infinite;
        }
        @keyframes ringFade{
          0%,100%{opacity:0.4;transform:scale(1);}
          50%{opacity:1;transform:scale(1.04);}
        }
        .empty-icon-wrap{
          position:relative;z-index:2;
          width:56px;height:56px;border-radius:16px;
          background:var(--adim);border:1px solid rgba(0,212,182,0.2);
          display:flex;align-items:center;justify-content:center;
          color:var(--a);
        }
        .empty-title{
          font-family:var(--display);font-size:clamp(24px,4vw,36px);
          font-weight:700;letter-spacing:-0.03em;color:var(--text);
          margin-bottom:10px;
        }
        .empty-sub{
          font-size:14px;color:var(--text2);max-width:340px;line-height:1.6;
          margin-bottom:32px;
        }
        .empty-cta{
          display:inline-flex;align-items:center;gap:9px;
          height:50px;padding:0 28px;
          background:var(--a);border-radius:10px;
          font-family:var(--display);font-size:15px;font-weight:700;
          color:#020606;text-decoration:none;
          transition:transform 0.2s,opacity 0.2s;
        }
        .empty-cta:hover{transform:translateY(-2px);opacity:0.92;}
      `}</style>

      <div className="cart-inner">
        {/* ── Header ── */}
        <div className="cart-header" ref={headerRef}>
          <div className="cart-header-inner">
            <div>
              <p className="cart-eyebrow anim-in">Your Bag</p>
              <h1 className="cart-title anim-in">
                Cart
                <span className="cart-title-em"> Items</span>
                {items.length > 0 && (
                  <span className="cart-count-badge">{itemCount}</span>
                )}
              </h1>
            </div>
            <Link href="/shop" className="back-link anim-in">
              <ArrowLeft size={14} />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Empty State ── */}
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="cart-layout">
            {/* ── Items Column ── */}
            <div className="items-col">
              <p className="items-label">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
              <div className="items-list">
                {items.map((item, i) => (
                  <CartItemRow
                    key={item.id}
                    item={item}
                    onQty={handleQty}
                    onRemove={handleRemove}
                    index={i}
                  />
                ))}
              </div>

              {/* Trust signals */}
              <div className="trust-bar">
                {[
                  { icon: <Truck size={15} />, name: 'Free Shipping', desc: 'Orders over $75' },
                  { icon: <RotateCcw size={15} />, name: '30-Day Returns', desc: 'Hassle-free policy' },
                  { icon: <Shield size={15} />, name: 'Secure Checkout', desc: 'SSL encrypted' },
                ].map((t, i) => (
                  <div className="trust-item" key={i}>
                    <div className="trust-icon">{t.icon}</div>
                    <div className="trust-text">
                      <p className="trust-name">{t.name}</p>
                      <p className="trust-desc">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Summary Panel ── */}
            <div ref={summaryRef}>
              <div className="summary-panel">
                <div className="summary-header">
                  <p className="summary-label">Order Summary</p>
                  <h2 className="summary-title">Your Total</h2>
                </div>

                <div className="summary-body">
                  <OrderSummary items={items} promoDiscount={promoDiscount} />
                </div>

                {/* Promo Code */}
                <div className="promo-section">
                  <button
                    className={`promo-toggle${promoOpen ? ' open' : ''}`}
                    onClick={() => setPromoOpen(v => !v)}
                  >
                    <span>
                      {appliedPromo ? `Promo: ${appliedPromo}` : 'Have a promo code?'}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  <div className={`promo-body${promoOpen ? ' open' : ''}`}>
                    {appliedPromo ? (
                      <div className="promo-applied">
                        <span className="promo-applied-txt">✓ {appliedPromo} — {promoDiscount}% off applied</span>
                        <button className="promo-remove" onClick={() => { setAppliedPromo(''); setPromoDiscount(0); }}>
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="promo-input-row">
                          <input
                            type="text"
                            className="promo-input"
                            placeholder="Enter code…"
                            value={promoInput}
                            onChange={e => setPromoInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handlePromo()}
                          />
                          <button className="promo-apply" onClick={handlePromo}>Apply</button>
                        </div>
                        {promoError && <p className="promo-error">{promoError}</p>}
                      </>
                    )}
                  </div>
                </div>

                {/* Checkout */}
                <div className="checkout-section">
                  <button
                    className={`checkout-btn${checkingOut ? ' loading' : ''}`}
                    onClick={handleCheckout}
                    disabled={checkingOut}
                  >
                    {checkingOut ? (
                      <>
                        <div className="checkout-spin" />
                        Processing…
                      </>
                    ) : (
                      <>
                        <Zap size={16} fill="currentColor" strokeWidth={0} />
                        Checkout Now
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                  <p className="checkout-sub">
                    <Shield size={10} />
                    Secured by SSL • No hidden fees
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}