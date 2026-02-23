// dead code
// 'use client';

// /**
//  * ImageSelectionModal — pure presentation, zero internal modal state.
//  * Parent (ProductImagePicker) owns what's shown and when to unmount this.
//  *
//  * onAddDirectly(url)  → parent immediately removes this modal & commits image
//  * onCropRequested()   → parent swaps this modal for ImageCropModal
//  * onCancel()          → parent removes this modal
//  */

// import { Zap, Crop, X, Image as ImageIcon } from 'lucide-react';

// const ACCENT = '#00d4b6';

// interface Props {
//     imageFile: File;
//     imageUrl: string;
//     onAddDirectly: (url: string) => void;
//     onCropRequested: () => void;           // ← NEW: just signals "open crop"
//     onCancel: () => void;
//     type?: 'featured' | 'editor';
// }

// export default function ImageSelectionModal({
//     imageFile,
//     imageUrl,
//     onAddDirectly,
//     onCropRequested,
//     onCancel,
// }: Props) {
//     const fileSizeMB = (imageFile.size / 1024 / 1024).toFixed(2);

//     return (
//         <div style={{
//             position: 'fixed', inset: 0,
//             background: 'rgba(0,0,0,0.65)',
//             backdropFilter: 'blur(4px)',
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             zIndex: 9000, padding: 16,
//         }}>
//             <div style={{
//                 background: '#fff', borderRadius: 16,
//                 width: '100%', maxWidth: 640, overflow: 'hidden',
//                 boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
//                 fontFamily: "'Barlow', sans-serif",
//             }}>
//                 {/* Header */}
//                 <div style={{
//                     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                     padding: '16px 20px', borderBottom: '1px solid #f0f0f0',
//                 }}>
//                     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//                         <div style={{
//                             width: 34, height: 34, borderRadius: 8, background: ACCENT,
//                             display: 'flex', alignItems: 'center', justifyContent: 'center',
//                         }}>
//                             <ImageIcon size={16} color="#020606" />
//                         </div>
//                         <div>
//                             <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Add Image</div>
//                             <div style={{ fontSize: 11, color: '#999' }}>Choose how to add this image</div>
//                         </div>
//                     </div>
//                     <button onClick={onCancel} style={{
//                         background: 'none', border: 'none', cursor: 'pointer',
//                         color: '#aaa', padding: 4, borderRadius: 6,
//                         display: 'flex', alignItems: 'center',
//                     }}>
//                         <X size={18} />
//                     </button>
//                 </div>

//                 {/* Body */}
//                 <div style={{ display: 'flex', minHeight: 260 }}>
//                     {/* Left – preview */}
//                     <div style={{
//                         width: '45%', background: '#f7f7f7',
//                         borderRight: '1px solid #f0f0f0',
//                         display: 'flex', flexDirection: 'column',
//                         alignItems: 'center', justifyContent: 'center',
//                         padding: 20, gap: 10,
//                     }}>
//                         <img src={imageUrl} alt="Preview" style={{
//                             maxWidth: '100%', maxHeight: 200,
//                             objectFit: 'contain', borderRadius: 8,
//                             border: '1px solid #e5e5e5', background: '#fff',
//                         }} />
//                         <div style={{
//                             background: '#fff', border: '1px solid #e5e5e5',
//                             borderRadius: 8, padding: '6px 12px',
//                             display: 'flex', alignItems: 'center', gap: 6, width: '100%',
//                         }}>
//                             <ImageIcon size={12} color="#aaa" />
//                             <div style={{ flex: 1, minWidth: 0 }}>
//                                 <div style={{ fontSize: 11, fontWeight: 600, color: '#333', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//                                     {imageFile.name}
//                                 </div>
//                                 <div style={{ fontSize: 10, color: '#aaa' }}>{fileSizeMB} MB</div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right – actions */}
//                     <div style={{
//                         flex: 1, padding: 20,
//                         display: 'flex', flexDirection: 'column',
//                         gap: 12, justifyContent: 'center',
//                     }}>
//                         <p style={{ fontSize: 12, color: '#666', marginBottom: 4, margin: 0 }}>
//                             How would you like to add this image?
//                         </p>

//                         {/* Add Directly */}
//                         <button
//                             onClick={() => onAddDirectly(imageUrl)}
//                             style={{
//                                 background: `${ACCENT}12`, border: `2px solid ${ACCENT}`,
//                                 borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
//                                 textAlign: 'left', transition: 'all 0.18s',
//                                 display: 'flex', alignItems: 'center', gap: 14,
//                             }}
//                             onMouseEnter={e => {
//                                 e.currentTarget.style.background = `${ACCENT}22`;
//                                 e.currentTarget.style.boxShadow = `0 4px 16px ${ACCENT}33`;
//                             }}
//                             onMouseLeave={e => {
//                                 e.currentTarget.style.background = `${ACCENT}12`;
//                                 e.currentTarget.style.boxShadow = 'none';
//                             }}
//                         >
//                             <div style={{
//                                 width: 38, height: 38, borderRadius: 9, background: ACCENT,
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//                             }}>
//                                 <Zap size={18} color="#020606" />
//                             </div>
//                             <div>
//                                 <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
//                                     <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Add Directly</span>
//                                     <span style={{ fontSize: 9, fontWeight: 700, background: ACCENT, color: '#020606', borderRadius: 20, padding: '2px 7px' }}>FAST</span>
//                                 </div>
//                                 <div style={{ fontSize: 11, color: '#888' }}>Upload the image as-is</div>
//                             </div>
//                         </button>

//                         {/* Crop Image */}
//                         <button
//                             onClick={onCropRequested}
//                             style={{
//                                 background: '#1a1a1a0a', border: '2px solid #1a1a1a',
//                                 borderRadius: 12, padding: '16px 18px', cursor: 'pointer',
//                                 textAlign: 'left', transition: 'all 0.18s',
//                                 display: 'flex', alignItems: 'center', gap: 14,
//                             }}
//                             onMouseEnter={e => {
//                                 e.currentTarget.style.background = '#1a1a1a18';
//                                 e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
//                             }}
//                             onMouseLeave={e => {
//                                 e.currentTarget.style.background = '#1a1a1a0a';
//                                 e.currentTarget.style.boxShadow = 'none';
//                             }}
//                         >
//                             <div style={{
//                                 width: 38, height: 38, borderRadius: 9, background: '#1a1a1a',
//                                 display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
//                             }}>
//                                 <Crop size={18} color="#fff" />
//                             </div>
//                             <div>
//                                 <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 2 }}>
//                                     <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>Crop Image</span>
//                                     <span style={{ fontSize: 9, fontWeight: 700, background: '#1a1a1a', color: '#fff', borderRadius: 20, padding: '2px 7px' }}>CUSTOM</span>
//                                 </div>
//                                 <div style={{ fontSize: 11, color: '#888' }}>Adjust size, crop &amp; rotate</div>
//                             </div>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Footer */}
//                 <div style={{
//                     padding: '12px 20px', borderTop: '1px solid #f0f0f0',
//                     display: 'flex', justifyContent: 'flex-end',
//                 }}>
//                     <button
//                         onClick={onCancel}
//                         style={{
//                             background: 'transparent', border: '1px solid #e5e5e5',
//                             borderRadius: 8, padding: '7px 16px',
//                             fontSize: 12, fontWeight: 600, color: '#666',
//                             cursor: 'pointer', fontFamily: "'Barlow', sans-serif",
//                         }}
//                         onMouseEnter={e => (e.currentTarget.style.background = '#f5f5f5')}
//                         onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
//                     >
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }