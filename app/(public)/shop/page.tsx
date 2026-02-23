// // v2 (dummy)
// 'use client';

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import Image from 'next/image';
// import { SlidersHorizontal, X, Check } from 'lucide-react';
// import { ALL_DUMMY_PRODUCTS, CATEGORIES_LIST, PAGE_SIZE, DummyProduct } from '@/data/dummyProducts';
// import gsap from 'gsap';

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface FilterState {
//   condition: string[];
//   priceMax: number;
//   sort: 'default' | 'low-high' | 'high-low';
// }

// const CONDITION_OPTIONS = ['Brand New', 'New with Tags', 'Used - Like New', 'Used - Good'];
// const ACCENT = '#00d4b6';

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function applyFilters(products: DummyProduct[], cat: string, filters: FilterState): DummyProduct[] {
//   let result = cat === 'All' ? products : products.filter(p => p.category === cat);

//   if (filters.condition.length > 0)
//     result = result.filter(p => filters.condition.includes(p.condition));

//   result = result.filter(p => p.price <= filters.priceMax);

//   if (filters.sort === 'low-high') result = [...result].sort((a, b) => a.price - b.price);
//   else if (filters.sort === 'high-low') result = [...result].sort((a, b) => b.price - a.price);

//   return result;
// }

// // ─── Sword-slash tear animation ───────────────────────────────────────────────
// function slashClose(sheetEl: HTMLElement, onDone: () => void) {
//   const slash = document.createElement('div');
//   slash.style.cssText = `
//     position:absolute;inset:0;z-index:9999;pointer-events:none;overflow:hidden;
//     border-radius:inherit;
//   `;

//   const line = document.createElement('div');
//   line.style.cssText = `
//     position:absolute;top:-20%;left:-60%;width:60%;height:200%;
//     background:linear-gradient(90deg, transparent, rgba(0,212,182,0.6) 40%, rgba(255,255,255,0.9) 50%, rgba(0,212,182,0.6) 60%, transparent);
//     transform:skewX(-20deg);opacity:0;
//   `;
//   slash.appendChild(line);

//   // Two halves for the tear
//   const top = sheetEl.cloneNode(true) as HTMLElement;
//   const bot = sheetEl.cloneNode(true) as HTMLElement;

//   top.style.cssText += `position:absolute;inset:0;clip-path:polygon(0 0, 100% 0, 100% 50%, 0 50%);pointer-events:none;`;
//   bot.style.cssText += `position:absolute;inset:0;clip-path:polygon(0 50%, 100% 50%, 100% 100%, 0 100%);pointer-events:none;`;

//   sheetEl.style.position = 'relative';
//   sheetEl.style.overflow = 'hidden';
//   sheetEl.appendChild(slash);
//   sheetEl.appendChild(top);
//   sheetEl.appendChild(bot);

//   const tl = gsap.timeline({ onComplete: onDone });

//   // Phase 1: slash sweeps across
//   tl.to(line, { opacity: 1, left: '120%', duration: 0.25, ease: 'power3.out' })
//     // Phase 2: tear apart — top flies up, bottom flies down
//     .to(top, { y: '-60%', opacity: 0, skewX: -5, duration: 0.3, ease: 'power3.in' }, '-=0.05')
//     .to(bot, { y: '60%', opacity: 0, skewX: 5, duration: 0.3, ease: 'power3.in' }, '<')
//     .to(sheetEl, { opacity: 0, duration: 0.1 }, '-=0.1');
// }

// // ─── Product Card ─────────────────────────────────────────────────────────────
// function ProductCard({ product }: { product: DummyProduct }) {
//   const cardRef = useRef<HTMLDivElement>(null);
//   const imgRef = useRef<HTMLDivElement>(null);
//   const slashRef = useRef<HTMLDivElement>(null);
//   const isHovering = useRef(false);

//   const handleMouseEnter = useCallback(() => {
//     if (window.innerWidth < 1024) return;
//     isHovering.current = true;

//     // Image zoom
//     if (imgRef.current) {
//       gsap.to(imgRef.current.querySelector('img'), {
//         scale: 1.07,
//         duration: 0.5,
//         ease: 'power2.out',
//       });
//     }

//     // Slash animation
//     if (slashRef.current) {
//       gsap.fromTo(
//         slashRef.current,
//         { x: '-100%', opacity: 0.9 },
//         { x: '200%', opacity: 0, duration: 0.55, ease: 'power3.out' }
//       );
//     }
//   }, []);

//   const handleMouseLeave = useCallback(() => {
//     if (window.innerWidth < 1024) return;
//     isHovering.current = false;

//     if (imgRef.current) {
//       gsap.to(imgRef.current.querySelector('img'), {
//         scale: 1,
//         duration: 0.4,
//         ease: 'power2.out',
//       });
//     }
//   }, []);

//   const conditionColor: Record<string, string> = {
//     'Brand New': '#00d4b6',
//     'New with Tags': '#6ee7b7',
//     'Used - Like New': '#fbbf24',
//     'Used - Good': '#f87171',
//   };

//   return (
//     <div
//       ref={cardRef}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       className="product-card"
//       style={{
//         background: '#0d1515',
//         border: '1px solid rgba(255,255,255,0.07)',
//         borderRadius: 12,
//         overflow: 'hidden',
//         display: 'flex',
//         flexDirection: 'column',
//         cursor: 'pointer',
//         position: 'relative',
//         // Border shine: lighter on right/bottom, dimmer on left/top
//         boxShadow: `
//           inset 1px 0 0 rgba(255,255,255,0.03),
//           inset 0 1px 0 rgba(255,255,255,0.03),
//           inset -1px 0 0 rgba(255,255,255,0.08),
//           inset 0 -1px 0 rgba(255,255,255,0.08),
//           0 4px 24px rgba(0,0,0,0.4)
//         `,
//         transition: 'box-shadow 0.3s ease',
//       }}
//     >
//       {/* Image container */}
//       <div
//         ref={imgRef}
//         style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#111d1d' }}
//       >
//         {/* Diagonal slash strip — GSAP target */}
//         <div
//           ref={slashRef}
//           style={{
//             position: 'absolute',
//             inset: 0,
//             zIndex: 10,
//             pointerEvents: 'none',
//             background: 'linear-gradient(105deg, transparent 20%, rgba(0,212,182,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(0,212,182,0.15) 55%, transparent 80%)',
//             transform: 'translateX(-100%)',
//             width: '60%',
//             filter: 'blur(4px)',
//           }}
//         />

//         <Image
//           src={product.image}
//           alt={product.title}
//           fill
//           sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
//           style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
//         />

//         {/* Condition badge */}
//         <div
//           style={{
//             position: 'absolute',
//             top: 12,
//             left: 12,
//             background: 'rgba(2,6,6,0.8)',
//             backdropFilter: 'blur(8px)',
//             border: `1px solid ${conditionColor[product.condition] ?? ACCENT}`,
//             borderRadius: 4,
//             padding: '3px 8px',
//             fontSize: 9,
//             fontWeight: 700,
//             letterSpacing: '0.15em',
//             textTransform: 'uppercase',
//             color: conditionColor[product.condition] ?? ACCENT,
//             fontFamily: "'Barlow', sans-serif",
//           }}
//         >
//           {product.condition}
//         </div>
//       </div>

//       {/* Info — adaptive density via CSS classes */}
//       <div className="card-info" style={{ padding: '12px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>

//         {/* Brand — desktop + tablet only */}
//         <div className="card-brand" style={{
//           fontSize: 9,
//           fontWeight: 700,
//           letterSpacing: '0.2em',
//           textTransform: 'uppercase',
//           color: ACCENT,
//           fontFamily: "'Barlow', sans-serif",
//         }}>
//           {product.brand}
//         </div>

//         {/* Title */}
//         <h3 style={{
//           fontFamily: "'Barlow Condensed', sans-serif",
//           fontSize: 'clamp(15px, 2.5vw, 18px)',
//           fontWeight: 700,
//           textTransform: 'uppercase',
//           color: '#fff',
//           lineHeight: 1.2,
//           margin: 0,
//           display: '-webkit-box',
//           WebkitLineClamp: 2,
//           WebkitBoxOrient: 'vertical',
//           overflow: 'hidden',
//         }}>
//           {product.title}
//         </h3>

//         {/* Price row */}
//         <div style={{ marginTop: 'auto', paddingTop: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}>
//           <span style={{
//             fontFamily: "'Barlow Condensed', sans-serif",
//             fontSize: 16,
//             fontWeight: 700,
//             color: '#fff',
//           }}>
//             £{product.price}
//           </span>
//           {product.compareAtPrice && (
//             <span className="card-compare" style={{
//               fontFamily: "'Barlow', sans-serif",
//               fontSize: 13,
//               color: 'rgba(255,255,255,0.3)',
//               textDecoration: 'line-through',
//             }}>
//               £{product.compareAtPrice}
//             </span>
//           )}
//           {product.compareAtPrice && (
//             <span className="card-save" style={{
//               fontFamily: "'Barlow', sans-serif",
//               fontSize: 10,
//               fontWeight: 700,
//               color: '#00d4b6',
//               background: 'rgba(0,212,182,0.1)',
//               border: '1px solid rgba(0,212,182,0.2)',
//               borderRadius: 3,
//               padding: '1px 5px',
//             }}>
//               -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
//             </span>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Filter Sheet ─────────────────────────────────────────────────────────────
// function FilterSheet({
//   filters,
//   onApply,
//   onClose,
// }: {
//   filters: FilterState;
//   onApply: (f: FilterState) => void;
//   onClose: () => void;
// }) {
//   const [local, setLocal] = useState<FilterState>(filters);
//   const sheetRef = useRef<HTMLDivElement>(null);
//   const overlayRef = useRef<HTMLDivElement>(null);

//   // Slide in on mount
//   useEffect(() => {
//     if (sheetRef.current) {
//       gsap.fromTo(sheetRef.current, { y: '100%' }, { y: 0, duration: 0.4, ease: 'power3.out' });
//     }
//     if (overlayRef.current) {
//       gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
//     }
//   }, []);

//   const toggleCondition = (c: string) => {
//     setLocal(prev => ({
//       ...prev,
//       condition: prev.condition.includes(c)
//         ? prev.condition.filter(x => x !== c)
//         : [...prev.condition, c],
//     }));
//   };

//   const handleApply = () => {
//     if (!sheetRef.current) { onApply(local); onClose(); return; }

//     slashClose(sheetRef.current, () => {
//       onApply(local);
//       onClose();
//     });
//   };

//   const handleReset = () => setLocal({ condition: [], priceMax: 500, sort: 'default' });

//   return (
//     <div
//       ref={overlayRef}
//       style={{
//         position: 'fixed', inset: 0, zIndex: 200,
//         background: 'rgba(0,0,0,0.6)',
//         backdropFilter: 'blur(4px)',
//         display: 'flex', alignItems: 'flex-end',
//       }}
//       onClick={e => { if (e.target === overlayRef.current) onClose(); }}
//     >
//       <div
//         ref={sheetRef}
//         style={{
//           width: '100%',
//           maxHeight: '85vh',
//           background: 'rgba(13,21,21,0.92)',
//           backdropFilter: 'blur(24px)',
//           WebkitBackdropFilter: 'blur(24px)',
//           border: '1px solid rgba(0,212,182,0.12)',
//           borderBottom: 'none',
//           borderRadius: '20px 20px 0 0',
//           padding: 'clamp(24px, 4vw, 40px)',
//           overflowY: 'auto',
//           position: 'relative',
//         }}
//       >
//         {/* Header */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
//           <div>
//             <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900, textTransform: 'uppercase', color: '#fff', letterSpacing: '-0.01em' }}>
//               Filters
//             </div>
//             <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
//               Refine your search
//             </div>
//           </div>
//           <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
//             <X size={16} />
//           </button>
//         </div>

//         {/* Condition */}
//         <div style={{ marginBottom: 32 }}>
//           <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>
//             Condition
//           </div>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
//             {CONDITION_OPTIONS.map(c => {
//               const active = local.condition.includes(c);
//               return (
//                 <button
//                   key={c}
//                   onClick={() => toggleCondition(c)}
//                   style={{
//                     background: active ? 'rgba(0,212,182,0.12)' : 'rgba(255,255,255,0.03)',
//                     border: `1px solid ${active ? ACCENT : 'rgba(255,255,255,0.1)'}`,
//                     borderRadius: 6,
//                     padding: '8px 14px',
//                     display: 'flex', alignItems: 'center', gap: 7,
//                     cursor: 'pointer',
//                     color: active ? ACCENT : 'rgba(255,255,255,0.55)',
//                     fontFamily: "'Barlow', sans-serif",
//                     fontSize: 12,
//                     fontWeight: 600,
//                     transition: 'all 0.2s',
//                   }}
//                 >
//                   {active && <Check size={12} />}
//                   {c}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Price */}
//         <div style={{ marginBottom: 32 }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
//             <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT }}>
//               Max Price
//             </div>
//             <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff' }}>
//               £{local.priceMax}
//             </span>
//           </div>
//           <input
//             type="range" min={20} max={500} step={10}
//             value={local.priceMax}
//             onChange={e => setLocal(prev => ({ ...prev, priceMax: Number(e.target.value) }))}
//             className="price-range"
//             style={{ width: '100%' }}
//           />
//         </div>

//         {/* Sort */}
//         <div style={{ marginBottom: 40 }}>
//           <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 14 }}>
//             Sort By
//           </div>
//           <div style={{ display: 'flex', gap: 10 }}>
//             {(['default', 'low-high', 'high-low'] as const).map(s => {
//               const label = s === 'default' ? 'Newest' : s === 'low-high' ? 'Price: Low → High' : 'Price: High → Low';
//               const active = local.sort === s;
//               return (
//                 <button
//                   key={s}
//                   onClick={() => setLocal(prev => ({ ...prev, sort: s }))}
//                   style={{
//                     background: active ? 'rgba(0,212,182,0.12)' : 'rgba(255,255,255,0.03)',
//                     border: `1px solid ${active ? ACCENT : 'rgba(255,255,255,0.1)'}`,
//                     borderRadius: 6,
//                     padding: '8px 14px',
//                     cursor: 'pointer',
//                     color: active ? ACCENT : 'rgba(255,255,255,0.55)',
//                     fontFamily: "'Barlow', sans-serif",
//                     fontSize: 12,
//                     fontWeight: 600,
//                     transition: 'all 0.2s',
//                     flex: 1,
//                     textAlign: 'center',
//                   }}
//                 >
//                   {label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Actions */}
//         <div style={{ display: 'flex', gap: 12 }}>
//           <button
//             onClick={handleReset}
//             style={{
//               flex: 1,
//               padding: '14px',
//               background: 'rgba(255,255,255,0.04)',
//               border: '1px solid rgba(255,255,255,0.1)',
//               borderRadius: 8,
//               color: 'rgba(255,255,255,0.5)',
//               fontFamily: "'Barlow', sans-serif",
//               fontSize: 12,
//               fontWeight: 700,
//               letterSpacing: '0.1em',
//               textTransform: 'uppercase',
//               cursor: 'pointer',
//               transition: 'all 0.2s',
//             }}
//           >
//             Reset
//           </button>
//           <button
//             onClick={handleApply}
//             style={{
//               flex: 2,
//               padding: '14px',
//               background: ACCENT,
//               border: 'none',
//               borderRadius: 8,
//               color: '#020606',
//               fontFamily: "'Barlow Condensed', sans-serif",
//               fontSize: 16,
//               fontWeight: 900,
//               letterSpacing: '0.1em',
//               textTransform: 'uppercase',
//               cursor: 'pointer',
//               transition: 'all 0.2s',
//             }}
//           >
//             Apply Filters
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Autocomplete Search ───────────────────────────────────────────────────────
// function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
//   const [query, setQuery] = useState('');
//   const [ghost, setGhost] = useState('');
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [open, setOpen] = useState(false);
//   const [focused, setFocused] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const wrapRef = useRef<HTMLDivElement>(null);

//   const allTitles = ALL_DUMMY_PRODUCTS.map(p => p.title);

//   const updateSuggestions = (val: string) => {
//     if (!val.trim()) {
//       setSuggestions([]);
//       setGhost('');
//       setOpen(false);
//       return;
//     }
//     const lower = val.toLowerCase();
//     const matched = allTitles
//       .filter(t => t.toLowerCase().includes(lower))
//       .slice(0, 6);

//     setSuggestions(matched);
//     setOpen(matched.length > 0);

//     // Ghost text — first suggestion that starts with query
//     const startsWith = allTitles.find(t => t.toLowerCase().startsWith(lower));
//     if (startsWith) {
//       setGhost(val + startsWith.slice(val.length));
//     } else {
//       setGhost('');
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const val = e.target.value;
//     setQuery(val);
//     updateSuggestions(val);
//     onSearch(val);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Tab' && ghost) {
//       e.preventDefault();
//       setQuery(ghost);
//       setSuggestions([]);
//       setGhost('');
//       setOpen(false);
//       onSearch(ghost);
//     }
//     if (e.key === 'Escape') {
//       setOpen(false);
//       inputRef.current?.blur();
//     }
//   };

//   const selectSuggestion = (s: string) => {
//     setQuery(s);
//     setSuggestions([]);
//     setGhost('');
//     setOpen(false);
//     onSearch(s);
//   };

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handler = (e: MouseEvent) => {
//       if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   return (
//     <div ref={wrapRef} className="search-wrap" style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
//       {/* Input wrapper */}
//       <div style={{
//         position: 'relative',
//         borderRadius: 50,
//         border: `1px solid ${focused ? 'rgba(0,212,182,0.4)' : 'rgba(255,255,255,0.1)'}`,
//         background: 'rgba(255,255,255,0.04)',
//         backdropFilter: 'blur(12px)',
//         boxShadow: focused ? '0 0 0 3px rgba(0,212,182,0.08), 0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
//         transition: 'all 0.25s ease',
//         overflow: 'hidden',
//       }}>
//         {/* Ghost text behind input */}
//         {ghost && (
//           <div style={{
//             position: 'absolute',
//             left: 24,
//             top: '50%',
//             transform: 'translateY(-50%)',
//             fontFamily: "'Barlow', sans-serif",
//             fontSize: 14,
//             color: 'rgba(255,255,255,0.2)',
//             pointerEvents: 'none',
//             whiteSpace: 'nowrap',
//             overflow: 'hidden',
//             width: 'calc(100% - 48px)',
//           }}>
//             {ghost}
//           </div>
//         )}

//         <input
//           ref={inputRef}
//           type="text"
//           value={query}
//           onChange={handleChange}
//           onKeyDown={handleKeyDown}
//           onFocus={() => { setFocused(true); if (suggestions.length) setOpen(true); }}
//           onBlur={() => setFocused(false)}
//           placeholder="Search boots, kits, brands…"
//           style={{
//             width: '100%',
//             background: 'transparent',
//             border: 'none',
//             outline: 'none',
//             padding: '16px 24px',
//             fontFamily: "'Barlow', sans-serif",
//             fontSize: 14,
//             color: '#fff',
//             position: 'relative',
//             zIndex: 2,
//           }}
//         />

//         {query && (
//           <button
//             onClick={() => { setQuery(''); setSuggestions([]); setGhost(''); setOpen(false); onSearch(''); }}
//             style={{
//               position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
//               background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%',
//               width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center',
//               cursor: 'pointer', color: 'rgba(255,255,255,0.5)', zIndex: 3,
//             }}
//           >
//             <X size={12} />
//           </button>
//         )}
//       </div>

//       {/* Tab hint */}
//       {ghost && open && (
//         <div style={{
//           position: 'absolute', right: 52, top: '50%', transform: 'translateY(-50%)',
//           fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.25)',
//           letterSpacing: '0.1em', zIndex: 5, pointerEvents: 'none',
//           background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
//           borderRadius: 3, padding: '2px 6px',
//         }}>
//           TAB
//         </div>
//       )}

//       {/* Suggestions dropdown */}
//       {open && (
//         <div
//           className="suggestions-drop"
//           style={{
//             position: 'absolute',
//             top: 'calc(100% + 8px)',
//             left: 0,
//             right: 0,
//             background: 'rgba(13,21,21,0.95)',
//             backdropFilter: 'blur(20px)',
//             WebkitBackdropFilter: 'blur(20px)',
//             border: '1px solid rgba(0,212,182,0.15)',
//             borderRadius: 16,
//             overflow: 'hidden',
//             zIndex: 100,
//             boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
//             animation: 'dropFadeIn 0.2s ease',
//           }}
//         >
//           {suggestions.map((s, i) => (
//             <button
//               key={i}
//               onMouseDown={() => selectSuggestion(s)}
//               style={{
//                 display: 'block',
//                 width: '100%',
//                 textAlign: 'left',
//                 padding: '12px 20px',
//                 background: 'transparent',
//                 border: 'none',
//                 borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
//                 color: 'rgba(255,255,255,0.8)',
//                 fontFamily: "'Barlow', sans-serif",
//                 fontSize: 13,
//                 cursor: 'pointer',
//                 transition: 'background 0.15s',
//               }}
//               onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,182,0.08)')}
//               onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//             >
//               <span style={{ color: ACCENT, fontWeight: 600 }}>
//                 {s.slice(0, query.length)}
//               </span>
//               {s.slice(query.length)}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────────────────────────
// export default function ShopPage() {
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filters, setFilters] = useState<FilterState>({ condition: [], priceMax: 500, sort: 'default' });
//   const [filterOpen, setFilterOpen] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const sentinelRef = useRef<HTMLDivElement>(null);

//   // Derived filtered + searched list
//   const filtered = applyFilters(ALL_DUMMY_PRODUCTS, activeCategory, filters).filter(p =>
//     !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.brand.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const visible = filtered.slice(0, visibleCount);
//   const hasMore = visibleCount < filtered.length;

//   // Infinite scroll via IntersectionObserver
//   useEffect(() => {
//     if (!sentinelRef.current) return;
//     const obs = new IntersectionObserver(
//       entries => {
//         if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
//           setIsLoadingMore(true);
//           setTimeout(() => {
//             setVisibleCount(c => c + PAGE_SIZE);
//             setIsLoadingMore(false);
//           }, 600);
//         }
//       },
//       { rootMargin: '200px' }
//     );
//     obs.observe(sentinelRef.current);
//     return () => obs.disconnect();
//   }, [hasMore, isLoadingMore]);

//   // Reset page when filter/search changes
//   useEffect(() => {
//     setVisibleCount(PAGE_SIZE);
//   }, [activeCategory, searchQuery, filters]);

//   const activeFilterCount = filters.condition.length + (filters.priceMax < 500 ? 1 : 0) + (filters.sort !== 'default' ? 1 : 0);

//   return (
//     <div style={{ background: '#020606', minHeight: '100vh', color: '#fff', paddingTop: 80 }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
//         *, *::before, *::after { box-sizing: border-box; }

//         /* Grid bg */
//         .shop-grid-bg {
//           position: fixed; inset: 0; z-index: 0; pointer-events: none;
//           background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
//                             linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
//           background-size: 56px 56px;
//         }

//         /* Category pills */
//         .cat-scroll { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; }
//         .cat-scroll::-webkit-scrollbar { display:none; }
//         .cat-pill {
//           background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
//           color: rgba(255,255,255,0.5); padding: 8px 20px; border-radius: 100px;
//           font-size: 11px; font-weight: 700; letter-spacing: 0.15em;
//           text-transform: uppercase; cursor: pointer; white-space: nowrap;
//           transition: all 0.25s; font-family: 'Barlow', sans-serif;
//           flex-shrink: 0;
//         }
//         .cat-pill:hover { border-color: rgba(255,255,255,0.25); color: #fff; }
//         .cat-pill.active {
//           background: rgba(0,212,182,0.1); border-color: ${ACCENT};
//           color: ${ACCENT}; box-shadow: 0 0 16px rgba(0,212,182,0.12);
//         }

//         /* Filter button */
//         .filter-btn {
//           display: flex; align-items: center; gap: 7px;
//           background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
//           color: rgba(255,255,255,0.7); padding: 8px 18px; border-radius: 8px;
//           font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
//           text-transform: uppercase; cursor: pointer; white-space: nowrap;
//           transition: all 0.2s; font-family: 'Barlow', sans-serif; flex-shrink: 0;
//         }
//         .filter-btn:hover { border-color: rgba(0,212,182,0.4); color: ${ACCENT}; }
//         .filter-btn.has-filters { border-color: ${ACCENT}; color: ${ACCENT}; background: rgba(0,212,182,0.08); }

//         /* Product grid */
//         .product-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 14px;
//         }
//         @media (min-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
//         @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }

//         /* Card responsiveness */
//         @media (max-width: 639px) {
//           .card-brand { display: none !important; }
//           .card-compare { display: none !important; }
//           .card-save { display: none !important; }
//         }
//         @media (min-width: 640px) and (max-width: 1023px) {
//           .card-compare { display: none !important; }
//           .card-save { display: none !important; }
//         }

//         /* Product card hover */
//         @media (min-width: 1024px) {
//           .product-card:hover {
//             box-shadow:
//               inset 1px 0 0 rgba(0,212,182,0.15),
//               inset 0 1px 0 rgba(0,212,182,0.15),
//               inset -1px 0 0 rgba(0,212,182,0.3),
//               inset 0 -1px 0 rgba(0,212,182,0.3),
//               0 8px 40px rgba(0,0,0,0.6) !important;
//           }
//         }

//         /* Suggestions dropdown fade */
//         @keyframes dropFadeIn {
//           from { opacity:0; transform:translateY(-6px); }
//           to   { opacity:1; transform:translateY(0); }
//         }

//         /* Price range slider */
//         .price-range { -webkit-appearance:none; height:3px; border-radius:4px; outline:none; cursor:pointer; }
//         .price-range::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:${ACCENT}; cursor:pointer; border: 2px solid #020606; box-shadow: 0 0 8px rgba(0,212,182,0.5); }
//         .price-range::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:${ACCENT}; cursor:pointer; border:2px solid #020606; }

//         /* Loading dots */
//         @keyframes loadDot { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
//         .load-dot { width:6px; height:6px; border-radius:50%; background:${ACCENT}; animation: loadDot 1.2s ease infinite; display:inline-block; }
//         .load-dot:nth-child(2) { animation-delay:0.2s; }
//         .load-dot:nth-child(3) { animation-delay:0.4s; }

//         /* Empty state */
//         @keyframes pulse-ring {
//           0% { transform:scale(0.8); opacity:0.8; }
//           100% { transform:scale(2); opacity:0; }
//         }
//       `}</style>

//       {/* BG grid */}
//       <div className="shop-grid-bg" />

//       <div style={{ position: 'relative', zIndex: 10 }}>

//         {/* ── Page Header ── */}
//         <div style={{ padding: 'clamp(32px, 5vw, 64px) clamp(16px, 5vw, 64px) 24px' }}>
//           <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
//             {filtered.length} Products
//           </div>
//           <h1 style={{
//             fontFamily: "'Barlow Condensed', sans-serif",
//             fontSize: 'clamp(40px, 7vw, 80px)',
//             fontWeight: 900,
//             textTransform: 'uppercase',
//             color: '#fff',
//             lineHeight: 1,
//             letterSpacing: '-0.02em',
//             margin: 0,
//           }}>
//             Shop{' '}
//             <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
//               All
//             </span>
//           </h1>
//         </div>

//         {/* ── Search Bar ── */}
//         <div style={{
//           padding: '0 clamp(16px, 5vw, 64px) 32px',
//           display: 'flex',
//           justifyContent: 'center',
//         }}>
//           <SearchBar onSearch={setSearchQuery} />
//         </div>

//         {/* ── Category Pills + Filter Button ── */}
//         <div style={{
//           padding: '0 clamp(16px, 5vw, 64px) 40px',
//           display: 'flex',
//           gap: 12,
//           alignItems: 'center',
//         }}>
//           <div className="cat-scroll" style={{ flex: 1 }}>
//             {CATEGORIES_LIST.map(cat => (
//               <button
//                 key={cat}
//                 className={`cat-pill${activeCategory === cat ? ' active' : ''}`}
//                 onClick={() => setActiveCategory(cat)}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>
//           <button
//             className={`filter-btn${activeFilterCount > 0 ? ' has-filters' : ''}`}
//             onClick={() => setFilterOpen(true)}
//           >
//             <SlidersHorizontal size={13} />
//             Filters
//             {activeFilterCount > 0 && (
//               <span style={{
//                 background: ACCENT, color: '#020606',
//                 borderRadius: '50%', width: 18, height: 18,
//                 display: 'flex', alignItems: 'center', justifyContent: 'center',
//                 fontSize: 9, fontWeight: 900,
//               }}>
//                 {activeFilterCount}
//               </span>
//             )}
//           </button>
//         </div>

//         {/* ── Product Grid ── */}
//         <div className="product-grid" style={{ padding: '0 clamp(16px, 5vw, 64px) 80px' }}>
//           {visible.length === 0 ? (
//             <div style={{
//               gridColumn: '1/-1',
//               display: 'flex', flexDirection: 'column', alignItems: 'center',
//               padding: '80px 0', gap: 16,
//             }}>
//               <div style={{ position: 'relative', width: 48, height: 48 }}>
//                 <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: ACCENT, opacity: 0.2, animation: 'pulse-ring 2s ease-out infinite' }} />
//                 <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,212,182,0.1)', border: `1px solid rgba(0,212,182,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                   <span style={{ fontSize: 20 }}>🔍</span>
//                 </div>
//               </div>
//               <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
//                 No products found
//               </div>
//               <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
//                 Try adjusting your filters or search
//               </div>
//             </div>
//           ) : (
//             visible.map(p => <ProductCard key={p.id} product={p} />)
//           )}
//         </div>

//         {/* ── Infinite scroll sentinel ── */}
//         <div ref={sentinelRef} style={{ height: 1 }} />

//         {/* ── Loading indicator ── */}
//         {isLoadingMore && (
//           <div style={{
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             gap: 6, padding: '24px 0 48px',
//           }}>
//             <div className="load-dot" />
//             <div className="load-dot" />
//             <div className="load-dot" />
//             <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginLeft: 8 }}>
//               Loading more
//             </span>
//           </div>
//         )}

//         {!hasMore && visible.length > 0 && (
//           <div style={{
//             textAlign: 'center', padding: '16px 0 48px',
//             fontFamily: "'Barlow', sans-serif", fontSize: 11,
//             color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase',
//           }}>
//             — End of results —
//           </div>
//         )}
//       </div>

//       {/* ── Filter Sheet ── */}
//       {filterOpen && (
//         <FilterSheet
//           filters={filters}
//           onApply={f => setFilters(f)}
//           onClose={() => setFilterOpen(false)}
//         />
//       )}
//     </div>
//   );
// }

// v3 real
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { SlidersHorizontal, X, Check } from 'lucide-react';
import gsap from 'gsap';
import Link from 'next/link';

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
  sort: 'default' | 'low-high' | 'high-low';
}

const CONDITION_OPTIONS = ['Brand New', 'New with Tags', 'Used - Like New', 'Used - Good'];
const ACCENT = '#00d4b6';
const PAGE_SIZE = 12;

// ─── Sword-slash tear animation ───────────────────────────────────────────────
function slashClose(sheetEl: HTMLElement, onDone: () => void) {
  const line = document.createElement('div');
  line.style.cssText = `
    position:absolute;top:-20%;left:-60%;width:60%;height:200%;z-index:9999;
    background:linear-gradient(90deg, transparent, rgba(0,212,182,0.6) 40%, rgba(255,255,255,0.9) 50%, rgba(0,212,182,0.6) 60%, transparent);
    transform:skewX(-20deg);opacity:0;pointer-events:none;
  `;
  const top = sheetEl.cloneNode(true) as HTMLElement;
  const bot = sheetEl.cloneNode(true) as HTMLElement;
  top.style.cssText += 'position:absolute;inset:0;clip-path:polygon(0 0,100% 0,100% 50%,0 50%);pointer-events:none;z-index:9998;';
  bot.style.cssText += 'position:absolute;inset:0;clip-path:polygon(0 50%,100% 50%,100% 100%,0 100%);pointer-events:none;z-index:9998;';
  sheetEl.style.position = 'relative';
  sheetEl.style.overflow = 'hidden';
  sheetEl.appendChild(line);
  sheetEl.appendChild(top);
  sheetEl.appendChild(bot);
  gsap.timeline({ onComplete: onDone })
    .to(line, { opacity: 1, left: '120%', duration: 0.25, ease: 'power3.out' })
    .to(top, { y: '-60%', opacity: 0, skewX: -5, duration: 0.3, ease: 'power3.in' }, '-=0.05')
    .to(bot, { y: '60%', opacity: 0, skewX: 5, duration: 0.3, ease: 'power3.in' }, '<')
    .to(sheetEl, { opacity: 0, duration: 0.1 }, '-=0.1');
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const imgRef = useRef<HTMLDivElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = useCallback(() => {
    if (window.innerWidth < 1024) return;
    if (imgRef.current) gsap.to(imgRef.current.querySelector('img'), { scale: 1.07, duration: 0.5, ease: 'power2.out' });
    if (slashRef.current) gsap.fromTo(slashRef.current, { x: '-100%', opacity: 0.9 }, { x: '200%', opacity: 0, duration: 0.55, ease: 'power3.out' });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (window.innerWidth < 1024) return;
    if (imgRef.current) gsap.to(imgRef.current.querySelector('img'), { scale: 1, duration: 0.4, ease: 'power2.out' });
  }, []);

  const conditionColor: Record<string, string> = {
    'Brand New': '#00d4b6',
    'New with Tags': '#6ee7b7',
    'Used - Like New': '#fbbf24',
    'Used - Good': '#f87171',
  };

  const imageUrl = product.images?.[0]?.url;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/shop/${product._id}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="product-card"
        style={{
          background: '#0d1515',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          cursor: 'pointer', position: 'relative',
          boxShadow: `
          inset 1px 0 0 rgba(255,255,255,0.03),
          inset 0 1px 0 rgba(255,255,255,0.03),
          inset -1px 0 0 rgba(255,255,255,0.08),
          inset 0 -1px 0 rgba(255,255,255,0.08),
          0 4px 24px rgba(0,0,0,0.4)
        `,
          transition: 'box-shadow 0.3s ease',
          opacity: isOutOfStock ? 0.6 : 1,
        }}
      >
        {/* Image */}
        <div ref={imgRef} style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#111d1d' }}>
          <div ref={slashRef} style={{
            position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none',
            background: 'linear-gradient(105deg, transparent 20%, rgba(0,212,182,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(0,212,182,0.15) 55%, transparent 80%)',
            transform: 'translateX(-100%)', width: '60%', filter: 'blur(4px)',
          }} />

          {imageUrl ? (
            <Image
              src={imageUrl} alt={product.title} fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.1)', fontSize: 32 }}>
              📦
            </div>
          )}

          {/* Condition badge */}
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(2,6,6,0.85)', backdropFilter: 'blur(8px)',
            border: `1px solid ${conditionColor[product.condition] ?? ACCENT}`,
            borderRadius: 4, padding: '3px 7px',
            fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: conditionColor[product.condition] ?? ACCENT,
            fontFamily: "'Barlow', sans-serif",
          }}>
            {product.condition}
          </div>

          {/* Out of stock */}
          {isOutOfStock && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(2,6,6,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 900, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 14px' }}>
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="card-info" style={{ padding: '12px 14px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {product.brand && (
            <div className="card-brand" style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, fontFamily: "'Barlow', sans-serif" }}>
              {product.brand}
            </div>
          )}
          <h3 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(14px, 2.2vw, 17px)', fontWeight: 700,
            textTransform: 'uppercase', color: '#fff', lineHeight: 1.2, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {product.title}
          </h3>
          <div style={{ marginTop: 'auto', paddingTop: 10, display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, color: '#fff' }}>
              £{product.price}
            </span>
            {product.compareAtPrice && (
              <span className="card-compare" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>
                £{product.compareAtPrice}
              </span>
            )}
            {product.compareAtPrice && (
              <span className="card-save" style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, color: ACCENT, background: 'rgba(0,212,182,0.1)', border: '1px solid rgba(0,212,182,0.2)', borderRadius: 3, padding: '1px 5px' }}>
                -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton Card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div style={{ background: '#0d1515', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, overflow: 'hidden' }}>
      <div className="skeleton-pulse" style={{ aspectRatio: '3/4' }} />
      <div style={{ padding: '12px 14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="skeleton-pulse" style={{ height: 8, width: '40%', borderRadius: 4 }} />
        <div className="skeleton-pulse" style={{ height: 12, width: '85%', borderRadius: 4 }} />
        <div className="skeleton-pulse" style={{ height: 12, width: '60%', borderRadius: 4 }} />
        <div className="skeleton-pulse" style={{ height: 14, width: '30%', borderRadius: 4, marginTop: 8 }} />
      </div>
    </div>
  );
}

// ─── Filter Sheet ─────────────────────────────────────────────────────────────
function FilterSheet({ filters, onApply, onClose }: {
  filters: FilterState;
  onApply: (f: FilterState) => void;
  onClose: () => void;
}) {
  const [local, setLocal] = useState<FilterState>(filters);
  const sheetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sheetRef.current) gsap.fromTo(sheetRef.current, { y: '100%' }, { y: 0, duration: 0.4, ease: 'power3.out' });
    if (overlayRef.current) gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  }, []);

  const toggleCondition = (c: string) =>
    setLocal(p => ({ ...p, condition: p.condition.includes(c) ? p.condition.filter(x => x !== c) : [...p.condition, c] }));

  const handleApply = () => {
    if (!sheetRef.current) { onApply(local); onClose(); return; }
    slashClose(sheetRef.current, () => { onApply(local); onClose(); });
  };

  return (
    <div ref={overlayRef}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-end' }}
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div ref={sheetRef} style={{
        width: '100%', maxHeight: '85vh',
        background: 'rgba(13,21,21,0.95)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(0,212,182,0.12)', borderBottom: 'none',
        borderRadius: '20px 20px 0 0', padding: 'clamp(24px, 4vw, 40px)',
        overflowY: 'auto', position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 900, textTransform: 'uppercase', color: '#fff' }}>Filters</div>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Refine your search</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }}>
            <X size={16} />
          </button>
        </div>

        {/* Condition */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>Condition</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {CONDITION_OPTIONS.map(c => {
              const active = local.condition.includes(c);
              return (
                <button key={c} onClick={() => toggleCondition(c)} style={{
                  background: active ? 'rgba(0,212,182,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 6, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 7,
                  cursor: 'pointer', color: active ? ACCENT : 'rgba(255,255,255,0.55)',
                  fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                }}>
                  {active && <Check size={12} />}{c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Max Price */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT }}>Max Price</div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: '#fff' }}>£{local.priceMax}</span>
          </div>
          <input type="range" min={20} max={1000} step={10} value={local.priceMax}
            onChange={e => setLocal(p => ({ ...p, priceMax: Number(e.target.value) }))}
            className="price-range" style={{ width: '100%' }} />
        </div>

        {/* Sort */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>Sort By</div>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['default', 'low-high', 'high-low'] as const).map(s => {
              const label = s === 'default' ? 'Newest' : s === 'low-high' ? 'Price ↑' : 'Price ↓';
              const active = local.sort === s;
              return (
                <button key={s} onClick={() => setLocal(p => ({ ...p, sort: s }))} style={{
                  background: active ? 'rgba(0,212,182,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? ACCENT : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 6, padding: '8px 14px', cursor: 'pointer',
                  color: active ? ACCENT : 'rgba(255,255,255,0.55)',
                  fontFamily: "'Barlow', sans-serif", fontSize: 12, fontWeight: 600,
                  transition: 'all 0.2s', flex: 1, textAlign: 'center',
                }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setLocal({ condition: [], priceMax: 1000, sort: 'default' })} style={{
            flex: 1, padding: '14px', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
            color: 'rgba(255,255,255,0.5)', fontFamily: "'Barlow', sans-serif",
            fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
          }}>Reset</button>
          <button onClick={handleApply} style={{
            flex: 2, padding: '14px', background: ACCENT, border: 'none', borderRadius: 8,
            color: '#020606', fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 16, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
          }}>Apply Filters</button>
        </div>
      </div>
    </div>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────
function SearchBar({ products, onSearch }: { products: Product[]; onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('');
  const [ghost, setGhost] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const allTitles = products.map(p => p.title);

  const update = (val: string) => {
    if (!val.trim()) { setSuggestions([]); setGhost(''); setOpen(false); return; }
    const lower = val.toLowerCase();
    const matched = allTitles.filter(t => t.toLowerCase().includes(lower)).slice(0, 6);
    setSuggestions(matched);
    setOpen(matched.length > 0);
    const sw = allTitles.find(t => t.toLowerCase().startsWith(lower));
    setGhost(sw ? val + sw.slice(val.length) : '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val); update(val); onSearch(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab' && ghost) { e.preventDefault(); setQuery(ghost); setSuggestions([]); setGhost(''); setOpen(false); onSearch(ghost); }
    if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur(); }
  };

  const select = (s: string) => { setQuery(s); setSuggestions([]); setGhost(''); setOpen(false); onSearch(s); };

  useEffect(() => {
    const h = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%', maxWidth: 600 }}>
      <div style={{
        position: 'relative', borderRadius: 50,
        border: `1px solid ${focused ? 'rgba(0,212,182,0.4)' : 'rgba(255,255,255,0.1)'}`,
        background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)',
        boxShadow: focused ? '0 0 0 3px rgba(0,212,182,0.08), 0 8px 32px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
        transition: 'all 0.25s ease', overflow: 'hidden',
      }}>
        {ghost && (
          <div style={{
            position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)',
            fontFamily: "'Barlow', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.2)',
            pointerEvents: 'none', whiteSpace: 'nowrap', overflow: 'hidden', width: 'calc(100% - 72px)',
          }}>{ghost}</div>
        )}
        <input ref={inputRef} type="text" value={query}
          onChange={handleChange} onKeyDown={handleKeyDown}
          onFocus={() => { setFocused(true); if (suggestions.length) setOpen(true); }}
          onBlur={() => setFocused(false)}
          placeholder="Search products, brands…"
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', padding: '15px 24px', fontFamily: "'Barlow', sans-serif", fontSize: 14, color: '#fff', position: 'relative', zIndex: 2 }}
        />
        {ghost && open && (
          <div style={{ position: 'absolute', right: query ? 52 : 16, top: '50%', transform: 'translateY(-50%)', fontFamily: "'Barlow', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '2px 6px', zIndex: 5, pointerEvents: 'none' }}>TAB</div>
        )}
        {query && (
          <button onClick={() => { setQuery(''); setSuggestions([]); setGhost(''); setOpen(false); onSearch(''); }}
            style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', zIndex: 3 }}>
            <X size={12} />
          </button>
        )}
      </div>

      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'rgba(13,21,21,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0,212,182,0.15)', borderRadius: 16, overflow: 'hidden', zIndex: 100, boxShadow: '0 16px 48px rgba(0,0,0,0.5)', animation: 'dropFadeIn 0.2s ease' }}>
          {suggestions.map((s, i) => (
            <button key={i} onMouseDown={() => select(s)} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '11px 20px',
              background: 'transparent', border: 'none',
              borderBottom: i < suggestions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              color: 'rgba(255,255,255,0.8)', fontFamily: "'Barlow', sans-serif", fontSize: 13, cursor: 'pointer', transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,212,182,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ color: ACCENT, fontWeight: 600 }}>{s.slice(0, query.length)}</span>
              {s.slice(query.length)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ShopPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCategoryId, setActiveCategoryId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({ condition: [], priceMax: 1000, sort: 'default' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Fetch categories once ──
  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => setCategories(d.categories ?? []));
  }, []);

  // ── Fetch products — re-runs when category, sort, or priceMax changes ──
  useEffect(() => {
    setLoading(true);
    setVisibleCount(PAGE_SIZE);

    const params = new URLSearchParams();
    if (activeCategoryId) params.set('category', activeCategoryId);
    if (filters.sort !== 'default') params.set('sort', filters.sort);
    if (filters.priceMax < 1000) params.set('maxPrice', String(filters.priceMax));

    fetch(`/api/products?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setAllProducts(d.products ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [activeCategoryId, filters.sort, filters.priceMax]);

  // ── Reset visible count on search/condition change ──
  useEffect(() => { setVisibleCount(PAGE_SIZE); }, [searchQuery, filters.condition]);

  // ── Client-side: condition filter + search ──
  const filtered = allProducts.filter(p => {
    if (filters.condition.length > 0 && !filters.condition.includes(p.condition)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return p.title.toLowerCase().includes(q) || (p.brand ?? '').toLowerCase().includes(q);
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // ── Infinite scroll ──
  useEffect(() => {
    if (!sentinelRef.current) return;
    const obs = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => { setVisibleCount(c => c + PAGE_SIZE); setIsLoadingMore(false); }, 500);
        }
      },
      { rootMargin: '200px' }
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasMore, isLoadingMore]);

  const handleCategoryClick = (cat: Category | null) => {
    if (!cat) { setActiveCategory('All'); setActiveCategoryId(''); }
    else { setActiveCategory(cat.name); setActiveCategoryId(cat._id); }
  };

  const activeFilterCount =
    filters.condition.length +
    (filters.priceMax < 1000 ? 1 : 0) +
    (filters.sort !== 'default' ? 1 : 0);

  return (
    <div style={{ background: '#020606', minHeight: '100vh', color: '#fff', paddingTop: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800;900&family=Barlow:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .shop-grid-bg {
          position:fixed; inset:0; z-index:0; pointer-events:none;
          background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 56px 56px;
        }

        .cat-scroll { display:flex; gap:10px; overflow-x:auto; padding-bottom:4px; }
        .cat-scroll::-webkit-scrollbar { display:none; }
        .cat-pill {
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.5); padding:8px 20px; border-radius:100px;
          font-size:11px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase;
          cursor:pointer; white-space:nowrap; transition:all 0.25s;
          font-family:'Barlow', sans-serif; flex-shrink:0;
        }
        .cat-pill:hover { border-color:rgba(255,255,255,0.25); color:#fff; }
        .cat-pill.active { background:rgba(0,212,182,0.1); border-color:${ACCENT}; color:${ACCENT}; box-shadow:0 0 16px rgba(0,212,182,0.12); }

        .filter-btn {
          display:flex; align-items:center; gap:7px;
          background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.1);
          color:rgba(255,255,255,0.7); padding:8px 18px; border-radius:8px;
          font-size:11px; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          cursor:pointer; white-space:nowrap; transition:all 0.2s;
          font-family:'Barlow', sans-serif; flex-shrink:0;
        }
        .filter-btn:hover { border-color:rgba(0,212,182,0.4); color:${ACCENT}; }
        .filter-btn.has-filters { border-color:${ACCENT}; color:${ACCENT}; background:rgba(0,212,182,0.08); }

        .product-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media (min-width:640px)  { .product-grid { grid-template-columns:repeat(2,1fr); } }
        @media (min-width:1024px) { .product-grid { grid-template-columns:repeat(3,1fr); } }

        @media (max-width:639px) {
          .card-brand { display:none !important; }
          .card-compare { display:none !important; }
          .card-save { display:none !important; }
        }
        @media (min-width:640px) and (max-width:1023px) {
          .card-compare { display:none !important; }
          .card-save { display:none !important; }
        }

        @media (min-width:1024px) {
          .product-card:hover {
            box-shadow:
              inset 1px 0 0 rgba(0,212,182,0.15),
              inset 0 1px 0 rgba(0,212,182,0.15),
              inset -1px 0 0 rgba(0,212,182,0.3),
              inset 0 -1px 0 rgba(0,212,182,0.3),
              0 8px 40px rgba(0,0,0,0.6) !important;
          }
        }

        @keyframes dropFadeIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }

        .price-range { -webkit-appearance:none; height:3px; border-radius:4px; outline:none; cursor:pointer; background:rgba(255,255,255,0.1); }
        .price-range::-webkit-slider-thumb { -webkit-appearance:none; width:18px; height:18px; border-radius:50%; background:${ACCENT}; cursor:pointer; border:2px solid #020606; box-shadow:0 0 8px rgba(0,212,182,0.5); }
        .price-range::-moz-range-thumb { width:18px; height:18px; border-radius:50%; background:${ACCENT}; cursor:pointer; border:2px solid #020606; }

        @keyframes loadDot { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        .load-dot { width:6px; height:6px; border-radius:50%; background:${ACCENT}; animation:loadDot 1.2s ease infinite; display:inline-block; }
        .load-dot:nth-child(2) { animation-delay:0.2s; }
        .load-dot:nth-child(3) { animation-delay:0.4s; }

        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .skeleton-pulse {
          background: linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.04) 75%);
          background-size:400px 100%; animation:shimmer 1.4s ease infinite;
        }

        @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:0.8} 100%{transform:scale(2);opacity:0} }
      `}</style>

      <div className="shop-grid-bg" />

      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ── Header ── */}
        <div style={{ padding: 'clamp(32px, 5vw, 64px) clamp(16px, 5vw, 64px) 24px' }}>
          <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: ACCENT, marginBottom: 12 }}>
            {loading ? '…' : `${filtered.length} Products`}
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(40px, 7vw, 80px)', fontWeight: 900, textTransform: 'uppercase', color: '#fff', lineHeight: 1, letterSpacing: '-0.02em', margin: 0 }}>
            Shop{' '}
            <span style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
              {activeCategory}
            </span>
          </h1>
        </div>

        {/* ── Search ── */}
        <div style={{ padding: '0 clamp(16px, 5vw, 64px) 28px', display: 'flex', justifyContent: 'center' }}>
          <SearchBar products={allProducts} onSearch={setSearchQuery} />
        </div>

        {/* ── Category Pills + Filter ── */}
        <div style={{ padding: '0 clamp(16px, 5vw, 64px) 36px', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="cat-scroll" style={{ flex: 1 }}>
            <button className={`cat-pill${activeCategory === 'All' ? ' active' : ''}`} onClick={() => handleCategoryClick(null)}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat._id} className={`cat-pill${activeCategory === cat.name ? ' active' : ''}`} onClick={() => handleCategoryClick(cat)}>
                {cat.name}
              </button>
            ))}
          </div>
          <button className={`filter-btn${activeFilterCount > 0 ? ' has-filters' : ''}`} onClick={() => setFilterOpen(true)}>
            <SlidersHorizontal size={13} />
            Filters
            {activeFilterCount > 0 && (
              <span style={{ background: ACCENT, color: '#020606', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 900 }}>
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* ── Grid ── */}
        <div className="product-grid" style={{ padding: '0 clamp(16px, 5vw, 64px) 80px' }}>
          {loading ? (
            Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
          ) : visible.length === 0 ? (
            <div style={{ gridColumn: '1/-1', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px 0', gap: 16 }}>
              <div style={{ position: 'relative', width: 48, height: 48 }}>
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: ACCENT, opacity: 0.2, animation: 'pulse-ring 2s ease-out infinite' }} />
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,212,182,0.1)', border: `1px solid rgba(0,212,182,0.3)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔍</div>
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>No products found</div>
              <div style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>Try adjusting your filters or search</div>
            </div>
          ) : (
            visible.map(p => <ProductCard key={p._id} product={p} />)
          )}
        </div>

        <div ref={sentinelRef} style={{ height: 1 }} />

        {isLoadingMore && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '24px 0 48px' }}>
            <div className="load-dot" /><div className="load-dot" /><div className="load-dot" />
            <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', textTransform: 'uppercase', marginLeft: 8 }}>Loading more</span>
          </div>
        )}

        {!hasMore && !loading && visible.length > 0 && (
          <div style={{ textAlign: 'center', padding: '16px 0 48px', fontFamily: "'Barlow', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            — End of results —
          </div>
        )}
      </div>

      {filterOpen && (
        <FilterSheet filters={filters} onApply={f => setFilters(f)} onClose={() => setFilterOpen(false)} />
      )}
    </div>
  );
}