'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ImagePlus, X, Star } from 'lucide-react';
// import ImageSelectionModal from './ImageSelectionModal';
import ImageCropModal from './ImageCropModal';

const ACCENT = '#00d4b6';
const MAX_DEFAULT = 5;

export interface ImagePickerValue {
    files: File[];
    featuredIndex: number;
    existingUrls: string[];
}

interface Props {
    existingUrls?: string[];
    onChange: (val: ImagePickerValue) => void;
    maxImages?: number;
}

interface PreviewItem { src: string; file?: File; }
interface QueueItem { file: File; objectUrl: string; }
type ModalStep = 'selection' | 'crop' | null;

export default function ProductImagePicker({ existingUrls = [], onChange, maxImages = MAX_DEFAULT }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [items, setItems] = useState<PreviewItem[]>([]);
    const [featuredIndex, setFeatured] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [current, setCurrent] = useState<QueueItem | null>(null);
    const [modalStep, setModalStep] = useState<ModalStep>(null);
    const [mounted, setMounted] = useState(false);

    // Always-current ref so async callbacks never close over stale onChange
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    useEffect(() => { setMounted(true); }, []);

    // Init from existing URLs
    useEffect(() => {
        setItems(existingUrls.map(src => ({ src })));
        setFeatured(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [existingUrls.join(',')]);

    // ── Emit whenever items or featuredIndex change (NOT during render) ────────
    // This useEffect runs after render, so it's safe to call onChange here.
    useEffect(() => {
        onChangeRef.current({
            files: items.filter(i => !!i.file).map(i => i.file!),
            featuredIndex: featuredIndex,
            existingUrls: items.filter(i => !i.file).map(i => i.src),
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, featuredIndex]);

    // Pop next from queue when modal is fully closed
    useEffect(() => {
        if (modalStep === null && current === null && queue.length > 0) {
            const [next, ...rest] = queue;
            setQueue(rest);
            setCurrent(next);
            setModalStep('crop');
        }
    }, [modalStep, current, queue]);

    const enqueueFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        setItems(prev => {
            const slots = maxImages - prev.length;
            if (slots <= 0) return prev;
            // Don't add to items yet — just queue
            return prev;
        });
        setItems(prev => {
            const slots = maxImages - prev.length;
            if (slots <= 0) return prev;
            const toQueue = Array.from(incoming).slice(0, slots)
                .map(f => ({ file: f, objectUrl: URL.createObjectURL(f) }));
            setQueue(q => [...q, ...toQueue]);
            return prev;
        });
    };

    // ── Add Directly ──────────────────────────────────────────────────────────
    const handleAddDirectly = useCallback((url: string) => {
        const file = current?.file;
        if (!file) return;
        setCurrent(null);
        setModalStep(null);
        setItems(prev => [...prev, { src: url, file }]);
        // featuredIndex unchanged — emit fires via useEffect
    }, [current]);

    // ── Crop requested — swap modal ───────────────────────────────────────────
    const handleCropRequested = useCallback(() => {
        setModalStep('crop');
    }, []);

    // ── Crop complete ─────────────────────────────────────────────────────────
    const handleCropComplete = useCallback((croppedUrl: string) => {
        const file = current?.file;
        if (!file) return;
        setCurrent(null);
        setModalStep(null);
        // Convert blob URL → File then add (async, but items update is safe here)
        fetch(croppedUrl)
            .then(r => r.blob())
            .then(blob => {
                const croppedFile = new File(
                    [blob],
                    file.name.replace(/\.[^.]+$/, '.jpg'),
                    { type: 'image/jpeg' }
                );
                setItems(prev => [...prev, { src: croppedUrl, file: croppedFile }]);
            });
    }, [current]);

    // ── Cancel / back ─────────────────────────────────────────────────────────
    const handleCancel = useCallback(() => {
        if (current) URL.revokeObjectURL(current.objectUrl);
        setCurrent(null);
        setModalStep(null);
    }, [current]);

    const handleCropBack = useCallback(() => {
        setModalStep('selection');
    }, []);

    // ── Thumbnail actions ─────────────────────────────────────────────────────
    const removeItem = (idx: number) => {
        setItems(prev => prev.filter((_, i) => i !== idx));
        setFeatured(fi => {
            const newLen = items.length - 1;
            if (newLen === 0) return 0;
            if (fi >= newLen) return Math.max(0, newLen - 1);
            if (fi === idx) return 0;
            if (fi > idx) return fi - 1;
            return fi;
        });
    };

    const markFeatured = (idx: number) => setFeatured(idx);

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
    const onDragLeave = () => setDragging(false);
    const onDrop = (e: React.DragEvent) => { e.preventDefault(); setDragging(false); enqueueFiles(e.dataTransfer.files); };

    const canAdd = items.length + queue.length < maxImages;

    const portalContent = mounted && current ? createPortal(
        <>
            {/* {modalStep === 'selection' && (
                <ImageSelectionModal
                    imageFile={current.file}
                    imageUrl={current.objectUrl}
                    onAddDirectly={handleAddDirectly}
                    onCropRequested={handleCropRequested}
                    onCancel={handleCancel}
                    type="editor"
                />
            )} */}
            {modalStep === 'crop' && (
                <ImageCropModal
                    imageUrl={current.objectUrl}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCancel}
                    defaultAspectRatio={3 / 4}
                />
            )}
        </>,
        document.body
    ) : null;

    return (
        <>
            {canAdd && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
                    style={{
                        border: `2px dashed ${dragging ? ACCENT : '#d0d0d0'}`,
                        borderRadius: 10, padding: '22px 16px', textAlign: 'center',
                        cursor: 'pointer', background: dragging ? `${ACCENT}0d` : '#fafafa',
                        transition: 'all 0.2s', marginBottom: 14,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = ACCENT)}
                    onMouseLeave={e => { if (!dragging) e.currentTarget.style.borderColor = '#d0d0d0'; }}
                >
                    <ImagePlus size={28} style={{ margin: '0 auto 8px', display: 'block', color: dragging ? ACCENT : '#bbb' }} />
                    <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 13, color: '#888', margin: 0 }}>
                        {items.length === 0
                            ? `Click or drag to upload images (max ${maxImages})`
                            : `Add more — ${maxImages - items.length} slot${maxImages - items.length !== 1 ? 's' : ''} remaining`}
                    </p>
                </div>
            )}

            <input
                ref={fileInputRef} type="file" multiple accept="image/*"
                style={{ display: 'none' }}
                onClick={e => { (e.target as HTMLInputElement).value = ''; }}
                onChange={e => enqueueFiles(e.target.files)}
            />

            {items.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 }}>
                    {items.map((item, idx) => (
                        <div key={idx} onClick={() => markFeatured(idx)} title="Click to set as featured"
                            style={{
                                position: 'relative', aspectRatio: '1', borderRadius: 8, overflow: 'hidden',
                                border: `2px solid ${featuredIndex === idx ? ACCENT : '#e5e5e5'}`, cursor: 'pointer',
                            }}
                        >
                            <img src={item.src} alt={`product-${idx}`}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                            {featuredIndex === idx && (
                                <div style={{
                                    position: 'absolute', top: 4, left: 4, background: ACCENT,
                                    borderRadius: 4, padding: '2px 5px', display: 'flex', alignItems: 'center', gap: 3,
                                }}>
                                    <Star size={9} fill="#020606" color="#020606" />
                                    <span style={{ fontFamily: "'Barlow', sans-serif", fontSize: 9, fontWeight: 700, color: '#020606' }}>FEATURED</span>
                                </div>
                            )}
                            <button onClick={e => { e.stopPropagation(); removeItem(idx); }}
                                style={{
                                    position: 'absolute', top: 4, right: 4,
                                    background: 'rgba(0,0,0,0.55)', border: 'none', borderRadius: '50%',
                                    width: 20, height: 20, display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', cursor: 'pointer', padding: 0,
                                }}>
                                <X size={11} color="#fff" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: 11, color: '#aaa', marginTop: 8, marginBottom: 0 }}>
                {items.length > 0
                    ? 'Click a thumbnail to set it as the featured image.'
                    : `Up to ${maxImages} images. First image is featured by default.`}
            </p>

            {portalContent}
        </>
    );
}