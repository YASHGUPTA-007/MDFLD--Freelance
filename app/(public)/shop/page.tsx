'use client';

import React, { useState } from 'react';
import { ShoppingBag, Search, User, Menu, SlidersHorizontal, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Static Product Data
const PRODUCTS = [
  {
    id: 1,
    name: 'MDFLD Core Tech Hoodie',
    price: '$120',
    category: 'TOPS',
    tag: 'NEW',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Tactical Cargo Pant',
    price: '$145',
    category: 'BOTTOMS',
    image: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Strike Shell Jacket',
    price: '$180',
    category: 'OUTERWEAR',
    tag: 'LIMITED',
    image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Oversized Heavy Tee',
    price: '$45',
    category: 'TOPS',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'Midfield Utility Vest',
    price: '$110',
    category: 'OUTERWEAR',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 6,
    name: 'Apex Runner Sneaker',
    price: '$220',
    category: 'FOOTWEAR',
    tag: 'SOLD OUT',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 7,
    name: 'Signature Beanie',
    price: '$35',
    category: 'ACCESSORIES',
    image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 8,
    name: 'Performance Track Pant',
    price: '$95',
    category: 'BOTTOMS',
    image: 'https://images.unsplash.com/photo-1517438322307-e67111335449?q=80&w=800&auto=format&fit=crop'
  }
];

const CATEGORIES = ['ALL', 'NEW ARRIVALS', 'OUTERWEAR', 'TOPS', 'BOTTOMS', 'FOOTWEAR', 'ACCESSORIES'];

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState('ALL');

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: '#020606', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Oswald:wght@400;500;600;700&display=swap');
        
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        
        /* Background & Overlays */
        .grid-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px); background-size: 56px 56px; }
        
        /* Navigation */
        .navbar { position: sticky; top: 0; z-index: 50; background: rgba(2, 6, 6, 0.8); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.05); padding: 20px 64px; display: flex; justify-content: space-between; align-items: center; }
        .nav-link { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; transition: color 0.2s; }
        .nav-link:hover, .nav-link.active { color: #fff; }
        .icon-btn { background: none; border: none; color: #fff; cursor: pointer; transition: color 0.2s, transform 0.2s; display: flex; align-items: center; justify-content: center; }
        .icon-btn:hover { color: #00d4b6; transform: translateY(-1px); }
        
        /* Filter Pills */
        .filter-scroll::-webkit-scrollbar { display: none; }
        .filter-pill { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); padding: 10px 24px; border-radius: 100px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
        .filter-pill:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .filter-pill.active { background: rgba(0,212,182,0.1); border-color: #00d4b6; color: #00d4b6; box-shadow: 0 0 16px rgba(0,212,182,0.15); }

        /* Product Grid & Cards */
        .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 32px; padding: 0 64px 80px; position: relative; z-index: 10; }
        .product-card { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: pointer; display: flex; flexDirection: column; }
        .product-card:hover { border-color: rgba(0,212,182,0.4); background: rgba(255,255,255,0.03); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 20px rgba(0,212,182,0.1); }
        
        .img-container { position: relative; width: 100%; aspect-ratio: 4/5; overflow: hidden; background: #050c0a; }
        .img-container img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.6s; filter: grayscale(20%) contrast(110%); }
        .product-card:hover .img-container img { transform: scale(1.05); filter: grayscale(0%) contrast(110%); }
        
        /* Badges */
        .product-tag { position: absolute; top: 16px; left: 16px; background: #00d4b6; color: #020606; font-family: 'Oswald', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; padding: 4px 10px; z-index: 2; border-radius: 2px; }
        .product-tag.sold-out { background: #333; color: #fff; }
        
        /* Quick Add Button */
        .quick-add { position: absolute; bottom: 0; left: 0; width: 100%; background: rgba(0,212,182,0.95); backdrop-filter: blur(4px); color: #020606; font-family: 'Oswald', sans-serif; font-size: 14px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; padding: 16px; border: none; cursor: pointer; transform: translateY(100%); transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); display: flex; justify-content: center; align-items: center; gap: 8px; z-index: 2; }
        .product-card:hover .quick-add { transform: translateY(0); }
        .quick-add:hover { background: #00e5c5; }
        
        /* Animations */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.6s forwards; opacity: 0; }
      `}</style>

      {/* Global Background Elements */}
      <div className="grid-bg" />
      <div style={{ position: 'fixed', top: '-10%', right: '-10%', width: 800, height: 800, background: 'radial-gradient(circle, rgba(0,212,182,0.05) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-20%', left: '-10%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(0,212,182,0.03) 0%, transparent 60%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

    

      {/* Shop Header */}
      <div style={{ padding: '64px 64px 32px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 100, backdropFilter: 'blur(10px)', padding: '6px 16px 6px 8px', marginBottom: 24 }}>
          <div style={{ position: 'relative', width: 6, height: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#00d4b6', opacity: 0.5, animation: 'pulse-ring 2s ease-out infinite' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4b6', position: 'relative', zIndex: 1 }} />
          </div>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#00d4b6' }}>Season 04 Available</span>
        </div>
        
        <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 'clamp(48px, 6vw, 80px)', fontWeight: 700, lineHeight: 1, textTransform: 'uppercase', color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>
          Latest <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>Arrivals</span>
        </h1>
      </div>

      {/* Filters Bar */}
      <div style={{ padding: '0 64px', marginBottom: 48, position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="filter-scroll" style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: 4, gap: 8 }}>
          <SlidersHorizontal size={14} />
          <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Filter</span>
        </button>
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {PRODUCTS.map((product, i) => (
          <div key={product.id} className="product-card fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
            {/* Image Container */}
            <div className="img-container">
              {product.tag && (
                <div className={`product-tag ${product.tag === 'SOLD OUT' ? 'sold-out' : ''}`}>
                  {product.tag}
                </div>
              )}
              {/* Using standard img tag for ease of copy/pasting without Next.js Image config setup */}
              <img src={product.image} alt={product.name} loading="lazy" />
              
              <button className="quick-add">
                {product.tag === 'SOLD OUT' ? 'Notify Me' : 'Quick Add'} <ArrowRight size={16} />
              </button>
            </div>

            {/* Product Info */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', marginBottom: 8 }}>
                  {product.category}
                </div>
                <h3 style={{ fontFamily: "'Oswald', sans-serif", fontSize: 20, fontWeight: 500, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.02em', margin: 0, lineHeight: 1.2 }}>
                  {product.name}
                </h3>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 24 }}>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500, color: '#00d4b6' }}>
                  {product.price}
                </span>
                <span style={{ fontSize: 12, fontWeight: 400, color: 'rgba(255,255,255,0.3)' }}>
                  1 Color
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}