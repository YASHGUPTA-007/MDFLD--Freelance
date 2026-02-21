import React from 'react';

export default function GlobalStyles() {
  return (
    <style dangerouslySetInnerHTML={{__html: `
      @keyframes marquee {
        0% { transform: translateX(0%); }
        100% { transform: translateX(-50%); }
      }
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-gradient {
        background-size: 200% auto;
        animation: gradient 3s linear infinite;
      }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #0a0a0a; }
      ::-webkit-scrollbar-thumb { background: #00d4b6; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #00ffdd; }
    `}} />
  );
}