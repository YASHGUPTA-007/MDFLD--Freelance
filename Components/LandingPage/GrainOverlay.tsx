import React from 'react';

export default function GrainOverlay() {
  return (
    <div 
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.035] mix-blend-overlay" 
      style={{ backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')" }}
    />
  );
}