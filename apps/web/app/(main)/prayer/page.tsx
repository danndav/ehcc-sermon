'use client';

import { useState } from 'react';
import { PRAYER_CATEGORIES } from '@/lib/constants';

const MOCK_PRAYERS = [
  { id: '1', firstName: 'Adaeze', initials: 'AO', timeAgo: '2 hrs', category: 'Healing', content: 'Pray for my mother\'s surgery next week. She needs God\'s hand upon the doctors.', prayerCount: 34 },
  { id: '2', firstName: 'Emmanuel', initials: 'EM', timeAgo: '3 hrs', category: 'Breakthrough', content: 'Believing God for a breakthrough in my business this quarter. It has been difficult.', prayerCount: 18 },
  { id: '3', firstName: 'Grace', initials: 'GN', timeAgo: '5 hrs', category: 'Family', content: 'Pray for unity in my family. We are going through a challenging time right now.', prayerCount: 22 },
  { id: '4', firstName: 'David', initials: 'DA', timeAgo: '8 hrs', category: 'Finances', content: 'Trusting God for financial provision. I lost my job last month and need direction.', prayerCount: 45 },
];

const STREAK_DAYS = [true, true, true, true, true, false, false];

export default function PrayerPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [prayingFor, setPrayingFor] = useState<Set<string>>(new Set(['1']));
  const [requestText, setRequestText] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const filtered = activeCategory === 'All'
    ? MOCK_PRAYERS
    : MOCK_PRAYERS.filter((p) => p.category === activeCategory);

  const streakCount = STREAK_DAYS.filter(Boolean).length;

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-page-title text-text-primary">Prayer Room</h1>

      {/* Prayer Streak */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {STREAK_DAYS.map((done, i) => (
            <div
              key={i}
              className={`w-6 h-2 rounded-full ${done ? 'bg-[#4A1572]' : 'border border-black/15'}`}
            />
          ))}
        </div>
        <span className="text-[11px] text-[#4A1572] font-medium">{streakCount} night streak</span>
      </div>

      {/* Nightly Prayer Card */}
      <div className="bg-[#3D1260] rounded-xl p-3 text-white">
        <div className="flex items-center justify-between mb-1">
          <p className="text-[14px] font-medium">Nightly prayer meeting</p>
          <span className="flex items-center gap-1 text-[10px] text-white/80">
            <span className="w-2 h-2 rounded-full bg-[#E24B4A] animate-pulse" />
            Live
          </span>
        </div>
        <p className="text-[11px] text-white/70 mb-3">Every night · 12:00 AM</p>
        <button className="w-full bg-[#4A4BAD] text-white rounded-lg py-2 text-[13px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
          Join on Microsoft Teams
        </button>
      </div>

      {/* Category filters */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
        {PRAYER_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 px-3 py-1 rounded-full text-[10px] border transition-colors ${
              activeCategory === cat
                ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]'
                : 'bg-surface border-black/10 text-text-secondary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Prayer Wall */}
      <div className="space-y-2">
        {filtered.map((prayer) => {
          const isPraying = prayingFor.has(prayer.id);
          return (
            <div key={prayer.id} className="bg-white border border-black/10 rounded-xl p-3">
              <div className="flex items-start gap-2">
                <div className="w-[28px] h-[28px] rounded-full bg-[#F3EAF9] text-[#4A1572] flex items-center justify-center text-[10px] font-medium shrink-0">
                  {prayer.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] font-medium text-text-primary">{prayer.firstName}</span>
                    <span className="text-[10px] text-text-tertiary">{prayer.timeAgo}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] border border-black/10 bg-surface text-text-secondary">
                      {prayer.category}
                    </span>
                  </div>
                  <p className="text-[12px] text-text-secondary mt-1 leading-relaxed">{prayer.content}</p>
                  <button
                    onClick={() => {
                      const next = new Set(prayingFor);
                      if (isPraying) next.delete(prayer.id); else next.add(prayer.id);
                      setPrayingFor(next);
                    }}
                    className={`mt-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      isPraying
                        ? 'bg-teal-light border border-[#5DCAA5] text-teal'
                        : 'border border-black/15 text-text-tertiary'
                    }`}
                  >
                    {isPraying ? 'Praying for this' : 'Pray for this'}
                    <span className="ml-1 text-[10px]">{prayer.prayerCount + (isPraying ? 1 : 0)} praying</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Submit Prayer Request */}
      <div className="bg-surface rounded-xl p-3">
        <h3 className="text-[13px] font-medium text-text-primary mb-2">Submit a prayer request</h3>
        <textarea
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder="Share your prayer request here..."
          rows={3}
          className="w-full bg-white border border-black/[0.15] rounded-lg px-3 py-2 text-[12px] text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-[#4A1572] resize-none"
        />
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
              className="accent-[#4A1572]"
            />
            <span className="text-[11px] text-text-tertiary">Make private (pastor only)</span>
          </label>
          <button className="bg-[#4A1572] text-white rounded-lg px-4 py-1.5 text-[12px] font-medium hover:opacity-90 active:scale-[0.98] transition-all">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
