import React from 'react';
import { Sparkles } from 'lucide-react';

export default function PostsSection() {
  const posts = [
    { 
      img: 'photo-1522778119026-d647f0596c20', 
      badge: 'REVIEW', 
      badgeColor: 'bg-orange-500', 
      cat: 'GEAR REVIEW', 
      title: 'The Evolution of the Speed Boot', 
      desc: 'Exploring 30 years of innovation in football footwear technology.', 
      mt: 'mt-12', 
      catColor: 'text-[#00d4b6]' 
    },
    { 
      img: 'photo-1543351611-58f69d7c1781', 
      badge: 'FEATURED', 
      badgeColor: 'bg-[#00d4b6] text-black', 
      cat: 'CULTURE', 
      title: 'Why 90s Kits Are Taking Over Streetwear', 
      desc: 'The resurgence of retro football fashion in modern style.', 
      mt: '-mt-4', 
      catColor: 'text-purple-400' 
    },
    { 
      img: 'photo-1574629810360-7efbb1925846', 
      badge: 'INTERVIEW', 
      badgeColor: 'bg-blue-500', 
      cat: 'INTERVIEW', 
      title: 'Inside the Mind of a Kit Collector', 
      desc: "One collector's journey through football's most iconic jerseys.", 
      mt: 'mt-20', 
      catColor: 'text-[#00d4b6]' 
    },
  ];

  return (
    <section className="py-32 bg-linear-to-b from-[#050505] via-[#111] to-[#050505] border-y border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#00d4b6]/5 rounded-full blur-[150px] float-element pointer-events-none"></div>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20 reveal-up">
          <p className="text-[#00d4b6] text-sm font-bold tracking-[0.3em] mb-4 flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" />LATEST STORIES</p>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">The Pitch.</h2>
          <p className="text-gray-400 text-lg">News, insights, and stories from the global football community.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(({ img, badge, badgeColor, cat, title, desc, mt, catColor }) => (
            <div key={title} className={`reveal-up group cursor-pointer ${mt} relative`}>
              <div className="relative overflow-hidden rounded-[30px] mb-6 border border-white/5">
                <img src={`https://images.unsplash.com/${img}?q=80&w=800&auto=format&fit=crop`}
                     className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700" alt={title} />
                <div className={`absolute top-4 left-4 ${badgeColor} text-white px-3 py-1 rounded-full text-xs font-black tracking-wider`}>{badge}</div>
              </div>
              <p className={`${catColor} text-sm font-bold tracking-widest mb-3`}>{cat}</p>
              <h3 className={`text-2xl font-black uppercase tracking-tighter mb-2 ${catColor.replace('text-', 'group-hover:text-')} group-hover:opacity-80 transition-colors leading-tight`}>{title}</h3>
              <p className="text-gray-500 text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}