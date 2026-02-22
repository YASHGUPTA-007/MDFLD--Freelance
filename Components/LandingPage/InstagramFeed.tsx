"use client"
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Heart, MessageCircle, ArrowRight, ExternalLink } from 'lucide-react';

const ACCENT = '#00d4b6';

interface Post {
  id: number;
  img: string;
  likes: string;
  comments: string;
  caption: string;
  tag: string;
  timestamp: string;
  type: string;
}

interface PostCardProps {
  post: Post;
  index: number;
}

const POSTS: Post[] = [
  {
    id: 0,
    img: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=85&auto=format&fit=crop',
    likes: '12.4K',
    comments: '284',
    caption: 'The Phantom GX Elite just landed. Blockchain verified. Zero compromise. Shop the link in bio 🔗',
    tag: '#MidfieldFC',
    timestamp: '2 hours ago',
    type: 'PRODUCT DROP',
  },
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1551280859-d6f8f5a7c4ab?w=800&q=85&auto=format&fit=crop',
    likes: '9.1K',
    comments: '193',
    caption: 'Training in the wet. The Predator grips where others slip. Elite is a standard, not a label 🏆',
    tag: '#RuleTheMidfield',
    timestamp: '1 day ago',
    type: 'LIFESTYLE',
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=85&auto=format&fit=crop',
    likes: '7.8K',
    comments: '147',
    caption: 'New season. New kit. Same hunger. 2025/26 home shirts are now live — all clubs, all sizes 👕',
    tag: '#NewSeason',
    timestamp: '3 days ago',
    type: 'NEW ARRIVALS',
  },
];

function PostCard({ post, index }: PostCardProps) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.12, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        border: `1px solid ${hovered ? 'rgba(0,212,182,0.28)' : 'rgba(255,255,255,0.07)'}`,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        background: '#0a0f0e',
        transition: 'border-color 0.35s',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '1 / 1', overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={post.img} alt={post.caption}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            filter: hovered ? 'brightness(0.45) saturate(1.1)' : 'brightness(0.72) saturate(0.85)',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'filter 0.55s ease, transform 0.7s ease',
          }}
        />

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,15,14,0.85) 0%, rgba(10,15,14,0.1) 50%, transparent 100%)',
        }} />

        {/* Type tag */}
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: hovered ? ACCENT : 'rgba(2,6,6,0.7)',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${hovered ? ACCENT : 'rgba(255,255,255,0.1)'}`,
          color: hovered ? '#020606' : 'rgba(255,255,255,0.55)',
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 8, fontWeight: 900, letterSpacing: '0.3em', textTransform: 'uppercase',
          padding: '5px 11px',
          transition: 'all 0.3s',
        }}>{post.type}</div>

        {/* Instagram icon */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: hovered
            ? 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)'
            : 'rgba(2,6,6,0.6)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
          width: 32, height: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s',
        }}>
          <Instagram style={{ width: 14, height: 14, color: '#fff' }} />
        </div>

        {/* Hover overlay — engagement */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28,
          }}
        >
          <button
            onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
          >
            <Heart style={{ width: 26, height: 26, color: liked ? '#ff4d4d' : '#fff', fill: liked ? '#ff4d4d' : 'transparent', transition: 'all 0.2s', transform: liked ? 'scale(1.2)' : 'scale(1)' }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>{post.likes}</span>
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <MessageCircle style={{ width: 26, height: 26, color: '#fff' }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 800, color: '#fff', letterSpacing: '0.05em' }}>{post.comments}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <ExternalLink style={{ width: 24, height: 24, color: '#fff' }} />
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 11, fontWeight: 800, color: '#fff', letterSpacing: '0.08em' }}>VIEW</span>
          </div>
        </motion.div>
      </div>

      {/* Caption */}
      <div style={{ padding: '18px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{
          fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 400,
          color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, margin: 0,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {post.caption}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, color: ACCENT, letterSpacing: '0.05em' }}>{post.tag}</span>
          <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>{post.timestamp}</span>
        </div>

        {/* Engagement bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <Heart style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.3)', fill: 'transparent' }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{post.likes}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <MessageCircle style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.3)' }} />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{post.comments}</span>
          </div>
          <a href="#" style={{
            marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5,
            fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: hovered ? ACCENT : 'rgba(255,255,255,0.25)',
            textDecoration: 'none', transition: 'color 0.3s',
          }}>
            View Post <ExternalLink style={{ width: 9, height: 9 }} />
          </a>
        </div>
      </div>

      {/* Bottom accent line */}
      <div style={{
        height: 2, background: ACCENT,
        transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform 0.45s ease',
      }} />
    </motion.div>
  );
}

export default function InstagramFeed() {
  return (
    <section style={{
      background: '#030909',
      padding: 'clamp(64px, 8vw, 104px) clamp(20px, 4vw, 52px)',
      fontFamily: "'Barlow Condensed', sans-serif",
      borderTop: '1px solid rgba(255,255,255,0.04)',
      position: 'relative', overflow: 'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,900;1,900&family=Barlow:wght@300;400;500;600;700&display=swap');
      `}</style>

      {/* Ambient glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, background: 'radial-gradient(ellipse, rgba(0,212,182,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48, flexWrap: 'wrap', gap: 24 }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16,
            background: 'linear-gradient(135deg, rgba(240,148,51,0.12), rgba(188,24,136,0.12))',
            border: '1px solid rgba(188,24,136,0.2)',
            padding: '7px 16px 7px 10px',
          }}>
            <div style={{
              width: 20, height: 20,
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Instagram style={{ width: 11, height: 11, color: '#fff' }} />
            </div>
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
              @midfield.fc
            </span>
          </div>

          <div style={{ overflow: 'hidden' }}>
            <motion.h2
              initial={{ y: '110%' }} whileInView={{ y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(40px, 5.5vw, 68px)', fontWeight: 900,
                textTransform: 'uppercase', letterSpacing: '-0.03em',
                color: '#fff', lineHeight: 0.88, margin: 0,
              }}
            >
              Follow The<br />
              <span style={{
                background: 'linear-gradient(135deg, #f09433 0%, #dc2743 50%, #bc1888 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>Culture.</span>
            </motion.h2>
          </div>
        </div>

        {/* Right side — follower count + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 32 }}>
            {[
              { n: '284K', l: 'Followers' },
              { n: '1.2K', l: 'Posts' },
              { n: '4.8M', l: 'Monthly Reach' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 8, fontWeight: 600, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
              color: '#fff', textDecoration: 'none',
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 900,
              letterSpacing: '0.25em', textTransform: 'uppercase',
              padding: '13px 28px',
              transition: 'filter 0.25s',
            }}
            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.12)')}
            onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
          >
            <Instagram style={{ width: 15, height: 15 }} />
            Follow Us <ArrowRight style={{ width: 14, height: 14 }} />
          </a>
        </div>
      </div>

      {/* Posts grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {POSTS.map((post, i) => (
          <PostCard key={post.id} post={post} index={i} />
        ))}
      </div>

      {/* Bottom CTA strip */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        style={{
          marginTop: 32, padding: '20px 28px',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32,
            background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Instagram style={{ width: 16, height: 16, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 15, fontWeight: 800, textTransform: 'uppercase', color: '#fff', letterSpacing: '0.04em' }}>Tag us in your fit</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em' }}>Use <strong style={{ color: ACCENT }}>#RuleTheMidfield</strong> for a chance to be featured</div>
          </div>
        </div>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700,
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', textDecoration: 'none',
            display: 'flex', alignItems: 'center', gap: 6,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = ACCENT)}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
        >
          Open Instagram <ExternalLink style={{ width: 12, height: 12 }} />
        </a>
      </motion.div>
    </section>
  );
}