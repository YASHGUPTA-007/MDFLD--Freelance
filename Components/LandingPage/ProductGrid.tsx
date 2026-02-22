"use client"
import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Zap, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ACCENT = '#00d4b6';

interface Product {
  id: number;
  brand: string;
  name: string;
  price: string;
  originalPrice: string;
  rating: number;
  reviews: number;
  tag: string;
  tagColor: string;
  sizes: string[];
  img: string;
}

const PRODUCTS: Product[] = [
  {
    id: 0, 
    brand: 'Nike', 
    name: 'Phantom GX Elite', 
    price: '£229', 
    originalPrice: '£279',
    rating: 4.9, 
    reviews: 3201, 
    tag: 'HOT', 
    tagColor: '#ff4d4d',
    sizes: ['7', '8', '9', '10', '11'],
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 1, 
    brand: 'Adidas', 
    name: 'Copa Pure.1 FG', 
    price: '£199', 
    originalPrice: '£239',
    rating: 4.8, 
    reviews: 1782, 
    tag: 'NEW', 
    tagColor: ACCENT,
    sizes: ['6', '7', '8', '9', '10'],
    img: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 2, 
    brand: 'New Balance', 
    name: 'Furon v7 Pro', 
    price: '£179', 
    originalPrice: '£219',
    rating: 4.7, 
    reviews: 921, 
    tag: 'SALE', 
    tagColor: '#f0a500',
    sizes: ['7', '8', '9', '10'],
    img: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 3, 
    brand: 'Puma', 
    name: 'King Ultimate FG', 
    price: '£249', 
    originalPrice: '£299',
    rating: 4.6, 
    reviews: 654, 
    tag: 'LIMITED', 
    tagColor: '#a855f7',
    sizes: ['8', '9', '10', '11'],
    img: 'https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 4, 
    brand: 'Mizuno', 
    name: 'Morelia Neo IV Beta', 
    price: '£189', 
    originalPrice: '£229',
    rating: 4.9, 
    reviews: 432, 
    tag: 'PRO', 
    tagColor: ACCENT,
    sizes: ['7', '8', '9'],
    img: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=80&auto=format&fit=crop',
  },
  {
    id: 5, 
    brand: 'Under Armour', 
    name: 'Magnetico Elite 3', 
    price: '£159', 
    originalPrice: '£199',
    rating: 4.5, 
    reviews: 318, 
    tag: 'DROP', 
    tagColor: '#ff4d4d',
    sizes: ['6', '7', '8', '9', '10', '11'],
    img: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=600&q=80&auto=format&fit=crop',
  },
];

interface ProductCardProps {
  product: Product;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [addedToBag, setAddedToBag] = useState(false);
  const [imageHovered, setImageHovered] = useState(false);

  const handleAdd = () => {
    if (!addedToBag) {
      setAddedToBag(true);
      setTimeout(() => setAddedToBag(false), 2200);
    }
  };

  const discount = Math.round(
    ((parseFloat(product.originalPrice.replace('£', '')) - 
      parseFloat(product.price.replace('£', ''))) / 
      parseFloat(product.originalPrice.replace('£', ''))) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        delay: index * 0.07, 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1] 
      }}
      style={{
        background: 'linear-gradient(135deg, rgba(10, 15, 14, 0.8) 0%, rgba(10, 15, 14, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex', 
        flexDirection: 'column',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 212, 182, 0.15)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.25)';
      }}
    >
      {/* Discount Badge */}
      {discount > 0 && (
        <div style={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: 'rgba(255, 77, 77, 0.95)',
          color: '#fff',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.03em',
          padding: '6px 10px',
          borderRadius: 8,
          zIndex: 3,
          boxShadow: '0 4px 12px rgba(255, 77, 77, 0.3)',
        }}>
          -{discount}%
        </div>
      )}

      {/* Image Container */}
      <div 
        style={{ 
          position: 'relative', 
          overflow: 'hidden', 
          aspectRatio: '4/3', 
          flexShrink: 0,
          background: 'rgba(0, 0, 0, 0.2)',
        }}
        onMouseEnter={() => setImageHovered(true)}
        onMouseLeave={() => setImageHovered(false)}
      >
        <img
          src={product.img} 
          alt={product.name}
          style={{
            width: '100%', 
            height: '100%', 
            objectFit: 'cover',
            transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'block',
            transform: imageHovered ? 'scale(1.08)' : 'scale(1)',
          }}
        />
        
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute', 
          inset: 0,
          background: 'linear-gradient(to top, rgba(10, 15, 14, 0.85) 0%, rgba(10, 15, 14, 0.3) 40%, transparent 70%)',
        }} />

        {/* Tag Badge */}
        <div style={{
          position: 'absolute', 
          top: 16, 
          left: 0,
          background: product.tagColor, 
          color: '#fff',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 10, 
          fontWeight: 700, 
          letterSpacing: '0.12em',
          padding: '7px 14px 7px 16px',
          boxShadow: `0 4px 16px ${product.tagColor}50`,
          clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)',
        }}>
          {product.tag}
        </div>

        {/* Wishlist Button */}
        <motion.button
          onClick={() => setLiked(!liked)}
          whileTap={{ scale: 0.9 }}
          style={{
            position: 'absolute', 
            top: 16, 
            right: 60,
            width: 40, 
            height: 40,
            background: liked 
              ? 'rgba(255, 77, 77, 0.2)' 
              : 'rgba(10, 15, 14, 0.75)',
            backdropFilter: 'blur(12px)',
            border: `1.5px solid ${liked ? 'rgba(255, 77, 77, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: 10,
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: liked 
              ? '0 4px 16px rgba(255, 77, 77, 0.25)' 
              : '0 2px 8px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Heart 
            style={{ 
              width: 16, 
              height: 16, 
              color: liked ? '#ff4d4d' : 'rgba(255, 255, 255, 0.6)', 
              fill: liked ? '#ff4d4d' : 'transparent',
              transition: 'all 0.3s ease',
            }} 
          />
        </motion.button>

        {/* Quick Add Overlay (on hover) */}
        <AnimatePresence>
          {imageHovered && !addedToBag && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                right: 16,
              }}
            >
              <button
                onClick={handleAdd}
                style={{
                  width: '100%',
                  background: `linear-gradient(135deg, ${ACCENT} 0%, rgba(0, 212, 182, 0.9) 100%)`,
                  border: 'none',
                  color: '#020606',
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.03em',
                  padding: '14px 20px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  boxShadow: `0 8px 24px ${ACCENT}40`,
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 12px 32px ${ACCENT}60`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = `0 8px 24px ${ACCENT}40`;
                }}
              >
                <ShoppingBag style={{ width: 16, height: 16 }} />
                Quick Add
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info */}
      <div style={{ 
        padding: '20px 20px 18px', 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 12,
      }}>
        {/* Brand */}
        <div style={{
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
          fontSize: 10.5, 
          fontWeight: 600,
          letterSpacing: '0.15em', 
          textTransform: 'uppercase',
          color: ACCENT,
        }}>
          {product.brand}
        </div>

        {/* Product Name */}
        <h3 style={{
          fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, sans-serif", 
          fontSize: 19, 
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: '#ffffff', 
          lineHeight: 1.25, 
          margin: 0,
          minHeight: 48,
        }}>
          {product.name}
        </h3>

        {/* Rating */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 8,
        }}>
          <div style={{ 
            display: 'flex', 
            gap: 3,
            alignItems: 'center',
          }}>
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                style={{ 
                  width: 12, 
                  height: 12, 
                  fill: i < Math.floor(product.rating) ? ACCENT : 'rgba(255, 255, 255, 0.08)', 
                  color: i < Math.floor(product.rating) ? ACCENT : 'rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.2s ease',
                }} 
              />
            ))}
          </div>
          <span style={{ 
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
            fontSize: 11, 
            color: 'rgba(255, 255, 255, 0.4)',
            fontWeight: 500,
          }}>
            {product.rating} ({product.reviews.toLocaleString()})
          </span>
        </div>

        {/* Size Selection */}
        <div style={{ 
          display: 'flex', 
          gap: 6, 
          flexWrap: 'wrap',
        }}>
          {product.sizes.map(size => (
            <motion.button
              key={size}
              onClick={() => setSelectedSize(size)}
              whileTap={{ scale: 0.95 }}
              style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                fontSize: 11, 
                fontWeight: 600,
                color: selectedSize === size ? '#020606' : 'rgba(255, 255, 255, 0.5)',
                background: selectedSize === size 
                  ? `linear-gradient(135deg, ${ACCENT} 0%, rgba(0, 212, 182, 0.9) 100%)` 
                  : 'rgba(255, 255, 255, 0.04)',
                border: `1.5px solid ${selectedSize === size ? ACCENT : 'rgba(255, 255, 255, 0.08)'}`,
                padding: '8px 12px', 
                borderRadius: 8,
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: 42,
                boxShadow: selectedSize === size 
                  ? `0 4px 12px ${ACCENT}30` 
                  : 'none',
              }}
              onMouseEnter={(e) => {
                if (selectedSize !== size) {
                  e.currentTarget.style.borderColor = 'rgba(0, 212, 182, 0.3)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedSize !== size) {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }
              }}
            >
              UK {size}
            </motion.button>
          ))}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, minHeight: 8 }} />

        {/* Price Row */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingTop: 12,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{
              fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, sans-serif", 
              fontSize: 28, 
              fontWeight: 700,
              color: ACCENT, 
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}>
              {product.price}
            </span>
            <span style={{
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
              fontSize: 14,
              color: 'rgba(255, 255, 255, 0.25)', 
              textDecoration: 'line-through',
              fontWeight: 500,
            }}>
              {product.originalPrice}
            </span>
          </div>

          {/* Add to Bag Button */}
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.95 }}
            style={{
              background: addedToBag 
                ? 'rgba(0, 212, 182, 0.15)' 
                : `linear-gradient(135deg, ${ACCENT} 0%, rgba(0, 212, 182, 0.9) 100%)`,
              border: `1.5px solid ${ACCENT}`,
              color: addedToBag ? ACCENT : '#020606',
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
              fontSize: 11, 
              fontWeight: 700,
              letterSpacing: '0.03em',
              padding: '11px 18px', 
              borderRadius: 10,
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center', 
              gap: 7,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              minWidth: 120,
              justifyContent: 'center',
              boxShadow: addedToBag 
                ? 'none' 
                : `0 4px 16px ${ACCENT}40`,
            }}
            onMouseEnter={(e) => {
              if (!addedToBag) {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = `0 6px 20px ${ACCENT}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (!addedToBag) {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}40`;
              }
            }}
          >
            {addedToBag ? (
              <>
                <Check style={{ width: 14, height: 14 }} />
                Added!
              </>
            ) : (
              <>
                <ShoppingBag style={{ width: 14, height: 14 }} />
                Add
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Shimmer Effect */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
        pointerEvents: 'none',
        animation: 'shimmer 3s infinite',
      }} />

      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }
      `}</style>
    </motion.div>
  );
}

export default function ProductGrid() {
  const [filter, setFilter] = useState('All');
  const [loadMoreHovered, setLoadMoreHovered] = useState(false);
  
  const filters = ['All', 'Nike', 'Adidas', 'Puma', 'New Balance', 'Mizuno'];
  const filtered = filter === 'All' ? PRODUCTS : PRODUCTS.filter(p => p.brand === filter);

  return (
    <section style={{
      background: 'linear-gradient(180deg, #020606 0%, #0a0f0f 100%)',
      padding: 'clamp(60px, 8vw, 110px) clamp(24px, 5vw, 64px)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Google Fonts Import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      {/* Background Elements */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.02) 1px, transparent 0)',
        backgroundSize: '32px 32px',
        opacity: 0.5,
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: '40%',
        height: '50%',
        background: `radial-gradient(circle, ${ACCENT}06 0%, transparent 70%)`,
        pointerEvents: 'none',
        filter: 'blur(80px)',
      }} />

      <div style={{ position: 'relative', maxWidth: 1400, margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'flex-end', 
          justifyContent: 'space-between', 
          marginBottom: 'clamp(40px, 5vw, 56px)',
          flexWrap: 'wrap',
          gap: 28,
        }}>
          <div>
            {/* Eyebrow */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
            }}>
              <Zap 
                style={{ 
                  width: 16, 
                  height: 16, 
                  color: ACCENT,
                  fill: ACCENT,
                }} 
              />
              <span style={{
                fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                fontSize: 11.5, 
                fontWeight: 600,
                letterSpacing: '0.15em', 
                textTransform: 'uppercase',
                color: ACCENT,
              }}>
                Trending Now
              </span>
            </div>

            {/* Main Heading */}
            <h2 style={{
              fontFamily: "'Sora', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 'clamp(38px, 5.5vw, 64px)', 
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff', 
              lineHeight: 1.08, 
              margin: 0,
            }}>
              This Week's{' '}
              <span style={{ 
                background: `linear-gradient(135deg, ${ACCENT} 0%, rgba(0, 212, 182, 0.7) 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Top Drops
              </span>
            </h2>
          </div>

          {/* Filter Buttons */}
          <div style={{ 
            display: 'flex', 
            gap: 8, 
            flexWrap: 'wrap',
            alignItems: 'center',
          }}>
            {filters.map(f => (
              <motion.button 
                key={f} 
                onClick={() => setFilter(f)}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", 
                  fontSize: 11, 
                  fontWeight: 600,
                  letterSpacing: '0.05em', 
                  textTransform: 'uppercase',
                  color: filter === f ? '#020606' : 'rgba(255, 255, 255, 0.5)',
                  background: filter === f 
                    ? `linear-gradient(135deg, ${ACCENT} 0%, rgba(0, 212, 182, 0.9) 100%)` 
                    : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${filter === f ? ACCENT : 'rgba(255, 255, 255, 0.08)'}`,
                  padding: '10px 20px', 
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: filter === f 
                    ? `0 4px 16px ${ACCENT}30` 
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (filter !== f) {
                    e.currentTarget.style.borderColor = 'rgba(0, 212, 182, 0.3)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== f) {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  }
                }}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 'clamp(16px, 2.5vw, 24px)',
        }}>
          {filtered.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Load More Button */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: 'clamp(48px, 6vw, 72px)',
        }}>
          <motion.button 
            onMouseEnter={() => setLoadMoreHovered(true)}
            onMouseLeave={() => setLoadMoreHovered(false)}
            whileTap={{ scale: 0.98 }}
            style={{
              background: loadMoreHovered 
                ? `linear-gradient(135deg, ${ACCENT} 0%, rgba(0, 212, 182, 0.9) 100%)` 
                : 'transparent',
              border: `2px solid ${ACCENT}`,
              color: loadMoreHovered ? '#020606' : ACCENT,
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
              fontSize: 13, 
              fontWeight: 700, 
              letterSpacing: '0.08em', 
              textTransform: 'uppercase',
              padding: '18px 56px', 
              borderRadius: 12,
              cursor: 'pointer',
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 12,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: loadMoreHovered 
                ? `0 8px 28px ${ACCENT}40` 
                : '0 4px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            Load More Drops 
            <ArrowRight 
              style={{ 
                width: 18, 
                height: 18,
                transform: loadMoreHovered ? 'translateX(4px)' : 'translateX(0)',
                transition: 'transform 0.3s ease',
              }} 
            />
          </motion.button>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 768px) {
          section > div > div:first-child {
            align-items: flex-start !important;
          }
          section > div > div:nth-child(2) > div {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)) !important;
          }
        }
        
        @media (max-width: 480px) {
          section > div > div:nth-child(2) > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}