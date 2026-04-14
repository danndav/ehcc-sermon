'use client';

import { Star, Play } from 'lucide-react';
import Link from 'next/link';

const KIDS_SERMONS = [
  { id: 'k1', title: 'David and Goliath', pastor: 'Min Joseph Sanni', duration: 900, tags: ['Bible Story', 'Courage'] },
  { id: 'k2', title: 'Noah\'s Ark Adventure', pastor: 'Dr Seun Olabode', duration: 720, tags: ['Bible Story', 'Obedience'] },
  { id: 'k3', title: 'The Good Shepherd', pastor: 'Min Joseph Sanni', duration: 840, tags: ['Jesus', 'Love'] },
  { id: 'k4', title: 'Daniel and the Lions', pastor: 'Dr Seun Olabode', duration: 780, tags: ['Bible Story', 'Faith'] },
  { id: 'k5', title: 'Joseph the Dreamer', pastor: 'Min Joseph Sanni', duration: 960, tags: ['Bible Story', 'Dreams'] },
  { id: 'k6', title: 'The Miracle of the Loaves', pastor: 'Dr Seun Olabode', duration: 660, tags: ['Jesus', 'Sharing'] },
];

const FUN_COLORS = [
  'bg-[#FFE4EC]', 'bg-[#E4F0FF]', 'bg-[#FFF4D0]', 'bg-[#E1F5EE]', 'bg-[#F3EAF9]', 'bg-[#FAECE7]',
];

export default function KidsModePage() {
  return (
    <div className="px-4 lg:px-6 py-4 lg:py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Star size={22} className="text-[#FFB800]" fill="#FFB800" />
        <h1 className="text-[24px] font-semibold text-text-primary">Kids</h1>
      </div>
      <p className="text-[14px] text-text-secondary mb-6">Fun Bible stories and lessons for young believers!</p>

      {/* Featured */}
      <div className="bg-[#4A1572] rounded-2xl p-5 mb-6 text-white">
        <p className="text-white/60 text-[11px] font-medium mb-1">Today&apos;s story</p>
        <h2 className="text-[18px] font-medium mb-1">David and Goliath</h2>
        <p className="text-white/70 text-[12px] mb-3">Learn how a young boy defeated a giant with faith and a sling!</p>
        <button className="bg-white text-[#4A1572] rounded-full px-4 py-2 text-[13px] font-medium inline-flex items-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all">
          <Play size={14} fill="#4A1572" />
          Watch now
        </button>
      </div>

      {/* All stories */}
      <h2 className="text-[16px] font-medium text-text-primary mb-3">All stories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {KIDS_SERMONS.map((sermon, i) => (
          <div key={sermon.id} className="bg-white border border-black/10 rounded-2xl overflow-hidden hover:border-black/20 transition-colors cursor-pointer">
            <div className={`aspect-video ${FUN_COLORS[i % FUN_COLORS.length]} flex items-center justify-center`}>
              <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
                <Play size={20} className="text-[#4A1572] ml-0.5" fill="#4A1572" />
              </div>
            </div>
            <div className="p-3">
              <h3 className="text-[14px] font-medium text-text-primary">{sermon.title}</h3>
              <p className="text-[11px] text-text-tertiary mt-0.5">{sermon.pastor} · {Math.round(sermon.duration / 60)} min</p>
              <div className="flex gap-1 mt-2">
                {sermon.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-[#FFF4D0] text-[#7A5A00] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
