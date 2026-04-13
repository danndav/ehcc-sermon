'use client';

import { useState } from 'react';
import { MOODS } from '@/lib/constants';

export function MoodPicker() {
  const [activeMood, setActiveMood] = useState<string | null>(null);

  return (
    <section>
      <h3 className="text-[14px] font-medium text-text-primary mb-2">How are you feeling?</h3>
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
        {MOODS.map((mood) => (
          <button
            key={mood}
            onClick={() => setActiveMood(activeMood === mood ? null : mood)}
            className={`shrink-0 px-3 py-1 rounded-full text-[10px] border transition-colors ${
              activeMood === mood
                ? 'bg-[#F3EAF9] border-[#9B59B6] text-[#4A1572]'
                : 'bg-surface border-black/10 text-text-secondary'
            }`}
          >
            {mood}
          </button>
        ))}
      </div>
      {activeMood && (
        <div className="mt-3 bg-[#F3EAF9] rounded-xl p-3">
          <p className="text-[12px] text-[#4A1572]">Finding sermons for when you feel {activeMood.toLowerCase()}...</p>
        </div>
      )}
    </section>
  );
}
