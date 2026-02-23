'use client';

/**
 * @file app/admin/products/_components/ImageCropModal.tsx
 * Rethemed to match admin panel: #00d4b6 accent, dark controls.
 * Logic unchanged from original high-performance version.
 */

import { useState, useRef, useEffect } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, RotateCw, Maximize2, Check, Crop as CropIcon, Loader2 } from 'lucide-react';

const ACCENT = '#00d4b6';
const DARK = '#1a1a1a';

interface Props {
    imageUrl: string;
    onCropComplete: (croppedImageUrl: string) => void;
    onCancel: () => void;
    defaultAspectRatio?: number;
}

const ASPECT_RATIOS = [
    // { label: 'Free', value: null, desc: 'Any size' },
    // { label: '16:9', value: 16 / 9, desc: 'Landscape' },
    // { label: '4:3', value: 4 / 3, desc: 'Classic' },
    { label: '1:1', value: 1, desc: 'Square' },
    { label: '3:4', value: 3 / 4, desc: 'Portrait' },
    // { label: '9:16', value: 9 / 16, desc: 'Story' },
];

export default function ImageCropModal({ imageUrl, onCropComplete, onCancel, defaultAspectRatio }: Props) {
    const [crop, setCrop] = useState<Crop>({ unit: '%', width: 80, height: 80, x: 10, y: 10 });
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [rotation, setRotation] = useState(0);
    // const [selectedRatio, setSelectedRatio] = useState<number | null>(defaultAspectRatio ?? null);
    const [selectedRatio, setSelectedRatio] = useState<number | null>(defaultAspectRatio ?? (3 / 4));

    const [isProcessing, setIsProcessing] = useState(false);

    const imgRef = useRef<HTMLImageElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const processingRef = useRef(false);

    // Auto-adjust crop when ratio changes
    useEffect(() => {
        if (selectedRatio === null) return;
        const w = 80, h = 80;
        const newCrop: Crop = { unit: '%', width: w, height: h, x: 10, y: 10 };
        if (selectedRatio > 1) newCrop.height = w / selectedRatio;
        else if (selectedRatio < 1) newCrop.width = h * selectedRatio;
        newCrop.x = (100 - newCrop.width) / 2;
        newCrop.y = (100 - newCrop.height) / 2;
        setCrop(newCrop);
    }, [selectedRatio]);

    const handleApplyCrop = () => {
        if (!completedCrop || !imgRef.current || !canvasRef.current) return;
        if (processingRef.current) return;

        processingRef.current = true;
        setIsProcessing(true);

        requestAnimationFrame(async () => {
            try {
                const image = imgRef.current!;
                const canvas = canvasRef.current!;
                const c = completedCrop;
                const scaleX = image.naturalWidth / image.width;
                const scaleY = image.naturalHeight / image.height;

                const ctx = canvas.getContext('2d', { willReadFrequently: false, alpha: false });
                if (!ctx) throw new Error('No canvas context');

                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                const outW = c.width * scaleX;
                const outH = c.height * scaleY;
                const MAX = 3000;
                const scale = (outW > MAX || outH > MAX) ? Math.min(MAX / outW, MAX / outH) : 1;

                canvas.width = outW * dpr * scale;
                canvas.height = outH * dpr * scale;
                ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                if (rotation !== 0) {
                    ctx.translate(outW / 2, outH / 2);
                    ctx.rotate((rotation * Math.PI) / 180);
                    ctx.translate(-outW / 2, -outH / 2);
                }

                ctx.drawImage(image, c.x * scaleX, c.y * scaleY, outW, outH, 0, 0, outW, outH);

                canvas.toBlob(blob => {
                    if (!blob) {
                        alert('Failed to process image. Please try again.');
                        setIsProcessing(false);
                        processingRef.current = false;
                        return;
                    }
                    onCropComplete(URL.createObjectURL(blob));
                }, 'image/jpeg', 0.90);

            } catch {
                alert('Failed to process image. Please try again.');
                setIsProcessing(false);
                processingRef.current = false;
            }
        });
    };

    const handleFitImage = () => {
        const newCrop: Crop = { unit: '%', width: 90, height: 90, x: 5, y: 5 };
        if (selectedRatio !== null) {
            if (selectedRatio > 1) newCrop.height = newCrop.width / selectedRatio;
            else if (selectedRatio < 1) newCrop.width = newCrop.height * selectedRatio;
            newCrop.x = (100 - newCrop.width) / 2;
            newCrop.y = (100 - newCrop.height) / 2;
        }
        setCrop(newCrop);
    };

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9100, padding: 16,
        }}>
            {/* Processing overlay */}
            {isProcessing && (
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 9200,
                }}>
                    <div style={{
                        background: '#fff', borderRadius: 16, padding: '36px 48px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        fontFamily: "'Barlow', sans-serif",
                    }}>
                        <Loader2 size={44} color={ACCENT} style={{ animation: 'spin 1s linear infinite' }} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 16, fontWeight: 700, color: DARK, marginBottom: 4 }}>Processing…</div>
                            <div style={{ fontSize: 13, color: '#888' }}>This will only take a moment</div>
                        </div>
                    </div>
                </div>
            )}

            <div style={{
                background: '#fff', borderRadius: 18,
                width: '100%', maxWidth: 1100, maxHeight: '94vh',
                overflow: 'hidden',
                boxShadow: '0 32px 80px rgba(0,0,0,0.3)',
                display: 'flex', flexDirection: 'column',
                fontFamily: "'Barlow', sans-serif",
            }}>
                {/* ── Header ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '16px 24px', borderBottom: '1px solid #f0f0f0', flexShrink: 0,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                            width: 38, height: 38, borderRadius: 9,
                            background: DARK,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <CropIcon size={18} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 800, color: DARK, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: '-0.01em' }}>
                                CROP IMAGE
                            </div>
                            <div style={{ fontSize: 11, color: '#aaa' }}>Adjust the crop area, then apply</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { if (!isProcessing) onCancel(); }}
                        disabled={isProcessing}
                        style={{
                            background: 'none', border: 'none', cursor: isProcessing ? 'not-allowed' : 'pointer',
                            color: '#aaa', padding: 6, borderRadius: 8, display: 'flex', alignItems: 'center',
                            opacity: isProcessing ? 0.4 : 1,
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* ── Main ── */}
                <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                    {/* Crop canvas area */}
                    <div style={{
                        flex: 1, padding: 24,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: '#f7f7f7', overflow: 'auto',
                    }}>
                        <ReactCrop
                            crop={crop}
                            onChange={c => setCrop(c)}
                            onComplete={c => setCompletedCrop(c)}
                            aspect={selectedRatio ?? undefined}
                            disabled={isProcessing}
                        >
                            <img
                                ref={imgRef}
                                src={imageUrl}
                                alt="Crop"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    maxHeight: 'calc(94vh - 200px)',
                                    maxWidth: '100%',
                                    opacity: isProcessing ? 0.4 : 1,
                                    pointerEvents: isProcessing ? 'none' : 'auto',
                                    transition: 'opacity 0.2s',
                                    borderRadius: 8,
                                }}
                            />
                        </ReactCrop>
                    </div>

                    {/* ── Side panel ── */}
                    <div style={{
                        width: 260, borderLeft: '1px solid #f0f0f0',
                        background: '#fff', display: 'flex', flexDirection: 'column',
                        flexShrink: 0, overflowY: 'auto',
                    }}>
                        {/* Aspect ratios */}
                        <div style={{ padding: '20px 16px', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
                                Aspect Ratio
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {ASPECT_RATIOS.map(r => {
                                    const active = selectedRatio === r.value;
                                    return (
                                        <button
                                            key={r.label}
                                            onClick={() => setSelectedRatio(r.value)}
                                            disabled={isProcessing}
                                            style={{
                                                width: '100%', padding: '10px 14px',
                                                borderRadius: 8, textAlign: 'left',
                                                border: `2px solid ${active ? ACCENT : '#e5e5e5'}`,
                                                background: active ? `${ACCENT}14` : '#fff',
                                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                transition: 'all 0.15s',
                                                opacity: isProcessing ? 0.5 : 1,
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 700, color: active ? DARK : '#444' }}>
                                                    {r.label}
                                                </div>
                                                <div style={{ fontSize: 10, color: '#aaa' }}>{r.desc}</div>
                                            </div>
                                            {active && (
                                                <div style={{
                                                    width: 18, height: 18, borderRadius: '50%',
                                                    background: ACCENT,
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                }}>
                                                    <Check size={10} color="#020606" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tools */}
                        <div style={{ padding: '20px 16px', borderBottom: '1px solid #f0f0f0' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#888', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
                                Tools
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                                {[
                                    { icon: <RotateCw size={15} />, label: 'Rotate 90°', action: () => setRotation(p => (p + 90) % 360) },
                                    { icon: <Maximize2 size={15} />, label: 'Fit to View', action: handleFitImage },
                                ].map(t => (
                                    <button key={t.label} onClick={t.action} disabled={isProcessing} style={{
                                        width: '100%', padding: '10px 14px',
                                        borderRadius: 8, border: '1px solid #e5e5e5',
                                        background: '#fafafa', cursor: isProcessing ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 8,
                                        fontSize: 12, fontWeight: 600, color: '#444',
                                        opacity: isProcessing ? 0.5 : 1,
                                        transition: 'background 0.15s',
                                        fontFamily: "'Barlow', sans-serif",
                                    }}
                                        onMouseEnter={e => !isProcessing && (e.currentTarget.style.background = '#f0f0f0')}
                                        onMouseLeave={e => (e.currentTarget.style.background = '#fafafa')}
                                    >
                                        {t.icon} {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Info */}
                        <div style={{ padding: '20px 16px', marginTop: 'auto' }}>
                            <div style={{
                                background: `${ACCENT}10`, border: `1px solid ${ACCENT}44`,
                                borderRadius: 10, padding: '12px 14px',
                                display: 'flex', flexDirection: 'column', gap: 8,
                            }}>
                                {[
                                    ['Crop Size', completedCrop ? `${Math.round(completedCrop.width)} × ${Math.round(completedCrop.height)}px` : '—'],
                                    ['Rotation', `${rotation}°`],
                                    ...(selectedRatio !== null ? [['Ratio', ASPECT_RATIOS.find(r => r.value === selectedRatio)?.label ?? '']] : []),
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                                        <span style={{ color: '#666' }}>{k}</span>
                                        <span style={{ fontWeight: 700, color: DARK }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hidden canvas */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />

                {/* ── Footer ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 24px', borderTop: '1px solid #f0f0f0',
                    background: '#fff', flexShrink: 0,
                }}>
                    <div style={{ fontSize: 11, color: '#aaa', lineHeight: 1.7 }}>
                        <div>💡 Drag to select crop area</div>
                        <div>📐 Resize with corner handles</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10 }}>
                        <button
                            onClick={() => { if (!isProcessing) onCancel(); }}
                            disabled={isProcessing}
                            style={{
                                padding: '10px 20px', borderRadius: 8,
                                border: '1px solid #e5e5e5', background: 'transparent',
                                fontSize: 13, fontWeight: 600, color: '#666',
                                cursor: isProcessing ? 'not-allowed' : 'pointer',
                                opacity: isProcessing ? 0.5 : 1,
                                fontFamily: "'Barlow', sans-serif",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApplyCrop}
                            disabled={isProcessing || !completedCrop}
                            style={{
                                padding: '10px 24px', borderRadius: 8,
                                border: 'none',
                                background: isProcessing || !completedCrop ? '#ccc' : ACCENT,
                                color: '#020606',
                                fontSize: 13, fontWeight: 700,
                                cursor: isProcessing || !completedCrop ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', gap: 7,
                                boxShadow: completedCrop && !isProcessing ? `0 4px 14px ${ACCENT}55` : 'none',
                                transition: 'all 0.2s',
                                fontFamily: "'Barlow', sans-serif",
                            }}
                        >
                            {isProcessing
                                ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Processing…</>
                                : <><Check size={14} /> Apply Crop</>
                            }
                        </button>
                    </div>
                </div>
            </div>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}